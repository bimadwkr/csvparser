import React from 'react';
import { BarChart3, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-md shadow-rose-500/20 text-white">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Instagram Metrics Parser
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                v1.0
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Transform raw Instagram scraping data into clean, standardized performance reports.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local In-Browser Processing &bull; No Server Uploads</span>
        </div>
      </div>
    </header>
  );
};
