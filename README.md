# Myportfolio
# My Portfolio — Shaikh Jawwad Ahmad

A fast, single-page portfolio built with Vite + React + Tailwind + Framer Motion. It auto-deploys to GitHub Pages on every push to `main`.

## Live URL (after first deploy)
- https://jawwad9226.github.io/Myportfolio/

## Highlights
- Zero local setup required to publish.
- Smart avatar loader: tries `/profile.webp`, `/profile.jpg`, then your GitHub avatar. Shows a shimmer while loading and a default icon if all fail.
- Automatic color theming extracted from your avatar (with tasteful fallbacks).
- Smooth hover interactions for contact buttons and project cards.

## How to publish
1. Commit these files to `main`.
2. Go to Settings → Pages and ensure **Build and deployment = GitHub Actions**.
3. Wait for the "Deploy Vite site to GitHub Pages" workflow to finish, then visit the live URL above.

## Customize
- Edit projects/skills in `src/App.jsx` (near the top).
- To override the photo, add `public/profile.jpg` or `public/profile.webp`. If missing, your GitHub avatar is used.

## Local development (optional)
```bash
npm install
npm run dev
```
