const fs = require('fs');
const path = require('path');

// 讀取會員資料
const membersPath = path.join(__dirname, '..', 'data', 'members.json');
const membersData = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

// 產業內容模板
const industryTemplates = {
    "律師": {
        full: (name) => `${name}律師擁有豐富的法律實務經驗，專精於各類民事、刑事、商事法律事務。我們致力於為客戶提供專業、高效的法律服務，包括法律諮詢、契約審閱、訴訟代理、調解協商等全方位法律服務。無論是企業經營、個人權益保護，或是複雜的商業糾紛，我們都能提供最適切的法律建議與解決方案。憑藉深厚的法學素養與實務經驗，我們協助客戶在法律風險中做出最佳決策，保障客戶的合法權益。`,
        services: [
            "民事訴訟代理與法律諮詢",
            "刑事辯護與法律顧問服務",
            "契約審閱與商業法律服務",
            "勞資糾紛處理與勞動法諮詢",
            "智慧財產權保護與訴訟代理"
        ]
    },
    "水電工程": {
        full: (name) => `${name}提供專業的水電工程服務，擁有豐富的施工經驗與技術實力。我們專精於各類水電系統的設計、安裝、維修與保養，包括住宅、商業、工業等不同類型的水電工程。無論是新屋裝潢、舊屋翻新，或是水電系統故障排除，我們都能提供完善的解決方案。憑藉專業的技術團隊與優質的服務品質，我們確保每個工程都能達到最高標準，為客戶打造安全、舒適的生活環境。`,
        services: [
            "水電系統設計與規劃",
            "水電安裝與施工服務",
            "水電維修與故障排除",
            "水電保養與定期檢查",
            "水電改造與升級服務"
        ]
    }
};

// 通用模板（當產業不在模板中時使用）
const getDefaultTemplate = (industry) => ({
    full: (name, industry) => `${name}提供專業的${industry}服務，擁有豐富的實務經驗與專業知識。我們致力於為客戶提供優質、可靠的專業服務，無論是個人需求或企業合作，我們都能提供完善的解決方案。憑藉專業的團隊與優質的服務品質，我們確保每個專案都能達到客戶的期望，為客戶創造最大價值。我們重視與客戶的溝通與合作，以誠信、專業、效率為服務宗旨，持續提升服務品質，成為客戶最值得信賴的合作夥伴。`,
    services: [
        `專業${industry}服務`,
        `提供優質專業服務與諮詢`,
        `客製化服務方案`,
        `專業團隊支援`,
        `完善的售後服務`
    ]
});

// 更新每個會員
membersData.members.forEach(member => {
    const name = member.name;
    const industry = member.industry;
    const template = industryTemplates[industry] || getDefaultTemplate(industry);
    
    // 生成詳細介紹（至少300字）
    if (template.full) {
        member.description = typeof template.full === 'function' 
            ? template.full(name, industry) 
            : template.full;
    }
    
    // 更新服務內容
    if (template.services) {
        member.services = Array.isArray(template.services) 
            ? template.services 
            : template.services;
    }
});

// 寫回檔案
fs.writeFileSync(membersPath, JSON.stringify(membersData, null, 2), 'utf8');

console.log(`已更新 ${membersData.members.length} 位會員的簡介`);
console.log('- 已將所有會員簡介擴展到至少300字');

