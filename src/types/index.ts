export interface Member {
    id: number;
    name: string;
    photo: string;
    industry: string;
    category?: string;
    company: string;
    position?: string;
    title: string;
    shortIntro: string;
    fullIntro: string;
    links: { [key: string]: string } | MemberLink[];
    services: string[];
    hashtags: string[];
    editCount?: number;
    photoPosition?: string;
    user_id?: string;
    email?: string;
    phone?: string;
}

export interface MemberLink {
    type: string;
    url: string;
    icon?: string;
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
