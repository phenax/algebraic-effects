import React, { ConcurrentMode } from 'react';
import { createRoot } from 'react-dom';
import styled from 'styled-components';

import Link from './components/Link';
import FloatingHeaderLink from './components/FloatingHeaderLink';
import Sidenav from './components/Sidenav';
import Router, { RouteProvider } from './components/Router';

import Homepage from './pages/Homepage.mdx';
const CoreModule = React.lazy(() => import(/* webpackChunkName: "CoreModulePage" */ './pages/core.mdx'));
const Lingo = React.lazy(() => import(/* webpackChunkName: "LingoPage" */ './pages/lingo.mdx'));
const Operations = React.lazy(() => import(/* webpackChunkName: "OperationsPage" */ './pages/operations.mdx'));
const Exception = React.lazy(() => import(/* webpackChunkName: "ExceptionPage" */ './pages/Exception.mdx'));
const State = React.lazy(() => import(/* webpackChunkName: "StatePage" */ './pages/State.mdx'));
const Random = React.lazy(() => import(/* webpackChunkName: "RandomPage" */ './pages/Random.mdx'));
const TaskMonad = React.lazy(() => import(/* webpackChunkName: "TaskMonadPage" */ './pages/task.mdx'));

const pages = {
  home: {
    order: 1,
    title: 'Getting started',
    render: Homepage,
  },
  core: {
    order: 2,
    title: 'Core modules',
    render: CoreModule,
  },
  lingo: {
    order: 3,
    title: 'Made up words',
    render: Lingo,
  },
  operations: {
    order: 4,
    title: 'Global operations',
    render: Operations,
  },
  effects_exception: {
    order: 10,
    title: 'Exception Effect',
    render: Exception,
  },
  effects_state: {
    order: 11,
    title: 'State Effect',
    render: State,
  },
  effects_random: {
    order: 12,
    title: 'Random Effect',
    render: Random,
  },
  task: {
    order: 20,
    title: 'Task monad',
    render: TaskMonad,
  },
};

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

const LoadingSpinner = () => (
  <div>
    Loading...
  </div>
);

const App = () => (
  <Wrapper>
    <RouteProvider>
      <Aside>
        <Sidenav pages={pages} />
      </Aside>
      <Main>
        <FloatingHeaderLink />
        <Content>
          <React.Suspense fallback={<LoadingSpinner />} maxDuration={200}>
            <Router pages={pages} />
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
