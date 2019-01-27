import React, { useState, useEffect } from 'react';

const getHash = () => window.location.hash.slice(1);

const Router = ({ pages, ...props }) => {
  const [page, setPage] = useState(getHash());
  const currentPage = pages[page] || pages.home;

  const onHashChange = () => {
    const hash = getHash();
    setPage(hash);
  };

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if(currentPage && currentPage.title) {
      document.title = `${currentPage.title} - Algebraic Effects`;
    } else {
      document.title = 'Algebraic Effects';
    }
  }, [page]);

  return <currentPage.render {...props} />;
};

export default Router;
