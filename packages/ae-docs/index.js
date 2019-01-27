import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import Link from './components/Link';
import Sidenav from './components/Sidenav';
import Router from './components/Router';

import Homepage from './pages/Homepage.mdx';
import CoreModule from './pages/core.mdx';
import Exception from './pages/Exception.mdx';
import State from './pages/State.mdx';
import Random from './pages/Random.mdx';

const pages = {
  home: {
    title: 'Getting started',
    render: Homepage,
  },
  core: {
    title: 'Core modules',
    render: CoreModule,
  },
  effects_exception: {
    title: 'Exception Effect',
    render: Exception,
  },
  effects_state: {
    title: 'State Effect',
    render: State,
  },
  effects_random: {
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
  width: 300px;
`;

const Content = styled.div`
  max-width: 700px;
  margin: 1em auto;
  padding: 1em;
`;

const App = () => (
  <Wrapper>
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
  </Wrapper>
);

render(<App />, document.getElementById('root'));
