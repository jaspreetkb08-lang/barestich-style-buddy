import React from 'react';
import { ShoppingBag, ChevronDown, UserRound } from 'lucide-react';
import { ThemeConfig, ThemeType } from '../types';

interface HeaderProps {
  theme: ThemeConfig;
  currentThemeId: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  onAvatarClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, currentThemeId, onThemeChange, onAvatarClick }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-20 backdrop-blur-sm border-b h-16 flex items-center justify-between px-4 md:px-6 shadow-sm transition-colors duration-500
      ${theme.bgPanel} ${theme.border} ${theme.fontSans}`}>
      
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md transition-colors duration-500 ${theme.accentIconBg} ${theme.accentIconText}`}>
          <ShoppingBag size={20} />
        </div>
        <h1 className={`text-xl font-bold tracking-tight transition-colors duration-500 ${theme.fontSerif} ${theme.textMain}`}>
          BareStich <span className={`hidden sm:inline font-light text-sm ml-1 ${theme.fontSans} ${theme.textMuted}`}>Style Buddy</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Vibe Selector */}
        <div className="relative flex items-center">
          <span className={`text-xs mr-2 font-medium hidden sm:block ${theme.textMuted}`}>Vibe:</span>
          <div className={`relative group`}>
            <select
              value={currentThemeId}
              onChange={(e) => onThemeChange(e.target.value as ThemeType)}
              className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-full text-sm font-medium border transition-all focus:outline-none focus:ring-2
                ${theme.bgApp} ${theme.border} ${theme.textMain} focus:ring-opacity-20 ${currentThemeId === 'work' ? 'focus:ring-slate-500' : 'focus:ring-black'}`}
            >
              <option value="default">Default</option>
              <option value="work">Office / Work</option>
              <option value="date">Date Night</option>
              <option value="street">Streetwear</option>
            </select>
            <ChevronDown 
              size={14} 
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-40%] ${theme.textMuted}`} 
            />
          </div>
        </div>

        {/* Avatar / Bitmoji Button */}
        <button 
          onClick={onAvatarClick}
          className={`p-2 rounded-full border transition-all hover:scale-105 active:scale-95 flex items-center gap-1
          ${theme.bgApp} ${theme.border} ${theme.textMain}`}
          title="Customize Your Style Twin"
        >
          <UserRound size={18} />
          <span className="text-xs font-medium hidden sm:block">My Look</span>
        </button>
      </div>
    </header>
  );
};

export default Header;