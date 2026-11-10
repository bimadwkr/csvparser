import React from 'react';
import { BarChart3, ShieldCheck, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: 'posts' | 'followers';
  onTabChange: (tab: 'posts' | 'followers') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-md shadow-rose-500/20 text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Instagram CSV Studio
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  v2.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Transform raw Instagram scraping data into clean, standardized performance reports.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Client-Side Processing &bull; No Server Uploads</span>
          </div>
        </div>

        {/* Top-Level Navigation Switcher */}
        <div className="flex items-center gap-2 border-t border-slate-100 py-2.5">
          <button
            type="button"
            onClick={() => onTabChange('posts')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'posts'
                ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Post Metrics Parser</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('followers')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'followers'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CSV Follower Parser</span>
            <span className="px-1.5 py-0.2 bg-purple-200/80 text-purple-800 rounded-full text-[10px] font-bold">
              Baru
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
