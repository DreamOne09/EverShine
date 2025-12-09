// 會員資料更新API - 整合 GitHub API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// GitHub 配置
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'DreamOne09';
const GITHUB_REPO = process.env.GITHUB_REPO || 'EverShine';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH = 'data/members.json';

// 初始化 Octokit
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// 輔助函數：計算 SHA-256
function hashPin(pin) {
    return crypto.createHash('sha256').update(pin).digest('hex');
}

// 健康檢查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API Service Running' });
});

// 更新會員資料 API
app.post('/api/update-member', async (req, res) => {
    try {
        const { name, pin, data } = req.body;

        if (!name || !pin || !data) {
            return res.status(400).json({ error: '缺少必要參數' });
        }

        console.log(`收到更新請求: ${name}`);

        // 1. 從 GitHub 獲取目前的 members.json
        let fileData;
        try {
            const { data: githubData } = await octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: FILE_PATH,
                ref: GITHUB_BRANCH
            });
            fileData = githubData;
        } catch (error) {
            console.error('GitHub 讀取失敗:', error);
            return res.status(500).json({ error: '無法讀取會員資料庫' });
        }

        // 解碼內容 (GitHub 回傳的是 base64)
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const jsonContent = JSON.parse(content);

        // 2. 驗證會員與 PIN 碼
        const memberIndex = jsonContent.members.findIndex(m => m.name === name);
        if (memberIndex === -1) {
            return res.status(404).json({ error: '找不到此會員' });
        }

        const member = jsonContent.members[memberIndex];
        const inputPinHash = hashPin(pin);

        // 比對 PIN 碼 (假設 members.json 裡存的是 hash)
        // 如果 members.json 裡沒有 pinHash，則暫時允許通過 (為了遷移方便)，或者拒絕
        if (member.pinHash && member.pinHash !== inputPinHash) {
            return res.status(403).json({ error: 'PIN 碼錯誤' });
        }

        // 3. 更新資料
        // 只更新允許的欄位，避免覆蓋關鍵資訊
        const updatedMember = {
            ...member,
            ...data, // 覆蓋傳入的欄位
            updatedAt: new Date().toISOString(),
            updateCount: (member.updateCount || 0) + 1  // 增加更新次數
        };

        // 確保不被修改的關鍵欄位
        updatedMember.name = member.name;
        updatedMember.pinHash = member.pinHash;

        jsonContent.members[memberIndex] = updatedMember;

        // 4. 寫回 GitHub
        const newContent = Buffer.from(JSON.stringify(jsonContent, null, 2)).toString('base64');

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: FILE_PATH,
            message: `Update member profile: ${name} (via API)`,
            content: newContent,
            sha: fileData.sha, // 必須提供原本的 SHA 才能更新
            branch: GITHUB_BRANCH,
            committer: {
                name: 'EverShine Bot',
                email: 'bot@evershine.tw'
            }
        });

        console.log(`更新成功: ${name}`);
        res.json({ success: true, message: '更新成功！網站將在幾分鐘內自動更新。' });

    } catch (error) {
        console.error('API 處理失敗:', error);
        res.status(500).json({ error: '伺服器內部錯誤: ' + error.message });
    }
});

// 獲取更新過的會員（用於滾動牆）
app.get('/api/updated-members', async (req, res) => {
    try {
        const fs = require('fs').promises;
        const dataPath = path.join(__dirname, '../data/members.json');
        const content = await fs.readFile(dataPath, 'utf-8');
        const jsonData = JSON.parse(content);

        // 篩選有更新過的會員 (updateCount > 0)
        let updatedMembers = jsonData.members.filter(m => m.updateCount && m.updateCount > 0);

        // 如果少於 5 人，重複複製直到至少有 10 個
        const minCount = 10;
        if (updatedMembers.length > 0 && updatedMembers.length < minCount) {
            const original = [...updatedMembers];
            while (updatedMembers.length < minCount) {
                updatedMembers = updatedMembers.concat(original);
            }
        }

        // 複製一份並串接（用於無限滾動）
        const doubled = [...updatedMembers, ...updatedMembers];

        res.json({ members: doubled });
    } catch (error) {
        console.error('獲取更新會員失敗:', error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
});

// 處理 Clean URLs
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    if (page.startsWith('api') || page.includes('.')) return next();

    const filePath = path.join(__dirname, '../', `${page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) next();
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
