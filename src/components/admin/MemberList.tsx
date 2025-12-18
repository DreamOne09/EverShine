// src/components/admin/MemberList.tsx
import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Member {
    id: string;
    name: string;
    industry?: string;
    company?: string;
    position?: string;
    title?: string;
    photo?: string;
}

interface Props {
    members: Member[];
    loading: boolean;
    onRefresh: () => void; // callback after delete
}

const ITEMS_PER_PAGE = 10;

const MemberList: React.FC<Props> = ({ members, loading, onRefresh }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(members.length / ITEMS_PER_PAGE));
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const displayed = members.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const handleDelete = async (id: string) => {
        if (!confirm('確定要刪除這位會員嗎？此動作無法復原。')) return;
        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) {
            alert('刪除失敗: ' + error.message);
        } else {
            alert('已刪除');
            onRefresh();
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-gray-400 text-sm border-b border-white/10">
                        <th className="p-4">會員</th>
                        <th className="p-4">產業/公司</th>
                        <th className="p-4">職稱</th>
                        <th className="p-4 text-right">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {displayed.map(member => (
                        <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                                    {member.photo && <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />}
                                </div>
                                <span className="font-medium text-white">{member.name}</span>
                            </td>
                            <td className="p-4 text-gray-300">
                                <div className="text-white text-sm">{member.industry}</div>
                                <div className="text-xs opacity-70">{member.company}</div>
                            </td>
                            <td className="p-4 text-gray-300 text-sm">
                                {member.position || member.title}
                            </td>
                            <td className="p-4 text-right flex gap-2 justify-end">
                                <button
                                    onClick={() => navigate(`/member-edit?id=${member.id}`)}
                                    className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors text-sm flex items-center gap-1"
                                    title="編輯"
                                >
                                    <Edit size={14} /> 編輯
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors text-sm flex items-center gap-1"
                                    title="刪除"
                                >
                                    <Trash2 size={14} /> 刪除
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <span>第 {page} 頁 / 共 {totalPages} 頁</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-3 py-1 bg-black/30 rounded disabled:opacity-50"
                    >上一頁</button>
                    <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-3 py-1 bg-black/30 rounded disabled:opacity-50"
                    >下一頁</button>
                </div>
            </div>
        </div>
    );
};

export default MemberList;
