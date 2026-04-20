import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.heroContainer}>
      <nav className={`${styles.navbar} glass`}>
        <div className={styles.logo}>ClipFlow</div>
        <div className={styles.ctaGroup}>
          <button className={styles.buttonSecondary}>Dashboard</button>
          <button className={styles.buttonPrimary}>Join Waitlist</button>
        </div>
      </nav>

      <div className={`${styles.heroContent} animate-fade-in`}>
        <span className={styles.badge}>Status: In Beta</span>
        <h1 className={styles.title}>
          Your Channel's <br />
          Security Layer.
        </h1>
        <p className={styles.subtitle}>
          Editors upload video files here. You approve them. We push to YouTube via API. 
          No passwords shared. No 2GB downloads.
        </p>

        <div className={styles.ctaGroup}>
          <button className={styles.buttonPrimary}>Start Interactive Demo</button>
          <button className={styles.buttonSecondary}>View Pricing</button>
        </div>

        <div className={styles.workflow}>
          <div className={styles.step}>
            <div className={`${styles.icon} glass`}>🎬</div>
            <span>Preview</span>
          </div>
          <div className={styles.arrow} />
          <div className={styles.step}>
            <div className={`${styles.icon} glass`} style={{borderColor: 'var(--primary)'}}>🛡️</div>
            <span>Approve</span>
          </div>
          <div className={styles.arrow} />
          <div className={styles.step}>
            <div className={`${styles.icon} glass`}>📺</div>
            <span>Publish</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
