/* eslint-disable class-methods-use-this */
// https://docs.pastvu.com/dev/api

interface ResponseData {
  result: {
    can: {
      [key: string]: string
    }
    photo: {
      file: string,
      year: number,
      year2: number,
      title: string,
      regions: {}[],
    }
  }
}

class PastVuApi {
  constructor(private baseUrl: string) { }

  private setParams(id: number): string {
    return `&params={"cid":${id}}`;
  }

  private async getResponseData(res: Response): Promise<never | ResponseData> {
    if (res.ok) {
      return res.json();
    }

    const error = await res.text();
    return Promise.reject(JSON.parse(error));
  }

  public async getPhoto(id: number): Promise<ResponseData> {
    const res = await fetch(this.baseUrl + this.setParams(id));

    return this.getResponseData(res);
  }
}

const pastVuApi = new PastVuApi('https://pastvu.com/api2?method=photo.giveForPage');

export default pastVuApi;
