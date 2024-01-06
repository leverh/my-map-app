import React from 'react';
import styles from './IconSelector.module.css';

const IconSelector = ({ onIconSelected }) => {
  const icons = ['default', 'food', 'cinema', 'education', 'cafe', 'health', 'hotel', 'museum', 'park', 'religion', 'shopping', 'sport', 'transport'];

  return (
    <select className={styles.iconSelector} onChange={(e) => onIconSelected(e.target.value)}>
      {icons.map((icon) => (
        <option className={styles.icon} key={icon} value={icon}>{icon}</option>
      ))}
    </select>
  );
};

export default IconSelector;
