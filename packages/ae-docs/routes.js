import React from 'react';

import Homepage from './pages/Homepage.mdx';
const CoreModule = React.lazy(() => import(/* webpackChunkName: "CoreModulePage" */ './pages/core.mdx'));
const Lingo = React.lazy(() => import(/* webpackChunkName: "LingoPage" */ './pages/lingo.mdx'));
const Operations = React.lazy(() => import(/* webpackChunkName: "OperationsPage" */ './pages/operations.mdx'));
const Exception = React.lazy(() => import(/* webpackChunkName: "ExceptionPage" */ './pages/Exception.mdx'));
const State = React.lazy(() => import(/* webpackChunkName: "StatePage" */ './pages/State.mdx'));
const Random = React.lazy(() => import(/* webpackChunkName: "RandomPage" */ './pages/Random.mdx'));
const TaskMonad = React.lazy(() => import(/* webpackChunkName: "TaskMonadPage" */ './pages/task.mdx'));

export default {
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
