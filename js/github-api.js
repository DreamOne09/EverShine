/**
 * GitHub API 輔助函式
 * 用於會員資料的讀取和更新
 */

class GitHubAPI {
    constructor(config) {
        this.config = config;
        this.apiUrl = `${config.apiUrl}/repos/${config.owner}/${config.repo}/contents/${config.filePath}`;
    }

    /**
     * 獲取檔案內容
     */
    async getFileContent() {
        try {
            const response = await fetch(this.apiUrl, {
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API 錯誤: ${response.status}`);
            }

            const data = await response.json();
            const content = atob(data.content); // Base64 解碼
            return {
                content: JSON.parse(content),
                sha: data.sha // 需要 SHA 來更新檔案
            };
        } catch (error) {
            console.error('獲取檔案失敗:', error);
            throw error;
        }
    }

    /**
     * 更新檔案內容
     */
    async updateFileContent(newContent, sha, commitMessage) {
        try {
            const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(newContent, null, 2))));

            const response = await fetch(this.apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: contentBase64,
                    sha: sha,
                    branch: this.config.branch
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`更新失敗: ${errorData.message || response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('更新檔案失敗:', error);
            throw error;
        }
    }

    /**
     * 驗證 PIN 碼
     */
    async verifyPin(memberName, pin) {
        try {
            const { content } = await this.getFileContent();
            const member = content.members.find(m => m.name === memberName);

            if (!member) {
                throw new Error('找不到此會員');
            }

            // 計算 PIN 碼的 SHA-256 雜湊值
            const pinHash = await this.hashPin(pin);

            if (pinHash !== member.pinHash) {
                throw new Error('PIN 碼錯誤');
            }

            return member;
        } catch (error) {
            console.error('驗證失敗:', error);
            throw error;
        }
    }

    /**
     * 更新會員資料
     */
    async updateMemberData(memberName, pin, newData) {
        try {
            // 1. 驗證 PIN 碼
            await this.verifyPin(memberName, pin);

            // 2. 獲取當前檔案內容
            const { content, sha } = await this.getFileContent();

            // 3. 找到並更新會員資料
            const memberIndex = content.members.findIndex(m => m.name === memberName);
            if (memberIndex === -1) {
                throw new Error('找不到此會員');
            }

            // 4. 合併新資料（保護 name, industry, pinHash）
            const currentMember = content.members[memberIndex];
            content.members[memberIndex] = {
                ...currentMember,
                ...newData,
                // 保護欄位
                name: currentMember.name,
                industry: currentMember.industry,
                category: currentMember.category,
                pinHash: currentMember.pinHash,
                // 更新時間
                updatedAt: new Date().toISOString()
            };

            // 5. 提交更新
            const commitMessage = `Update member data: ${memberName}`;
            await this.updateFileContent(content, sha, commitMessage);

            return content.members[memberIndex];
        } catch (error) {
            console.error('更新會員資料失敗:', error);
            throw error;
        }
    }

    /**
     * 計算 PIN 碼的 SHA-256 雜湊值
     */
    async hashPin(pin) {
        const encoder = new TextEncoder();
        const data = encoder.encode(pin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// 匯出到全域
if (typeof window !== 'undefined') {
    window.GitHubAPI = GitHubAPI;
}
