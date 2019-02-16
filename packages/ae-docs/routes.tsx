import React from 'react';

import { Routes } from './types/routes';

import Homepage from './pages/homepage.mdx';
const CoreModule = React.lazy(() => import(/* webpackChunkName: "CoreModulePage" */ './pages/Core.mdx'));
const Questions = React.lazy(() => import(/* webpackChunkName: "QuestionsPage" */ './pages/questions.mdx'));
const Lingo = React.lazy(() => import(/* webpackChunkName: "LingoPage" */ './pages/lingo.mdx'));
const GenericEffects = React.lazy(() => import(/* webpackChunkName: "GenericEffectsPage" */ './pages/GenericEffects.mdx'));

const Exception = React.lazy(() => import(/* webpackChunkName: "ExceptionEffectPage" */ './pages/Exception.mdx'));
const State = React.lazy(() => import(/* webpackChunkName: "StateEffectPage" */ './pages/State.mdx'));
const Random = React.lazy(() => import(/* webpackChunkName: "RandomEffectPage" */ './pages/Random.mdx'));
const Logger = React.lazy(() => import(/* webpackChunkName: "LoggerEffectPage" */ './pages/Logger.mdx'));

const TaskMonad = React.lazy(() => import(/* webpackChunkName: "TaskMonadPage" */ './pages/Task.mdx'));

const EFFECTS = 'Effects';

const routes: Routes = {
  home: {
    order: 1,
    title: 'Getting started',
    render: Homepage,
    keywords: 'import,index,start,beginner',
  },
  faq: {
    order: 2,
    title: 'What, Why and How',
    render: Questions,
    keywords: 'questions,answers,faq,motivation,background',
  },
  core: {
    order: 2,
    title: 'Core modules',
    render: CoreModule,
    keywords: 'createEffect,func,program,custom,flow,resume,throw,end,handler,compose,concat,with,run,generic',
  },
  lingo: {
    order: 3,
    title: 'Made up words',
    render: Lingo,
    keywords: 'operation,signature,program,effect,handler,runner',
  },
  operations: {
    order: 4,
    title: 'Generic effects',
    render: GenericEffects,
    keywords: 'sleep,call,background,race,parallel,series,awaitPromise,createGenericEffect',
  },
  task: {
    order: 10,
    title: 'Task monad',
    render: TaskMonad,
    keywords: 'resolve,reject,empty,promise,map,fork,fold,reduce,chain,race,parallel,series',
  },


  exception: {
    order: 20,
    title: 'Exception Effect',
    render: Exception,
    keywords: 'try,catch,either,error,throw',
    group: EFFECTS,
  },
  state: {
    order: 21,
    title: 'State Effect',
    render: State,
    keywords: 'get,set,update',
    group: EFFECTS,
  },
  random: {
    order: 22,
    title: 'Random Effect',
    render: Random,
    keywords: 'seed,unseeded,crypto,fromArray,number,getInt',
    group: EFFECTS,
  },
  logger: {
    order: 23,
    title: 'Logger Effect',
    render: Logger,
    keywords: 'console,log,warn,error,message,info',
    group: EFFECTS,
  },
};

export default routes;
