// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  dev: [
    'intro',
    'getting-started',
    'system-overview',
    {
      type: 'category',
      label: 'Projects',
      link: { type: 'doc', id: 'projects/overview' },
      items: [
        'projects/backend',
        'projects/merchant-portal',
        'projects/mobile-app',
        'projects/admin-portal',
        'projects/knowledge-base',
        'projects/docs-sites',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/tenancy',
        'architecture/auth',
        'architecture/api-conventions',
        'architecture/data-model',
        'architecture/runtime-sdui',
        'architecture/publishing-pipeline',
      ],
    },
    {
      type: 'category',
      label: 'Structures',
      items: [
        'structures/backend-structure',
        'structures/merchant-structure',
        'structures/mobile-structure',
        'structures/admin-structure',
      ],
    },
    {
      type: 'category',
      label: 'Libraries',
      link: { type: 'doc', id: 'libraries/overview' },
      items: [
        'libraries/backend-libs',
        'libraries/frontend-libs',
        'libraries/mobile-libs',
        'libraries/shared-patterns',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      link: { type: 'doc', id: 'integrations/overview' },
      items: [
        'integrations/database',
        'integrations/redis-queue',
        'integrations/storage',
        'integrations/auth-providers',
        'integrations/payments-notifications',
        'integrations/hosting',
      ],
    },
    {
      type: 'category',
      label: 'Workflows',
      items: [
        'workflows/local-dev',
        'workflows/env-config',
        'workflows/testing',
        'workflows/deployment',
        'workflows/troubleshooting',
      ],
    },
    'glossary',
  ],
};

module.exports = sidebars;
