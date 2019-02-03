import React, { useState, useEffect, useContext } from 'react';

import Link from './Link';
import { RouterContext } from './Router';

const FLOATING_HOOK_ID = 'floating-heading-link';

type Position = { x: number, y: number };

const useFloatingLink = () => {
  const [target, setTarget] = useState<string>('');
  const [position, setPosition] = useState<Position>({ x: -100, y: -100 });

  const onMouseMove = (e: Event & { target: HTMLElement }) => {
    if(!e.target) return;

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

    e.target.id !== FLOATING_HOOK_ID && setTarget('');
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return {
    target,
    linkProps: {
      id: FLOATING_HOOK_ID,
      style: {
        position: 'absolute',
        zIndex: 1,
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: '1em',
        padding: '1em .5em',
        textDecoration: 'none',
      },
    },
  };
};

// Workaround for the header link issue with markdown remark
const FloatingHeaderLink = () => {
  const { page } = useContext(RouterContext);
  const { target, linkProps } = useFloatingLink();

  return target ? (
    <Link {...linkProps} to={`${page}.${target}`}>
      {'🔗'}
    </Link>
  ): '';
};

export default FloatingHeaderLink;
