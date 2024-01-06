import React from 'react';

const IconSelector = ({ onIconSelected }) => {
  const icons = ['default', 'food', 'cinema', 'education', 'cafe', 'health', 'hotel', 'museum', 'park', 'religion', 'shopping', 'sport', 'transport'];

  return (
    <select onChange={(e) => onIconSelected(e.target.value)}>
      {icons.map((icon) => (
        <option key={icon} value={icon}>{icon}</option>
      ))}
    </select>
  );
};

export default IconSelector;
