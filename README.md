# Forward Design Portfolio

A professional photography portfolio website built with Next.js, React, and Tailwind CSS. Features smooth animations using GSAP and Lenis for scroll effects.

## Features

- **Photography Gallery** - Full-screen carousel with 25+ images
- **Smooth Scrolling** - Powered by Lenis for premium scroll experience
- **GSAP Animations** - Custom animations for entrance and interactions
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Accessibility** - ARIA labels, keyboard navigation, and reduced motion support
- **Dark Theme** - Elegant dark theme with gold accents

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Animations**: GSAP + ScrollTrigger
- **Smooth Scroll**: Lenis
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── carousel/          # Image carousel component
│   └── ...
├── lib/                   # Utilities and helpers
├── public/               # Static assets
│   └── images/            # Photography images
├── tailwind.config.ts     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies
```

## Customization

### Adding Images

Add images to `public/images/` folder and update the `IMAGES` array in `components/carousel/carousel.tsx`.

### Colors

Edit Tailwind theme colors in `tailwind.config.ts`:
- `background` - Main background color
- `foreground` - Main text color
- `accent-gold` - Accent/brand color

## License

Private - All rights reserved