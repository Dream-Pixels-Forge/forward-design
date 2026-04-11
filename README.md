# Forward Design Portfolio

A professional photography portfolio website built with Next.js, React, and Tailwind CSS. Features smooth animations using GSAP and Lenis for scroll effects.

## About This Project

This portfolio was developed by **Dream-Pixels-Forge** for their client **Forward Design**. It showcases the photography work of Forward Design in an immersive, modern web experience.

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

## Skills & Tools Used

- **Next.js** - Full-stack React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP (GreenSock Animation Platform)** - Industry-standard animation library
- **Lenis** - Smooth scroll library for premium feel
- **TypeScript** - Type-safe JavaScript
- **React 19** - Latest React with hooks and server components

### DPF Skills Used

- **dpf-about-guidance** - Transformed project brief into visual and strategic guidance
- **dpf-type-pair** - Selected distinctive typography pairings for the design
- **dpf-trends** - Applied verified design trends and patterns
- **dpf-cinematic-scrollytelling** - Created immersive scroll-driven storytelling experience
- **Movematics** - Animation strategy and review for carousel interactions
- **Git** - Version control and GitHub for deployment

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

## Credits

- **Client**: Forward Design
- **Development**: Dream-Pixels-Forge

## License

Private - All rights reserved