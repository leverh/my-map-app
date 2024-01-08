import React, { useState } from 'react';
import { logIn } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import styles from './SignIn.module.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate('/map'); // Redirect to MapComponent
    } catch (error) {
      setError(error.message);
    }
  };
 
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
      <h2 className={styles.header}>Sign In</h2>
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
        <button className={styles.button} type="submit">Sign In</button>
      </form>
      </div>
    </div>
  );
};

export default SignIn;
