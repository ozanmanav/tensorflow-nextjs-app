# 🤖 AI Image Recognition App

Modern image classification app powered by **TensorFlow.js** and **MobileNet** built with **Next.js**.

## ✨ Features

- 🚀 **Instant Page Loading** - Lazy loading optimized performance
- 🧠 **AI Image Recognition** - MobileNet model with 1000+ object classes
- ⚡ **Real-time Analysis** - Instant prediction results
- 🎨 **Modern UI/UX** - Clean interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **AI/ML:** TensorFlow.js, MobileNet
- **Styling:** Tailwind CSS
- **Performance:** Dynamic Imports, Lazy Loading

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tensorflow-nextjs-app

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

## 📖 Usage

1. **Upload Image:** Click "Choose File" or select sample image
2. **AI Analysis:** Model loads automatically when image is selected
3. **View Results:** Get top 5 predictions with confidence scores

## ⚡ Performance Features

- **Lazy Loading:** TensorFlow.js loads only when needed
- **Instant Page Load:** No blocking AI model loading
- **Optimized Bundle:** Dynamic imports reduce initial load time

## 🎯 Supported Objects

MobileNet recognizes **1000+** object classes including:

- Animals, Vehicles, Food, Electronics, Household items, etc.

## 📊 Model Info

- **Model:** MobileNet v2
- **Size:** ~13MB (lazy loaded)
- **Accuracy:** 71.3% top-1 on ImageNet
- **Inference:** ~100-300ms

---

⭐ **Star this project if you find it useful!**
