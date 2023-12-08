/* eslint-disable class-methods-use-this */
// https://historypin.github.io/api-docs/index.html

import { IContentPhoto } from '../types';

interface ResponseData {
  caption: string,
  date: string,
  display: {
    [key: string]: string,
  },
  content: {
    [key: string]: string,
  },
  location: {
    geo_tags: string
  },
}

class HistoryPinApi {
  constructor(private baseUrl: string) { }

  private setParams(id: number): string {
    return `?id=${id}`;
  }

  private getContentPhoto(
    res: ResponseData,
    isPhotoLoaded: boolean,
  ): Promise<never> | IContentPhoto {
    const {
      caption,
      date,
      display,
      location,
    } = res;

    if (!isPhotoLoaded) {
      const contentPhoto: IContentPhoto = {
        url: '',
        year: 0,
        title: '',
        region: '',
      };

      if (date.length === 4 && Number(date) >= 1826) {
        contentPhoto.year = Number(date);
      } else if (date.length === 11) {
        const averageYear = Math.round((Number(date.slice(0, 4)) + Number(date.slice(7))) / 2);

        if (averageYear >= 1826) {
          contentPhoto.year = averageYear;
        } else return Promise.reject();
      } else if (date.length === 10) {
        const sliceYear = Number(date.slice(0, 4));

        if (sliceYear >= 1826) {
          contentPhoto.year = sliceYear;
        } else return Promise.reject();
      } else return Promise.reject();

      if (
        display.content.includes('http')
        && display.content !== 'https://photos-cdn.historypin.org/services/thumb/phid/1095200/dim/1000x1000/c/1512924030'
      ) {
        // https://photos-cdn.historypin.org/services/thumb/phid/1078627/dim/1000x1000/c/1499828996
        contentPhoto.url = display.content;
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

  private checkData(
    data: ResponseData,
  ): Promise<never> | ResponseData {
    const {
      caption,
      date,
      display,
      location,
    } = data;

    if (
      date === 'Date Unknown'
      || date === undefined
      || caption === ''
      || display.content === ''
      || location.geo_tags === ''
    ) {
      return Promise.reject();
    }

    return data;
  }

  public async getPhoto(id: number, isPhotoLoaded: boolean): Promise<never | IContentPhoto> {
    const res = await fetch(
      this.baseUrl + this.setParams(id),
      {
        method: 'GET',
      },
    );

    const data = await this.checkData(await this.getResponseData(res));

    return this.getContentPhoto(data, isPhotoLoaded);
  }
}

const historyPinApi = new HistoryPinApi('https://www.historypin.org/en/api/pin/get.json');

export default historyPinApi;
