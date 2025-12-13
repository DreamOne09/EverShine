import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const membersPath = path.join(__dirname, 'public/data/members.json');

const rawData = `
1. 吳介輝

行業別: 人壽保險 


產品名: 醫療、意外、儲蓄、長照規劃 (服務)；南山人壽 重盛通訊處 (公司) 


slogan: 長照理財 找介輝 讓你生命 更光輝 


聯絡方式: 0911-602-709；michaelwu7676@gmail.com 


合作對象: 骨科/復健科醫師、中醫師、牙醫師、長照機構 

2. 郭家宏

行業別: 甜點外燴 / 甜品外燴 


產品名: 春酒尾牙Candy Bar/活動下午茶/會議餐盒點心 (服務)；一百分股份有限公司 (公司) 


slogan: 活動餐點 甜饗派 一站服務 不用煩 


聯絡方式: 0912-618-501；egg100daan@gmail.com 


合作對象: 活動企劃公司/行銷公司/公關公司/婚禮企劃公司 

3. 江沛璇

行業別: 營養保健 


產品名: 營養保健品、營養早餐、健管計劃 (服務) 


slogan: Amway安麗 草本養生 找沛璇 美好生活 逐笑顏 


聯絡方式: 0939-664-562；ilchiang@yahoo.com 


合作對象: 心理諮商、中醫師、家醫科醫師 

4. 王執定

行業別: 信託規劃顧問 


產品名: 信託規劃、財產規劃 (服務)；問大師家族辦公室 (公司) 


slogan: 信託規劃 找執定 無憂無慮 心安定 


聯絡方式: 0927-860-882；garfiwang@gmail.com 


合作對象: 長照、銀髮機構業者 

5. 王冠勛

行業別: 燈具照明 


產品名: 照明燈具批發、規劃、客製化訂做 (服務)；長輝照明科技有限公司 (公司) 


slogan: 生活照明 找冠勛 人生光明 得冠軍 


聯絡方式: 0911-205-224；line ID:ederwang 


合作對象: 室內設計師、營造廠主任、水電工程包商 

6. 何昇軒

行業別: 律師 


產品名: 訴訟、法律諮詢服務 (服務)；德恭法律事務所 (公司) 


slogan: 訴訟經驗 最齊全 法律諮詢 何昇軒 


聯絡方式: 0985-697-791；ntpuho@gmail.com 


合作對象: 命理師、銀行理專 

7. 杜宗樺

行業別: 商空設計 


產品名: 連鎖餐飲、汽車展覽 (專長領域)；提芙設計工程有限公司 (公司) 


slogan: 風格國際 又獨特 商空設計 找杜哥 


聯絡方式: 0937-666-877；design@e-deva.com.tw 


合作對象: 星巴克、星巴克、星巴克 (客戶實例) 

8. 賴瑋弘

行業別: 物理治療師 


產品名: 疼痛解除、徒手治療、運動治療 (服務)；樂霖物理治療所 (公司) 


slogan: 身體痠痛 找瑋弘 讓你健康 氣勢虹 


聯絡方式: 0921-345-753；pe7256@gmail.com 


合作對象: 骨科及復健科醫師、健身教練 

9. 江學洋

行業別: 品牌設計 


產品名: 用品牌識別幫你說一個好故事 (服務)；溫體氣流廣告製作有限公司 (公司) 


slogan: 品牌設計 找學洋 業績提升 喜洋洋 


聯絡方式: 0986-921-263 


合作對象: 傳產二代接班轉型想做品牌、連鎖餐飲品牌打理、新開店面品牌 

10. 孫成育

行業別: 禮贈品 


產品名: 企業禮贈品、文創個性商品創意商品開發、包袋類製作 (服務)；和朝創意開發有限公司 (公司) 


slogan: 贈品商品找Johnson 行銷效益 有保證 


聯絡方式: 0935-009-651；johnson@harvestnest.com 


合作對象: 品牌策略、廣告企劃、展覽規劃、線上線下整合行銷 

11. 邱宇鴻

行業別: 中小企業顧問 


產品名: 電腦資訊網路解決 (服務)；夢想成真資訊股份有限公司 (公司) 


slogan: 問題解決 全方位 省錢賺錢 邱宇鴻 


聯絡方式: 0989-018-852 


合作對象: 新創中小企業、想開發電商網路企業、中小企業老闆(20人以下)、傳產想經營網路電商、新創公司(剛創業諮詢) 

12. 廖俊瑋

行業別: 會計師 


產品名: 帳務處理、工商登記、財稅簽證 (服務)；宇雋會計師事務所 (公司) 


slogan: 會計稅務 找俊瑋 輕鬆省稅 最到位 


聯絡方式: 0916-246-263 


合作對象: 銀行企金、勞資顧問、移民公司、政府貸款或補助款 (文化部補助款申請或寫手) 

13. 陳育文

行業別: 住宅設計 


產品名: 室內設計、施工 (服務)；亞罕室內設計事務所 (公司) 


slogan: 住宅設計 找育文 老屋豪宅 樣樣能 


聯絡方式: 0921-293-160；vcaido2009@gmail.com 


合作對象: 房仲、代銷、危老鑑定師 

14. 李孟一

行業別: 魔術方塊教學 


產品名: 魔術方塊教學、選手培訓 (服務)；夢想一號文化教育有限公司 (公司) 


slogan: 魔術方塊 找孟一 追求夢想 得第一 


聯絡方式: 0963-237-969；Email：one@dreamcube.tw 


合作對象: 想上課的家長、補習班、共學團、課後照顧中學、樂齡學習中心 

15. 黃昱歆

行業別: 自媒體經營 


產品名: 自媒體經營 (服務)；讓創意飛媒體有限公司 (公司) 


slogan: 輕鬆經營 自媒體 創飛趴控 幫助您 


聯絡方式: 0988-940-224；Email：jasperysh@gmail.com 


合作對象: 設計師、攝影師、媒體資源 

16. 蘇翊婷

行業別: 茶葉盤商 


產品名: 客製茶葉禮盒，專業高山茶，茶包，冷泡茶 (產品)；茶事漫慢 (公司) 


slogan: 想要好茶 找蘇蘇 讓你品質價格 不會 輸 


聯絡方式: 0955-699-750 


合作對象: 飯店、餐飲、活動行銷公司、公司福委、有喝茶的人 

17. 洪智威

行業別: 空調工程 


產品名: 小冷，居家壁掛+吊隱 (服務)；昇宏空調工程有限公司 (公司) 


slogan: 居家空調 找智威 專業服務 揪甘心 


聯絡方式: 0956-865-098 


合作對象: 散客、建商冷氣代工、全國電子協力廠商 

18. 郭孝淵

行業別: 包裝設計 


產品名: 包裝結構開發、禮盒量產、綠色再生包裝設計 (服務)；提摩設計工作室 (公司) 


slogan: 創意設計 找提摩 企業發展 躍蓬勃 


聯絡方式: 0913-322-070 


合作對象: 連鎖餐飲業者以及有禮盒包裝需求，想製作永續包裝的傳產業者 

19. 江心怡

行業別: LINE應用開發 


產品名: LINE@QA圖文chatbot, 會員管理, 定期連絡, 電子名片, 報名預約功能, 購物商城, 分潤機制 (服務)；光隼資訊有限公司 (公司) 


slogan: 讓LINE應用 好容易 輕量開發 找心怡 


聯絡方式: LINE ID: Lingchiang0831/0922930621 


合作對象: 醫美診所或美業相關工作者 

20. 施秉辰

行業別: 資訊弱電系統整合 


產品名: 資訊設備軟硬體整合服務、弱電設備規劃建置 (服務)；驊程科技股份有限公司 (公司) 


slogan: 資訊弱電 大小事 交給秉辰 全搞定 


聯絡方式: 0931-049-858；Line：addams.shih 


合作對象: 室內設計師、工程統包、各種工班 

21. 李秉誠

行業別: 包租代管 


產品名: 包租代管服務、專業房屋管理、房屋修繕、媒合屋主租客、催收租金、老屋改建增加收益 (服務)；楓烽管理顧問有限公司 (公司) 


slogan: 包租代管 找亨利 讓你省時 又省力 


聯絡方式: 0901395543；Line：Ibc12345 


合作對象: 房屋仲介、包租公、包租婆 

22. 徐采璇

行業別: 原型食物料理師 


產品名: 三無原型食物餐廳、三無即食包，無糖、無奶、無麩質食物製作 (服務/產品)；錢自來綜合餐飲坊 (公司) 


slogan: 身體秘密 玄又玄 飲食協助 找采璇 


聯絡方式: 0977152710 


合作對象: 火鍋店、咖啡廳、產婦、注重健康長輩 

23. 王祈

行業別: AI學習整合 


產品名: 教育賦能、 AI應用學習 (服務)；祈育教育實業坊 (公司) 


slogan: A I 學習 找王祈 科技賦能 正黃旗 


聯絡方式: 0956522350 


合作對象: 尋求職涯成長的專業人士、各級學生 (國中至大學)、企業AI內訓 

24. 賴永相

行業別: 堅果烘焙業 


產品名: 自營堅果品牌-大象山、堅果禮盒、OEM堅果 (產品)；大象山食品有限公司 (公司) 


slogan: 身體健康 吃堅果 烘培堅果 大象山 


聯絡方式: 0935553726；elephant552726@yahoo.com.tw 


合作對象: 團購直播主、高爾夫球隊 

25. 蘇子超

行業別: 電子商品設計 


產品名: 電子商品設計、電子商品生產及製作 (服務)；廣謙科技有限公司 (公司) 


slogan: 電子設計 找子超 熱賣狂銷 數紙鈔 


聯絡方式: 0926-190980 


合作對象: 工業設計、專利師、新創投資 

26. 李維恩

行業別: 網站創新開發 


產品名: 專注於：網站 / APP / 系統 / AI (服務)；艾思特創新設計有限公司 (公司) 


slogan: 網站APP 找維恩 數位創新 賺大錢 


聯絡方式: 0933-721-702 


合作對象: (未明確列出) 

27. 陳夗媃

行業別: 澎湖特色餐飲 


產品名: 澎湖美食甜點、團體包場咖啡、甜點、美食宅配、澎湖特產宅配 (產品/服務)；半日閑企業行 (公司) 


slogan: 澎湖旅遊 享新鮮 美食甜點 半日閑 


聯絡方式: 06-921-1007 


合作對象: 旅行社、公司活動部 

28. 王年煜

行業別: AI程式交易 


產品名: 人工智慧 & 外匯交易 (服務)；創達智能技術股份有限公司 (公司) 


slogan: 程式交易 很容易 穩定獲利 找年煜 


聯絡方式: 0938-767-768；Mail：wang.ian@investrontech.com 


合作對象: 有理財需求的公司與個人、想替自己客戶尋找穩定收益的理財產品、對開發人工智慧應用有興趣的公司或個人 

29. 王銓

行業別: AI商務顧問 


產品名: 客製AI自動化系統、AI工具導入 (服務)；三人科技顧問 (三人數位科技有限公司) (公司) 


slogan: AI服務 組合拳 幫你創新 找王銓 


聯絡方式: 0911-309-998；E-Mail：wang.business.a@gmail.com 


合作對象: 行政繁瑣的中小企業、想解放工作時間的工作者 

30. 李慰祖

行業別: 團體服業 


產品名: 針對公營及民營團體與學校提供各種款式團體服裝設計、製作 (服務)；悅爾企業有限公司 (公司) 


slogan: 團體服裝 找姐夫（Jeffrey） 品質形象 不馬虎 


聯絡方式: 0903-995105；Line ID: jwl8477 


合作對象: 公司行號、公司團體、公關行銷、標案合作 

31. 吳睿霖

行業別: 統包工程 


產品名: 建案、商業、住宅工程統包及木作工程 (服務)；元允室內裝修工程有限公司 (公司) 


slogan: 工程統包 找睿霖 進度品管 最放心 


聯絡方式: 0938-541-940 


合作對象: 營造廠、建設公司、設計公司 

32. 劉弼凱

行業別: 水電工程 


產品名: 建築物專用水電工程，配合設計師/建築師/統包公司，為您特製合法合規的水+電 (服務)；雷水有限公司 (公司) 


slogan: 案場工程 找水電 雷水讓你 尚放心 


聯絡方式: 0929-853-311；mail：l.shuei1113@gmail.com 


合作對象: 設計師/建築師/統包公司 

33. 楊明翰

行業別: 機電設計 


產品名: 機電規劃、設計、施工、監工、完工、測試，後續使用中的開機操作、維護保養 (服務)；欣楠科技股份有限公司 (公司) 


slogan: 機電設計 找明翰 智能創新 沒煩惱 


聯絡方式: 0978059263；mail：sunshineminghan@gmail.com 


合作對象: 統包工程、室內裝修、室內設計師 

34. 許雅婷

行業別: 人力媒合平台 


產品名: 快速協助商家解決缺工問題並節省時間與人力成本 (服務)；沃祈數位科技股份有限公司 (公司) 


slogan: worky信的過 更好用 一鍵派工 超輕鬆 


聯絡方式: 0920808788；mail:angela.hsu@gamehours.com 


合作對象: 商家老闆、有人力需求的店家和企業、連鎖企業、有短期工作需求者 

35. 潘芷盈

行業別: SEO 內容行銷 


產品名: 免費架網站、免費寫文章、有效才付費 (服務)；最準行銷服務有限公司 (公司) 


slogan: 精準流量 全代操 客戶上門 免煩惱 


聯絡方式: 0975042077；jadepang418@gmail.com 


合作對象: 行銷公司、品牌顧問、電商系統 

36. 湯益承

行業別: 永續可分解包裝 


產品名: 夾鏈袋，垃圾袋，蔬果袋，麵包袋，拾狗便袋等公版與客製化包裝袋服務 (服務/產品)；謙益科技股份有限公司 (公司) 


slogan: 分解包裝 找益承 袋袋永續 有保證 


聯絡方式: 0930857662；mail:pm1modesty@gmail.com 


合作對象: 飯店旅宿業，團購主，家樂福，全聯採購 

37. 呂學承

行業別: 汽車租賃 


產品名: 企業租車、買賣汽車、中古車買賣 (服務)；富豪聯合租賃股份有限公司 (公司) 


slogan: 汽車租賃 找富豪 事業馬上 變富豪 


聯絡方式: 0928-834-212；mail：alexlu@am-asap.com 


合作對象: 半導體與科技廠區/建設公司/代銷不動產/宗教協會工會
`;

