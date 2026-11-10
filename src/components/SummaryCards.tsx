import React from 'react';
import { Layers, Eye, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { MetricSummary } from '../types/instagram';
import { formatMetricNumber } from '../utils/formatters';

interface SummaryCardsProps {
  summary: MetricSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'Total Posts',
      value: formatMetricNumber(summary.totalPosts),
      subtext: `${summary.totalPosts} rows parsed`,
      icon: Layers,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Total Views',
      value: formatMetricNumber(summary.totalViews),
      subtext: `From ${summary.viewAvailableCount} posts with view data`,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Total Likes',
      value: formatMetricNumber(summary.totalLikes),
      subtext: `From ${summary.likeAvailableCount} posts with like data`,
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-100',
    },
    {
      title: 'Total Comments',
      value: formatMetricNumber(summary.totalComments),
      subtext: `From ${summary.commentAvailableCount} posts with comment data`,
      icon: MessageCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
    },
    {
      title: 'Total Shares',
      value: formatMetricNumber(summary.totalShares),
      subtext: `From ${summary.shareAvailableCount} posts with share data`,
      icon: Share2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Total Bookmarks',
      value: formatMetricNumber(summary.totalBookmarks),
      subtext: `From ${summary.bookmarkAvailableCount} posts with bookmark data`,
      icon: Bookmark,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-100',
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
