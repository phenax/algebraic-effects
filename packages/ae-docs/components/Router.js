import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';

const getHash = () => `${window.location.hash}`.slice(1).split('.');

export const RouterContext = React.createContext(null);

const Router = ({ routes, ...props }) => {
  const { page } = useContext(RouterContext) || {};
  const currentPage = routes[page] || routes.home;

  useEffect(() => {
    // Set current title
    document.title = currentPage && currentPage.title
      ? `${currentPage.title} - Algebraic Effects`
      : 'Algebraic Effects';

    // Scroll to top
    document.scrollingElement.scrollTo(0, 0);
  }, [page]);

  return <currentPage.render {...props} />;
};

const scrollIntoView = $el => {
  if(typeof $el.scrollIntoView === 'function') {
    $el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  } else {
    const fromTop = $el.offsetTop;
    requestAnimationFrame(() => document.scrollingElement.scrollTo(0, fromTop));
  }
};

export const RouteProvider = ({ children }) => {
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
