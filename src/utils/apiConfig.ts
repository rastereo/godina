import { IApiConfig } from '../types';

import historyPinApi from './HistoryPinApi';
import kinopoiskApi from './KinopoiskApi';
import locApi from './LocApi';
import pastVuApi from './PastVuApi';

const apiConfig: IApiConfig[] = [
  { api: pastVuApi, minId: 1, maxId: 5000000 },
  { api: historyPinApi, minId: 1, maxId: 1300000 },
  { api: kinopoiskApi, minId: 1, maxId: 1000000 },
  { api: locApi, minId: 1, maxId: 1500000 },
];

export default apiConfig;
