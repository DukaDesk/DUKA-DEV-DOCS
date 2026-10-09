import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function Card({ title, body, to }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: 20,
        borderRadius: 14,
        border: '1px solid var(--ifm-color-emphasis-200)',
        background: 'var(--ifm-background-surface-color)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>{body}</div>
    </Link>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className="hero hero--duka" style={{ padding: '64px 0' }}>
        <div className="container">
          <p style={{ opacity: 0.7, letterSpacing: 2, fontSize: 12, fontWeight: 700 }}>
            STRICTLY FOR DEVELOPERS
          </p>
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <Link className="button button--warning button--lg" to="/intro">
              Start with the core
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/system-overview"
            >
              See system map
            </Link>
            <Link
              className="button button--outline button--lg"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
              to="/projects/backend"
            >
              Backend deep dive
            </Link>
          </div>
        </div>
      </header>
      <main className="container" style={{ padding: '32px 16px 64px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          <Card
            title="1 · System overview"
            body="Monorepo map, request flows, tenancy model, and where each project lives."
            to="/system-overview"
          />
          <Card
            title="2 · Projects"
            body="Backend, Merchant portal, Mobile app, Admin portal — stack, structure, entry points."
            to="/projects/overview"
          />
          <Card
            title="3 · Structures & libraries"
            body="Folder-by-folder anatomy plus every key dependency and what it actually does."
            to="/structures/backend-structure"
          />
          <Card
            title="4 · Integrations"
            body="Postgres, Redis/Bull, S3, Auth, Payments, Hosting — config, env vars, failure modes."
            to="/integrations/overview"
          />
        </div>
      </main>
    </Layout>
  );
}
