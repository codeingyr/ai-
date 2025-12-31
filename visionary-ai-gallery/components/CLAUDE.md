# Components 模块

[根目录](../CLAUDE.md) > **components**

> 最后更新：2025-12-31 10:50:38

---

## 变更记录 (Changelog)

| 日期 | 变更内容 |
|------|---------|
| 2025-12-31 10:50:38 | 初始化模块文档 |

---

## 模块职责

提供应用的所有 UI 组件，包括导航侧边栏、图片画廊网格、创建/上传模态框和图片预览器。

---

## 组件列表

### 1. Sidebar.tsx
**职责**: 左侧分类导航侧边栏

**Props**:
```typescript
interface SidebarProps {
  selectedCategory: Category;      // 当前选中分类
  onSelectCategory: (category: Category) => void;  // 分类选择回调
  isOpen: boolean;                 // 移动端展开状态
}
```

**功能**:
- 显示 7 个分类选项（全部 + 6 个具体分类）
- 使用 Lucide 图标增强视觉效果
- 显示 Gemini 2.5 运行状态指示器
- 支持响应式折叠（移动端）

**样式**:
- 固定定位，宽度 w-64
- Slate-900 背景，Indigo 选中高亮

---

### 2. Gallery.tsx
**职责**: 图片网格画廊展示组件

**Props**:
```typescript
interface GalleryProps {
  items: GalleryItem[];                      // 图片列表
  category: Category;                        // 当前分类过滤
  onDelete: (id: string) => void;           // 删除回调
  onPreview: (item: GalleryItem) => void;   // 预览回调
}
```

**功能**:
- 响应式网格布局（1-4 列）
- 悬停显示操作按钮（预览、下载、删除）
- 显示图片元信息（分类标签、提示词、来源标记）
- 空状态提示

**交互**:
- 点击图片预览
- 悬停显示操作遮罩
- 下载按钮触发浏览器下载

---

### 3. CreateModal.tsx
**职责**: 创建/上传图片的模态框

**Props**:
```typescript
interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string, prompt: string, category: Category, source: 'generated' | 'uploaded') => void;
}
```

**功能**:
- **AI 绘图标签页**:
  - 提示词输入（多行文本框）
  - 风格分类选择（下拉菜单）
  - 图片比例选择（1:1, 16:9, 9:16）
  - 调用 `geminiService` 生成图片

- **本地上传标签页**:
  - 拖拽/点击上传
  - 文件大小验证（4MB 限制）
  - 预览后确认保存

**状态管理**:
- 加载状态显示（Loader2 旋转动画）
- 错误消息提示

---

### 4. ImageViewer.tsx
**职责**: 全屏图片详情预览

**Props**:
```typescript
interface ImageViewerProps {
  item: GalleryItem | null;
  onClose: () => void;
}
```

**功能**:
- 全屏模态展示
- 显示大图（自适应容器）
- 侧边栏显示元数据：
  - 提示词原文
  - 分类标签
  - 创建时间
- 下载按钮

**布局**:
- 桌面端：左图右信息
- 移动端：上图下信息

---

## 依赖关系

```
CreateModal  -->  geminiService (generateAIImage)
    |
    v
App.tsx (状态管理)
    |
    +----> Sidebar
    +----> Gallery
    +----> ImageViewer
```

---

## 样式主题

- **主色调**: Indigo-500/600 (按钮、高亮)
- **背景色**: Slate-900/950
- **文本色**: Slate-50/200/400
- **边框**: Slate-700/800
- **圆角**: rounded-xl / rounded-2xl
- **阴影**: shadow-lg / shadow-2xl + color shadow

---

## 相关文件清单

| 文件路径 | 描述 |
|---------|------|
| `components/Sidebar.tsx` | 侧边栏导航 |
| `components/Gallery.tsx` | 图片画廊 |
| `components/CreateModal.tsx` | 创建/上传模态框 |
| `components/ImageViewer.tsx` | 图片预览器 |
| `../types.ts` | 共享类型定义 |
| `../services/geminiService.ts` | AI 生成服务 |

---

## 常见问题

### Q: 如何添加新的分类图标？
A: 在 `Sidebar.tsx` 的 `categories` 数组中添加新项，从 `lucide-react` 导入对应图标。

### Q: 为什么图片下载的文件名是动态的？
A: 使用 `Date.now()` 确保每次下载文件名唯一，避免覆盖。
