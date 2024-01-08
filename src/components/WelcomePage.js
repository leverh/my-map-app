import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
  return (
    <div className={styles.WelcomePage}>
    <div className={styles.FormContainer}>
      <h1 className={styles.header}>Welcome to the map-app of your life!</h1>
      <Link  to="/signin"><button className={styles.button}>Sign In</button></Link>
      <Link to="/signup"><button className={styles.button}>Sign Up</button></Link>
    </div>
    </div>
  );
};

export default WelcomePage;