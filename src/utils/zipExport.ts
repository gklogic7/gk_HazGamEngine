import JSZip from 'jszip';
import { VanillaProject } from '../types';

/**
 * Prepares the HTML file by ensuring link to styles.css and script.js exist
 */
export function prepareStandaloneHtml(project: VanillaProject): string {
  let html = project.html;

  // If html doesn't have a head or body, wrap it nicely
  if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title}</title>
</head>
<body>
${html}
</body>
</html>`;
  }

  // Bundle CSS inside <style>
  const styleTag = `\n  <style>\n${project.css}\n  </style>`;
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${styleTag}\n</head>`);
  } else {
    html = `${styleTag}\n${html}`;
  }

  // Bundle JS inside <script>
  const scriptTag = `\n  <script>\n${project.js}\n  </script>`;
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${scriptTag}\n</body>`);
  } else {
    html = `${html}\n${scriptTag}`;
  }

  return html;
}

/**
 * Prepares index.html for ZIP export with external link and script tags
 */
export function prepareZipHtml(project: VanillaProject): string {
  let html = project.html;

  if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${html}
  <script src="script.js"></script>
</body>
</html>`;
    return html;
  }

  // Check if styles.css is referenced
  if (!html.includes('styles.css') && !html.includes('style.css')) {
    const linkTag = `  <link rel="stylesheet" href="styles.css">\n`;
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${linkTag}</head>`);
    } else {
      html = `${linkTag}${html}`;
    }
  }

  // Check if script.js is referenced
  if (!html.includes('script.js') && !html.includes('app.js')) {
    const scriptTag = `  <script src="script.js"></script>\n`;
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${scriptTag}</body>`);
    } else {
      html = `${html}\n${scriptTag}`;
    }
  }

  return html;
}

/**
 * Packages and downloads the project as a clean ZIP file
 */
export async function downloadProjectAsZip(project: VanillaProject): Promise<void> {
  const zip = new JSZip();

  const zipHtml = prepareZipHtml(project);
  zip.file('index.html', zipHtml);
  zip.file('styles.css', project.css);
  zip.file('script.js', project.js);

  const readme = `# ${project.title}

100% Pure Vanilla HTML, CSS & JavaScript Project.

## How to Run Offline
1. Double-click \`index.html\` to open directly in any web browser (Chrome, Firefox, Safari, Edge).
2. No internet connection, npm install, or local server required!

## Project Files
- \`index.html\`: Semantic HTML5 markup
- \`styles.css\`: Pure CSS stylesheets
- \`script.js\`: Native Vanilla JavaScript logic

Generated with VanillaLab Offline Studio.
`;

  zip.file('README.md', readme);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  a.download = `${slug || 'vanilla-project'}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads single self-contained HTML file
 */
export function downloadSingleHtml(project: VanillaProject): void {
  const fullHtml = prepareStandaloneHtml(project);
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  a.download = `${slug || 'vanilla-project'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
