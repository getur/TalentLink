# TalentLink Design System

This document outlines the design tokens and structural guidelines for TalentLink. The system prioritizes a clean, high-contrast, minimalist aesthetic with a pure white background, thin strokes, and standard rounding.

## 1. Core Principles
- **Clarity over Clutter**: Pure white backgrounds and significant negative space.
- **Precision**: Thin borders (1px) replace shadows for elevation.
- **Consistency**: Unified rounding and spacing scales.
- **Achromatic Base**: Primary UI uses Black and White, with color used sparingly for status or highlights.

## 2. Color Tokens (Tailwind Format)

### Neutral Scale
| Token | Value | Hex | Usage |
| :--- | :--- | :--- | :--- |
| `bg-white` | Base | `#FFFFFF` | Main application background |
| `bg-gray-50` | Slate 50 | `#F8FAFC` | Secondary backgrounds, input fields |
| `border-gray-100` | Slate 100 | `#F1F5F9` | Default strokes, dividers |
| `text-black` | Slate 950 | `#020617` | Primary headings, active text |
| `text-gray-500` | Slate 500 | `#64748B` | Secondary text, captions |
| `text-gray-400` | Slate 400 | `#94A3B8` | Disabled text, uppercase labels |

### Brand & Status
| Token | Value | Usage |
| :--- | :--- | :--- |
| `text-orange-500` | Accent | Primary highlights, Dept tags |
| `bg-orange-50` | Muted Accent | Status backgrounds |
| `bg-red-500` | Error | Notifications, critical alerts |

## 3. Typography
**Font Family**: `Plus Jakarta Sans` (Sans-serif)

| Level | Size Token | Weight | Case | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | `text-3xl` (30px) | `font-extrabold` | Sentence | `tracking-tight` |
| **Heading 2** | `text-xl` (20px) | `font-bold` | Sentence | Normal |
| **Label/Meta** | `text-[10px]` | `font-bold` | `uppercase` | `tracking-widest` |
| **Body** | `text-sm` (14px) | `font-medium` | Sentence | Normal |
| **Caption** | `text-xs` (12px) | `font-medium` | Sentence | Normal |

## 4. Elevation & Borders
Elevation is defined by thin borders rather than shadows.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `border` | 1px | Default divider/border |
| `border-gray-100` | Thin Stroke | Primary container boundary |
| `shadow-none` | 0px | **Strictly no shadows** across the platform |

## 5. Shape (Rounding)
TalentLink uses a consistent, moderate rounding scale.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `rounded` | 4px | Small UI elements (Checkboxes, small tags) |
| `rounded-lg` | 8px | Buttons, small containers, dropdowns |
| `rounded-xl` | 12px | Opportunity cards, dashboards, sidebar |
| `rounded-2xl` | 16px | Large profile headers, focus blocks |
| `rounded-full` | 9999px | Avatars, pills |

## 6. Component Specs

### Opportunity Card
- **Background**: `bg-white`
- **Border**: `border border-gray-100`
- **Hover**: `hover:border-gray-200`
- **Padding**: `p-6`
- **Rounding**: `rounded-xl`
- **Shadow**: `shadow-none`

### Primary Button
- **Background**: `bg-black`
- **Text**: `text-white`
- **Rounding**: `rounded-lg`
- **Padding**: `px-8 py-3`
- **Font**: `text-xs font-bold uppercase tracking-widest`

### Secondary Button/Input
- **Background**: `bg-gray-50`
- **Border**: `border border-gray-100`
- **Text**: `text-gray-500`
- **Rounding**: `rounded-lg`

### Search Container
- **Background**: `bg-gray-50`
- **Border**: `border border-gray-100`
- **Layout**: `flex items-center gap-2 p-1.5`
- **Rounding**: `rounded-xl`

## 7. Layout Spacing
- **Container Max Width**: `max-w-7xl`
- **Page Gutter**: `px-8`
- **Vertical Rhythm**: `py-10`, `py-12`, `py-16` (Major sections)
- **Grid Gap**: `gap-6` (Grid layouts), `gap-12` (Split layouts)