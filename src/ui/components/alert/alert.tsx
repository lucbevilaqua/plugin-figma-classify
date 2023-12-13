import React, { useState, useEffect } from 'react';
import { AlertProps } from './types';

import './styles.css'

const Alert = ({ show, changeDisplay, message }: AlertProps) => {

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      show = false
      changeDisplay(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [show]);

  if (!show) return <></>;

  return (
    <div className="alert">
      {message}
    </div>
  );
};

export default Alert;
