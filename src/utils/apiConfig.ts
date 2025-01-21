import historyPinApi from './HistoryPinApi';
// import kinopoiskApi from './KinopoiskApi';
import locApi from './LocApi';
import pastVuApi from './PastVuApi';

import { IApiConfig } from '../types';

const apiConfig: IApiConfig[] = [
  { api: pastVuApi, minId: 1, maxId: 10e6 },
  { api: historyPinApi, minId: 1, maxId: 3e6 },
  // { api: kinopoiskApi, minId: 1, maxId: 10e6 },
  { api: locApi, minId: 1, maxId: 7e5 },
];

export default apiConfig;
