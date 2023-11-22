/* eslint-disable class-methods-use-this */
// https://kinopoiskapiunofficial.tech/

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

  public async getFilmInfo(id: number): Promise<ResponseFilmInfo> {
    const filmInfo = await fetch(this.baseUrl + this.setFilmId(id), {
      method: 'GET',
      headers: {
        'X-API-KEY': this.token,
        'Content-Type': 'application/json',
      },
    });

    return this.getResponseData(filmInfo);
  }

  public async getStillList(id: number): Promise<ResponseStillList> {
    const stillList = await fetch(this.baseUrl + this.setFilmId(id) + this.setParameters(), {
      method: 'GET',
      headers: {
        'X-API-KEY': this.token,
        'Content-Type': 'application/json',
      },
    });

    return this.getResponseData(stillList);
  }
}

const kinopoiskApi = new KinopoiskApi(
  'https://kinopoiskapiunofficial.tech/api/v2.2/films',
  '1e6a0dbf-a4e1-4045-aa4a-dadee214c91d',
);

export default kinopoiskApi;
