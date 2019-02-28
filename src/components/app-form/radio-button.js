import React from 'react';

const AppRadioButton = (props) => {
  const { name, value, onChange, currentValue, children, color = 'default'} = props;

  return (
    <div className={`app-radio-button ${currentValue === value ? 'active' : ''} ${color}`}>
      <label className="label">
        <input
          type="radio"
          value={value}
          name={name}
          checked={currentValue === value}
          onChange={onChange}
        />
        { children }
      </label>
    </div>
  );
};

export default AppRadioButton;
