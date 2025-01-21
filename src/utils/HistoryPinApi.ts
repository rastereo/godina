/* eslint-disable class-methods-use-this */
// https://historypin.github.io/api-docs/index.html

import Bottleneck from 'bottleneck';
import { IContentPhoto } from '../types';

interface ResponseData {
  caption: string;
  date: string;
  display: {
    [key: string]: string;
  };
  content: {
    [key: string]: string;
  };
  location: {
    geo_tags: string;
  };
}

class HistoryPinApi {
  limiter = new Bottleneck({
    maxConcurrent: 1,
  });

  constructor(private baseUrl: string) {}

  private setParams(id: number): string {
    return `?id=${id}`;
  }

  private getContentPhoto(
    res: ResponseData,
    isPhotoLoaded: boolean
  ): Promise<never> | IContentPhoto {
    const { caption, date, display, location } = res;

    if (!isPhotoLoaded) {
      const contentPhoto: IContentPhoto = {
        url: '',
        year: 0,
        title: '',
        region: '',
      };

      const regexYear = /[12]\d{3}/g;

      const yearMatch = date.match(regexYear);

      if (yearMatch) {
        let yearSum: number = 0;

        // eslint-disable-next-line no-return-assign
        yearMatch.forEach((year) => (yearSum += Number(year)));

        contentPhoto.year = Math.round(yearSum / yearMatch.length);
      } else return Promise.reject();

      if (display.content) {
        const url = `https://www.historypin.org${display.content}`;

        contentPhoto.url = url;
        contentPhoto.title = caption;
        contentPhoto.region = location.geo_tags;
      } else return Promise.reject();

      return contentPhoto;
    }

    return Promise.reject();
  }

  private async getResponseData(res: Response): Promise<ResponseData | never> {
    if (res.ok) {
      return res.json();
    }

    const error = await res.text();
    return Promise.reject(JSON.parse(error));
  }

  private checkData(data: ResponseData): Promise<never> | ResponseData {
    const { caption, date, display, location } = data;

    if (
      date === 'Date Unknown' ||
      date === undefined ||
      caption === '' ||
      display.content === '' ||
      location.geo_tags === ''
    ) {
      return Promise.reject();
    }

    return data;
  }

  public async getPhoto(
    id: number,
    isPhotoLoaded: boolean
  ): Promise<never | IContentPhoto> {
    const res = await this.limiter.schedule(() =>
      fetch(this.baseUrl + this.setParams(id), {
        method: 'GET',
      })
    );

    const data = await this.checkData(await this.getResponseData(res));

    return this.getContentPhoto(data, isPhotoLoaded);
  }
}

const historyPinApi = new HistoryPinApi(
  'https://www.historypin.org/en/api/pin/get.json'
);

export default historyPinApi;
