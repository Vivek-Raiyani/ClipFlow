# ClipFlow Frontend Design Guide

This guide outlines the core design and aesthetic principles for all frontend development in ClipFlow. The goal is to maintain a consistent, premium, "Apple-inspired" dark mode aesthetic across the entire application.

## 1. Design Philosophy
Our application uses a clean, minimalist UI/UX design that leverages:
- **Deep Dark Theme**: A very dark, almost pitch-black background to make content and vibrant accents pop.
- **Glassmorphism**: Subtle, blurred translucent backgrounds for cards, navigation, and overlays to create depth and a modern Apple-like feel.
- **Subtle Glows & Accents**: Strategic use of neon gradients (pink/purple) mapped to specific interactive elements to provide visual feedback without overwhelming the interface.
- **Smooth Animations**: Micro-animations for interactions (hover states, revealing elements on scroll, floating ambient orbs) that make the app feel alive.

## 2. Color Palette & CSS Variables
All colors should be used via CSS variables defined in `/app/globals.css`. **Do not hardcode hex codes or use raw Tailwind color classes** (e.g., avoid `bg-gray-900`) unless they map to these tokens or are strictly necessary for utility.

### Backgrounds
- `var(--bg-deep)`: The main app background (`#050505`).
- `var(--bg-surface)`: Secondary, slightly elevated background (`#0a0a0a`).
- `var(--bg-elevated)`: For highly elevated elements (`#111111`).

### Typography
- `var(--text-primary)`: Main text color, off-white (`#f3f4f6`).
- `var(--text-secondary)`: Secondary text, gray (`#9ca3af`).
- `var(--text-muted)`: Barely visible text, heavily desaturated (`rgba(255,255,255,0.25)`).

### Accents & Gradients
- `var(--accent-pink)` (`#ec4899`) and `var(--accent-purple)` (`#a855f7`).
- Text gradients can be achieved using the `.gradient-text` (silver-white) or `.gradient-text-accent` (pink/purple) utility classes.

### Glassmorphism
- `var(--glass-bg)`: `rgba(18, 18, 18, 0.55)`
- `var(--glass-border)`: `rgba(255, 255, 255, 0.07)`

## 3. Typography
- **Primary Font**: `Inter` (sans-serif) for all headings, buttons, and body text.
- **Monospace Font**: `Space Mono` or `Fira Mono` for badges, code snippets, or technical data.
- **Headings**: Use tight tracking (`letter-spacing: -0.02em`) and solid font weights (e.g., `font-semibold`) to mimic the Apple typography style.

## 4. Common Components & Utility Classes

To keep development fast and consistent, use these global CSS classes (from `globals.css`) instead of rewriting complex Tailwind utilities:

### Containers
- `.container`: Max-width 1120px, auto-centered with padding.
- `.container-narrow`: Max-width 760px, ideal for focused content like forms or settings.

### Glass & Cards
- `.glass`: Applies the standard blurred background and subtle border.
- `.card`: A predefined component that uses `.glass`, adds border-radius, padding, and subtle hover effects (border highlight and shadow glow).

### Buttons
- `.btn`: Base button style (inline-flex, rounded, responsive scale-down on active).
- `.btn-primary`: Vibrant background, dark text, scales up slightly on hover.
- `.btn-ghost`: Transparent with border, highlights on hover.

### Badges & Inputs
- `.badge` / `.badge-accent`: Small, pill-shaped markers with uppercase monospace text, perfect for statuses or categories.
- `.input`: Consistent input fields with rounded pill shapes, borders, and smooth focus transitions.

### Text Classes
- `.gradient-text`: Creates a subtle premium white/silver gradient over text.
- `.gradient-text-accent`: Creates a vibrant pink-to-purple gradient over text.
- `.text-secondary` and `.text-muted`.

## 5. Animations
Use predefined animations to make the UI feel fluid:
- **Reveal**: Add class `.reveal` to an element. Toggle `.visible` via IntersectionObserver in React to fade-up the element on scroll. Add `.reveal-delay-1` through `.reveal-delay-4` for staggered lists.
- **Floating**: Add `.animate-float` to ambient elements, icons, or illustrations.
- **Pulse Glow**: Add `.animate-pulse-glow` for gentle, throbbing visual effects on backgrounds or borders.

## 6. Layout & Responsiveness
- Use Flexbox and CSS Grid primarily.
- Ensure all hover animations and interactions use a responsive cubic-bezier transition (e.g., `transition: all 0.2s cubic-bezier(0.3, 0, 0.2, 1);`).
- Do not use extreme box-shadows. Stick to `var(--shadow-glow)` for accent components and `var(--shadow-card)` for deep elevation.

## Implementation Checklist
- [ ] Are colors pulling from `var(--...)` instead of hardcoded hex values?
- [ ] Do interactive elements (buttons, inputs) scale or change borders slightly on hover?
- [ ] Is `Inter` the primary font with `-0.02em` tracking for headings?
- [ ] Are container classes (`.container`, `.container-narrow`) used properly instead of custom width constraints?
- [ ] Do cards use the `.card` or `.glass` classes for the frosted aesthetic?


