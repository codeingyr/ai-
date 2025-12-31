import React from 'react';
import { GalleryItem, Category, CategoryMap } from '../types';
import { Download, Trash2, Eye, ExternalLink } from 'lucide-react';

interface GalleryProps {
  items: GalleryItem[];
  category: Category;
  onDelete: (id: string) => void;
  onPreview: (item: GalleryItem) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, category, onDelete, onPreview }) => {
  
  const filteredItems = category === Category.ALL 
    ? items 
    : items.filter(item => item.category === category);

  const handleDownload = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `visionary-${item.category}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <div className="bg-slate-800 p-6 rounded-full mb-4">
          <Eye className="w-12 h-12 opacity-50" />
        </div>
        <p className="text-xl font-medium">暂无图片</p>
        <p className="text-sm mt-2">快去生成一些新作品，或者上传本地图片吧。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map((item) => (
        <div 
          key={item.id} 
          className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border border-slate-700 hover:border-indigo-500/50"
        >
          {/* Image Container */}
          <div className="aspect-square w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onPreview(item)}>
            <img 
              src={item.url} 
              alt={item.prompt} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto">
            <button 
              onClick={() => onPreview(item)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
              title="预览"
            >
              <Eye className="w-6 h-6" />
            </button>
            <button 
              onClick={(e) => handleDownload(e, item)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
              title="下载"
            >
              <Download className="w-6 h-6" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-200 rounded-full transition-colors backdrop-blur-md"
              title="删除"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          {/* Info footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-100 translate-y-0 transition-all">
            <div className="flex justify-between items-end">
                <div>
                    <span className="inline-block px-2 py-1 mb-1 text-xs font-semibold text-indigo-200 bg-indigo-500/20 rounded border border-indigo-500/30">
                        {CategoryMap[item.category]}
                    </span>
                    <p className="text-sm text-slate-200 line-clamp-1 opacity-90">{item.prompt || '未命名作品'}</p>
                </div>
                {item.source === 'uploaded' && (
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
