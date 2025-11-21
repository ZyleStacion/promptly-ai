<!-- default README -->
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



<!-- SHORT TERM -->
# promptly-ai
Promptly AI is a web platform that enables SMBs to upload private corporate data to generate a custom AI model.

# Requirement
TailwindCSS Version  3.4.17

Install Tailwind CSS with Vite

1. Create your project

npm create vite@latest my-project -- --template react
cd my-project



2. Install Tailwind CSS

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p



3. Configure your template paths (tailwind.config.js)

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9610FA',
        secondary: '#165BFB',
        subPrimary:'gray-900',
        subSecondary:'neutral-950'
       },

      containers: {
        center: true,
        padding:{
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },

     },
  },
  plugins: [],
}

4. Add the Tailwind directives to your CSS (index.css)

@tailwind base;
@tailwind components;
@tailwind utilities;


5. Start your build process

npm run dev

6. Extra install

install react-icons framer-motion