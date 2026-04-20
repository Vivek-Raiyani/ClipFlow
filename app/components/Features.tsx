import React from 'react';
import styles from './Features.module.css';

const features = [
  {
    title: "Zero Egress Fees",
    description: "Built on Cloudflare R2. Move massive 4K files to YouTube without paying a cent in bandwidth egress fees.",
    icon: "💰"
  },
  {
    title: "Decoupled Access",
    description: "Editors upload to your firewall. You approve from yours. No more sharing Google passwords with contractors.",
    icon: "🛡️"
  },
  {
    title: "Mobile Approval",
    description: "Get a notification when a video is ready. Preview and hit 'Publish' from your phone, anywhere in the world.",
    icon: "📱"
  }
];

const Features = () => {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Engineered for Scale</h2>
          <p style={{ opacity: 0.6 }}>The technical stack that powers the next generation of content production.</p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={`${styles.card} glass`}>
              <div className={styles.iconContainer}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardText}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
