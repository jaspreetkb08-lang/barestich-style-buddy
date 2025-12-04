import React from 'react';
import { Message, ThemeConfig } from '../types';
import { Sparkles, User, Camera, RefreshCw } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  theme: ThemeConfig;
  onVisualize?: (text: string) => void;
  isGeneratingImage?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, theme, onVisualize, isGeneratingImage }) => {
  const isModel = message.role === 'model';
  const hasImage = !!message.imageUrl;

  // Function to process bold text (**text**) into proper JSX elements
  const formatText = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className={`font-semibold ${theme.textHighlight}`}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] flex-col ${isModel ? 'items-start' : 'items-end'}`}>
        
        <div className={`flex ${isModel ? 'flex-row' : 'flex-row-reverse'} w-full`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 transition-colors duration-500 shadow-sm
            ${isModel ? `${theme.accentIconBg} ${theme.accentIconText} mr-3` : 'bg-gray-200 text-gray-600 ml-3'}`}>
            {isModel ? <Sparkles size={16} /> : <User size={16} />}
            </div>

            {/* Bubble content wrapper */}
            <div className="flex flex-col gap-2 w-full">
                
                {/* Text Bubble */}
                <div className={`p-4 md:p-5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm transition-colors duration-500 w-fit
                ${isModel 
                    ? `${theme.bgBubbleModel} ${theme.textBubbleModel} border ${theme.border} rounded-tl-none` 
                    : `${theme.bgBubbleUser} ${theme.textBubbleUser} rounded-tr-none shadow-md`
                }`}>
                    <div className={`whitespace-pre-wrap ${theme.fontSans}`}>
                        {formatText(message.text)}
                    </div>
                </div>

                {/* Generated Image Bubble (if present) */}
                {hasImage && (
                  <div className={`mt-2 overflow-hidden rounded-xl border-4 shadow-lg animate-fade-in
                    ${theme.border} ${theme.bgBubbleModel}`} style={{ maxWidth: '320px' }}>
                    <div className="relative aspect-square">
                        <img 
                          src={`data:image/png;base64,${message.imageUrl}`} 
                          alt="Generated Outfit" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                            AI Generated Style Twin
                        </div>
                    </div>
                  </div>
                )}

                {/* Visualize Action Button - More Prominent CTA */}
                {isModel && !hasImage && !message.isError && onVisualize && (
                    <button 
                        onClick={() => onVisualize(message.text)}
                        disabled={isGeneratingImage}
                        className={`self-start mt-2 text-xs font-medium flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all active:scale-95
                        ${isGeneratingImage 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-wait' 
                            : `${theme.bgPanel} ${theme.textMain} ${theme.border} hover:border-gray-400 hover:shadow-md hover:bg-white`
                        }`}
                    >
                        {isGeneratingImage ? (
                            <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>Designing...</span>
                            </>
                        ) : (
                            <>
                                <Camera size={14} className={theme.textMuted} />
                                <span>Visualize this look</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;