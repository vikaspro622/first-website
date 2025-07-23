// Simple static site generator
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const CONTENT_DIR = path.join(__dirname, 'content');
const PUBLIC_DIR = path.join(__dirname, 'public');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const BLOG_PUBLIC_DIR = path.join(PUBLIC_DIR, 'blog');

const TEMPLATE = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');

function renderPage(title, contentHtml) {
  return TEMPLATE.replace(
    /<main>[\s\S]*<\/main>/,
    `<main>\n      <h1>${title}</h1>\n      ${contentHtml}\n    </main>`
  );
}

function buildPage(mdPath, htmlPath, title) {
  const md = fs.readFileSync(mdPath, 'utf8');
  const htmlContent = marked.parse(md);
  const pageHtml = renderPage(title, htmlContent);
  fs.writeFileSync(htmlPath, pageHtml, 'utf8');
  console.log(`Built: ${htmlPath}`);
}

// Build main pages
const pages = [
  { md: 'index.md', html: 'index.html', title: 'Home' },
  { md: 'about.md', html: 'about.html', title: 'About' },
  { md: 'faq.md', html: 'faq.html', title: 'FAQ' },
];
pages.forEach(({ md, html, title }) => {
  buildPage(path.join(CONTENT_DIR, md), path.join(PUBLIC_DIR, html), title);
});

// Build blog posts
ds = fs.readdirSync(BLOG_DIR);
ds.forEach(file => {
  if (file.endsWith('.md')) {
    const name = file.replace(/\.md$/, '');
    buildPage(
      path.join(BLOG_DIR, file),
      path.join(BLOG_PUBLIC_DIR, name + '.html'),
      name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    );
  }
}); 