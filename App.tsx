import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import MessageBubble from './components/MessageBubble';
import AvatarConfigModal from './components/AvatarConfigModal';
import { sendMessageToGemini, generateFashionImage } from './services/geminiService';
import { Message, ThemeType, AvatarConfig } from './types';
import { PRESET_PROMPTS, THEMES, DEFAULT_AVATAR } from './constants';
import { Shirt, CloudSun, Calendar, ArrowRight, Camera } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [prefill, setPrefill] = useState('');
  const [currentThemeId, setCurrentThemeId] = useState<ThemeType>('default');
  
  // Avatar State
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[currentThemeId];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isGeneratingImage]);

  // Auto-detect theme from user input
  const detectThemeFromInput = (text: string): ThemeType | null => {
    const t = text.toLowerCase();
    
    // Work keywords
    if (t.includes('office') || t.includes('work') || t.includes('meeting') || t.includes('corporate') || t.includes('interview') || t.includes('formal')) {
      return 'work';
    }
    
    // Date keywords
    if (t.includes('date') || t.includes('dinner') || t.includes('romantic') || t.includes('anniversary') || t.includes('soft girl')) {
      return 'date';
    }
    
    // Street keywords
    if (t.includes('street') || t.includes('fest') || t.includes('concert') || t.includes('urban') || t.includes('hip hop') || t.includes('cool')) {
      return 'street';
    }

    return null;
  };

  const handleSendMessage = async (text: string) => {
    // Attempt to auto-switch theme if relevant keywords are found
    const detectedTheme = detectThemeFromInput(text);
    if (detectedTheme && detectedTheme !== currentThemeId) {
      setCurrentThemeId(detectedTheme);
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setPrefill(''); 

    try {
      // Get AI response, passing avatar config for personalization
      const responseText = await sendMessageToGemini(text, avatarConfig);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Oops! I'm having a wardrobe malfunction (connection error). Please try again!",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisualize = async (text: string) => {
    setIsGeneratingImage(true);
    try {
        // Find the most recent message to attach image to, or just create a new one
        // Strategy: Append a new message with the image and a caption
        
        const base64Image = await generateFashionImage(text, avatarConfig);
        
        if (base64Image) {
            const imageMsg: Message = {
                id: Date.now().toString(),
                role: 'model',
                text: "**Here is your Style Twin visualized!** \nDoes this vibe match what you were thinking?",
                imageUrl: base64Image,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, imageMsg]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handlePromptClick = (promptContent: string, promptTheme: ThemeType) => {
    setPrefill(promptContent);
    setCurrentThemeId(promptTheme);
  };

  return (
    <div className={`h-full flex flex-col transition-colors duration-700 ease-in-out ${theme.bgApp} ${theme.fontSans}`}>
      <Header 
        theme={theme} 
        currentThemeId={currentThemeId}
        onThemeChange={setCurrentThemeId}
        onAvatarClick={() => setIsAvatarModalOpen(true)}
      />

      <AvatarConfigModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        config={avatarConfig}
        onConfigChange={setAvatarConfig}
        theme={theme}
      />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-36 px-4 md:px-0 scroll-smooth">
        <div className="max-w-3xl mx-auto w-full">
          
          {/* Welcome Screen / Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in px-6">
              <div className="space-y-3">
                <h2 className={`text-3xl md:text-4xl font-semibold transition-colors ${theme.fontSerif} ${theme.textMain}`}>
                  What's the vibe today?
                </h2>
                <p className={`max-w-md mx-auto leading-relaxed transition-colors ${theme.textMuted}`}>
                  I'm your personal stylist. Tell me your plans, and I'll curate the perfect look for your "Style Twin".
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {PRESET_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt.content, prompt.theme)}
                    className={`group p-5 rounded-xl border shadow-sm hover:shadow-md transition-all text-left flex items-start gap-4
                      ${theme.bgPanel} ${theme.border} hover:border-gray-400`}
                  >
                    <div className={`p-2 rounded-full transition-colors ${theme.inputBg} ${theme.textMain}`}>
                      {idx === 0 && <Calendar size={18} />}
                      {idx === 1 && <CloudSun size={18} />}
                      {idx === 2 && <Shirt size={18} />}
                      {idx === 3 && <Calendar size={18} />}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm mb-1 ${theme.textMain}`}>{prompt.label}</h3>
                      <p className={`text-xs line-clamp-2 ${theme.textMuted}`}>{prompt.content.replace(/\n/g, ', ')}</p>
                    </div>
                    <ArrowRight size={16} className={`ml-auto transition-colors self-center ${theme.textMuted} group-hover:text-gray-900`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-2 py-4">
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                theme={theme} 
                onVisualize={handleVisualize}
                isGeneratingImage={isGeneratingImage}
              />
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start w-full mb-6">
                 <div className="flex max-w-[85%] md:max-w-[75%] flex-row">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 text-white mr-3 animate-pulse ${theme.accentIconBg}`}>
                      <Shirt size={16} />
                    </div>
                    <div className={`border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2
                       ${theme.bgBubbleModel} ${theme.border} ${theme.textMuted}`}>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="text-xs ml-2">Curating looks...</span>
                    </div>
                 </div>
              </div>
            )}
            
            {/* Image Generation Loading Indicator */}
            {isGeneratingImage && !isLoading && (
                 <div className="flex justify-start w-full mb-6">
                 <div className="flex max-w-[85%] md:max-w-[75%] flex-row">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 text-white mr-3 animate-pulse ${theme.accentIconBg}`}>
                      <Camera size={16} />
                    </div>
                    <div className={`border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2
                       ${theme.bgBubbleModel} ${theme.border} ${theme.textMuted}`}>
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                      <span className="text-xs ml-2">Creating your Style Twin visualization...</span>
                    </div>
                 </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

        </div>
      </main>

      <InputArea 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading || isGeneratingImage} 
        prefill={prefill}
        theme={theme}
      />
    </div>
  );
};

export default App;