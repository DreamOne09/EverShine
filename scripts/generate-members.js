// 會員資料生成腳本
// 從 images/members/ 資料夾讀取所有會員照片，生成初始會員資料

const fs = require('fs');
const path = require('path');

// 會員照片資料夾路徑
const membersDir = path.join(__dirname, '../images/members');

// 讀取所有會員照片
const memberPhotos = fs.readdirSync(membersDir)
    .filter(file => file.endsWith('.jpg'))
    .map(file => file.replace('.jpg', ''));

console.log(`找到 ${memberPhotos.length} 位會員`);

// 會員名單
const members = [
    "何昇軒", "劉弼凱", "劉懿德", "劉祐沁", "吳介輝", "吳宇峰", "吳睿霖", "吳貞妮",
    "孫成育", "廖俊瑋", "廖涌辰", "徐采璇", "施秉辰", "李孟一", "李彥慶", "李慰祖",
    "李秉誠", "李維恩", "李逸強", "杜宗樺", "林修賢", "林庭瑀", "林盈助", "楊承樺",
    "楊明翰", "江學洋", "江心怡", "江沛璇", "洪儀君", "洪智威", "游凱地", "湯益承",
    "潘芷盈", "王冠勛", "王執定", "王年煜", "王祈", "王銓", "蘇子超", "蘇翊婷",
    "許雅婷", "詹謦鴻", "賴永相", "賴瑋弘", "邱宇鴻", "邱翰城", "郭孝淵", "郭家宏",
    "鄭雅菁", "陳亭儒", "陳夗媃", "陳育文", "顧心芝", "黃昱歆"
];

// 產業分類（從 category-mapping.js 提取）
const industries = [
    "律師", "會計師", "專利商標", "AI商務顧問", "銀行融資顧問", "信託規劃顧問",
    "中小企業顧問", "地政士", "人力媒合平台", "品牌設計", "永續可分解包裝",
    "包租代管", "電子商品設計", "禮贈品", "SEO內容行銷", "自媒體經營",
    "LINE應用開發", "餐飲行銷整合", "團體服", "創意策劃", "插畫設計",
    "包裝設計", "網站創新開發", "資訊弱電系統整合", "機電設計", "空調工程",
    "策展規劃設計", "統包工程", "水電工程", "泥作工程", "抗病毒地板",
    "商空設計", "住宅設計", "燈具照明", "心靈諮詢", "人壽保險",
    "產物保險規劃", "營養保健", "手足指甲保健", "醫療輔具", "物理治療師",
    "運動營養師", "健身教練", "寵物營養", "共享空間", "魔術方塊教學",
    "升學輔導顧問", "實體黃金買賣", "AI程式交易", "澎湖特色餐飲",
    "茶葉盤商", "原型食物料理師", "麵包烘焙業", "堅果烘焙", "無麩質雞蛋糕",
    "AI程式教育"
];

// 生成會員資料
const membersData = {
    "members": members.map((name, index) => {
        const industry = industries[index % industries.length];
        return {
            "id": `member-${index + 1}`,
            "name": name,
            "photo": `images/members/${name}.jpg`,
            "industry": industry,
            "category": getCategoryByIndustry(industry),
            "company": `${name.substring(0, 2)}有限公司`,
            "position": "董事長",
            "title": `${name.substring(0, 2)}有限公司 董事長`,
            "shortIntro": `專業的${industry}服務，致力於為客戶創造價值`,
            "fullIntro": `我是${name}，擁有多年的${industry}產業經驗。專注於提供優質的專業服務，協助客戶達成商業目標。透過 BNI 長輝白金分會，我建立了廣泛的商務網絡，並持續為會員創造引薦機會。我相信透過專業服務與誠信合作，能夠為每一位客戶帶來實質的商業成長。期待與您合作，共同創造更大的商業價值。`,
            "links": [],
            "services": [
                `${industry}諮詢`,
                "專業顧問服務",
                "商務合作",
                "引薦服務"
            ],
            "hashtags": [
                `#${industry}`,
                `#${name}`,
                "#BNI長輝白金分會"
            ],
            "createdAt": new Date().toISOString(),
            "updatedAt": new Date().toISOString()
        };
    })
};

// 產業分類函數（簡化版）
function getCategoryByIndustry(industry) {
    const categoryMapping = {
        "企業顧問": ["律師", "會計師", "專利商標", "AI商務顧問", "銀行融資顧問", "信託規劃顧問", "中小企業顧問", "地政士", "人力媒合平台", "品牌設計", "永續可分解包裝", "包租代管", "電子商品設計"],
        "企業行銷": ["禮贈品", "SEO內容行銷", "自媒體經營", "LINE應用開發", "餐飲行銷整合", "團體服", "創意策劃", "插畫設計", "包裝設計"],
        "資訊系統": ["LINE應用開發", "網站創新開發", "資訊弱電系統整合", "機電設計"],
        "工程裝修": ["空調工程", "策展規劃設計", "統包工程", "水電工程", "泥作工程", "抗病毒地板", "商空設計", "住宅設計", "燈具照明"],
        "健康美麗": ["心靈諮詢", "人壽保險", "產物保險規劃", "營養保健", "手足指甲保健", "醫療輔具", "物理治療師", "運動營養師", "健身教練", "寵物營養", "共享空間"],
        "休閒教育": ["魔術方塊教學", "升學輔導顧問", "AI程式教育"],
        "投資理財": ["實體黃金買賣", "AI程式交易"],
        "美食餐飲": ["澎湖特色餐飲", "茶葉盤商", "原型食物料理師", "麵包烘焙業", "堅果烘焙", "無麩質雞蛋糕"]
    };

    for (const [category, industries] of Object.entries(categoryMapping)) {
        if (industries.includes(industry)) {
            return category;
        }
    }

    return "企業顧問";
}

// 儲存為 JSON 檔案
const outputPath = path.join(__dirname, '../data/members-data.json');
fs.writeFileSync(outputPath, JSON.stringify(membersData, null, 2), 'utf8');

console.log(`✅ 會員資料已生成：${outputPath}`);
console.log(`總計：${membersData.members.length} 位會員`);
