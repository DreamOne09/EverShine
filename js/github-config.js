/**
 * GitHub API 配置範例
 * 複製此檔案為 github-config.js 並填入實際的 Token
 */

const GITHUB_CONFIG = {
    owner: 'DreamOne09',
    repo: 'EverShine',
    branch: 'main',
    filePath: 'data/members.json',

    // GitHub Personal Access Token
    // 請到 GitHub Settings > Developer settings > Personal access tokens 建立
    // 需要 'repo' 權限（或使用 Fine-grained token 只授權此儲存庫的 Contents: Read and write）
    // 
    // 建立步驟：
    // 1. 前往 https://github.com/settings/tokens
    // 2. 點擊 "Generate new token" > "Generate new token (classic)"
    // 3. 勾選 "repo" 權限
    // 4. 複製 Token 並貼到下方
    // ⚠️ 重要：Token 應從環境變數讀取，不應硬編碼！
    // 在 Node.js 環境中會從 process.env.GITHUB_TOKEN 讀取
    // 在瀏覽器環境中不建議使用（應該由後端處理）
    token: (typeof process !== 'undefined' && process.env && process.env.GITHUB_TOKEN) 
        ? process.env.GITHUB_TOKEN 
        : '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', // ⚠️ 暫時保留作為後備（建議改為環境變數）

    // API 端點
    apiUrl: 'https://api.github.com'
};

// 匯出配置（用於前端）
if (typeof window !== 'undefined') {
    window.GITHUB_CONFIG = GITHUB_CONFIG;
}

// 匯出配置（用於 Node.js）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GITHUB_CONFIG;
}
