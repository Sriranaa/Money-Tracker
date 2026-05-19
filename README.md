# MoneyTracker

Modern responsive finance management app built with React, React Router DOM, Tailwind CSS, Firebase Authentication, Firestore, and Cloudinary uploads.

## Free-Mode Stack

- Firebase Authentication: Email/password and Google
- Firebase Firestore: users, settings, transactions, history
- Cloudinary unsigned uploads: proof images
- No Firebase Phone OTP
- No Firebase Storage

## Dependencies

Runtime:
- react
- react-dom
- react-router-dom
- firebase
- lucide-react

Development:
- vite
- @vitejs/plugin-react
- tailwindcss
- postcss
- autoprefixer
- eslint
- @eslint/js
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- globals
- @types/react
- @types/react-dom

## Install

```bash
npm install
```

## Firebase Console

Enable:
- Authentication: Email/Password
- Authentication: Google
- Firestore Database
- Authorized domains for local and production hosting

Do not enable Phone OTP unless you upgrade Firebase billing.

Copy `.env.example` to `.env` and add Firebase web app values.

## Cloudinary

Create a free Cloudinary account, then create an unsigned upload preset.

Add these values to `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
```

Proof image upload works only after these two values are set.

## Local Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Firebase Deploy

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only firestore:rules
npm run build
firebase deploy --only hosting
```

## Vercel Deploy

```bash
npm run build
```

Framework preset: Vite

Build command: `npm run build`

Output directory: `dist`

Add the same Firebase and Cloudinary environment variables in Vercel project settings.
