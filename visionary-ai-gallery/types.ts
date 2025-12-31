export enum Category {
  ALL = 'All',
  LANDSCAPE = 'Landscape',
  CHARACTER = 'Character',
  ANIME = 'Anime',
  PRODUCT = 'Product',
  POSTER = 'Poster',
  ABSTRACT = 'Abstract'
}

export const CategoryMap: Record<Category, string> = {
  [Category.ALL]: '全部作品',
  [Category.LANDSCAPE]: '自然风景',
  [Category.CHARACTER]: '人物角色',
  [Category.ANIME]: '二次元/动漫',
  [Category.PRODUCT]: '产品设计',
  [Category.POSTER]: '商业海报',
  [Category.ABSTRACT]: '抽象艺术',
};

export interface GalleryItem {
  id: string;
  url: string;
  prompt: string;
  category: Category;
  createdAt: number;
  source: 'generated' | 'uploaded';
}

export interface GenerationConfig {
  prompt: string;
  category: Category;
  aspectRatio: "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
}
