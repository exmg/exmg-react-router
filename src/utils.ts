import { createHashHistory, createMemoryHistory, History, createBrowserHistory  } from 'history';

export type HistoryTypes = 'browser' | 'hash' | 'memory';

let history: History;

export const createHistory = (type: HistoryTypes): History => {
  if (history) {
    return history;
  }

  switch (type) {
    case 'browser':
      return history = createBrowserHistory();
    case 'hash':
      return history = createHashHistory();
    case 'memory':
      return history = createMemoryHistory();
    default:
      throw new Error(`exmg-react-router: History type ${type} not supported`);
  }
};

export const getHistory = (): History => {
  return history;
};
