import React from 'react';
import { Plus, Search } from 'lucide-react';
import MemberList from './MemberList';

export interface AdminMembersTabProps {
    memberSearch: string;
    onMemberSearch: (v: string) => void;
    onAddMember: () => void;
    filteredMembers: Record<string, unknown>[];
    loading: boolean;
    onRefresh: () => void;
}

const AdminMembersTab: React.FC<AdminMembersTabProps> = ({
    memberSearch,
    onMemberSearch,
    onAddMember,
    filteredMembers,
    loading,
    onRefresh,
}) => {
    return (
        <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-4 md:p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="搜尋會員..."
                        value={memberSearch}
                        onChange={(e) => onMemberSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary"
                    />
                </div>
                <button
                    type="button"
                    onClick={onAddMember}
                    className="flex items-center justify-center gap-2 bg-primary text-bg-dark px-4 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors shrink-0"
                >
                    <Plus size={18} /> 新增會員
                </button>
            </div>

            <MemberList members={filteredMembers as never} loading={loading} onRefresh={onRefresh} />
        </div>
    );
};

export default AdminMembersTab;
