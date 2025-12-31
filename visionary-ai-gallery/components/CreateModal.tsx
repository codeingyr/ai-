import React, { useState } from 'react';
import { Category, GenerationConfig, CategoryMap } from '../types';
import { X, Sparkles, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { generateAIImage } from '../services/geminiService';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string, prompt: string, category: Category, source: 'generated' | 'uploaded') => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'upload'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generation State
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<Category>(Category.LANDSCAPE);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");

  // Upload State
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("请输入提示词");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const config: GenerationConfig = {
        prompt,
        category,
        aspectRatio
      };
      
      const imageUrl = await generateAIImage(config);
      onSuccess(imageUrl, prompt, category, 'generated');
      setPrompt(''); // Reset
      onClose();
    } catch (err: any) {
      setError(err.message || "生成图片失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic check for file size (e.g. 4MB limit for local storage safety)
      if (file.size > 4 * 1024 * 1024) {
        setError("图片大小不能超过 4MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmUpload = () => {
    if (uploadPreview) {
      onSuccess(uploadPreview, "本地上传图片", Category.ALL, 'uploaded');
      setUploadPreview(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {activeTab === 'generate' ? <Sparkles className="w-5 h-5 text-indigo-400" /> : <Upload className="w-5 h-5 text-emerald-400" />}
            {activeTab === 'generate' ? 'AI 灵感创作' : '上传本地图片'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button 
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'generate' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveTab('generate')}
          >
            AI 绘图
          </button>
          <button 
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'upload' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => setActiveTab('upload')}
          >
            本地上传
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {activeTab === 'generate' ? (
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">提示词 (Prompt)</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想象中的画面（例如：一座漂浮在云端的赛博朋克城市，霓虹灯光，史诗感）..."
                  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">风格分类</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(Category).filter(c => c !== Category.ALL).map(c => (
                      <option key={c} value={c}>{CategoryMap[c]}</option>
                    ))}
                  </select>
                </div>

                {/* Ratio Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">图片比例</label>
                  <div className="flex gap-2">
                    {["1:1", "16:9", "9:16"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setAspectRatio(r as any)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border ${aspectRatio === r ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    正在绘制...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    开始生成
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    {uploadPreview ? (
                        <img src={uploadPreview} alt="Preview" className="h-full object-contain p-2" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-4 text-slate-400" />
                            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">点击上传</span> 或拖拽图片到这里</p>
                            <p className="text-xs text-slate-500">支持 PNG, JPG, GIF (最大 4MB)</p>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
              
              <button 
                onClick={confirmUpload}
                disabled={!uploadPreview}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                保存到画廊
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
