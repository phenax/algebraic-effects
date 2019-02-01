import React, { ConcurrentMode } from 'react';
import { createRoot } from 'react-dom';
import styled, { keyframes } from 'styled-components';

import Link from './components/Link';
import FloatingHeaderLink from './components/FloatingHeaderLink';
import Sidenav from './components/Sidenav';
import Router, { RouteProvider } from './components/Router';


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
  max-width: 800px;
  width: 100%;
  margin: 1em auto;
  padding: 1em 1.5em;
  font-size: 1.2em;
  line-height: 1.6em;
`;

const spin = keyframes`
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
`;

const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${p => p.height || '300px'};
`;

const Spinner = styled.div`
  display: ${p => p.isVisible ? 'block': 'none'};
  width: ${p => p.size || 70}px;
  height: ${p => p.size || 70}px;
  border: ${p => p.thickness || 3}px solid transparent;
  border-left-color: ${p => p.color || '#333'};
  border-right-color: ${p => p.color || '#333'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner = ({ height, ...props }) => (
  <CenteredWrapper height={height}>
    <Spinner isVisible {...props} />
  </CenteredWrapper>
);

const App = () => (
  <Wrapper>
    <RouteProvider>
      <Aside>
        <Sidenav routes={routes} />
      </Aside>
      <Main>
        <FloatingHeaderLink />
        <Content>
          <React.Suspense fallback={<LoadingSpinner />} maxDuration={200}>
            <Router routes={routes} />
          </React.Suspense>
        </Content>
      </Main>
    </RouteProvider>
  </Wrapper>
);

createRoot(document.getElementById('root')).render(
  <ConcurrentMode>
    <App />
  </ConcurrentMode>,
);
