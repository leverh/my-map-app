import React from 'react';
import styles from './Footer.module.css';

function Footer({ className = '', style = {} }) {
  return (
    <footer className={`${styles.footer} ${className}`} style={style}>
      <p className={styles.footerText}>© ERoR cODes {new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;
