import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { apps } from "../site/data/apps.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const siteUrl = "https://oliveiralabs.github.io";
const contactEmail = "antonio.filho128@gmail.com";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
}

function header() {
  return `
    <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <header class="site-header" data-header>
      <div class="shell header-inner">
        <a class="brand" href="/" aria-label="Oliveira Labs — início" translate="no">
          <span class="brand-mark" aria-hidden="true"><span>O</span><span>L</span></span>
          <span class="brand-name">Oliveira Labs</span>
        </a>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-navigation" data-menu-button>
          <span>Menu</span><span class="menu-lines" aria-hidden="true"></span>
        </button>
        <nav class="site-nav" id="site-navigation" aria-label="Navegação principal" data-navigation>
          <a href="/apps/">Aplicativos</a>
          <a href="/sobre/">Sobre</a>
          <a href="/suporte/">Suporte</a>
        </nav>
      </div>
    </header>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="shell footer-main">
        <div>
          <a class="brand brand-footer" href="/" aria-label="Oliveira Labs — início" translate="no">
            <span class="brand-mark" aria-hidden="true"><span>O</span><span>L</span></span>
            <span class="brand-name">Oliveira Labs</span>
          </a>
          <p>Aplicativos musicais independentes para tocar, praticar e criar.</p>
        </div>
        <div class="footer-links">
          <div><strong>Explorar</strong><a href="/apps/">Todos os aplicativos</a><a href="/sobre/">Sobre o estúdio</a></div>
          <div><strong>Contato</strong><a href="/suporte/">Central de suporte</a><a href="mailto:${contactEmail}">${contactEmail}</a></div>
          <div><strong>Documentos</strong><a href="/privacy-policy.html">Privacidade</a><a href="/app-ads.txt">App-ads.txt</a></div>
        </div>
      </div>
      <div class="shell footer-bottom"><span>© 2026 Oliveira Labs</span><span>Montes Claros, Brasil</span></div>
    </footer>`;
}

