/* eslint-disable class-methods-use-this */
// https://kinopoiskapiunofficial.tech/

import { IContentPhoto } from '../types';

interface ResponseStillList {
  total: number,
  items: [{
    imageUrl: string,
  }],
}

interface ResponseFilmInfo {
  year: number,
  nameRu: string,
  countries: [{
    country: string
  }]
}

class KinopoiskApi {
  constructor(private baseUrl: string, private token: string) { }

  private setFilmId(id: number): string {
    return `/${id}`;
  }

  private setParameters(): string {
    return '/images?type=STILL&page=1';
  }

  private async getResponseData(res: Response): Promise<any | never> {
    if (res.ok) {
      return res.json();
    }

    const error = await res.text();

    return Promise.reject(JSON.parse(error));
  }

  private async getContentPhoto(id: number, imageUrl: string) {
    const contentPhoto: IContentPhoto = {
      url: '',
      year: 0,
      title: '',
      region: '',
    };

    const filmInfo = await this.getFilmInfo(id);

    contentPhoto.url = imageUrl;
    contentPhoto.year = filmInfo.year;
    contentPhoto.title = `Кадр из «${filmInfo.nameRu}»`;

    contentPhoto.region = filmInfo.countries.reduce((acc: string[], region: {
      [key: string]: string,
    }) => {
      acc.push(region.country);

      return acc;
    }, []).join(', ');

    return contentPhoto;
  }

  private getImageUrl(
    data: ResponseStillList,
    randomInteger: (min: number, max: number) => number,
  ): string | Promise<never> {
    if (data.total > 0) {
      const { imageUrl } = data.items[randomInteger(1, data.items.length)];

      return imageUrl;
    }

    return Promise.reject();
  }

  private async getFilmInfo(id: number): Promise<ResponseFilmInfo> {
    const filmInfo = await fetch(this.baseUrl + this.setFilmId(id), {
      method: 'GET',
      headers: {
        'X-API-KEY': this.token,
        'Content-Type': 'application/json',
      },
    });

    return this.getResponseData(filmInfo);
  }

  private async getStillList(id: number): Promise<ResponseStillList> {
    const stillList = await fetch(this.baseUrl + this.setFilmId(id) + this.setParameters(), {
      method: 'GET',
      headers: {
        'X-API-KEY': this.token,
        'Content-Type': 'application/json',
      },
    });

    return this.getResponseData(stillList);
  }

  public async getPhoto(
    id: number,
    isPhotoLoaded: boolean,
    randomInteger: (min: number, max: number) => number,
  ): Promise<never | IContentPhoto> {
    const stillList = await this.getStillList(id);

    const imageUrl = await this.getImageUrl(stillList, randomInteger);

    return this.getContentPhoto(id, imageUrl);
  }
}

const kinopoiskApi = new KinopoiskApi(
  'https://kinopoiskapiunofficial.tech/api/v2.2/films',
  '1e6a0dbf-a4e1-4045-aa4a-dadee214c91d',
);

export default kinopoiskApi;
