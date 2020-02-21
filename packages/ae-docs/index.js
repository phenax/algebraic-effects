import React, { ConcurrentMode } from 'react';
import { createRoot } from 'react-dom';
import styled from 'styled-components';

import LoadingSpinner from './components/LoadingSpinner';
import FloatingHeaderLink from './components/FloatingHeaderLink';
import Sidenav from './components/Sidenav';
import Router, { RouteProvider } from './components/Router';
import Footer from './components/Footer';

import routes from './routes';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`;

const Main = styled.main`
  width: 100%;
`;

const Aside = styled.aside`
  flex: 0 0 230px;

  @media all and (max-width: 1100px) {
    flex: 0;
  }
`;

const Content = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 1em auto;
  padding: 1em 1.5em 2em;
  font-size: 1.2em;
  line-height: 1.6em;
`;

const App = () => (
  <React.Fragment>
    <Aside>
      <Sidenav routes={routes} />
    </Aside>
    <Main>
      <FloatingHeaderLink />
      <Content>
        <React.Suspense fallback={<LoadingSpinner />} maxDuration={200}>
          <Router routes={routes} />
          <Footer routes={routes} />
        </React.Suspense>
      </Content>
    </Main>
  </React.Fragment>
);

createRoot(document.getElementById('root')).render(
  <ConcurrentMode>
    <Wrapper>
      <RouteProvider>
        <App />
      </RouteProvider>
    </Wrapper>
  </ConcurrentMode>,
);
