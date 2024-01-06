import React, { useState } from 'react';
import { signUp } from '../services/authService';
import styles from './SignUp.module.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      // Redirect or show success message
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.email}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.password}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
