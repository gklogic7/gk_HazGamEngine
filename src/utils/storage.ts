import { VanillaProject } from '../types';
import { DEFAULT_PROJECTS } from '../data/defaultProjects';

const PROJECTS_STORAGE_KEY = 'vanillalab_projects_v1';
const ACTIVE_PROJECT_KEY = 'vanillalab_active_project_v1';

export function getStoredProjects(): VanillaProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PROJECTS;
  } catch (e) {
    console.warn('Failed to load projects from storage:', e);
    return DEFAULT_PROJECTS;
  }
}

export function saveStoredProjects(projects: VanillaProject[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to storage:', e);
  }
}

export function getActiveProjectId(projects: VanillaProject[]): string {
  try {
    const savedId = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (savedId && projects.some(p => p.id === savedId)) {
      return savedId;
    }
  } catch (e) {
    // fallback
  }
  return projects[0]?.id || DEFAULT_PROJECTS[0].id;
}

export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch (e) {
    // ignore
  }
}

export function createBlankProject(title: string = 'New Vanilla Project'): VanillaProject {
  return {
    id: 'proj-' + Date.now(),
    title,
    description: 'Custom offline Vanilla HTML, CSS & JavaScript project.',
    category: 'starter',
    icon: 'Code2',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isCustom: true,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <div class="wrapper">
    <h1>${title}</h1>
    <p>Start writing your pure Vanilla HTML, CSS, and JS code right here.</p>
    <button id="testBtn">Test Me</button>
  </div>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.wrapper {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 24px;
  max-width: 480px;
  width: 100%;
}

h1 {
  color: #38bdf8;
  margin-bottom: 12px;
}

p {
  color: #94a3b8;
  margin-bottom: 16px;
  line-height: 1.5;
}

button {
  background: #0284c7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #0369a1;
}`,
    js: `// Vanilla JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('testBtn');
  btn.addEventListener('click', () => {
    alert('Vanilla JavaScript working offline!');
    console.log('Button clicked in project!');
  });
  console.log('Project loaded');
});`
  };
}
