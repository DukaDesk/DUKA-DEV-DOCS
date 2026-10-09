// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DukaDesk Developer Core Docs',
  tagline: 'How the whole DukaDesk system fits together — projects, structures, libraries, integrations',
  favicon: 'img/logo.svg',

  url: 'https://dev-docs.dukadesk.com',
  baseUrl: '/',
  organizationName: 'dukadesk',
  projectName: 'duka-dev-docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: 'DukaDesk Dev Core',
        logo: {
          alt: 'DukaDesk logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'dev',
            position: 'left',
            label: 'Core Docs',
          },
          {
            to: '/system-overview',
            label: 'System Map',
            position: 'left',
          },
          {
            to: '/projects/overview',
            label: 'Projects',
            position: 'left',
          },
          {
            to: '/integrations/overview',
            label: 'Integrations',
            position: 'left',
          },
          {
            href: 'https://github.com/DukaDesk',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Core',
            items: [
              { label: 'Intro for Developers', to: '/intro' },
              { label: 'System Overview', to: '/system-overview' },
              { label: 'Getting Started', to: '/getting-started' },
            ],
          },
          {
            title: 'Projects',
            items: [
              { label: 'Backend (NestJS)', to: '/projects/backend' },
              { label: 'Merchant Portal', to: '/projects/merchant-portal' },
              { label: 'Mobile App (Expo)', to: '/projects/mobile-app' },
              { label: 'Admin Portal', to: '/projects/admin-portal' },
            ],
          },
          {
            title: 'Deep Dives',
            items: [
              { label: 'Libraries', to: '/libraries/overview' },
              { label: 'Integrations', to: '/integrations/overview' },
              { label: 'Workflows', to: '/workflows/local-dev' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} DukaDesk. Internal developer documentation.`,
      },
      prism: {
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
    }),
};

module.exports = config;
