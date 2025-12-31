import React from 'react';
import { GalleryItem, CategoryMap } from '../types';
import { X, Download, Calendar, Tag } from 'lucide-react';

interface ImageViewerProps {
  item: GalleryItem | null;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ item, onClose }) => {
  if (!item) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `visionary-${item.category}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-slate-800/50 text-white hover:bg-slate-700 transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl mx-auto overflow-hidden">
        
        {/* Image Area */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-12 relative">
          <img 
            src={item.url} 
            alt={item.prompt} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-indigo-500/10"
          />
        </div>

        {/* Info Sidebar */}
        <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 p-8 flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6">图片详情</h2>
          
          <div className="space-y-6 flex-1">
            
            {/* Prompt */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">提示词 (Prompt)</label>
              <p className="text-slate-200 bg-slate-800 p-4 rounded-xl text-sm leading-relaxed border border-slate-700">
                {item.prompt || '无描述'}
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs">分类</span>
                </div>
                <p className="text-indigo-400 font-medium">{CategoryMap[item.category]}</p>
              </div>
              
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">创建时间</span>
                </div>
                <p className="text-slate-200 font-medium">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 mt-auto">
            <button 
              onClick={handleDownload}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <Download className="w-5 h-5" />
              下载原图
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
