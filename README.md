# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    ````markdown
    # React + TypeScript + Vite

    This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

    Currently, two official plugins are available:

    - [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
    - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

    ## React Compiler

    The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

    ## Expanding the ESLint configuration

    If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

    ```js
    export default defineConfig([
      globalIgnores(['dist']),
      {
        files: ['**/*.{ts,tsx}'],
        extends: [
          // Other configs...

          // Remove tseslint.configs.recommended and replace with this
          tseslint.configs.recommendedTypeChecked,
          // Alternatively, use this for stricter rules
          tseslint.configs.strictTypeChecked,
          // Optionally, add this for stylistic rules
          tseslint.configs.stylisticTypeChecked,

          // Other configs...
        ],
        languageOptions: {
          parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
          },
          // other options...
        },
      },
    ])
    ```

    You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

    ```js
    // eslint.config.js
    import reactX from 'eslint-plugin-react-x'
    import reactDom from 'eslint-plugin-react-dom'

    export default defineConfig([
      globalIgnores(['dist']),
      {
        files: ['**/*.{ts,tsx}'],
        extends: [
          // Other configs...
          // Enable lint rules for React
          reactX.configs['recommended-typescript'],
          // Enable lint rules for React DOM
          reactDom.configs.recommended,
        ],
        languageOptions: {
          parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
          },
          // other options...
        },
      },
    ])
    ```

    ````

    ## Tailwind CSS & shadcn UI (quickstart)

    I added Tailwind configuration and PostCSS setup to this project. To finish configuring and optionally add `shadcn` UI components, you can follow these steps.

    1. (Already done in this workspace) Install Tailwind and support packages:

       npm install -D tailwindcss postcss autoprefixer

    2. Ensure `tailwind.config.cjs` and `postcss.config.cjs` exist at the project root (they're included here). Tailwind will scan `./index.html` and `./src/**/*` by default.

    3. Import Tailwind in your main CSS file (`src/index.css`) — the directives are already injected here.

    4. Start the dev server:

       npm run dev

    5. To add shadcn UI components (recommended workflow):

       - Run the shadcn UI CLI interactively in the project root (this will scaffold components and a `components/` folder):

         npx shadcn-ui@latest init

       - Then add components you want, for example:

         npx shadcn-ui@latest add button

       Notes:
       - The `shadcn-ui` CLI expects Tailwind to be configured.
       - `clsx` and `lucide-react` are useful companion libraries (they are already installed in this project).

    If you want me to run the `shadcn-ui init` and add a few starter components now, tell me which components (e.g. `button`, `input`, `card`) and I can scaffold them for you.
