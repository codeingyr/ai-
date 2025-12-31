# Services 模块

[根目录](../CLAUDE.md) > **services**

> 最后更新：2025-12-31 10:50:38

---

## 变更记录 (Changelog)

| 日期 | 变更内容 |
|------|---------|
| 2025-12-31 10:50:38 | 初始化模块文档 |

---

## 模块职责

封装与外部服务交互的业务逻辑，目前主要是 Google Gemini AI 图片生成服务。

---

## 服务列表

### 1. geminiService.ts
**职责**: 调用 Google Gemini 2.5 Flash Image API 生成图片

**导出函数**:
```typescript
function generateAIImage(config: GenerationConfig): Promise<string>
```

**参数**:
```typescript
interface GenerationConfig {
  prompt: string;          // 用户输入的提示词
  category: Category;      // 图片分类（用于 prompt 增强）
  aspectRatio: "1:1" | "3:4" | "4:3" | "16:9" | "9:16";  // 图片比例
}
```

**返回值**: base64 编码的 PNG 图片 data URI (`data:image/png;base64,...`)

---

## 实现细节

### Prompt Engineering
根据不同分类自动增强提示词，提升生成质量：

| 分类 | 增强关键词 |
|------|-----------|
| Landscape | highly detailed, cinematic lighting, 8k, photorealistic, wide angle |
| Anime | anime style, vibrant colors, studio ghibli inspired, 2D render |
| Product | product photography, studio lighting, clean background, 4k |
| Poster | poster design, bold typography, graphic design, vector art |
| Character | character design, detailed face, expressive, concept art |
| Abstract | abstract art, geometric shapes, fluid forms, digital art |

通用增强：`masterpiece, best quality, sharp focus`

### API 调用
```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash-image',
  contents: {
    parts: [{ text: enhancedPrompt }],
  },
  config: {
    imageConfig: {
      aspectRatio: config.aspectRatio,
    }
  },
});
```

### 错误处理
- try-catch 捕获 API 错误
- 无图片数据时抛出 "No image data found in response"
- 错误会传播到调用方 (CreateModal) 进行用户提示

---

## 依赖配置

### 环境变量
- `process.env.API_KEY` / `process.env.GEMINI_API_KEY`: Gemini API 密钥
- 在 `vite.config.ts` 中通过 `define` 注入

### SDK 初始化
```typescript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

---

## 相关文件清单

| 文件路径 | 描述 |
|---------|------|
| `services/geminiService.ts` | AI 图片生成服务 |
| `../types.ts` | GenerationConfig 类型定义 |
| `../components/CreateModal.tsx` | 调用方 |
| `../vite.config.ts` | 环境变量注入配置 |

---

## 常见问题

### Q: 如何修改生成模型？
A: 修改 `model` 参数，如改为 `gemini-2.0-flash-exp` 或其他可用模型。

### Q: 支持哪些图片比例？
A: 当前支持 1:1, 3:4, 4:3, 16:9, 9:16。在 CreateModal 中限制为 1:1, 16:9, 9:16 三个选项。

### Q: API 密钥如何获取？
A: 访问 [Google AI Studio](https://ai.google.dev/) 创建 API 密钥。
