import React from 'react';
import { X, User, Palette, Sparkles } from 'lucide-react';
import { ThemeConfig, AvatarConfig } from '../types';
import { HAIR_STYLES_FEMALE, HAIR_STYLES_MALE, BODY_TYPES, FACIAL_HAIR_OPTIONS } from '../constants';

interface AvatarConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AvatarConfig;
  onConfigChange: (newConfig: AvatarConfig) => void;
  theme: ThemeConfig;
}

const AvatarConfigModal: React.FC<AvatarConfigModalProps> = ({ 
  isOpen, onClose, config, onConfigChange, theme 
}) => {
  if (!isOpen) return null;

  const hairOptions = config.gender === 'male' ? HAIR_STYLES_MALE : HAIR_STYLES_FEMALE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-sm rounded-2xl shadow-xl overflow-hidden transform transition-all scale-100 ${theme.bgPanel} ${theme.fontSans}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme.border}`}>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className={theme.textHighlight} />
            <h3 className={`font-bold ${theme.textMain} ${theme.fontSerif}`}>Your Style Twin</h3>
          </div>
          <button onClick={onClose} className={`p-1 rounded-full hover:bg-black/5 ${theme.textMuted}`}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          
          {/* Gender */}
          <div className="space-y-3">
             <label className={`text-sm font-semibold ${theme.textMain}`}>Gender Identity</label>
             <div className="flex gap-2">
               {['female', 'male', 'unisex'].map((g) => (
                 <button
                   key={g}
                   onClick={() => onConfigChange({...config, gender: g as any})}
                   className={`flex-1 py-2 px-3 rounded-lg text-sm border capitalize transition-all
                     ${config.gender === g 
                       ? `${theme.accentIconBg} text-white border-transparent shadow-md` 
                       : `${theme.bgApp} ${theme.textMain} ${theme.border} hover:border-gray-400`}`}
                 >
                   {g}
                 </button>
               ))}
             </div>
          </div>

          {/* Body Type (Female Only) */}
          {config.gender === 'female' && (
             <div className="space-y-3 animate-fade-in">
               <label className={`text-sm font-semibold ${theme.textMain}`}>Body Type</label>
               <select
                 value={config.bodyType || ""}
                 onChange={(e) => onConfigChange({...config, bodyType: e.target.value})}
                 className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 ${theme.bgApp} ${theme.border} ${theme.textMain}`}
               >
                 <option value="" disabled>Select Body Type</option>
                 {BODY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                 ))}
               </select>
               <p className={`text-[10px] ${theme.textMuted}`}>Helps AI suggest flattering silhouettes.</p>
             </div>
          )}

          {/* Hair Style (Dynamic) */}
          <div className="space-y-3">
             <label className={`text-sm font-semibold ${theme.textMain}`}>Hair Style</label>
             <select
               value={config.hairStyle}
               onChange={(e) => onConfigChange({...config, hairStyle: e.target.value})}
               className={`w-full p-2.5 rounded-lg border text-sm appearance-none outline-none focus:ring-2 ${theme.bgApp} ${theme.border} ${theme.textMain}`}
             >
               {hairOptions.map(style => (
                 <option key={style} value={style}>{style}</option>
               ))}
             </select>
          </div>

           {/* Facial Hair (Male Only) */}
           {config.gender === 'male' && (
             <div className="space-y-3 animate-fade-in">
               <label className={`text-sm font-semibold ${theme.textMain}`}>Facial Hair</label>
               <select
                 value={config.facialHair || "None"}
                 onChange={(e) => onConfigChange({...config, facialHair: e.target.value})}
                 className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 ${theme.bgApp} ${theme.border} ${theme.textMain}`}
               >
                 {FACIAL_HAIR_OPTIONS.map(style => (
                    <option key={style} value={style}>{style}</option>
                 ))}
               </select>
             </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
               <label className={`text-sm font-semibold ${theme.textMain}`}>Hair Color</label>
               <select
                 value={config.hairColor}
                 onChange={(e) => onConfigChange({...config, hairColor: e.target.value})}
                 className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 ${theme.bgApp} ${theme.border} ${theme.textMain}`}
               >
                 <option value="black">Black</option>
                 <option value="brown">Brown</option>
                 <option value="blonde">Blonde</option>
                 <option value="red">Red</option>
                 <option value="grey">Grey</option>
                 <option value="colorful">Colorful</option>
               </select>
            </div>
            <div className="space-y-3">
               <label className={`text-sm font-semibold ${theme.textMain}`}>Skin Tone</label>
               <select
                 value={config.skinTone}
                 onChange={(e) => onConfigChange({...config, skinTone: e.target.value})}
                 className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 ${theme.bgApp} ${theme.border} ${theme.textMain}`}
               >
                 <option value="fair">Fair</option>
                 <option value="light">Light</option>
                 <option value="medium">Medium</option>
                 <option value="tan">Tan</option>
                 <option value="deep">Deep</option>
               </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${theme.border} ${theme.bgApp}`}>
          <button 
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-medium shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform ${theme.buttonBg} ${theme.buttonText}`}
          >
            Save Look
          </button>
        </div>

      </div>
    </div>
  );
};

export default AvatarConfigModal;