import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Gallery from './components/Gallery';
import CreateModal from './components/CreateModal';
import ImageViewer from './components/ImageViewer';
import { Category, GalleryItem, CategoryMap } from './types';
import { Menu, Plus, Trash } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  
  // Static initial data to prevent images from changing on reload
  // Using high-quality Unsplash source images
  const defaultImages: GalleryItem[] = [
    {
      id: 'init-1',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      prompt: '清晨的雾中群山，高分辨率摄影',
      category: Category.LANDSCAPE,
      createdAt: Date.now() - 1000000,
      source: 'uploaded'
    },
    {
      id: 'init-2',
      url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      prompt: '赛博朋克风格的动漫角色',
      category: Category.ANIME,
      createdAt: Date.now() - 900000,
      source: 'uploaded'
    },
    {
      id: 'init-3',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      prompt: '极具表现力的人像摄影',
      category: Category.CHARACTER,
      createdAt: Date.now() - 800000,
      source: 'uploaded'
    },
    {
      id: 'init-4',
      url: 'https://images.unsplash.com/photo-1629196914168-3a26476b7e88?auto=format&fit=crop&w=800&q=80',
      prompt: '极简主义的抽象几何海报设计',
      category: Category.POSTER,
      createdAt: Date.now() - 700000,
      source: 'uploaded'
    },
    {
      id: 'init-5',
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      prompt: '干净背景下的产品摄影，智能手表',
      category: Category.PRODUCT,
      createdAt: Date.now() - 600000,
      source: 'uploaded'
    },
    {
      id: 'init-6',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      prompt: '流体艺术，抽象背景',
      category: Category.ABSTRACT,
      createdAt: Date.now() - 500000,
      source: 'uploaded'
    },
    {
      id: 'init-7',
      url: 'https://images.unsplash.com/photo-1546856313-71a25d209199?auto=format&fit=crop&w=800&q=80',
      prompt: '日落时分的城市天际线',
      category: Category.LANDSCAPE,
      createdAt: Date.now() - 400000,
      source: 'uploaded'
    },
    {
      id: 'init-8',
      url: 'https://images.unsplash.com/photo-1607374028082-9f373d726c59?auto=format&fit=crop&w=800&q=80',
      prompt: '机械少女，科幻概念艺术',
      category: Category.ANIME,
      createdAt: Date.now() - 300000,
      source: 'uploaded'
    }
  ];

  const [images, setImages] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('visionary_gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If parsed is empty or not an array, use default
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load images from storage", e);
    }
    return defaultImages;
  });

  useEffect(() => {
    try {
      localStorage.setItem('visionary_gallery', JSON.stringify(images));
    } catch (e) {
      // Handle QuotaExceededError
      console.error("Storage full:", e);
      alert("本地存储空间已满，旧的图片可能无法保存，请删除一些图片释放空间。");
    }
  }, [images]);

  const handleAddImage = (url: string, prompt: string, category: Category, source: 'generated' | 'uploaded') => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      url,
      prompt,
      category,
      createdAt: Date.now(),
      source
    };
    setImages(prev => [newItem, ...prev]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("确定要删除这张图片吗？")) {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };
  
  const handleClearStorage = () => {
      if (window.confirm("确定要重置所有数据吗？这将删除所有生成和上传的图片并恢复默认设置。")) {
          localStorage.removeItem('visionary_gallery');
          setImages(defaultImages);
      }
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold hidden sm:block">
              {CategoryMap[selectedCategory]}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={handleClearStorage}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors"
                title="重置数据"
            >
                <Trash className="w-4 h-4" />
                重置
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">新建作品</span>
            </button>
          </div>
        </header>

        {/* Gallery Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Gallery 
              items={images} 
              category={selectedCategory} 
              onDelete={handleDelete}
              onPreview={setSelectedImage}
            />
          </div>
        </div>

      </main>

      {/* Modals */}
      <CreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddImage}
      />

      <ImageViewer 
        item={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
};

export default App;
