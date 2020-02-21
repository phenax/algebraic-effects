import { compose } from 'ramda';
import { fromClassPrototype } from 'pipey';

import { Routes, Page } from '../types/routes';

const { map, filter, sort } = fromClassPrototype(Array);

const isMatch = (term?: string, str?: string) =>
  `${str}`.toLowerCase().indexOf(`${term}`.toLowerCase()) >= 0;

export const findMatchingRoutes = (term: string) => (routes: Routes) =>
  compose(
    sort((a: Page, b: Page) => a.order - b.order),
    filter((page: Page) =>
      !term
        ? true
        : isMatch(term, page.title) ||
          isMatch(term, page.key) ||
          isMatch(term, page.description) ||
          isMatch(term, page.keywords)
    ),
    map((key: string) => ({ ...routes[key], key })),
    Object.keys
  )(routes);
