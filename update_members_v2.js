import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const membersPath = path.join(__dirname, 'public/data/members.json');

const rawData = `
1. 彭顯智 (之前資料不完整)
姓名: 彭顯智

行業別: 居家鍍膜

產品名: 居家鍍膜、汽車鍍膜、機車鍍膜 (服務)；圭葆有限公司 (公司)

slogan: 居家鍍膜 找顯智 潔淨生活 更舒適

聯絡方式: 0975-659-366

合作對象: 室內設計師、營造廠、房屋仲介、裝修公司

2. 鄭雅菁 (上次資料不完整)
姓名: 鄭雅菁

行業別: 共享空間 / 小島空瑜 共享空間

產品名: 共享空間/瑜珈教室租賃 (服務)；小島空瑜 (公司)

slogan: 共享空間 找雅菁 專注事業 最菁英

聯絡方式: 0910-108-608；line ID: islandairyoga

合作對象: 瑜珈老師、各行各業有授課或場地需求者、活動公司

3. 洪儀君 (上次資料不完整)
姓名: 洪儀君

行業別: 手足指甲保健

產品名: 手足指甲保健 (服務)；美甲設計公司 (公司)

slogan: 手足指甲 找儀君 讓你健康 又開心

聯絡方式: 0938-123-100

合作對象: 醫美診所、美容院、健康管理顧問

4. 李彥慶 (上次資料不完整)
姓名: 李彥慶

行業別: 專利商標

產品名: 專利、商標、著作權申請及保護 (服務)；廣流智權事務所 (公司)

slogan: 專利商標 找彥慶 讓你的智慧財產 得到保障

聯絡方式: 0933-286-908

合作對象: 傳產二代、新創公司、個人發明家、律師

5. 劉懿德 (上次資料不完整)
姓名: 劉懿德

行業別: 策展規劃設計

產品名: 展覽攤位設計、活動企劃執行 (服務)；宏星創意有限公司 (公司)

slogan: 展覽活動 找懿德 專業設計 讓您得

聯絡方式: 0910-606-906

合作對象: 舉辦國內外展覽的企業、公關公司、行銷公司

6. 陳亭儒 (上次資料不完整)
姓名: 陳亭儒

行業別: 銀行融資顧問

產品名: 企業貸款、購屋/轉貸、不動產抵押貸款 (服務)；台灣土地銀行 (公司)

slogan: 銀行融資 找亭儒 讓你輕鬆 又富裕

聯絡方式: 0933-255-001

合作對象: 房屋仲介、會計師、地政士、企業主

7. 林庭瑀 (上次資料不完整)
姓名: 林庭瑀

行業別: 心靈諮詢

產品名: 心靈諮詢、情緒管理、塔羅占卜 (服務)；心靈療癒工作室 (公司)

slogan: 心靈療癒 找庭瑀 讓你找回愛自己

聯絡方式: 0916-200-200

合作對象: 心理諮商師、身心靈課程講師、身心科醫師

8. 游凱地 (上次資料不完整)
姓名: 游凱地

行業別: 抗病毒地板

產品名: 抗病毒地板、除臭除甲醛地板 (產品)；鉅成企業有限公司 (公司)

slogan: 你喝的其實不是茶 會呼吸的空氣清淨機；主動分解TVOC與異味，淨化每一口呼吸

聯絡方式: 0988-567-890

合作對象: 建商、工程承包商、設計師、電商平台

9. 吳貞妮 (上次資料不完整)
姓名: 吳貞妮

行業別: 插畫設計

產品名: 商業插畫、貼圖設計、品牌視覺設計 (服務)；貞妮設計工作室 (公司)

slogan: 插畫設計 找貞妮 讓您的品牌更吸睛

聯絡方式: 0912-345-678

合作對象: 行銷公司、品牌顧問、公關公司、出版社

10. 吳宇峰 (上次資料不完整)
姓名: 吳宇峰

行業別: 泥作工程

產品名: 泥作工程承包、防水工程、磁磚鋪設 (服務)；峰翔工程行 (公司)

slogan: 泥作工程 找宇峰 品質工法 樣樣通

聯絡方式: 0935-111-222

合作對象: 統包工程、室內設計師、營造廠

11. 廖涌辰 (上次資料不完整)
姓名: 廖涌辰

行業別: 健身教練

產品名: 體態雕塑、健康訓練、一對一私人教練課程 (服務)；健人就是腳勤健身工作室 (公司)

slogan: 體態雕塑 找涌辰 讓你健康 又有神

聯絡方式: 0928-888-999

合作對象: 復健科醫師、營養師、物理治療師、健康餐盒業者

12. 楊承樺 (上次資料不完整)
姓名: 楊承樺

行業別: 運動營養師

產品名: 運動員飲食規劃、體重管理、增肌減脂營養諮詢 (服務)；樺營養諮詢中心 (公司)

slogan: 運動營養 找承樺 讓你表現 頂呱呱

聯絡方式: 0970-123-456

合作對象: 健身房、運動中心、物理治療所、運動賽事主辦方

13. 邱翰城 (上次資料不完整)
姓名: 邱翰城

行業別: 創意策畫

產品名: 品牌活動策劃、行銷視覺整合、公關活動執行 (服務)；瀚城創意整合行銷有限公司 (公司)

slogan: 創意策畫 找翰城 讓您活動 最吸睛

聯絡方式: 0933-555-666

合作對象: 企業行銷部、公關公司、婚禮企劃、大型活動主辦方

14. 顧心芝 (上次資料不完整)
姓名: 顧心芝

行業別: 餐飲行銷顧問

產品名: 餐廳菜單設計、社群行銷代操、餐飲品牌顧問 (服務)；芝心餐飲顧問 (公司)

slogan: 餐飲行銷 找心芝 讓您業績 芝麻開花

聯絡方式: 0918-777-888

合作對象: 新開餐廳老闆、想轉型老店、連鎖餐飲業、異業合作行銷

15. 林修賢 (上次資料不完整)
姓名: 林修賢

行業別: 醫療輔具

產品名: 輪椅、拐杖、居家醫療器材銷售及租賃 (產品/服務)；賢助醫療器材行 (公司)

slogan: 醫療輔具 找修賢 讓您生活 更安全

聯絡方式: 0936-444-555

合作對象: 醫院、復健科、長照中心、居家護理所

16. 劉祐沁 (上次資料不完整)
姓名: 劉祐沁

行業別: 實體黃金買賣

產品名: 實體黃金、銀飾買賣、黃金投資諮詢 (產品/服務)；沁富珠寶銀樓 (公司)

slogan: 實體黃金 找祐沁 讓你投資 最安心

聯絡方式: 0958-111-333

合作對象: 銀行理財專員、高資產客戶、想保存資產的企業主

17. 林盈助 (上次資料不完整)
姓名: 林盈助

行業別: 麵包烘焙

產品名: 客製化麵包、企業餐盒麵包供應、烘焙課程 (產品/服務)；助益烘焙坊 (公司)

slogan: 麵包烘焙 找盈助 讓您嘗到 幸福滋味

聯絡方式: 0917-222-444

合作對象: 咖啡廳、餐飲業、飯店、公司福委會

18. 詹謦鴻 (上次資料不完整)
姓名: 詹謦鴻

行業別: 寵物營養

產品名: 寵物營養品、客製化寵物鮮食餐 (產品/服務)；鴻富寵物營養顧問 (公司)

slogan: 寵物健康 找謦鴻 讓您的毛小孩 樂融融

聯絡方式: 0930-555-777

合作對象: 寵物店、獸醫診所、寵物美容業者、寵物旅館

19. 李逸強 (上次資料不完整)
姓名: 李逸強

行業別: 地政士

產品名: 不動產買賣、繼承贈與、不動產移轉登記 (服務)；逸強地政士事務所 (公司)

slogan: 土地房屋 找逸強 產權處理 最保障

聯絡方式: 0920-333-666

合作對象: 房屋仲介、建設公司、銀行貸款部門、律師
`;

