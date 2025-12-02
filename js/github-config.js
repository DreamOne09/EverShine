/**
 * GitHub API 配置範例
 * 複製此檔案為 github-config.js 並填入實際的 Token
 */

const GITHUB_CONFIG = {
    owner: 'DreamOne09',
    repo: 'EverShine',
    branch: 'main',
    filePath: 'data/members.json',

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
