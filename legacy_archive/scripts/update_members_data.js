const fs = require('fs');
const path = require('path');

const membersPath = path.join(__dirname, '../data/members.json');

try {
    const data = JSON.parse(fs.readFileSync(membersPath, 'utf8'));
    const members = data.members;

    const updatedMembers = members.map(member => {
        // 1. Ensure 3-5 Service Items
        let services = member.services || [];
        if (services.length < 3) {
            const defaultServices = [
                `${member.industry}專業諮詢`,
                "客製化解決方案",
                "企業顧問服務",
                "專案規劃與執行",
                "跨領域資源整合"
            ];
            // Add missing services up to 5
            for (let i = services.length; i < 5; i++) {
                services.push(defaultServices[i]);
            }
        }
        // Limit to 5
        if (services.length > 5) {
            services = services.slice(0, 5);
        }

        // 2. Ensure Social Links (Add placeholders if empty)
        let links = member.links || [];
        if (links.length === 0) {
            links = [
                { type: 'facebook', url: '#', icon: 'facebook' },
                { type: 'line', url: '#', icon: 'line' },
                { type: 'website', url: '#', icon: 'website' }
            ];
        }

        // 3. Ensure 100-word Intro (fullIntro)
        let fullIntro = member.fullIntro || "";
        if (fullIntro.length < 50) { // If too short, generate a longer one
            fullIntro = `我是${member.name}，專注於${member.industry}領域。我們致力於提供最優質的${member.industry}服務，協助客戶解決各種難題。憑藉多年的實務經驗，我們深入了解客戶需求，提供量身打造的解決方案。加入BNI長輝白金分會後，我更積極連結各方資源，為客戶創造最大價值。無論是${services[0]}或是${services[1]}，我們都能提供專業的建議與執行。期待與您合作，共同開創雙贏的商業契機。我們的服務宗旨是誠信、專業、效率，讓每一位客戶都能感受到我們的用心。`;
        }

        return {
            ...member,
            services: services,
            links: links,
            fullIntro: fullIntro
        };
    });

    data.members = updatedMembers;

    fs.writeFileSync(membersPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated ${updatedMembers.length} members.`);

} catch (error) {
    console.error('Error updating members.json:', error);
}
