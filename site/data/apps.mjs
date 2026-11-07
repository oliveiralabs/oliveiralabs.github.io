export const apps = [
  {
    slug: "mega-drum",
    order: "01",
    name: "Mega Drum",
    category: "Bateria virtual",
    icon: "/assets/img/new-mega-drum.png",
    accent: "#E4553F",
    lead: "Uma bateria completa no celular, feita para tocar, praticar e criar batidas.",
    description:
      "Mega Drum transforma a tela em um instrumento responsivo. O aplicativo reúne kits de bateria, editor de kits, aulas, gravação e recursos para tocar junto com músicas.",
    platforms: ["Android", "iPhone", "iPad", "Web"],
    features: [
      ["Toque responsivo", "Peças simultâneas e resposta rápida para acompanhar grooves e exercícios."],
      ["Kits e personalização", "Uma coleção de baterias, temas e um editor para montar o próprio kit."],
      ["Prática e criação", "Aulas, gravação e acompanhamento para desenvolver ideias e técnica."],
    ],
    stores: {
      google: "https://play.google.com/store/apps/details?id=com.oliveiralabs.megadrum",
      apple: "https://apps.apple.com/app/mega-drum-drum-simulator/id6789980388",
    },
    website: "https://megadrum.app",
    support: "/megadrum-support.html",
    privacy: "/privacy-policy-megadrum.html",
  },
  {
    slug: "mega-bass",
    order: "02",
    name: "Mega Bass",
    category: "Contrabaixo virtual",
    icon: "/assets/img/app-mega-bass-play.png",
    accent: "#338AC3",
    lead: "Contrabaixo de quatro cordas para tocar, estudar, gravar e praticar com loops.",
    description:
      "Mega Bass leva um braço de 22 casas para o celular ou tablet, com multitouch, glissando, sustain, diferentes timbres, metrônomo, loops e lições interativas.",
    platforms: ["Android", "iPhone", "iPad"],
    features: [
      ["Quatro cordas, 22 casas", "Multitouch, glissando, sustain e controles pensados para uma execução expressiva."],
      ["Loops e metrônomo", "Acompanhamentos em estilos diferentes para estudar tempo, repertório e groove."],
      ["Lições e gravação", "Exercícios guiados e registro das performances para acompanhar a evolução."],
    ],
    stores: {
      google: "https://play.google.com/store/apps/details?id=com.oliveiralabs.megabass",
      apple: "https://apps.apple.com/app/mega-bass-guitar-lessons/id6813614711",
    },
    support: "/megabass-support.html",
    privacy: "/privacy-policy-megabass.html",
  },
  {
    slug: "mega-piano",
    order: "03",
    name: "Mega Piano",
    category: "Piano e teclado",
    icon: "/assets/img/app-mega-piano-play.png",
    accent: "#21A9B8",
    lead: "Teclado de 88 teclas com instrumentos, aulas, acompanhamentos e gravação.",
    description:
      "Mega Piano foi criado para tocar, praticar e registrar ideias. O teclado rolável aceita acordes e glissando e reúne sons adicionais, metrônomo, faixas de acompanhamento e suporte a MIDI compatível.",
    platforms: ["Android", "iPhone", "iPad"],
    features: [
      ["Teclado completo", "88 teclas roláveis, acordes multitouch, sustain, oitava e controles de expressão."],
      ["Sons e acompanhamento", "Pianos e outros instrumentos, faixas de apoio e metrônomo integrado."],
      ["Aprendizado e registro", "Lições com feedback, gravações locais e compartilhamento escolhido pelo usuário."],
    ],
    stores: {
      google: "https://play.google.com/store/apps/details?id=com.oliveiralabs.megapiano",
      apple: "https://apps.apple.com/app/mega-piano-piano-keyboard/id6813156279",
    },
    support: "/megapiano-support.html",
    privacy: "/privacy-policy-megapiano.html",
  },
  {
    slug: "pads-worship",
    order: "04",
    name: "Pads Worship",
    category: "Pads ambientes",
    icon: "/assets/img/app-pads-worship-play.png",
    accent: "#376FE8",
    lead: "Pads contínuos para adoração, apresentações, meditação e ambientes sonoros.",
    description:
      "Pads Worship cria camadas ambientes contínuas com transições suaves. Foi pensado para uso rápido ao vivo, em equipes de adoração, performances solo ou momentos de reflexão.",
    platforms: ["Android", "iPhone", "iPad"],
    features: [
      ["Pads contínuos", "Sons ambientes que sustentam a atmosfera sem interromper a execução."],
      ["Transições suaves", "Trocas com fade para preservar a continuidade em apresentações ao vivo."],
      ["Uso direto", "Kits, sequências e controles organizados para acesso rápido durante a música."],
    ],
    stores: {
      google: "https://play.google.com/store/apps/details?id=com.oliveiralabs.padsworship",
      apple: "https://apps.apple.com/app/pads-worship/id6763444385",
    },
    support: "/pads-worship-support.html",
    privacy: "/padsworship-privacy-policy.html",
  },
  {
    slug: "percussao-virtual",
    order: "05",
    name: "Percussão Virtual",
    category: "Instrumentos de percussão",
    icon: "/assets/img/app-percussion-play.png",
    accent: "#C95343",
    lead: "Um conjunto de instrumentos de percussão para praticar ritmos e criar kits.",
    description:
      "Percussão Virtual reúne instrumentos e kits para estudo e diversão, com resposta multitouch, gravação e ferramentas para montar combinações de sons no celular.",
    platforms: ["Android"],
    features: [
      ["Vários instrumentos", "Percussões como congas, pandeiro, cuíca, afoxé, güiro e outros sons."],
      ["Kits pessoais", "Combinações de instrumentos para adaptar a superfície ao ritmo ou ensaio."],
      ["Gravação e comunidade", "Recursos para registrar ideias e explorar conteúdos criados no aplicativo."],
    ],
    stores: {
      google: "https://play.google.com/store/apps/details?id=com.oliveiralabs.percussao",
    },
    privacy: "/privacy-policy-percussion.html",
  },
  {
    slug: "backjam",
    order: "06",
    name: "BackJam",
    category: "Backing tracks",
    icon: "/assets/img/backjam.png",
    accent: "#F0A500",
    lead: "Acompanhamentos para guitarristas e baixistas praticarem progressões e estilos.",
    description:
      "BackJam é um aplicativo de backing tracks para guitarra e baixo. Ele organiza estilos, progressões salvas e conteúdos baixados para apoiar sessões de estudo e improvisação.",
    platforms: ["Android", "Em preparação"],
    features: [
      ["Estilos para praticar", "Bases organizadas para estudar repertório, improvisação e linguagem musical."],
      ["Progressões salvas", "Estruturas harmônicas e preferências ficam disponíveis no próprio aparelho."],
      ["Conteúdo sob demanda", "Estilos adicionais podem ser baixados conforme a sessão de prática."],
    ],
    stores: {},
    status: "Em preparação",
    privacy: "/privacy-policy-backjam.html",
  },
];

export const publishedApps = apps.filter((app) => Object.keys(app.stores).length > 0);
