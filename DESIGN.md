# Oliveira Labs — direção de design

## Objetivo

Apresentar a Oliveira Labs como um estúdio independente de aplicativos musicais. A página inicial deve permitir reconhecer o portfólio inteiro rapidamente; cada página de produto deve explicar o uso do aplicativo e levar à loja, suporte e política corretos.

## Sistema visual

- **Noite** `#17213A`: marca, títulos e superfícies de contraste.
- **Porcelana** `#F4F7F8`: fundo principal frio e luminoso.
- **Névoa** `#DDE5E8`: linhas, divisões e superfícies secundárias.
- **Azul de sinal** `#3457D5`: links, foco e ações.
- **Amarelo de pulso** `#F5C84B`: playhead e pequenos pontos de atenção.
- **Grafite** `#202733`: texto corrente.

Tipografia: Bricolage Grotesque para títulos e marca; IBM Plex Sans para leitura e interface. Ambas são servidas pelo próprio site. Números e metadados usam IBM Plex Mono do sistema como fallback funcional.

## Estrutura

```text
[marca]                              [Aplicativos] [Sobre] [Suporte]
------------------------------------------------------------------
Oliveira Labs constrói               pauta interativa do portfólio
instrumentos digitais.               ┃ ícone  Mega Drum
                                     ┃ ícone  Mega Bass
                                     ┃ ...
------------------------------------------------------------------
Portfólio completo
01  [ícone]  Mega Drum       resumo, plataformas, abrir produto
02  [ícone]  Mega Bass       resumo, plataformas, abrir produto
...
------------------------------------------------------------------
Como trabalhamos                     contato e suporte
------------------------------------------------------------------
[rodapé institucional e documentos]
```

As páginas de aplicativo reutilizam a mesma linguagem: ícone e proposta em destaque, links de loja imediatamente visíveis, recursos em linhas numeradas e links específicos de suporte/privacidade.

## Princípios

1. **Produto antes de decoração:** imagens reais dos aplicativos, sem ilustrações genéricas ou depoimentos inventados.
2. **Uma assinatura memorável:** a pauta com playhead conecta os aplicativos; o restante é contido.
3. **Sem kit de cards:** o portfólio é uma lista editorial contínua, com hierarquia e ritmo próprios.
4. **Clareza institucional:** textos objetivos, status explícito e caminhos diretos para lojas e suporte.
5. **Acessível e leve:** navegação por teclado, foco visível, contraste alto, movimento opcional e HTML estático.

