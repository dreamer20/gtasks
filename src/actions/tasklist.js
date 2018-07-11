import { FETCH_TASKLISTS } from './types';

export const fetchTasklists = () => ({
  type: 'ADD',
  path: `tasks/v1/users/@me/lists`,
  method: 'GET'
});

