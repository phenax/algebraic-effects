import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import Link from './components/Link';
import Sidenav from './components/Sidenav';
import Router, { RouteProvider } from './components/Router';

import Homepage from './pages/Homepage.mdx';
import CoreModule from './pages/core.mdx';
import Exception from './pages/Exception.mdx';
import State from './pages/State.mdx';
import Random from './pages/Random.mdx';

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
  effects_exception: {
    order: 3,
    title: 'Exception Effect',
    render: Exception,
  },
  effects_state: {
    order: 4,
    title: 'State Effect',
    render: State,
  },
  effects_random: {
    order: 5,
    title: 'Random Effect',
    render: Random,
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
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 1em auto;
  padding: 1em 1.5em;
  font-size: 1.2em;
  line-height: 1.6em;
`;

const App = () => (
  <Wrapper>
    <RouteProvider>
      <Aside>
        <Sidenav pages={pages} />
      </Aside>
      <Main>
        <Content>
          <React.Suspense>
            <Router pages={pages} />
          </React.Suspense>
        </Content>
      </Main>
    </RouteProvider>
  </Wrapper>
);

render(<App />, document.getElementById('root'));
