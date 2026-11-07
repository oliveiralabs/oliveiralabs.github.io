import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { apps } from "../site/data/apps.mjs";
import { copy, locales } from "../site/data/i18n.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const siteUrl = "https://oliveiralabs.github.io";
const contactEmail = "antonio.filho128@gmail.com";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
const route = (locale, pathname = "/") => `${locales[locale].prefix}${pathname}` || "/";
const absolute = (pathname) => `${siteUrl}${pathname}`;
const contentFor = (app, locale) => app.content[locale];
const projectMail = (locale) => {
  const subject = locale === "pt" ? "Novo projeto — Oliveira Labs" : "New project — Oliveira Labs";
  const body = locale === "pt"
    ? `Olá, Oliveira Labs!\n\nGostaria de conversar sobre um projeto.\n\nProjeto ou ideia:\nTipo de produto (aplicativo, sistema web ou outro):\nObjetivo principal:\nPrazo esperado (se houver):\n\nObrigado(a)!`
    : `Hello, Oliveira Labs!\n\nI'd like to discuss a project.\n\nProject or idea:\nType of product (app, web system or other):\nMain goal:\nExpected timeline (if known):\n\nThank you!`;
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const homeApps = [
  apps.find((app) => app.slug === "mega-drum"),
  apps.find((app) => app.slug === "pads-worship"),
  ...apps.filter((app) => !["mega-drum", "pads-worship"].includes(app.slug)),
];

function header(locale, alternatePath) {
  const t = copy[locale];
  const home = route(locale, "/");
  return `
    <a class="skip-link" href="#content">${locale === "pt" ? "Ir para o conteúdo" : "Skip to content"}</a>
    <header class="site-header" data-header>
      <div class="shell header-inner">
        <a class="brand" href="${home}" aria-label="Oliveira Labs — ${locale === "pt" ? "início" : "home"}" translate="no">
          <img src="/site-assets/brand/oliveira-labs.png" width="52" height="52" alt="">
          <span>Oliveira Labs</span>
        </a>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-navigation" data-menu-button>
          <span>${locale === "pt" ? "Menu" : "Menu"}</span><span class="menu-icon" aria-hidden="true"></span>
        </button>
        <nav class="site-nav" id="site-navigation" aria-label="${locale === "pt" ? "Navegação principal" : "Main navigation"}" data-navigation>
          <a href="${route(locale, "/apps/")}">${t.nav.products}</a>
          <a href="${route(locale, "/services/")}">${t.nav.services}</a>
          <a href="${route(locale, "/about/")}">${t.nav.about}</a>
          <a href="${route(locale, "/support/")}">${t.nav.support}</a>
          <span class="nav-divider" aria-hidden="true"></span>
          <a class="language-link" href="${alternatePath}" hreflang="${locales[locales[locale].other].html}" lang="${locales[locales[locale].other].html}">${locales[locales[locale].other].short}</a>
          <a class="nav-cta" href="${projectMail(locale)}">${t.nav.project}</a>
        </nav>
      </div>
    </header>`;
}

function footer(locale) {
  const t = copy[locale];
  return `
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div class="footer-brand">
          <a class="brand" href="${route(locale, "/")}" translate="no"><img src="/site-assets/brand/oliveira-labs.png" width="64" height="64" alt=""><span>Oliveira Labs</span></a>
          <p>${t.footer.line}</p>
        </div>
        <div class="footer-column"><strong>${t.footer.explore}</strong><a href="${route(locale, "/apps/")}">${t.nav.products}</a><a href="${route(locale, "/services/")}">${t.nav.services}</a><a href="${route(locale, "/about/")}">${t.nav.about}</a></div>
        <div class="footer-column"><strong>${t.footer.contact}</strong><a href="${route(locale, "/support/")}">${t.nav.support}</a><a href="${projectMail(locale)}">${t.nav.project}</a><a href="mailto:${contactEmail}">${contactEmail}</a></div>
        <div class="footer-column"><strong>${t.footer.documents}</strong><a href="/privacy-policy.html">${t.footer.privacy}</a><a href="/app-ads.txt">App-ads.txt</a></div>
      </div>
      <div class="shell footer-bottom"><span>© 2026 Oliveira Labs</span><span>${t.footer.location}</span></div>
    </footer>`;
}

function page({ locale, title, description, pathname, alternatePath, content, bodyClass = "", structuredData = "" }) {
  const currentPath = route(locale, pathname);
  const canonical = absolute(currentPath);
  const englishPath = locale === "en" ? currentPath : alternatePath;
  const portuguesePath = locale === "pt" ? currentPath : alternatePath;
  return `<!doctype html>
<html lang="${locales[locale].html}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="#FFFFFF">
    <meta name="color-scheme" content="light">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="${absolute(englishPath)}">
    <link rel="alternate" hreflang="pt-BR" href="${absolute(portuguesePath)}">
    <link rel="alternate" hreflang="x-default" href="${absolute(englishPath)}">
    <link rel="icon" href="/site-assets/brand/oliveira-labs.png" type="image/png">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="preload" href="/site-assets/fonts/manrope.ttf" as="font" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="/site-assets/styles.css">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="${locale === "pt" ? "pt_BR" : "en_US"}">
    <meta property="og:site_name" content="Oliveira Labs">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${siteUrl}/site-assets/brand/oliveira-labs.png">
    <meta name="twitter:card" content="summary">
    ${structuredData}
    <script src="/site-assets/site.js" defer></script>
  </head>
  <body class="${escapeHtml(bodyClass)}">
    ${header(locale, alternatePath)}
    <main id="content">${content}</main>
    ${footer(locale)}
  </body>
</html>`;
}

function sectionHeading(kicker, title, text = "", align = "left") {
  return `<div class="section-heading section-heading-${align}"><p class="kicker"><span aria-hidden="true"></span>${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2>${text ? `<p>${escapeHtml(text)}</p>` : ""}</div>`;
}

function platformList(app, locale) {
  return `<div class="platform-list" aria-label="${locale === "pt" ? "Plataformas" : "Platforms"}">${app.platforms.map((platform) => `<span>${escapeHtml(platform)}</span>`).join("")}</div>`;
}

function productCard(app, locale, size = "standard") {
  const item = contentFor(app, locale);
  const t = copy[locale].products;
  return `<article class="product-card product-card-${size}" style="--app-color:${app.accent}">
    <div class="product-card-top"><img src="${app.icon}" width="112" height="112" alt="${escapeHtml(item.name)} icon" loading="lazy"><div>${app.status ? `<span class="status-pill">${t.coming}</span>` : platformList(app, locale)}</div></div>
    <div class="product-card-copy"><p>${escapeHtml(item.category)}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.lead)}</p></div>
    <a class="card-link" href="${route(locale, `/apps/${app.slug}/`)}"><span>${t.open}</span><span class="link-disc" aria-hidden="true">↗</span></a>
  </article>`;
}

function labVisual(locale) {
  const t = copy[locale].hero;
  return `<div class="lab-visual" aria-label="${escapeHtml(t.visualTitle)}">
    <img class="lab-pattern" src="/site-assets/lab-pattern.svg" width="760" height="680" alt="">
    <div class="lab-orbit lab-orbit-one" aria-hidden="true"></div><div class="lab-orbit lab-orbit-two" aria-hidden="true"></div>
    <div class="lab-core"><span class="bubble bubble-one" aria-hidden="true"></span><span class="bubble bubble-two" aria-hidden="true"></span><img src="/site-assets/brand/oliveira-labs.png" width="256" height="256" alt="Oliveira Labs"></div>
    <a class="floating-product floating-drum" href="${route(locale, "/apps/mega-drum/")}"><img src="${apps[0].icon}" width="66" height="66" alt=""><span>Mega Drum</span></a>
    <a class="floating-product floating-pads" href="${route(locale, "/apps/pads-worship/")}"><img src="${apps.find((app) => app.slug === "pads-worship").icon}" width="58" height="58" alt=""><span>Pads Worship</span></a>
    <a class="floating-product floating-piano" href="${route(locale, "/apps/mega-piano/")}"><img src="${apps[2].icon}" width="54" height="54" alt=""><span>Mega Piano</span></a>
    <div class="floating-code" aria-hidden="true"><span>&lt;/&gt;</span><strong>${locale === "pt" ? "Aplicativos + sistemas" : "Apps + systems"}</strong></div>
    <div class="lab-note"><span></span><div><strong>${escapeHtml(t.visualTitle)}</strong><small>${escapeHtml(t.visualText)}</small></div></div>
  </div>`;
}

function proofStrip(locale) {
  return `<section class="proof-strip" aria-label="${locale === "pt" ? "Experiência" : "Experience"}"><div class="shell proof-grid">${copy[locale].proof.map(([value, label]) => `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}</div></section>`;
}

function servicesBlock(locale, full = false) {
  const t = copy[locale].services;
  return `<section class="services-section ${full ? "services-full" : ""}">
    <div class="shell">
      ${sectionHeading(t.kicker, t.title, t.text)}
      <div class="capability-grid">${t.capabilities.map(([title, text], index) => `<article><span class="capability-icon" aria-hidden="true">${["⌁", "⌘", "{}", "✓"][index]}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div>
      <a class="button button-primary" href="${projectMail(locale)}">${t.cta}<span aria-hidden="true">↗</span></a>
      ${full ? `<div class="process"><h2>${escapeHtml(t.processTitle)}</h2><ol>${t.process.map(([title, text], index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div></li>`).join("")}</ol></div>` : ""}
    </div>
  </section>`;
}

function finalCta(locale) {
  const t = copy[locale].finalCta;
  return `<section class="final-cta"><div class="shell"><img src="/site-assets/brand/oliveira-labs.png" width="108" height="108" alt=""><div><h2>${escapeHtml(t.title)}</h2><p>${escapeHtml(t.text)}</p></div><a class="button button-white" href="${projectMail(locale)}">${escapeHtml(t.button)}<span aria-hidden="true">↗</span></a></div></section>`;
}

function homePage(locale) {
  const t = copy[locale];
  const alternate = route(locales[locale].other, "/");
  const description = locale === "pt" ? "A Oliveira Labs cria aplicativos, sistemas e produtos digitais e oferece serviços de desenvolvimento para novos projetos." : "Oliveira Labs creates apps, systems and digital products and provides development services for new projects.";
  const content = `
    <section class="hero"><div class="shell hero-grid"><div class="hero-copy"><p class="hero-badge"><span aria-hidden="true">⌁</span>${escapeHtml(t.hero.badge)}</p><h1>${escapeHtml(t.hero.title)}</h1><p>${escapeHtml(t.hero.text)}</p><div class="hero-actions"><a class="button button-primary" href="#products">${escapeHtml(t.hero.primary)}</a><a class="button button-secondary" href="${projectMail(locale)}">${escapeHtml(t.hero.secondary)}<span aria-hidden="true">↗</span></a></div></div>${labVisual(locale)}</div></section>
    ${proofStrip(locale)}
    <section class="products-section" id="products"><div class="shell">${sectionHeading(t.products.kicker, t.products.title, t.products.text, "center")}<div class="product-grid">${homeApps.map((app, index) => productCard(app, locale, index < 2 ? "featured" : "standard")).join("")}</div><div class="center-action"><a class="button button-secondary" href="${route(locale, "/apps/")}">${t.products.all}<span aria-hidden="true">↗</span></a></div></div></section>
    ${servicesBlock(locale)}
    <section class="case-study"><div class="shell case-grid"><div class="case-media"><img src="/assets/img/megadrum-showcase.webp" width="1847" height="851" alt="Mega Drum interface" loading="lazy"><div class="case-stat"><strong>1M+</strong><span>${escapeHtml(t.caseStudy.stat)}</span></div></div><div class="case-copy"><p class="kicker"><span aria-hidden="true"></span>${escapeHtml(t.caseStudy.kicker)}</p><h2>${escapeHtml(t.caseStudy.title)}</h2><p>${escapeHtml(t.caseStudy.text)}</p><div class="case-detail"><span>Android · iOS · Web</span><span>${escapeHtml(t.caseStudy.secondary)}</span></div><a class="button button-secondary" href="${route(locale, "/apps/mega-drum/")}">${escapeHtml(t.caseStudy.link)}<span aria-hidden="true">↗</span></a></div></div></section>
    <section class="about-section"><div class="shell about-grid"><div class="about-logo"><img src="/site-assets/brand/oliveira-labs.png" width="260" height="260" alt="Oliveira Labs"></div><div>${sectionHeading(t.about.kicker, t.about.title, t.about.text)}<a class="text-link" href="${route(locale, "/about/")}">${escapeHtml(t.about.link)}<span aria-hidden="true">↗</span></a></div></div></section>
    ${finalCta(locale)}`;
  return page({ locale, title: locale === "pt" ? "Oliveira Labs — Aplicativos, sistemas e desenvolvimento" : "Oliveira Labs — Apps, systems and development", description, pathname: "/", alternatePath: alternate, content, bodyClass: "home-page", structuredData: jsonLd({ "@context": "https://schema.org", "@type": "Organization", name: "Oliveira Labs", url: siteUrl, email: contactEmail, description }) });
}

function pageHero(title, text, locale, visual = true) {
  return `<section class="page-hero"><div class="shell page-hero-grid"><div><p class="hero-badge"><span aria-hidden="true">⌁</span>Oliveira Labs</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p></div>${visual ? `<div class="page-hero-mark"><img src="/site-assets/brand/oliveira-labs.png" width="260" height="260" alt=""></div>` : ""}</div></section>`;
}

function portfolioPage(locale) {
  const t = copy[locale];
  const content = `${pageHero(t.pages.portfolioHero, t.pages.portfolioText, locale)}<section class="products-section portfolio-page-section"><div class="shell"><div class="product-grid">${apps.map((app) => productCard(app, locale)).join("")}</div></div></section>${finalCta(locale)}`;
  return page({ locale, title: t.pages.portfolioTitle, description: t.pages.portfolioText, pathname: "/apps/", alternatePath: route(locales[locale].other, "/apps/"), content, bodyClass: "portfolio-page" });
}

function servicesPage(locale) {
  const t = copy[locale];
  const content = `${pageHero(t.pages.servicesHero, t.pages.servicesText, locale)}${proofStrip(locale)}${servicesBlock(locale, true)}${finalCta(locale)}`;
  return page({ locale, title: t.pages.servicesTitle, description: t.pages.servicesText, pathname: "/services/", alternatePath: route(locales[locale].other, "/services/"), content, bodyClass: "services-page" });
}

function aboutPage(locale) {
  const t = copy[locale];
  const values = locale === "pt" ? [["Produtos próprios", "Experiência prática com produtos publicados e mantidos ao longo do tempo."], ["Visão completa", "Decisões de produto, interface, engenharia e publicação conectadas."], ["Parceria direta", "Comunicação próxima e decisões objetivas durante o projeto."]] : [["Products of our own", "Hands-on experience with products that are published and maintained over time."], ["Complete perspective", "Product, interface, engineering and publishing decisions connected."], ["Direct partnership", "Close communication and clear decisions throughout the project."]];
  const content = `${pageHero(t.pages.aboutHero, t.pages.aboutText, locale)}<section class="about-detail"><div class="shell"><div class="about-story"><img src="/site-assets/brand/oliveira-labs.png" width="320" height="320" alt="Oliveira Labs"><div><h2>${escapeHtml(t.about.title)}</h2><p>${escapeHtml(t.about.text)}</p><p>${locale === "pt" ? "O conceito de laboratório representa a forma de trabalhar: observar um problema, testar ideias, construir com cuidado e aprender com o uso real." : "The laboratory concept represents how we work: observe a problem, test ideas, build carefully and learn from real use."}</p></div></div><div class="value-grid">${values.map(([title, text]) => `<article><span aria-hidden="true">⌁</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div></div></section>${finalCta(locale)}`;
  return page({ locale, title: t.pages.aboutTitle, description: t.pages.aboutText, pathname: "/about/", alternatePath: route(locales[locale].other, "/about/"), content, bodyClass: "about-page" });
}

function supportPage(locale) {
  const t = copy[locale];
  const items = apps.map((app) => { const item = contentFor(app, locale); const href = app.support || `mailto:${contactEmail}?subject=${encodeURIComponent(`${locale === "pt" ? "Suporte" : "Support"} — ${item.name}`)}`; return `<li><img src="${app.icon}" width="62" height="62" alt=""><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.category)}</span></div><a href="${href}">${app.support ? t.pages.appSupport : t.pages.contact}<span aria-hidden="true">↗</span></a></li>`; }).join("");
  const content = `${pageHero(t.pages.supportHero, t.pages.supportText, locale)}<section class="support-section"><div class="shell"><ul class="support-list">${items}</ul><div class="support-contact"><h2>${locale === "pt" ? "Ainda precisa de ajuda?" : "Still need help?"}</h2><p>${locale === "pt" ? "Inclua o aparelho, a versão do sistema, a versão do aplicativo e uma descrição do que aconteceu." : "Include your device, operating system version, app version and a description of what happened."}</p><a class="button button-primary" href="mailto:${contactEmail}">${t.pages.contact}</a></div></div></section>`;
  return page({ locale, title: t.pages.supportTitle, description: t.pages.supportText, pathname: "/support/", alternatePath: route(locales[locale].other, "/support/"), content, bodyClass: "support-page" });
}

function storeButtons(app, locale) {
  const t = copy[locale].pages;
  const buttons = [];
  if (app.stores.google) buttons.push(`<a class="store-button" href="${app.stores.google}"><span>Google Play</span><strong>${t.appStoreGoogle}</strong></a>`);
  if (app.stores.apple) buttons.push(`<a class="store-button" href="${app.stores.apple}"><span>App Store</span><strong>${t.appStoreApple}</strong></a>`);
  if (app.website) buttons.push(`<a class="store-button" href="${app.website}"><span>Web</span><strong>${new URL(app.website).hostname}</strong></a>`);
  if (!buttons.length) buttons.push(`<span class="store-button store-status"><span>Status</span><strong>${t.appStatus}</strong></span>`);
  return buttons.join("");
}

function appPage(app, locale) {
  const t = copy[locale];
  const item = contentFor(app, locale);
  const next = apps[(apps.indexOf(app) + 1) % apps.length];
  const nextItem = contentFor(next, locale);
  const content = `<article class="app-page-content" style="--app-color:${app.accent}">
    <section class="app-hero"><div class="shell"><nav class="breadcrumb" aria-label="${locale === "pt" ? "Navegação estrutural" : "Breadcrumb"}"><a href="${route(locale, "/apps/")}">${t.nav.products}</a><span>/</span><span aria-current="page">${escapeHtml(item.name)}</span></nav><div class="app-hero-grid"><div class="app-icon-stage"><span class="app-stage-bubble one" aria-hidden="true"></span><span class="app-stage-bubble two" aria-hidden="true"></span><img src="${app.icon}" width="330" height="330" alt="${escapeHtml(item.name)} icon" fetchpriority="high"></div><div class="app-intro"><p class="kicker"><span aria-hidden="true"></span>${escapeHtml(item.category)}</p><h1>${escapeHtml(item.name)}</h1><p>${escapeHtml(item.lead)}</p>${platformList(app, locale)}<div class="store-buttons">${storeButtons(app, locale)}</div></div></div></div></section>
    <section class="app-description"><div class="shell"><p>${escapeHtml(item.description)}</p></div></section>
    <section class="app-features"><div class="shell">${sectionHeading(t.pages.appFeatures, item.name)}<div class="feature-grid">${item.features.map(([title, text]) => `<article><span aria-hidden="true">⌁</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div></div></section>
    <section class="app-resources"><div class="shell"><h2>${t.pages.appResources}</h2><div>${app.support ? `<a href="${app.support}">${t.pages.appSupport}<span aria-hidden="true">↗</span></a>` : `<a href="mailto:${contactEmail}">${t.pages.contact}<span aria-hidden="true">↗</span></a>`}<a href="${app.privacy}">${t.pages.appPrivacy}<span aria-hidden="true">↗</span></a>${app.website ? `<a href="${app.website}">${t.pages.appWebsite}<span aria-hidden="true">↗</span></a>` : ""}</div></div></section>
    <nav class="next-app" aria-label="${t.pages.next}"><a href="${route(locale, `/apps/${next.slug}/`)}"><span>${t.pages.next}</span><strong>${escapeHtml(nextItem.name)}</strong><span class="link-disc" aria-hidden="true">↗</span></a></nav>
  </article>`;
  const description = `${item.lead} ${item.description}`;
  return page({ locale, title: `${item.name} — Oliveira Labs`, description, pathname: `/apps/${app.slug}/`, alternatePath: route(locales[locale].other, `/apps/${app.slug}/`), content, bodyClass: "app-page", structuredData: jsonLd({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: item.name, applicationCategory: "SoftwareApplication", operatingSystem: app.platforms.join(", "), description: item.lead, url: absolute(route(locale, `/apps/${app.slug}/`)), image: absolute(app.icon), author: { "@type": "Organization", name: "Oliveira Labs", url: siteUrl } }) });
}

function notFoundPage(locale) {
  const content = `<section class="not-found"><div class="shell"><img src="/site-assets/brand/oliveira-labs.png" width="150" height="150" alt=""><strong>404</strong><h1>${locale === "pt" ? "Este experimento não foi encontrado." : "This experiment could not be found."}</h1><p>${locale === "pt" ? "O endereço pode ter mudado ou não existir." : "The address may have changed or may not exist."}</p><a class="button button-primary" href="${route(locale, "/")}">${locale === "pt" ? "Voltar ao início" : "Back to home"}</a></div></section>`;
  return page({ locale, title: locale === "pt" ? "Página não encontrada — Oliveira Labs" : "Page not found — Oliveira Labs", description: "404", pathname: locale === "pt" ? "/404/" : "/404.html", alternatePath: route(locales[locale].other, locale === "pt" ? "/404.html" : "/404/"), content, bodyClass: "not-found-page" });
}

async function writeRoute(pathname, html) {
  if (pathname.endsWith(".html")) { await writeFile(path.join(output, pathname.replace(/^\//, "")), html); return; }
  const directory = pathname === "/" ? output : path.join(output, pathname.replace(/^\//, ""));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}

async function copyProtectedFiles() {
  const contract = JSON.parse(await readFile(path.join(root, "static-contract.json"), "utf8"));
  for (const entry of contract.files) {
    const destination = path.join(output, entry.path);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(root, entry.path), destination);
  }
}

async function build() {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await copyProtectedFiles();
  await cp(path.join(root, "site", "assets"), path.join(output, "site-assets"), { recursive: true });

  const indexed = [];
  for (const locale of Object.keys(locales)) {
    const pages = [
      [route(locale, "/"), homePage(locale)],
      [route(locale, "/apps/"), portfolioPage(locale)],
      [route(locale, "/services/"), servicesPage(locale)],
      [route(locale, "/about/"), aboutPage(locale)],
      [route(locale, "/support/"), supportPage(locale)],
    ];
    for (const app of apps) pages.push([route(locale, `/apps/${app.slug}/`), appPage(app, locale)]);
    for (const [pathname, html] of pages) { await writeRoute(pathname, html); indexed.push(pathname); }
  }
  await writeRoute("/404.html", notFoundPage("en"));
  await writeRoute("/pt/404/", notFoundPage("pt"));
  await writeRoute("/help/", supportPage("en"));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map((pathname) => `  <url><loc>${absolute(pathname)}</loc></url>`).join("\n")}\n</urlset>\n`;
  await writeFile(path.join(output, "sitemap.xml"), sitemap);
  await writeFile(path.join(output, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  await writeFile(path.join(output, "manifest.webmanifest"), JSON.stringify({ name: "Oliveira Labs", short_name: "Oliveira Labs", start_url: "/", display: "standalone", background_color: "#FFFFFF", theme_color: "#5FADE8", icons: [{ src: "/site-assets/brand/oliveira-labs.png", sizes: "512x512", type: "image/png" }] }, null, 2));
  console.log(`Oliveira Labs built: ${indexed.length} localized pages, 2 not-found pages and one compatibility route.`);
}

await build();
