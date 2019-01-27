import React, { useState, useEffect, useContext } from 'react';

const getHash = () => window.location.hash.slice(1);

export const RouterContext = React.createContext(null);

const Router = ({ pages, ...props }) => {
  const { page } = useContext(RouterContext) || {};
  const currentPage = pages[page] || pages.home;

  useEffect(() => {
    document.title = currentPage && currentPage.title
      ? `${currentPage.title} - Algebraic Effects`
      : 'Algebraic Effects';
  }, [page]);

  return <currentPage.render {...props} />;
};

export const RouteProvider = ({ children }) => {
  const [page, setPage] = useState(getHash());

  const onHashChange = () => {
    const hash = getHash();
    setPage(hash);
  };

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <RouterContext.Provider value={{ page, setPage }}>
      {children}
    </RouterContext.Provider>
  );
};

export default Router;