function parseMemberData(data) {
    const blocks = data.split(/^\d+\.\s+/gm).slice(1);
    return blocks.map(block => {
        const lines = block.trim().split('\n').filter(l => l.trim());

        let nameLine = block.match(/^([^\n]+)/);
        const name = nameLine ? nameLine[1].trim() : '';

        const industryMatch = block.match(/行業別:\s*([^\n]+)/);
        const industry = industryMatch ? industryMatch[1].trim() : '';

        const productMatch = block.match(/產品名:\s*([^\n]+)/);
        let productRaw = productMatch ? productMatch[1].trim() : '';
        // Extract company and services from product line
        // Format: "Services... (服務)；Company (公司)"
        let company = '';
        let servicesStr = '';

        if (productRaw.includes('；')) {
            const parts = productRaw.split('；');
            servicesStr = parts[0].replace(/\s*\(服務\)\s*$/, '').replace(/\s*\(服務\/產品\)\s*$/, '').trim();
            company = parts[1].replace(/\s*\(公司\)\s*$/, '').trim();
        } else {
            servicesStr = productRaw;
        }
        const services = servicesStr.split(/[、,]/).map(s => s.trim()).filter(Boolean);

        const sloganMatch = block.match(/slogan:\s*([^\n]+)/);
        const slogan = sloganMatch ? sloganMatch[1].trim() : '';

        const contactMatch = block.match(/聯絡方式:\s*([^\n]+)/);
        const contact = contactMatch ? contactMatch[1].trim() : '';

        const targetMatch = block.match(/合作對象:\s*([^\n]+)/);
        const target = targetMatch ? targetMatch[1].trim() : '';

        return {
            name,
            industry,
            company,
            services,
            slogan,
            contact,
            target
        };
    });
}

