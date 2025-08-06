// Simple static site generator
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const CONTENT_DIR = path.join(__dirname, 'content');
const PUBLIC_DIR = path.join(__dirname, 'public');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const BLOG_PUBLIC_DIR = path.join(PUBLIC_DIR, 'blog');

const BASE_TEMPLATE = fs.readFileSync(path.join(PUBLIC_DIR, 'base-template.html'), 'utf8');
const NAV_TEMPLATE = fs.readFileSync(path.join(PUBLIC_DIR, 'nav-template.html'), 'utf8');
const CONVERTKIT_FORM = fs.readFileSync(path.join(PUBLIC_DIR, 'convertkit-form.html'), 'utf8');

function renderPage(title, contentHtml, isBlog = false) {
  // Create navigation with appropriate links
  const navHtml = NAV_TEMPLATE
    .replace('NAV_HOME_LINK', isBlog ? '../index.html' : 'index.html')
    .replace('NAV_ACADEMY_LINK', isBlog ? '../academy.html' : 'academy.html')
    .replace('NAV_LOGIN_LINK', isBlog ? '../login.html' : 'login.html')
    .replace('NAV_BLOG_LINK', isBlog ? 'first-post.html' : 'blog/first-post.html')
    .replace('NAV_ABOUT_LINK', isBlog ? '../about.html' : 'about.html');

  // Create page content with ConvertKit form
  const pageContent = `
    <h1 class="hero-title">
      <span class="main-title">${title}</span>
    </h1>
    
    <div class="hero-description">
      ${contentHtml}
    </div>
    
    <!-- ConvertKit Form -->
    ${CONVERTKIT_FORM}
  `;

  // Build the complete page
  return BASE_TEMPLATE
    .replace('PAGE_TITLE', `Part-Time YouTuber Academy - ${title}`)
    .replace('PAGE_CSS_PATH', isBlog ? '../styles.css' : 'styles.css')
    .replace('PAGE_SCRIPT_PATH', isBlog ? '../script.js' : 'script.js')
    .replace('NAVIGATION_PLACEHOLDER', navHtml)
    .replace('PAGE_CONTENT', pageContent);
}

function buildPage(mdPath, htmlPath, title, isBlog = false) {
  const md = fs.readFileSync(mdPath, 'utf8');
  const htmlContent = marked.parse(md);
  const pageHtml = renderPage(title, htmlContent, isBlog);
  fs.writeFileSync(htmlPath, pageHtml, 'utf8');
  console.log(`Built: ${htmlPath}`);
}

// Build main pages (skip index.html)
const pages = [
  // { md: 'index.md', html: 'index.html', title: 'Home' }, // SKIP index.html
  { md: 'about.md', html: 'about.html', title: 'About' },
  { md: 'faq.md', html: 'faq.html', title: 'FAQ' },
];
pages.forEach(({ md, html, title }) => {
  buildPage(path.join(CONTENT_DIR, md), path.join(PUBLIC_DIR, html), title, false);
});

// Build blog posts
ds = fs.readdirSync(BLOG_DIR);
ds.forEach(file => {
  if (file.endsWith('.md')) {
    const name = file.replace(/\.md$/, '');
    const title = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    buildPage(
      path.join(BLOG_DIR, file),
      path.join(BLOG_PUBLIC_DIR, name + '.html'),
      title,
      true // isBlog = true
    );
  }
}); 