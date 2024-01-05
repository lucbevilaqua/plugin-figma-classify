import React, { useEffect, useRef, useState } from 'react';
import { HelpBubbleProps } from './types';
import './styles.css'

const HelpBubble = ({ children }: HelpBubbleProps) => {
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
    <div ref={ref}>
      <button className='help-bubble-container' onClick={handleClick}>
        ?
      </button>
      {show && (
        <div className='help-bubble-append'>
          {children}
        </div>
      )}
    </div>
  );
};

export default HelpBubble;
