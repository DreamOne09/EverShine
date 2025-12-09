/**
 * GitHub Issues 會員編輯系統
 * 安全方案：不暴露 Token，透過 Issues 提交修改請求
 */

class MemberEditIssueSystem {
    constructor() {
        this.owner = 'DreamOne09';
        this.repo = 'EverShine';
    }

    /**
     * 驗證 PIN 碼（前端驗證）
     */
    async verifyPin(memberName, pin) {
        try {
            // 讀取會員資料
            const response = await fetch('data/members.json');
            const data = await response.json();
            const member = data.members.find(m => m.name === memberName);

            if (!member) {
                throw new Error('找不到此會員');
            }

            // 計算 PIN 碼雜湊
            const pinHash = await this.hashPin(pin);

            if (pinHash !== member.pinHash) {
                throw new Error('PIN 碼錯誤');
            }

            return member;
        } catch (error) {
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

    /**
     * 建立 GitHub Issue 來提交修改請求
     */
    async submitEditRequest(memberName, pin, newData) {
        try {
            // 1. 驗證 PIN 碼
            await this.verifyPin(memberName, pin);

            // 2. 準備 Issue 內容
            const issueTitle = `會員資料修改請求：${memberName}`;
            const issueBody = this.formatIssueBody(memberName, newData);

            // 3. 建立 Issue URL（讓使用者手動建立）
            const issueUrl = this.generateIssueUrl(issueTitle, issueBody);

            return {
                success: true,
                issueUrl: issueUrl,
                message: '請點擊下方連結到 GitHub 提交修改請求'
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * 格式化 Issue 內容
     */
    formatIssueBody(memberName, newData) {
        return `## 會員資料修改請求

**會員姓名：** ${memberName}

### 修改內容

\`\`\`json
${JSON.stringify(newData, null, 2)}
\`\`\`

---

### 審核指示

**管理員請在下方留言：**
- 核准：\`approve\`
- 拒絕：\`reject\`

留言後，GitHub Actions 會自動處理此修改請求。

---
*此 Issue 由會員自助編輯系統自動生成*`;
    }

    /**
     * 生成 GitHub Issue URL
     */
    generateIssueUrl(title, body) {
        const baseUrl = `https://github.com/${this.owner}/${this.repo}/issues/new`;
        const params = new URLSearchParams({
            title: title,
            body: body,
            labels: 'member-edit'
        });
        return `${baseUrl}?${params.toString()}`;
    }
}

// 匯出到全域
if (typeof window !== 'undefined') {
    window.MemberEditIssueSystem = MemberEditIssueSystem;
}
