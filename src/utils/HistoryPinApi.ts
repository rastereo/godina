/* eslint-disable class-methods-use-this */
// https://historypin.github.io/api-docs/index.html

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

  private async getResponseData(res: Response): Promise<ResponseData | never> {
    if (res.ok) {
      return res.json();
    }

    const error = await res.text();
    return Promise.reject(JSON.parse(error));
  }

  private checkData(data: ResponseData): ResponseData | Promise<never> {
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

  public async getPhoto(id: number): Promise<ResponseData> {
    const res = await fetch(this.baseUrl + this.setParams(id));

    const data = this.getResponseData(res);

    return this.checkData(await data);
  }
}

const historyPinApi = new HistoryPinApi('https://www.historypin.org/en/api/pin/get.json');

export default historyPinApi;
