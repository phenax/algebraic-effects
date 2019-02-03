import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';

import { Routes } from '../types/routes';

const getHash = () => `${window.location.hash}`.slice(1).split('.');
const scrollTo = (x: number, y: number) => document.scrollingElement && document.scrollingElement.scrollTo(x, y);

export const RouterContext = React.createContext({ page: '' });


interface RouterProps { routes: Routes };
const Router = ({ routes, ...props }: RouterProps & any) => {
  const { page } = useContext(RouterContext);
  const currentPage = routes[page] || routes.home;

  useEffect(() => {
    // Set current title
    document.title = currentPage && currentPage.title
      ? `${currentPage.title} - Algebraic Effects`
      : 'Algebraic Effects';

    // Scroll to top
    scrollTo(0, 0);
  }, [page]);

  return <currentPage.render {...props} />;
};

const scrollIntoView = ($el: HTMLElement) => {
  if(typeof $el.scrollIntoView === 'function') {
    $el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  } else {
    const fromTop = $el.offsetTop;
    requestAnimationFrame(() => scrollTo(0, fromTop));
  }
};


interface RouterProviderProps {
  children: JSX.Element[] | JSX.Element,
};

export const RouteProvider = ({ children }: RouterProviderProps) => {
  const [initPage, initTarget] = getHash();
  const [page, setPage] = useState(initPage);
  const [scrollTarget, setScrollTarget] = useState(initTarget);

  const onHashChange = () => {
    const [hash, target] = getHash();
    target && setScrollTarget(target);
    setPage(hash);
  };

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useLayoutEffect(() => {
    if(scrollTarget) {
      const $target = document.getElementById(scrollTarget);
      $target && setTimeout(() => scrollIntoView($target), 400);
    }
  }, [scrollTarget]);

  return (
    <RouterContext.Provider value={{ page, setPage }}>
      {children}
    </RouterContext.Provider>
  );
};

export default Router;
