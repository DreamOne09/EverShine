import React from 'react';
import { Activity, Save } from 'lucide-react';

export interface HomeStatsForm {
    referral_count: number;
    referral_value: number;
    month: string;
}

export interface AdminSettingsTabProps {
    homeStats: HomeStatsForm;
    onHomeStatsChange: (next: HomeStatsForm) => void;
    onSaveHomeStats: () => void;
}

const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ homeStats, onHomeStatsChange, onSaveHomeStats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> 首頁數據更新（引薦成果）
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                    此處數字對應首頁 Results／統計區；與「引薦」分頁的<strong className="text-gray-300">案例列表</strong>（<code className="text-primary">referrals</code> 表）為不同資料來源。
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">統計月份</label>
                        <input
                            type="month"
                            value={homeStats.month}
                            onChange={(e) => onHomeStatsChange({ ...homeStats, month: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">總引薦單數</label>
                        <input
                            type="number"
                            value={homeStats.referral_count}
                            onChange={(e) => onHomeStatsChange({ ...homeStats, referral_count: Number(e.target.value) })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">總交易價值 (元)</label>
                        <input
                            type="number"
                            value={homeStats.referral_value}
                            onChange={(e) => onHomeStatsChange({ ...homeStats, referral_value: Number(e.target.value) })}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">預覽: ${(homeStats.referral_value / 100000000).toFixed(2)} 億</div>
                    </div>
                    <button
                        type="button"
                        onClick={onSaveHomeStats}
                        className="w-full py-3 bg-primary text-bg-dark font-bold rounded-lg hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                    >
                        <Save size={18} /> 儲存數據
                    </button>
                </div>
            </div>

            <div className="bg-bg-dark/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">系統公告</h3>
                <p className="text-gray-400 text-sm mb-4">若需發布系統公告或暫停網站服務，請在此設定。目前功能開發中。</p>
            </div>
        </div>
    );
};

export default AdminSettingsTab;
