/* eslint-disable class-methods-use-this */
// https://docs.pastvu.com/dev/api

import { IContentPhoto } from '../types';

interface ResponseData {
  result: {
    can: {
      [key: string]: string;
    };
    photo: {
      file: string;
      year: number;
      year2: number;
      title: string;
      regions: { [key: string]: string }[];
    };
  };
}

class PastVuApi {
  constructor(private baseUrl: string) {}

  private setParams(id: number): string {
    return `&params={"cid":${id}}`;
  }

  private getContentPhoto(
    res: ResponseData,
    isPhotoLoaded: boolean
  ): Promise<never> | IContentPhoto {
    if (
      res.result.photo &&
      res.result.can.download === 'login' &&
      res.result.photo.year >= 1826 &&
      !isPhotoLoaded
    ) {
      const { file, year, year2, title, regions } = res.result.photo;

      return {
        url: `https://pastvu.com/_p/d/${file}`,
        year: Math.round((year + year2) / 2),
        title,
        region: regions
          .reduce(
            (
              acc: string[],
              region: {
                [key: string]: string;
              }
            ) => {
              acc.push(region.title_local);

              return acc;
            },
            []
          )
          .join(', '),
      };
    }

    return Promise.reject();
  }

  private async getResponseData(
    res: Response,
    isPhotoLoaded: boolean
  ): Promise<never | IContentPhoto> {
    if (res.ok) {
      const responseData = await res.json();

      return this.getContentPhoto(responseData, isPhotoLoaded);
    }

    const error = await res.text();

    return Promise.reject(JSON.parse(error));
  }

  public async getPhoto(
    id: number,
    isPhotoLoaded: boolean
  ): Promise<never | IContentPhoto> {
    const res = await fetch(this.baseUrl + this.setParams(id));

    return this.getResponseData(res, isPhotoLoaded);
  }
}

const pastVuApi = new PastVuApi(
  'https://pastvu.com/api2?method=photo.giveForPage'
);

export default pastVuApi;
