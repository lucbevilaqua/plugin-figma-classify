import React from 'react';
import { ModalProps } from './types';
import './styles.css'

const Modal = ({ children, title, show, onClosed }: ModalProps) => {

  if (!show) return null;

  return (
    <div className='modal-container'>
      <div className='header-title'>
        {title}
        <button className='close-button' onClick={onClosed}>
          X
        </button>
      </div>

      <div className='content'>
        {children}
      </div>
    </div>
  );
};

export default Modal;
