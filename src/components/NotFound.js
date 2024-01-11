import React from 'react';
import styles from './NotFound.module.css';
import Footer from './Footer';

const NotFound = () => {
  return (
    <div className={styles.page}>
        <div className={styles.container}>
      <h2 className={styles.header}>404 Not Found</h2>
      <p className={styles.paragraph}>The page you are looking for does not exist.</p>
      </div>
      <Footer className={styles.customFooterStyle} />
    </div>
  );
};

export default NotFound;
