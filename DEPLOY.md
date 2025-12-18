# Deploying this Vite + React app to GitHub Pages

Steps to publish your app on GitHub Pages using GitHub Actions (no personal token required):

1. Create a new repository on GitHub (do not initialize with a README).
2. Add the remote locally (replace `<your-remote-url>`):

```bash
git remote add origin <your-remote-url>
git branch -M main
git push -u origin main
```

3. This project includes a GitHub Actions workflow that builds the app and deploys the `dist` output to GitHub Pages whenever you push to `main`.

4. After pushing, go to the repository's Settings → Pages and ensure GitHub Pages is enabled (the workflow will create the deployment automatically). The Pages site will be available shortly.

Notes:
- The workflow assumes your production build outputs to `dist` (Vite's default). If your build directory differs, update `.github/workflows/pages.yml`.
- If you prefer to use `gh-pages` branch or a manual approach, you can instead install the `gh-pages` package and add a `deploy` script to `package.json`.