function page({ title, description, pathname, content, bodyClass = "", structuredData = "" }) {
  const canonical = `${siteUrl}${pathname}`;
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="#17213A">
    <meta name="color-scheme" content="light">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" href="/site-assets/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="preload" href="/site-assets/fonts/bricolage-grotesque.ttf" as="font" type="font/ttf" crossorigin>
    <link rel="preload" href="/site-assets/fonts/ibm-plex-sans.ttf" as="font" type="font/ttf" crossorigin>
    <link rel="stylesheet" href="/site-assets/styles.css">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="Oliveira Labs">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta name="twitter:card" content="summary">
    ${structuredData}
    <script src="/site-assets/site.js" defer></script>
  </head>
  <body class="${escapeHtml(bodyClass)}">
    ${header()}
    <main id="conteudo">${content}</main>
    ${footer()}
  </body>
</html>`;
}

function platformList(app) {
  return app.platforms.map((platform) => `<span>${escapeHtml(platform)}</span>`).join("");
}

function appLink(app, label = "Conhecer o aplicativo") {
  return `<a class="text-link" href="/apps/${app.slug}/"><span>${escapeHtml(label)}</span><span aria-hidden="true">↗</span></a>`;
}

function score(app, index) {
  return `<a class="score-track" href="/apps/${app.slug}/" style="--track:${index};--app-accent:${app.accent}" data-score-track>
    <span class="score-number">${app.order}</span>
    <span class="score-icon-wrap"><img src="${app.icon}" width="62" height="62" alt="" loading="${index > 2 ? "lazy" : "eager"}"></span>
    <span class="score-label"><strong>${escapeHtml(app.name)}</strong><small>${escapeHtml(app.category)}</small></span>
  </a>`;
}

function portfolioRow(app) {
  return `<article class="portfolio-row" style="--app-accent:${app.accent}">
    <div class="portfolio-number">${app.order}</div>
    <a class="portfolio-icon" href="/apps/${app.slug}/" aria-label="${escapeHtml(app.name)}"><img src="${app.icon}" width="144" height="144" alt="Ícone do ${escapeHtml(app.name)}" loading="lazy"></a>
    <div class="portfolio-copy">
      <p>${escapeHtml(app.category)}</p>
      <h3><a href="/apps/${app.slug}/">${escapeHtml(app.name)}</a></h3>
      <div class="platform-list" aria-label="Plataformas">${platformList(app)}</div>
    </div>
    <p class="portfolio-description">${escapeHtml(app.lead)}</p>
    <div class="portfolio-action">${appLink(app)}</div>
  </article>`;
}

function homePage() {
  const description = "Oliveira Labs cria aplicativos musicais para tocar, praticar e criar. Conheça Mega Drum, Mega Bass, Mega Piano, Pads Worship, Percussão Virtual e BackJam.";
  const content = `
    <section class="hero section-dark">
      <div class="shell hero-grid">
        <div class="hero-copy">
          <p class="context-line"><span></span>Estúdio independente de aplicativos musicais</p>
          <h1>Instrumentos digitais para ideias que pedem som.</h1>
          <p class="hero-lead">Criamos experiências musicais diretas e acessíveis — do primeiro toque à prática diária, do ensaio à gravação.</p>
          <a class="button button-light" href="#portfolio">Explorar o portfólio</a>
        </div>
        <div class="score" data-score>
          <div class="score-head"><span>Portfólio / 06 aplicativos</span><span aria-live="polite" data-score-status>Selecione uma faixa</span></div>
          <div class="score-field">
            <span class="playhead" aria-hidden="true" data-playhead></span>
            ${apps.map(score).join("")}
          </div>
        </div>
      </div>
    </section>
    <section class="portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
      <div class="shell section-intro">
        <p class="section-index">01 / Portfólio</p>
        <div><h2 id="portfolio-title">Seis formas de fazer música caber no dia.</h2><p>Cada aplicativo resolve um momento diferente: tocar, aprender, acompanhar, experimentar ou registrar.</p></div>
      </div>
      <div class="shell portfolio-list">${apps.map(portfolioRow).join("")}</div>
    </section>
    <section class="studio-section">
      <div class="shell studio-grid">
        <p class="section-index">02 / Oliveira Labs</p>
        <div class="studio-statement"><h2>Pequeno por escolha.<br>Próximo de quem toca.</h2><p>A Oliveira Labs é um estúdio independente de Montes Claros, Minas Gerais. Desenvolvemos e mantemos cada produto com atenção à resposta do instrumento, à clareza da interface e ao uso real no celular.</p><a class="text-link" href="/sobre/"><span>Conheça o estúdio</span><span aria-hidden="true">↗</span></a></div>
        <div class="principles" aria-label="Princípios do estúdio"><div><span>01</span><strong>Resposta rápida</strong><p>Interações pensadas para acompanhar o gesto musical.</p></div><div><span>02</span><strong>Aprendizado aberto</strong><p>Ferramentas úteis tanto no primeiro contato quanto na rotina de prática.</p></div><div><span>03</span><strong>Evolução contínua</strong><p>Produtos vivos, construídos com retornos de quem usa.</p></div></div>
      </div>
    </section>
    <section class="support-band"><div class="shell"><p>Precisa de ajuda com algum aplicativo?</p><a class="button button-dark" href="/suporte/">Ir para o suporte</a></div></section>`;
  return page({
    title: "Oliveira Labs — Aplicativos musicais",
    description,
    pathname: "/",
    content,
    bodyClass: "home-page",
    structuredData: jsonLd({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Oliveira Labs",
      url: siteUrl,
      email: contactEmail,
      description,
    }),
  });
}

function appsPage() {
  const content = `
    <section class="page-hero"><div class="shell"><p class="context-line"><span></span>Portfólio completo</p><h1>Aplicativos feitos para tocar.</h1><p>Instrumentos virtuais, ferramentas de prática e ambientes sonoros desenvolvidos pela Oliveira Labs.</p></div></section>
    <section class="portfolio-section portfolio-standalone"><div class="shell portfolio-list">${apps.map(portfolioRow).join("")}</div></section>`;
  return page({
    title: "Aplicativos — Oliveira Labs",
    description: "Conheça todos os aplicativos da Oliveira Labs para música, prática e criação.",
    pathname: "/apps/",
    content,
    bodyClass: "portfolio-page",
  });
}

function storeButtons(app) {
  const buttons = [];
  if (app.stores.google) buttons.push(`<a class="store-button" href="${app.stores.google}"><span>Disponível no</span><strong>Google Play</strong></a>`);
  if (app.stores.apple) buttons.push(`<a class="store-button" href="${app.stores.apple}"><span>Disponível na</span><strong>App Store</strong></a>`);
  if (app.website) buttons.push(`<a class="store-button" href="${app.website}"><span>Visitar o site</span><strong>${new URL(app.website).hostname}</strong></a>`);
  if (!buttons.length) buttons.push(`<span class="status-button"><span>Status</span><strong>${escapeHtml(app.status)}</strong></span>`);
  return buttons.join("");
}

function appPage(app) {
  const description = `${app.lead} Conheça recursos, plataformas, suporte e links oficiais.`;
  const content = `
    <article class="product-page" style="--app-accent:${app.accent}">
      <section class="product-hero">
        <div class="shell">
          <nav class="breadcrumb" aria-label="Navegação estrutural"><a href="/apps/">Aplicativos</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(app.name)}</span></nav>
          <div class="product-hero-grid">
            <div class="product-icon-stage"><span class="product-index">${app.order}</span><img src="${app.icon}" width="360" height="360" alt="Ícone do ${escapeHtml(app.name)}" fetchpriority="high"></div>
            <div class="product-intro"><p class="context-line"><span></span>${escapeHtml(app.category)}</p><h1>${escapeHtml(app.name)}</h1><p class="product-lead">${escapeHtml(app.lead)}</p><div class="platform-list" aria-label="Plataformas">${platformList(app)}</div><div class="store-buttons">${storeButtons(app)}</div></div>
          </div>
        </div>
      </section>
      <section class="product-story"><div class="shell product-story-grid"><p class="section-index">Sobre o app</p><div><h2>${escapeHtml(app.description)}</h2></div></div></section>
      <section class="features-section"><div class="shell"><div class="features-heading"><p class="section-index">Recursos</p><h2>Feito para entrar no fluxo.</h2></div><ol class="feature-list">${app.features.map(([title, text], index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></li>`).join("")}</ol></div></section>
      <section class="product-links"><div class="shell"><div><p class="section-index">Informações</p><h2>Suporte e documentos</h2></div><div class="resource-links">${app.support ? `<a href="${app.support}"><span>Suporte do ${escapeHtml(app.name)}</span><span aria-hidden="true">↗</span></a>` : `<a href="/suporte/"><span>Falar com o suporte</span><span aria-hidden="true">↗</span></a>`}<a href="${app.privacy}"><span>Política de privacidade</span><span aria-hidden="true">↗</span></a>${app.website ? `<a href="${app.website}"><span>Site oficial</span><span aria-hidden="true">↗</span></a>` : ""}</div></div></section>
      <nav class="next-product" aria-label="Próximo aplicativo">${(() => { const next = apps[(apps.indexOf(app) + 1) % apps.length]; return `<a href="/apps/${next.slug}/"><span>Próximo aplicativo</span><strong>${escapeHtml(next.name)}</strong><span aria-hidden="true">↗</span></a>`; })()}</nav>
    </article>`;
  return page({
    title: `${app.name} — Oliveira Labs`,
    description,
    pathname: `/apps/${app.slug}/`,
    content,
    bodyClass: "app-page",
    structuredData: jsonLd({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: app.name,
      applicationCategory: "MusicApplication",
      operatingSystem: app.platforms.filter((platform) => !platform.startsWith("Em ")).join(", "),
      description: app.lead,
      url: `${siteUrl}/apps/${app.slug}/`,
      image: `${siteUrl}${app.icon}`,
      author: { "@type": "Organization", name: "Oliveira Labs", url: siteUrl },
    }),
  });
}

function aboutPage() {
  const content = `
    <section class="page-hero about-hero"><div class="shell"><p class="context-line"><span></span>Sobre o estúdio</p><h1>Tecnologia a serviço do gesto musical.</h1><p>A Oliveira Labs é a identidade de desenvolvimento de Antônio Oliveira e reúne um portfólio independente de aplicativos musicais.</p></div></section>
    <section class="about-body"><div class="shell about-grid"><p class="section-index">Nossa prática</p><div class="about-copy"><h2>Aplicativos que começam no instrumento, não na tendência.</h2><p>O trabalho combina desenvolvimento de software e interesse por música para transformar telas em superfícies úteis de toque, prática e criação.</p><p>Cada produto parte de uma necessidade concreta: experimentar um instrumento sem equipamento, manter a prática por perto, criar uma atmosfera ao vivo ou registrar uma ideia antes que ela desapareça.</p></div><aside><strong>Oliveira Labs</strong><span>Montes Claros — MG</span><span>Brasil</span><a href="mailto:${contactEmail}">${contactEmail}</a></aside></div></section>
    <section class="values-section"><div class="shell"><p class="section-index">O que orienta o trabalho</p><div class="values-grid"><div><span>01</span><h2>Resposta</h2><p>O som precisa acompanhar o toque e deixar a interação desaparecer.</p></div><div><span>02</span><h2>Clareza</h2><p>Recursos musicais complexos devem continuar compreensíveis na tela pequena.</p></div><div><span>03</span><h2>Continuidade</h2><p>Aplicativos são mantidos, refinados e ampliados depois do lançamento.</p></div></div></div></section>`;
  return page({
    title: "Sobre — Oliveira Labs",
    description: "Conheça a Oliveira Labs, estúdio independente de aplicativos musicais criado por Antônio Oliveira.",
    pathname: "/sobre/",
    content,
    bodyClass: "about-page",
  });
}

function supportPage() {
  const links = apps.map((app) => `<li><img src="${app.icon}" width="54" height="54" alt=""><div><strong>${escapeHtml(app.name)}</strong><span>${escapeHtml(app.category)}</span></div>${app.support ? `<a href="${app.support}">Abrir suporte<span class="sr-only"> do ${escapeHtml(app.name)}</span></a>` : `<a href="mailto:${contactEmail}?subject=Suporte%20${encodeURIComponent(app.name)}">Enviar e-mail<span class="sr-only"> sobre ${escapeHtml(app.name)}</span></a>`}</li>`).join("");
  const content = `
    <section class="page-hero support-hero"><div class="shell"><p class="context-line"><span></span>Central de suporte</p><h1>Vamos resolver isso.</h1><p>Escolha um aplicativo para consultar sua página específica ou envie uma mensagem com os detalhes do problema.</p><a class="button button-dark" href="mailto:${contactEmail}">Enviar e-mail</a></div></section>
    <section class="support-list-section"><div class="shell"><div class="support-list-heading"><p class="section-index">Por aplicativo</p><p>Ao entrar em contato, inclua o modelo do aparelho, a versão do sistema e a versão do aplicativo.</p></div><ul class="support-list">${links}</ul></div></section>
    <section class="contact-strip"><div class="shell"><span>E-mail de suporte</span><a href="mailto:${contactEmail}">${contactEmail}</a></div></section>`;
  return page({
    title: "Suporte — Oliveira Labs",
    description: "Encontre suporte para os aplicativos da Oliveira Labs ou entre em contato diretamente.",
    pathname: "/suporte/",
    content,
    bodyClass: "support-page",
  });
}

function notFoundPage() {
  const content = `<section class="not-found"><div class="shell"><span>404</span><p class="context-line"><span></span>Página não encontrada</p><h1>Essa faixa saiu da sequência.</h1><p>O endereço pode ter mudado ou não existir.</p><a class="button button-dark" href="/">Voltar ao início</a></div></section>`;
  return page({
    title: "Página não encontrada — Oliveira Labs",
    description: "A página solicitada não foi encontrada.",
    pathname: "/404.html",
    content,
    bodyClass: "not-found-page",
  });
}

async function writeRoute(route, html) {
  const directory = route === "/" ? output : path.join(output, route.replace(/^\//, ""));
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

  await writeRoute("/", homePage());
  await writeRoute("/apps/", appsPage());
  await writeRoute("/sobre/", aboutPage());
  await writeRoute("/suporte/", supportPage());
  // Compatibility route referenced by the byte-protected Mega Drum privacy page.
  await writeRoute("/help/", supportPage());
  for (const app of apps) await writeRoute(`/apps/${app.slug}/`, appPage(app));
  await writeFile(path.join(output, "404.html"), notFoundPage());

  const routes = ["/", "/apps/", "/sobre/", "/suporte/", ...apps.map((app) => `/apps/${app.slug}/`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`).join("\n")}\n</urlset>\n`;
  await writeFile(path.join(output, "sitemap.xml"), sitemap);
  await writeFile(path.join(output, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  await writeFile(path.join(output, "manifest.webmanifest"), JSON.stringify({ name: "Oliveira Labs", short_name: "Oliveira Labs", start_url: "/", display: "standalone", background_color: "#F4F7F8", theme_color: "#17213A", icons: [{ src: "/site-assets/favicon.svg", sizes: "any", type: "image/svg+xml" }] }, null, 2));
  console.log(`Oliveira Labs built: ${routes.length} indexed pages, one compatibility route and ${apps.length} app profiles.`);
}

await build();
