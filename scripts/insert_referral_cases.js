
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const cases = [
    {
        id: 'new-case-1',
        title: '【💼 合作共創新價值】包裝設計合作案',
        description: '生醫公司新產品線包裝設計引薦',
        metrics: { amount: '洽談中', type: '專案合作' },
        referrer_name: '施秉辰',
        referee_name: '郭孝淵',
        referrer_story: '這次我太太受邀擔任生醫公司營運顧問，負責新產品線，產品包裝設計是首要任務。我推薦了我們分會的包裝設計專家郭孝淵。他迅速提供設計方案，並詳細說明設計理念，令公司驚艷，最終成功簽約收款。',
        referee_story: '感謝秉辰哥的高度信任，他專業的介紹讓合作機會成真。這次合作針對高端運動族群的運動保養包裝設計，秉辰哥太太在需求整理上的專業協助至關重要，讓設計得以一次過稿、順利完成。這次合作不僅讓我成長，也見識到頂尖專業的高度。若有相關需求，絕對推薦找秉辰哥夫妻！'
    },
    {
        id: 'new-case-2',
        title: '【🤝 信任引薦創佳績】指甲保健服務',
        description: '凍甲問題專業處理引薦',
        metrics: { amount: '穩定回訪', type: '定期服務' },
        referrer_name: '蘇子超',
        referee_name: '洪儀君',
        referrer_story: '這次我引薦的是我的姐姐，她長期被凍甲問題困擾，無論是美容院還是自己修剪，都無法根治。某次她不小心撞到腳，情況更嚴重時，我立刻引薦了手足指甲保健專家儀君，希望能解決她的困擾。',
        referee_story: '非常感謝子超的信任引薦，因為客戶是他姐姐，我們快速建立了溝通群組，提供專業評估和建議。她經歷了指甲重建貼片處理後，疼痛問題已改善，並每月定期進行療程。這次引薦不僅幫助了她，還讓她的女兒也來體驗保養服務。'
    },
    {
        id: 'new-case-3',
        title: '「引薦創造新機會，成功不止一面。」SEO內容行銷案',
        description: '生技公司品牌行銷SEO服務',
        metrics: { amount: '兩張合約', type: '流量方案' },
        referrer_name: '施秉辰',
        referee_name: '潘芷盈',
        referrer_story: '我太太最近被邀請擔任一家生技公司的營運顧問，他們需要做網站關鍵字的行銷曝光。腦海中立即浮現出芷盈的「只贏不輸、有效才收費」SEO 服務，因為我們在例會上的交流，我深知她的專業能力，毫不猶豫地將她推薦給太太的客戶。據太太回報，客戶對芷盈的提案與服務非常滿意，並成功簽約。',
        referee_story: '感謝秉辰哥的引薦！秉辰哥太太顧問的生技公司，想發展全新的保養品品牌，於是來找我討論 SEO 內容行銷的需求。他們希望幫網站做關鍵字曝光，帶來精準穩定的流量以及潛在客戶。於是我到他們辦公室做簡報提案，以及解答品牌行銷相關問題。因我們的 AISEO 流量方案不僅可以做到 Google 關鍵字曝光、AI 收錄推薦，還是有效流量才收費，最後客戶決定一次簽了兩張合約！非常感謝 BNI 夥伴的精準引薦！'
    },
    {
        id: 'new-case-4',
        title: '信任是成功的基石 - AI 程式交易工具',
        description: '股票投資朋友引薦AI自動交易工具',
        metrics: { amount: '專業對接', type: '軟體授權' },
        referrer_name: '王銓',
        referee_name: '王年煜',
        referrer_story: '我與AI程式交易專家老王多次深度對談，對他的程式設計理念 and 行事風格有深入了解。我有位從事股票投資的朋友，在市場因政策變動而迷茫時，向我尋求理財工具建議。我立即推薦了老王的AI程式，朋友對其產品名稱「火箭樹懶」和「信天翁」感到有趣，並在群組中獲得老王的專業解惑，最終決定採用這項服務。',
        referee_story: '感謝 AI 程式教育的王銓引薦！我們都深耕AI產業，常交流應用，王銓對我產品的演進與績效有深入了解，建立了信任。他的朋友在了解後快速採用我的程式，這次引薦的成功全賴於王銓的信任和支持。'
    },
    {
        id: 'new-case-5',
        title: '快速連結創造商機 - 資訊弱電工程',
        description: '氣體設備公司新辦公室資訊規劃',
        metrics: { amount: '長期外包', type: '合約維護' },
        referrer_name: '劉懿德',
        referee_name: '施秉辰',
        referrer_story: '在新竹一家氣體設備公司，需要在新租的場域擴張空間，因此需要新辦公室設計、裝修工程、水電弱電及門禁系統。立刻想到了「建多室廣」的夥伴,資訊弱電專家——秉辰哥。在我們的協助下，業主提出更多資訊需求，我隨即引薦秉辰哥見面討論,透過秉辰哥的專業，客戶非常滿意，當場決定由秉辰哥進行資訊系統規劃。這次合作不僅解決了客戶需求，也體現了BNI跨專業合作的價值，讓我對互相推薦信心倍增！',
        referee_story: '感謝阿德的引薦，我們是「建多室廣」協力團隊成員，對彼此業務非常了解。這次客戶原本僅打算更新門禁系統，透過阿德引薦，客戶直接邀約我面對面會議，最終客戶完全接受我的建議，並將全公司資訊維護外包給我。現在已進入合約階段。以往拓展業務需花費大量時間，現在透過BNI系統，一次會議就能拿到生意，實在是非常有效的方式。感謝BNI，感謝阿德的引薦！'
    },
    {
        id: 'new-case-6',
        title: '朋友的信任是一座橋樑 - 家事律師引薦',
        description: '複雜離婚官司與財產分配案件',
        metrics: { amount: '全案委託', type: '法律顧問' },
        referrer_name: '李孟一',
        referee_name: '何昇軒',
        referrer_story: '這個案子其實是我朋友的朋友，我在臉書好友牆上看到我的朋友發文，希望幫他的朋友找能夠理解男方立場的律師協助離婚官司，我一看就覺得不單純，還特別寫理解男方立場，我馬上想到我們分會的帥氣奶爸律師何律，何律有很豐富的家事訴訟經驗，沒想到一引薦過後何律就用專業取得客戶信賴！',
        referee_story: '謝謝孟一的引薦，這位客戶是要處理離婚、子女監護，以及在臺灣、國外等地的婚後財產，情況複雜。通常這麼複雜的案件，我們需要多次跟當事人討論、提出方案、講解內容，才能取得當事人信任。但透過孟一的引薦，直接引薦我是家事案件專門律師，且也處理過多次複雜案件，當事人直接就有高度信任，會面一次後就全案委託，省去很多會議時間！'
    }
];

async function run() {
    console.log('Inserting referral cases...');
    for (const c of cases) {
        const { error } = await supabase.from('referrals').upsert(c);
        if (error) {
            console.error(`Error inserting ${c.id}:`, error.message);
        } else {
            console.log(`Inserted ${c.id}`);
        }
    }
}

run();
