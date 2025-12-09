# BNI EverShine React Project

This project has been fully migrated to a modern **React + TypeScript + Vite** stack.

## 🚀 Getting Started

### 1. Install Dependencies
Since the project structure has changed, please reinstall dependencies to ensure everything is linked correctly.

```bash
npm install
```

### 2. Run Development Server
Start the local development server:

```bash
npm run dev
```
Then visit [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
To create a production-ready build:

```bash
npm run build
```
The output will be in the `dist/` directory.

## ☁️ Deployment (Zeabur)

This project is optimized for deployment on **Zeabur**.

1.  Push this code to your GitHub repository.
2.  Log in to [Zeabur Dashboard](https://dash.zeabur.com) and create a new project.
3.  Select specific repository.
4.  Zeabur will automatically detect it as a static website/Vite project.
5.  If you need to configure manually:
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
    *   **Framework**: Vite

---

## 📂 Project Structure

*   **`src/`**: All React source code (Pages, Components, Hooks).
*   **`public/`**: Static assets including images and JSON data files.
*   **`legacy_archive/`**: Full backup of the previous HTML/JS website. **Do not edit files here** unless you need to reference old logic.

## 🌟 Key Features

*   **Homepage**: Hero section, About Us, Infinite Member Wall, Results Metrics, **Full FAQ**, **Contact Info**.
*   **BNI Page**: Global & Taiwan Stats, Core Process, Givers Gain culture.
*   **Members Page**: Searchable and filterable member list with expandable details.
*   **Referrals Page**: Showcase of business referrals and success stories.
*   **Tech Stack**: React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.

## ⚠️ Notes for Developers

*   The old `v2_react` folder has been merged into the root directory.
*   The old website files are safely stored in `legacy_archive/`.
