export interface Member {
    id: string;
    name: string;
    photo: string;
    industry: string;
    category?: string;
    company: string;
    position: string;
    title: string;
    shortIntro: string;
    fullIntro: string;
    links: MemberLink[];
    services: string[];
    hashtags: string[];
    pinHash?: string;
    editCount?: number;
    photoPosition?: string;
}

export interface MemberLink {
    type: string;
    url: string;
    icon: string;
}

export interface Referral {
    id: string;
    title: string;
    description: string;
    metrics: {
        amount: string;
        type: string;
    };
    referrer: ReferralPerson;
    referee: ReferralPerson;
}

export interface ReferralPerson {
    name: string;
    industry: string;
    photo: string;
    story?: string;
    testimonial?: string;
    value?: string;
}
