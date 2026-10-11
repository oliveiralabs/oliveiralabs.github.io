import type { Locale } from "./types";

const copy = {
  en: {
    nav: { home: "Home", kits: "Kits", help: "Help", download: "Get the app" },
    language: "Português",
    languageCode: "PT",
    hero: {
      eyebrow: "147 kits. One app. Your next beat.",
      title: "Find your next drum kit.",
      body: "Explore every kit available in Mega Drum, discover a new setup, and take it straight to the app.",
      search: "Search kits by name",
      submit: "Search",
    },
    stats: { kits: "kits", free: "free kits", premium: "premium kits" },
    featured: { eyebrow: "Start here", title: "Selected kits", all: "Browse all kits" },
    browse: {
      eyebrow: "The public catalog",
      title: "A kit for every session.",
      body: "Every page is a direct doorway into Mega Drum. Browse now, then use the kit in the mobile app.",
    },
    app: {
      eyebrow: "Built to be played",
      title: "The full drum experience lives in the app.",
      body: "Choose a kit, play with responsive multi-touch drums, record your ideas, and keep practicing wherever you are.",
    },
    catalog: { eyebrow: "Mega Drum catalog", title: "Explore all drum kits", body: "Search the complete public collection. Kit pages are static, fast, and easy to share.", filter: "Filter kits", noResults: "No kits match this search.", all: "All", free: "Free", premium: "Premium" },
    kit: { breadcrumbHome: "Home", breadcrumbKits: "Kits", available: "Available in Mega Drum", free: "Free kit", premium: "Premium kit", id: "Kit ID", access: "Access", use: "Get Mega Drum to use this kit", note: "Direct opening will be enabled after the next compatible app release.", more: "More kits to explore" },
    stores: { google: "Get it on Google Play", apple: "Download on the App Store" },
    footer: { line: "Play, practice, and create with a drum kit in your pocket.", legal: "Legal", discover: "Discover", privacy: "Privacy", terms: "Terms", copyright: "Copyright", rights: "© 2026 Oliveira Labs. All rights reserved." },
  },
  pt: {
    nav: { home: "Início", kits: "Kits", help: "Ajuda", download: "Baixar o app" },
    language: "English",
    languageCode: "EN",
    hero: {
      eyebrow: "147 kits. Um app. Sua próxima batida.",
      title: "Encontre seu próximo kit de bateria.",
      body: "Explore todos os kits disponíveis no Mega Drum, descubra uma nova configuração e leve-a direto para o app.",
      search: "Buscar kits por nome",
      submit: "Buscar",
    },
    stats: { kits: "kits", free: "kits gratuitos", premium: "kits premium" },
    featured: { eyebrow: "Comece por aqui", title: "Kits selecionados", all: "Ver todos os kits" },
    browse: {
      eyebrow: "O catálogo público",
      title: "Um kit para cada sessão.",
      body: "Cada página é uma porta de entrada para o Mega Drum. Explore no site e use o kit no aplicativo.",
    },
    app: {
      eyebrow: "Feito para tocar",
      title: "A experiência completa de bateria está no app.",
      body: "Escolha um kit, toque com bateria multitoque responsiva, grave suas ideias e pratique onde estiver.",
    },
    catalog: { eyebrow: "Catálogo Mega Drum", title: "Explore todos os kits", body: "Pesquise a coleção pública completa. As páginas dos kits são estáticas, rápidas e fáceis de compartilhar.", filter: "Filtrar kits", noResults: "Nenhum kit corresponde a esta busca.", all: "Todos", free: "Grátis", premium: "Premium" },
    kit: { breadcrumbHome: "Início", breadcrumbKits: "Kits", available: "Disponível no Mega Drum", free: "Kit gratuito", premium: "Kit premium", id: "ID do kit", access: "Acesso", use: "Baixe o Mega Drum para usar este kit", note: "A abertura direta será ativada após uma versão compatível do aplicativo.", more: "Mais kits para explorar" },
    stores: { google: "Baixar no Google Play", apple: "Baixar na App Store" },
    footer: { line: "Toque, pratique e crie com uma bateria no seu bolso.", legal: "Legal", discover: "Descobrir", privacy: "Privacidade", terms: "Termos", copyright: "Direitos autorais", rights: "© 2026 Oliveira Labs. Todos os direitos reservados." },
  },
} as const;

export function getCopy(locale: Locale) {
  return copy[locale];
}
