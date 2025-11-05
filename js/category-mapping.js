// 產業分類映射表
const categoryMapping = {
    "企業顧問": ["律師", "會計師", "專利商標", "AI商務顧問", "銀行融資顧問", "信託規劃顧問", "中小企業顧問", "地政士", "人力媒合平台", "品牌設計", "永續可分解包裝", "包租代管", "電子商品設計"],
    "企業行銷": ["禮贈品", "SEO內容行銷", "自媒體經營", "LINE應用開發", "餐飲行銷整合", "團體服業", "創意策劃", "插畫設計", "包裝設計"],
    "資訊系統": ["LINE應用開發", "網站創新開發", "資訊弱電系統整合", "機電設計"],
    "工程裝修": ["空調工程", "策展規劃設計", "統包工程", "水電工程", "泥作工程", "抗病毒地板", "商空設計", "住宅設計", "燈具照明"],
    "健康美麗": ["心靈諮詢", "人壽保險", "產物保險規劃", "營養保健", "手足指甲保健", "醫療輔具", "物理治療師", "運動營養師", "健身教練", "寵物營養", "共享空間"],
    "休閒教育": ["魔術方塊教學", "升學輔導顧問"],
    "投資理財": ["實體黃金買賣", "AI程式交易"],
    "美食餐飲": ["澎湖特色餐飲", "茶葉盤商", "原型食物料理師", "麵包烘焙業", "堅果烘焙", "無麩質雞蛋糕"],
    "其他": []
};

// 根據產業別取得分類
function getCategoryByIndustry(industry) {
    for (const [category, industries] of Object.entries(categoryMapping)) {
        if (industries.includes(industry)) {
            return category;
        }
    }
    // 如果找不到分類，根據產業名稱關鍵字判斷
    const industryLower = industry.toLowerCase();
    if (industryLower.includes('顧問') || industryLower.includes('顧問') || industryLower.includes('設計') && !industryLower.includes('包裝') && !industryLower.includes('插畫')) {
        return "企業顧問";
    }
    if (industryLower.includes('行銷') || industryLower.includes('設計') || industryLower.includes('創意') || industryLower.includes('包裝') || industryLower.includes('插畫') || industryLower.includes('團體服')) {
        return "企業行銷";
    }
    if (industryLower.includes('系統') || industryLower.includes('資訊') || industryLower.includes('網站') || industryLower.includes('line')) {
        return "資訊系統";
    }
    if (industryLower.includes('工程') || industryLower.includes('裝修') || industryLower.includes('設計') && (industryLower.includes('商空') || industryLower.includes('住宅') || industryLower.includes('策展'))) {
        return "工程裝修";
    }
    if (industryLower.includes('健康') || industryLower.includes('美麗') || industryLower.includes('保險') || industryLower.includes('營養') || industryLower.includes('醫療') || industryLower.includes('健身') || industryLower.includes('寵物') || industryLower.includes('共享')) {
        return "健康美麗";
    }
    if (industryLower.includes('教育') || industryLower.includes('教學') || industryLower.includes('輔導')) {
        return "休閒教育";
    }
    if (industryLower.includes('投資') || industryLower.includes('理財') || industryLower.includes('黃金') || industryLower.includes('交易') || industryLower.includes('ai程式')) {
        return "投資理財";
    }
    if (industryLower.includes('餐飲') || industryLower.includes('美食') || industryLower.includes('茶葉') || industryLower.includes('烘焙') || industryLower.includes('麵包') || industryLower.includes('食物')) {
        return "美食餐飲";
    }
    // 預設歸類為企業顧問
    console.warn(`未找到產業 "${industry}" 的分類，預設歸類為「企業顧問」`);
    return "企業顧問";
}

