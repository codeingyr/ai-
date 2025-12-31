import React from 'react';
import { Category, CategoryMap } from '../types';
import { 
  LayoutGrid, 
  Mountain, 
  User, 
  Tv, 
  Package, 
  Frame, 
  Zap,
  Image as ImageIcon
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory, isOpen }) => {
  
  const categories = [
    { id: Category.ALL, icon: LayoutGrid },
    { id: Category.LANDSCAPE, icon: Mountain },
    { id: Category.CHARACTER, icon: User },
    { id: Category.ANIME, icon: Tv },
    { id: Category.PRODUCT, icon: Package },
    { id: Category.POSTER, icon: Frame },
    { id: Category.ABSTRACT, icon: Zap },
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
      `}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <ImageIcon className="w-8 h-8 text-indigo-500 mr-3" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            幻视 AI 画廊
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${isSelected 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium">{CategoryMap[cat.id]}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">系统状态</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini 2.5 运行中
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
