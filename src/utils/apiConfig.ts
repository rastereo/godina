import { IApiConfig } from '../types';

import historyPinApi from './HistoryPinApi';
import kinopoiskApi from './KinopoiskApi';
import locApi from './LocApi';
import pastVuApi from './PastVuApi';

const apiConfig: IApiConfig[] = [
  { api: pastVuApi, minId: 1, maxId: 10e6 },
  { api: historyPinApi, minId: 1, maxId: 3e6 },
  { api: kinopoiskApi, minId: 1, maxId: 10e6 },
  { api: locApi, minId: 1, maxId: 3e6 },
];

export default apiConfig;
