
# Task Dashboard

## Description

A task management dashboard built with React + TypeScript (Vite) that helps users create, organize, and track tasks. Features include task CRUD, filtering, drag-and-drop reordering, local persistence, and a light/dark theme toggle.

## Table of Contents

- [Technologies Used](#technologiesused)
- [Features](#features)
- [Future Features](#nextsteps)
- [Deployed App](#deployment)
- [About The Authors](#author)

## <a name="technologiesused"></a>Technologies Used

- **React** - UI library for building components
- **TypeScript** - Static typing for safer code
- **Vite** - Fast development and build tooling
- **@dnd-kit** - Drag-and-drop and sortable utilities
- **CSS3** - Styling and theming with custom properties

## <a name="features"></a> Features

**Create / Edit / Delete** - Add new tasks, edit existing ones, and remove tasks easily.  
**Drag-and-Drop Reordering** - Reorder tasks using a smooth drag-and-drop interface powered by `@dnd-kit`.  
**Filtering & Search** - Filter by status/priority and search tasks by text.  
**Persistent Storage** - Tasks are saved to `localStorage` so data persists across sessions.  
**Theme Toggle** - Switch between light and dark themes.  
**Responsive Design** - Works across desktop and smaller screens.  

**In Progress:**

- [ ] Accessibility improvements (focus states, keyboard DnD)

## <a name="nextsteps"></a>Future Features

- **User Accounts & Sync** - Persist tasks to a server and sync across devices.  
- **Export / Import** - Export task lists to CSV/JSON and import them back.  
- **Notifications & Reminders** - In-app reminders for due tasks.  
- **Advanced Filters & Smart Lists** - Save custom filter views and smart lists.  

## <a name="deployment"></a>Deployed Link

**Live Application:**  
https://cfra8189.github.io/task-dashboard/

**Repository:**  
https://github.com/cfra8189/task-dashboard

## <a name="author"></a>About The Authors

- **Clarence Franklin** — UI/UX Design & Frontend Development

If you'd like additional contributors listed, provide their names and links and I will add them.

## Development Process

- Built iteratively using Vite dev server and feature-focused commits.  
- Uses local testing with `npm run dev` and production builds with `npm run build`.

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/cfra8189/task-dashboard.git
cd task-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Deploy options:

- **GitHub Actions**: push to `main` (workflow included) and Pages will auto-deploy.  
- **gh-pages**: use `npm run deploy` (project includes `predeploy` and `deploy` scripts).

## Works Cited

- React: https://reactjs.org/  
- Vite: https://vitejs.dev/  
- @dnd-kit: https://github.com/clauderic/dnd-kit  
- MDN Web Docs: https://developer.mozilla.org/



