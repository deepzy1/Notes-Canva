import React from 'react';
import { Bookmark, ExternalLink } from 'lucide-react';

interface ResourceLink {
  name: string;
  url: string;
  badge: string;
  color?: string;
}

interface ResourcesCardProps {
  title?: string;
  links?: ResourceLink[];
}

const BADGE_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  green: 'bg-green-100 text-green-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  red: 'bg-red-100 text-red-700',
};

export const ResourcesCard: React.FC<ResourcesCardProps> = ({
  title = 'Useful Resources',
  links = [
    { name: 'Python Official Docs', url: 'https://docs.python.org', badge: 'Docs', color: 'blue' },
    { name: 'W3Schools Python', url: 'https://www.w3schools.com/python', badge: 'W', color: 'emerald' },
    { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/python-programming-language', badge: 'GG', color: 'green' },
    { name: 'Real Python', url: 'https://realpython.com', badge: 'RP', color: 'indigo' },
    { name: 'YouTube Playlist', url: 'https://www.youtube.com', badge: 'YT', color: 'red' },
  ],
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
            <Bookmark className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-1.5 text-xs">
        {links.map((link, idx) => {
          const badgeClass = BADGE_COLORS[link.color || 'blue'] || 'bg-neutral-100 text-neutral-700';
          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-neutral-50 border border-neutral-100 transition-colors group cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className={`w-5 h-5 rounded-md ${badgeClass} text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                  {link.badge}
                </span>
                <span className="text-neutral-700 group-hover:text-purple-600 font-medium truncate">
                  {link.name}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-neutral-300 group-hover:text-neutral-500 flex-shrink-0" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
