import React, { useState } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    onRefresh: () => void;
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

    if (displayed.length === 0) {
        return <div className="text-center text-gray-500 py-8">尚無會員資料</div>;
    }

    return (
        <div>
            {/* Mobile: Card Layout */}
            <div className="md:hidden space-y-3">
                {displayed.map(member => (
                    <div key={member.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 shrink-0">
                                {member.photo && <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="font-bold text-white truncate">{member.name}</div>
                                <div className="text-sm text-primary truncate">{member.industry}</div>
                                <div className="text-xs text-gray-400 truncate">{member.company} {member.position || member.title ? `· ${member.position || member.title}` : ''}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/member-edit?id=${member.id}`)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                            >
                                <Edit size={14} /> 編輯
                            </button>
                            <button
                                onClick={() => handleDelete(member.id)}
                                className="flex items-center justify-center gap-1.5 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Table Layout */}
            <div className="hidden md:block overflow-x-auto">
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
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 shrink-0">
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
                                <td className="p-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => navigate(`/member-edit?id=${member.id}`)}
                                            className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors text-sm flex items-center gap-1"
                                        >
                                            <Edit size={14} /> 編輯
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={14} /> 刪除
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5 text-sm text-gray-400">
                <span>第 {page} / {totalPages} 頁 · 共 {members.length} 筆</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black/30 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={14} /> 上一頁
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black/30 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
                    >
                        下一頁 <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberList;