const parsedMembers = parseMemberData(rawData);

fs.readFile(membersPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading members.json:', err);
        return;
    }

    let json = JSON.parse(data);
    let members = json.members;

    let updatedCount = 0;

    parsedMembers.forEach(parsed => {
        const index = members.findIndex(m => m.name === parsed.name);

        if (index !== -1) {
            // Update existing
            const m = members[index];
            m.industry = parsed.industry || m.industry;
            m.company = parsed.company || m.company || parsed.name + '的公司'; // Fallback
            m.services = parsed.services.length > 0 ? parsed.services : m.services;
            m.shortIntro = parsed.slogan || m.shortIntro;
            m.title = `${m.position || '負責人'} - ${m.company}`;

            // Construct fullIntro including target and contact
            let fullIntro = `我是${parsed.name}，專注於${parsed.industry}。`;
            if (parsed.slogan) fullIntro += `\n${parsed.slogan}`;
            if (parsed.target) fullIntro += `\n\n【理想引薦對象】\n${parsed.target}`;
            if (parsed.contact) fullIntro += `\n\n【聯絡方式】\n${parsed.contact}`;

            m.fullIntro = fullIntro;
            m.editCount = (m.editCount || 0) + 1;
            m.updatedAt = new Date().toISOString();

            updatedCount++;
        } else {
            console.log(`Member not found: ${parsed.name}`);
        }
    });

    fs.writeFile(membersPath, JSON.stringify(json, null, 2), (err) => {
        if (err) console.error('Error writing members.json:', err);
        else console.log(`Successfully updated ${updatedCount} members.`);
    });
});
