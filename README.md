# Antique Carpet Management App

> A full-stack web application for cataloguing, searching, and managing an inventory of antique carpets — with role-based access control and real-time cloud persistence.

---

## Overview

A production-ready inventory management platform built for an antique carpet business. The application enables authenticated users to browse and search the full carpet catalog, while administrators have access to an additional management interface for adding new inventory items, uploading images, and removing records from the system.

---

## Core Features

### 🔍 Multi-Mode Catalog Search
Users can search the carpet inventory using three independent search strategies:
- **By Carpet Number** — exact alphanumeric lookup
- **By Dimensions** — range-based filtering (min/max width & length) with Firestore compound queries
- **By Carpet Style / Type** — category-driven dropdown selection

Search state is serialized into and restored from URL query parameters (`useSearchParams`), making every search result **shareable and deep-linkable**.

### 🗂️ Carpet Detail Pages
Each carpet has a dedicated route (`/carpet/:carpetNum`) displaying its full metadata (type, dimensions, unit of measurement) and an interactive image gallery. The detail view integrates with TanStack Query's cache so navigating back to search results is instant.

### 🖼️ Interactive Image Gallery
- **Lightbox modal** with full-size image viewer and keyboard navigation
- **Touch long-press detection** (custom [useLongPress](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/hooks/useLongPress.ts#31-96) hook) to surface admin controls on mobile without a separate UI affordance
- **Lazy image loading** for performance
- **Graceful out-of-bounds protection** when images are deleted while the modal is open

### 🎠 Hero Carousel
An animated landing carousel ([HeroCarousel](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/components/UI/HeroCarousel.tsx#7-70)) auto-advances every 10 seconds with alternating slide-from-left / slide-from-right CSS transitions and interactive dot navigation.

### 🔐 Firebase Authentication & Role-Based Access Control
- Email/password authentication via **Firebase Auth**
- User roles (`Admin` / standard user) stored in **Firestore** and resolved on login via a real-time `onAuthStateChanged` listener
- A `ProtectedRoute` component guards routes that require authentication
- Admin-only UI elements (toggle between catalog view and add-carpet form, delete buttons) are conditionally rendered based on the resolved role

### 🛠️ Admin — Add New Carpet
Admins access a structured form ([CarpetForm](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/components/UI/CarpetForm.tsx#336-343)) to register a new carpet. Key implementation details:
- **Schema validation** with **Zod** + `@hookform/resolvers` — including a custom `setValueAs` transformer to safely handle optional inch fields without producing `NaN` values when inputs are cleared
- **Unit toggle** (Feet / Meters) that conditionally shows/hides the inches sub-fields
- **Concurrent multi-file upload** via Firebase Storage's `uploadBytesResumable` with real-time progress tracking
- **Idempotent Firestore writes** — creates a new document if the carpet number is new, or appends uploaded image URLs to an existing document using `arrayUnion`
- **Payload sanitization** before writing to Firestore (strips `undefined` fields that would otherwise cause silent crashes)

### 🗑️ Admin — Image & Carpet Deletion
- **Individual image deletion** — removes the file from Firebase Storage (path decoded from the download URL) and the URL from the Firestore `imageUrls` array via `arrayRemove`
- **Full carpet deletion** — deletes all storage assets in parallel (`Promise.all`) then removes the Firestore document
- **Optimized UI updates** via TanStack Query's `queryClient.setQueryData` for instant feedback without a refetch

### 📬 Contact Form
An EmailJS-powered contact form for visitor inquiries, without requiring a dedicated backend.

---

## Technical Architecture

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Routing** | React Router v7 (file-based pages, nested layouts) |
| **State & Data Fetching** | TanStack Query v5 (server-state caching, optimistic updates) |
| **Auth & Database** | Firebase v11 — Auth, Firestore, Storage |
| **Form Management** | React Hook Form v7 |
| **Validation** | Zod (schema-first, with type inference) |
| **UI Components** | Material UI v6 + Ant Design v5 |
| **Animation** | Framer Motion + custom CSS keyframe transitions |
| **Email** | EmailJS Browser SDK |
| **Error Handling** | `react-error-boundary` with widget-level and full-page fallbacks |
| **Deployment** | Vercel (with SPA fallback routing via [vercel.json](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/vercel.json)) |

---

## Notable Engineering Decisions

- **Custom [useLongPress](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/hooks/useLongPress.ts#31-96) hook** (`useRef`-based timer management) shared across three components to eliminate duplicated touch-event logic; handles auto-dismiss, cleanup on unmount, and suppresses the OS context menu on image long-press.
- **Custom [useCarpets](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/hooks/useCarpets.ts#10-39) hook** wrapping TanStack Query with a discriminated-union [SearchParams](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/hooks/useCarpets.ts#4-9) type, enabling exhaustive type-safe switching between all three search modes.
- **Custom [useImageStorage](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/hooks/useImageStorage.ts#13-97) hook** encapsulating the entire upload + Firestore write lifecycle, returning live `progress`, `urls`, and `error` state to the consuming form.
- **Firestore Timestamp normalization** — all `Timestamp` fields are converted to native JS [Date](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/lib/firebase/FireBaseCarpet.ts#17-20) at the data-layer boundary so UI components never handle Firestore-specific types directly.
- **URL-driven search state** initialized lazily (`useState(() => parser(urlSearchParams))`) so deep-linked searches restore instantly without a second render.
- **`structuralSharing: false`** on the TanStack Query client to prevent Firestore `Timestamp`/[Date](file:///Users/ray/Documents/Dev/React/Projects/antique-carpet-management-apps/src/lib/firebase/FireBaseCarpet.ts#17-20) objects from failing reference-equality diffing.


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
