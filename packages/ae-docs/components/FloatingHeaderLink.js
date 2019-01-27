import React, { useState, useEffect, useContext } from 'react';

import Link from './Link';
import { RouterContext } from './Router';

// Workaround for the header link issue with markdown remark
const FloatingHeaderLink = () => {
  const { page } = useContext(RouterContext) || {};
  const [target, setTarget] = useState(null);
  const [position, setPosition] = useState({ x: -100, y: -100 });

  const onMouseMove = e => {
    if(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(`${e.target.tagName}`.toLowerCase()) >= 0) {
      if(e.target.id && e.target.id !== target) {
        setTarget(e.target.id);
        
        const fontSize = parseFloat(getComputedStyle(e.target).getPropertyValue('font-size'));

        setPosition({
          y: e.target.offsetTop - (50 - fontSize) * 0.5,
          x: e.target.offsetLeft - 30,
        });
        return;
      }
    }

    e.target.id !== 'floating-heading-link' && setTarget(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return target ? (
    <Link
      to={`${page}.${target}`}
      id="floating-heading-link"
      style={{
        position: 'absolute',
        zIndex: 1,
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: '1em',
        padding: '1em .5em',
        textDecoration: 'none',
      }}
    >
      {'🔗'}
    </Link>
  ): '';
};

export default FloatingHeaderLink;
