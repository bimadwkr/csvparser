import React from 'react';
import { Users, UserCheck, UserX, Award, TrendingUp, UserPlus } from 'lucide-react';
import { FollowerSummary } from '../../types/follower';
import { formatMetricNumber } from '../../utils/formatters';

interface FollowerSummaryCardsProps {
  summary: FollowerSummary;
}

export const FollowerSummaryCards: React.FC<FollowerSummaryCardsProps> = ({ summary }) => {
  const foundPercentage = summary.totalProfiles > 0
    ? Math.round((summary.foundProfiles / summary.totalProfiles) * 100)
    : 0;

  const notFoundPercentage = summary.totalProfiles > 0
    ? Math.round((summary.notFoundProfiles / summary.totalProfiles) * 100)
    : 0;

  const cards = [
    {
      title: 'Total Akun Dicek',
      value: formatMetricNumber(summary.totalProfiles),
      subtext: `${summary.totalProfiles} profil dianalisis`,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Akun Valid / Ditemukan',
      value: formatMetricNumber(summary.foundProfiles),
      subtext: `${foundPercentage}% dari total data`,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Tidak Ditemukan / Error',
      value: formatMetricNumber(summary.notFoundProfiles),
      subtext: `${notFoundPercentage}% profile does not exist`,
      icon: UserX,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-100',
    },
    {
      title: 'Total Followers',
      value: formatMetricNumber(summary.totalFollowers),
      subtext: `Dari ${summary.foundProfiles} akun aktif`,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-100',
    },
    {
      title: 'Rata-rata Followers',
      value: formatMetricNumber(summary.averageFollowers),
      subtext: 'Rata-rata per akun valid',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Total Following',
      value: formatMetricNumber(summary.totalFollowing),
      subtext: `Dari ${summary.foundProfiles} akun aktif`,
      icon: UserPlus,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.bgColor} ${card.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1" title={card.subtext}>
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
