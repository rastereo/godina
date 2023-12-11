/* eslint-disable class-methods-use-this */

import { IContentPhoto } from '../types';

interface Result {
  image_url: string[]
  date: string;
  title: string;
  location: string[],
}

interface ResponseData {
  content: {
    results: Result[],
  }
}

class LocApi {
  constructor(private baseUrl: string) {}

  private getContentPhoto(
    res: ResponseData,
    isPhotoLoaded: boolean,
  ): Promise<never> | IContentPhoto {
    const sliceYear = Number(res.content.results[0].date.slice(0, 4));

    if (
      sliceYear
      && sliceYear >= 1826
      && !isPhotoLoaded
      && res.content.results[0].image_url.length > 0
      && res.content.results[0].image_url[0] !== 'https://www.loc.gov/static/images/original-format/personal-narrative.svg'
      && res.content.results[0].image_url[0] !== 'https://www.loc.gov/static/images/original-format/group-of-images.svg'
    ) {
      const contentPhoto: IContentPhoto = {
        url: '',
        year: 0,
        title: '',
        region: '',
      };

      contentPhoto.year = sliceYear;

      contentPhoto.url = res
        .content.results[0]
        .image_url[res.content.results[0].image_url.length - 1];

      contentPhoto.title = res.content.results[0].title;

      contentPhoto.region = res.content.results[0].location.join('. ');

      return contentPhoto;
    }

    return Promise.reject();
  }

  private async getResponseData(
    res: Response,
  ): Promise<never | ResponseData> {
    if (res.ok) {
      const responseData = await res.json();

      return responseData;
    }

    const error = await res.text();

    return Promise.reject(JSON.parse(error));
  }

  private async fetchWithTimeout(resource: string): Promise<never | ResponseData> {
    const timeout = 5000;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(
      resource,
      {
        signal: controller.signal,
      },
    );

    clearTimeout(id);

    return this.getResponseData(response);
  }

  public async getPhoto(
    id: number,
    isPhotoLoaded: boolean,
  ): Promise<never | IContentPhoto> {
    const responseData = await this.fetchWithTimeout(this.baseUrl + id);

    const contentPhoto = await this.getContentPhoto(responseData, isPhotoLoaded);

    return contentPhoto;
  }
}

const locApi = new LocApi('https://www.loc.gov/photos/?fo=json&c=1&sp=');

export default locApi;