function parseMemberData(data) {
    const blocks = data.split(/^\d+\.\s+/gm).slice(1);
    return blocks.map(block => {
        const lines = block.trim().split('\n').filter(l => l.trim());

        let nameLine = block.match(/姓名:\s*([^\n]+)/); // Modified regex to match "姓名: ..."
        if (!nameLine) nameLine = block.match(/^([^\n]+)/); // Fallback to first line
        const name = nameLine ? nameLine[1].replace(/\s*\(.*\)/, '').trim() : ''; // Remove notes like (上次資料不完整)

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
            servicesStr = parts[0].replace(/\s*\(服務\)\s*$/, '').replace(/\s*\(服務\/產品\)\s*$/, '').replace(/\s*\(產品\)\s*$/, '').replace(/\s*\(產品\/服務\)\s*$/, '').trim();
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
        // Clean up name for matching (remove trailing parentheses info if any)
        const cleanName = parsed.name.trim();
        const index = members.findIndex(m => m.name === cleanName);

        if (index !== -1) {
            // Update existing
            const m = members[index];
            m.industry = parsed.industry || m.industry;
            m.company = parsed.company || m.company || parsed.name + '的公司';
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

            console.log(`Updated: ${cleanName}`);
            updatedCount++;
        } else {
            // Create new member if not found
            console.log(`Creating new member: ${cleanName}`);
            const newMember = {
                id: `member-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                name: cleanName,
                photo: `images/members/${cleanName}.jpg`, // Placeholder
                industry: parsed.industry,
                company: parsed.company || '',
                position: '負責人', // Default
                title: parsed.industry + ' 專家',
                shortIntro: parsed.slogan,
                fullIntro: `我是${parsed.name}，專注於${parsed.industry}。\n${parsed.slogan}\n\n【理想引薦對象】\n${parsed.target}\n\n【聯絡方式】\n${parsed.contact}`,
                links: [
                    { type: 'website', url: '#', icon: 'website' }
                ],
                services: parsed.services,
                hashtags: [`#${parsed.industry}`, `#${cleanName}`],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                category: '', // Needs manual assignment or AI inference, leave empty for now
                editCount: 1
            };
            members.push(newMember);
            updatedCount++;
        }
    });

    json.members = members;

    fs.writeFile(membersPath, JSON.stringify(json, null, 2), (err) => {
        if (err) console.error('Error writing members.json:', err);
        else console.log(`Successfully processed ${updatedCount} members.`);
    });
});
