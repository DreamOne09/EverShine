import { supabase } from '../lib/supabase';
import type { Member } from '../hooks/useMembers';
import { formatTaiwanPhoneDisplay } from '../lib/phoneFormat';

/** 公開會員列表（與前台 MemberWall / Members / Contact 共用） */
export async function fetchPublicMembers(): Promise<Member[]> {
    const { data, error } = await supabase.from('members').select('*').order('id', { ascending: true });
    if (error) throw error;
    const rows = (data || []) as Member[];
    return rows.map((m) => ({
        ...m,
        phone: m.phone ? formatTaiwanPhoneDisplay(m.phone) : m.phone,
    }));
}
