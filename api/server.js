// 簡單的會員資料更新API - 部署到Zeabur
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());

// 簡單的驗證碼系統（可以改為更安全的方式）
const VALID_CODES = {
    'EVERSHINE2025': true  // 可以定期更換
};

// 健康檢查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '會員資料API運行中' });
});

// 獲取會員資料
app.get('/api/members', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/members-data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: '讀取資料失敗' });
    }
});

// 更新會員資料
app.post('/api/members/update', async (req, res) => {
    try {
        const { memberName, memberData, verificationCode } = req.body;

        // 驗證碼檢查
        if (!VALID_CODES[verificationCode]) {
            return res.status(401).json({ error: '驗證碼錯誤' });
        }

        // 讀取現有資料
        const dataPath = path.join(__dirname, '../data/members-data.json');
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // 找到並更新會員
        const memberIndex = jsonData.members.findIndex(m => m.name === memberName);

        if (memberIndex === -1) {
            return res.status(404).json({ error: '找不到會員' });
        }

        // 更新資料
        jsonData.members[memberIndex] = {
            ...jsonData.members[memberIndex],
            ...memberData,
            updatedAt: new Date().toISOString()
        };

        // 寫回檔案
        await fs.writeFile(
            dataPath,
            JSON.stringify(jsonData, null, 2),
            'utf-8'
        );

        res.json({
            success: true,
            message: '資料更新成功',
            member: jsonData.members[memberIndex]
        });

    } catch (error) {
        console.error('更新失敗:', error);
        res.status(500).json({ error: '更新失敗: ' + error.message });
    }
});

// 獲取單一會員資料
app.get('/api/members/:name', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/members-data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        const jsonData = JSON.parse(data);

        const member = jsonData.members.find(m => m.name === req.params.name);

        if (!member) {
            return res.status(404).json({ error: '找不到會員' });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({ error: '讀取資料失敗' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 API服務運行在 http://localhost:${PORT}`);
    console.log(`📝 健康檢查: http://localhost:${PORT}/api/health`);
});
