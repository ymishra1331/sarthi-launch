# SarthiTrans Launch Page

A modern, professional web launch page for the SarthiTrans logistics mobile application.

## Features

- ⏱️ Animated countdown timer (2 minutes, configurable)
- 🎉 Smooth transition to launch completion state
- 📱 Fully responsive design (desktop + mobile)
- ✨ Professional animations using Framer Motion
- 🎨 Clean, corporate UI with Tailwind CSS

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the launch page.

### Building for Production

```bash
npm run build
npm start
```

## Configuration

The countdown duration can be modified in `app/page.tsx`:

```typescript
const COUNTDOWN_DURATION = 120 // Change this value (in seconds)
```

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles and Tailwind imports
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main launch page component
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Features Implemented

1. **Landing/Countdown Section**
   - Full-screen hero with gradient background
   - Animated countdown timer
   - Smooth digit animations

2. **Launch State**
   - Automatic transition after countdown
   - Celebratory animations
   - Action buttons (disabled Play Store, active Features)

3. **Features Section**
   - Card-based grid layout
   - Hover animations
   - Four feature cards

4. **App Preview Section**
   - Phone mockup
   - Professional styling

5. **Footer**
   - Company information
   - Compliance message
