import React, { useEffect, useRef, useState } from 'react';
import { PopoverProps } from './types';
import './styles.css'

const Popover = ({ children, content, direction = 'bottom' }: PopoverProps) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleClick = () => setShow(!show);

  return (
    <div ref={ref} onClick={handleClick}>
      {children}

      {show && (
        <div className={`popover-append ${direction === 'top' ? 'popover-top' : 'popover-bottom'}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;
