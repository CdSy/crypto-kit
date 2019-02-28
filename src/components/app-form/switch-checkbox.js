import React, { Component } from 'react';

const AppSwitchCheckbox = (props) => {
  const { id, name, label, value, onChange } = props;

  return (
    <div className="app-switch-button">
      {label &&
        <span className="label">{ label }</span>
      }
      <label className="switch" htmlFor={`checkbox-${id}`}>
        <input
          checked={value}
          type="checkbox"
          id={`checkbox-${id}`}
          data-id={id}
          name={name}
          onChange={onChange}
        />
        <div className="slider round"></div>
      </label>
    </div>
  );
};

export default AppSwitchCheckbox;
