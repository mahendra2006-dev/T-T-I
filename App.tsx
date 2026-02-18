
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateImage } from './services/gemini';
import { AspectRatio, GeneratedImage, GenerationOptions, ImageSize } from './types';
import { Select } from './components/ui/Select';
import { Toggle } from './components/ui/Toggle';

const LOADING_MESSAGES = [
  "Initializing neural pathways...",
  "Synthesizing visual concepts...",
  "Brushing digital pixels...",
  "Refining artistic details...",
  "Applying lighting and shadows...",
  "Manifesting your imagination...",
  "Almost there, finalizing the masterpiece..."
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Options
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [highQuality, setHighQuality] = useState(false);
  const [imageSize, setImageSize] = useState<ImageSize>("1K");

  // Timer for loading messages
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setLoadingMsgIdx(0);
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const options: GenerationOptions = {
        aspectRatio,
        highQuality,
        imageSize: highQuality ? imageSize : undefined,
      };

      const result = await generateImage(prompt, options);
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: result.url,
        prompt: prompt,
        timestamp: Date.now(),
        model: result.modelUsed,
        aspectRatio: aspectRatio,
      };

      setCurrentImage(newImage);
      setHistory((prev) => [newImage, ...prev]);
      setPrompt('');
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during generation.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Lumina Studio
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Billing Info
          </a>
          <button 
            onClick={() => window.aistudio.openSelectKey()}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full transition-colors border border-zinc-700"
          >
            Manage API Key
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 border border-zinc-800 shadow-xl">
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest border-b border-zinc-800 pb-3">
              Settings
            </h2>

            <Select
              label="Aspect Ratio"
              value={aspectRatio}
              options={[
                { label: 'Square (1:1)', value: '1:1' },
                { label: 'Standard (4:3)', value: '4:3' },
                { label: 'Cinematic (16:9)', value: '16:9' },
                { label: 'Portrait (3:4)', value: '3:4' },
                { label: 'Mobile (9:16)', value: '9:16' },
              ]}
              onChange={setAspectRatio}
            />

            <Toggle
              label="Pro Engine"
              description="Unlock 2K/4K high-fidelity (Gemini 3 Pro)"
              checked={highQuality}
              onChange={setHighQuality}
            />

            {highQuality && (
              <Select
                label="Resolution"
                value={imageSize}
                options={[
                  { label: 'High (1K)', value: '1K' },
                  { label: 'Ultra (2K)', value: '2K' },
                  { label: 'Master (4K)', value: '4K' },
                ]}
                onChange={setImageSize}
              />
            )}

            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <h3 className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-tight">Active Model</h3>
              <p className="text-sm text-zinc-300 font-mono">
                {highQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image'}
              </p>
            </div>
          </div>
          
          <div className="hidden lg:flex glass-panel p-6 rounded-2xl flex-col gap-4 border border-zinc-800/50">
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest border-b border-zinc-800 pb-3">
              Quick Tips
            </h2>
            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
              <li>Be descriptive: "A cyberpunk city in the rain..."</li>
              <li>Mention styles: "Minimalist", "Oil Painting", "3D Render"</li>
              <li>Specify lighting: "Golden hour", "Neon glow"</li>
            </ul>
          </div>
        </div>

        {/* Right Content: Generation Area */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Prompt Input */}
          <div className="gradient-border shadow-2xl shadow-blue-500/5">
            <div className="gradient-border-content p-4">
              <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to create..."
                    className="w-full bg-transparent border-none focus:ring-0 text-lg text-zinc-100 placeholder-zinc-600 resize-none py-2 min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                  />
                  <div className="absolute right-0 bottom-0 text-[10px] text-zinc-600 font-mono">
                    SHIFT + ENTER for newline
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 h-fit ${
                    isGenerating || !prompt.trim()
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/10'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      Generate
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Main Display */}
          <div className="flex-1 flex flex-col gap-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {!currentImage && !isGenerating ? (
              <div className="flex-1 glass-panel rounded-3xl border-dashed border-2 border-zinc-800 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-700">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-zinc-300 mb-2">Ready to create?</h3>
                <p className="text-zinc-500 max-w-sm">Enter a prompt above to generate a unique AI image tailored to your vision.</p>
              </div>
            ) : (
              <div className="relative group">
                {isGenerating && (
                  <div className="absolute inset-0 z-10 glass-panel rounded-3xl flex flex-col items-center justify-center gap-6 animate-pulse p-8">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium text-white">{LOADING_MESSAGES[loadingMsgIdx]}</p>
                      <p className="text-sm text-zinc-500">Processing complex visual parameters...</p>
                    </div>
                  </div>
                )}
                
                {currentImage && (
                  <div className="glass-panel rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col">
                    <div className="relative w-full overflow-hidden bg-zinc-900 group">
                      <img
                        src={currentImage.url}
                        alt={currentImage.prompt}
                        className={`w-full h-auto object-contain transition-transform duration-500 hover:scale-[1.02] ${isGenerating ? 'blur-sm' : ''}`}
                      />
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => downloadImage(currentImage.url, `lumina-${currentImage.id}.png`)}
                          className="bg-black/60 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/80 transition-all border border-white/10"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 bg-zinc-950">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-400 mb-1 uppercase tracking-tight">Prompt</p>
                          <p className="text-zinc-100 italic">"{currentImage.prompt}"</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                           <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono uppercase">
                            {currentImage.model.split('-').slice(0, 3).join(' ')}
                           </span>
                           <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                            {currentImage.aspectRatio}
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History Section */}
            {history.length > 1 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-zinc-100">Creation History</h2>
                  <button 
                    onClick={() => setHistory([])}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {history.slice(1).map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setCurrentImage(img)}
                      className="group cursor-pointer glass-panel rounded-xl overflow-hidden border border-zinc-800 transition-all hover:border-zinc-500 hover:shadow-xl hover:shadow-blue-500/5 aspect-square"
                    >
                      <div className="relative h-full w-full">
                        <img
                          src={img.url}
                          alt={img.prompt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                          <p className="text-[10px] text-white line-clamp-2 italic">"{img.prompt}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-900 text-center text-zinc-600 text-xs">
        <p>© 2024 Lumina Studio. Powered by Google Gemini. Creations may vary.</p>
      </footer>
    </div>
  );
};

export default App;
