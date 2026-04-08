/** Raw row from Supabase `referrals` table (flexible keys for legacy columns). */
export interface ReferralRow {
    id: string;
    title: string;
    description: string | null;
    referrer_name: string;
    referee_name: string;
    referrer_story: string | null;
    referee_story: string | null;
    referrer_testimonial?: string | null;
    referee_value?: string | null;
    metrics?: { amount?: string; type?: string } | null;
    created_at?: string | null;
    createdAt?: string | null;
}
