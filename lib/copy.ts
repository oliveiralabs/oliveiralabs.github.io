import type { Locale } from "./types";

const copy = {
  en: {
    nav: { kits: "Kits", help: "Help", download: "Get the app", downloadNow: "Download now" },
    play: {
      moreEyebrow: "Keep exploring",
      playOnline: "Play online",
      playingNow: "Playing now",
    },
    drum: {
      title: "Your browser is the drum kit.",
      stageLabel: "Interactive Mega Drum kit",
      rotateHint: "Rotate your phone for a larger playing surface.",
      appCta: "Get the complete experience in the app",
      advertisement: "Advertisement",
      pieces: {
        kick_l: "Left kick drum",
        kick_r: "Right kick drum",
        snare: "Snare drum",
        close_hh: "Closed hi-hat",
        open_hh: "Open hi-hat",
        tom_1: "High tom",
        tom_2: "Mid tom",
        tom_3: "Low tom",
        floor: "Floor tom",
        crash_l: "Left crash cymbal",
        crash_r: "Right crash cymbal",
        ride: "Ride cymbal",
        splash: "Splash cymbal",
      },
    },
    stats: { kits: "kits" },
    catalog: { eyebrow: "Mega Drum catalog", title: "Explore all drum kits", body: "Find the sound and setup that match your style, then keep playing in the Mega Drum app.", filter: "Filter kits", noResults: "No kits match this search.", all: "All", standard: "Unlockable", premium: "Premium" },
    kit: { breadcrumbHome: "Home", breadcrumbKits: "Kits", available: "Available in Mega Drum", catalog: "Catalog", official: "Official Mega Drum kit", access: "Access", use: "Get Mega Drum to use this kit", note: "Download Mega Drum and find this kit by name in the catalog.", more: "More kits to explore" },
    stores: { google: "Get it on Google Play", apple: "Download on the App Store" },
    footer: { line: "Play, practice, and create with a drum kit in your pocket.", legal: "Legal", discover: "Discover", privacy: "Privacy", privacyPreferences: "Privacy preferences", terms: "Terms", copyright: "Copyright", rights: "© 2026 Oliveira Labs. All rights reserved." },
  },
  pt: {
    nav: { kits: "Kits", help: "Ajuda", download: "Baixar o app", downloadNow: "Baixe agora" },
    play: {
      moreEyebrow: "Continue explorando",
      playOnline: "Tocar online",
      playingNow: "Tocando agora",
    },
    drum: {
      title: "Seu navegador virou uma bateria.",
      stageLabel: "Kit interativo do Mega Drum",
      rotateHint: "Gire o celular para ampliar a área de toque.",
      appCta: "Tenha a experiência completa no app",
      advertisement: "Publicidade",
      pieces: {
        kick_l: "Bumbo esquerdo",
        kick_r: "Bumbo direito",
        snare: "Caixa",
        close_hh: "Chimbal fechado",
        open_hh: "Chimbal aberto",
        tom_1: "Tom agudo",
        tom_2: "Tom médio",
        tom_3: "Tom grave",
        floor: "Surdo",
        crash_l: "Prato crash esquerdo",
        crash_r: "Prato crash direito",
        ride: "Prato de condução",
        splash: "Prato splash",
      },
    },
    stats: { kits: "kits" },
    catalog: { eyebrow: "Catálogo Mega Drum", title: "Explore todos os kits", body: "Encontre o som e a configuração que combinam com seu estilo e continue tocando no aplicativo Mega Drum.", filter: "Filtrar kits", noResults: "Nenhum kit corresponde a esta busca.", all: "Todos", standard: "Desbloqueáveis", premium: "Premium" },
    kit: { breadcrumbHome: "Início", breadcrumbKits: "Kits", available: "Disponível no Mega Drum", catalog: "Catálogo", official: "Kit oficial do Mega Drum", access: "Acesso", use: "Baixe o Mega Drum para usar este kit", note: "Baixe o Mega Drum e encontre este kit pelo nome no catálogo.", more: "Mais kits para explorar" },
    stores: { google: "Baixar no Google Play", apple: "Baixar na App Store" },
    footer: { line: "Toque, pratique e crie com uma bateria no seu bolso.", legal: "Legal", discover: "Descobrir", privacy: "Privacidade", privacyPreferences: "Preferências de privacidade", terms: "Termos", copyright: "Direitos autorais", rights: "© 2026 Oliveira Labs. Todos os direitos reservados." },
  },
} as const;

export function getCopy(locale: Locale) {
  return copy[locale];
}
