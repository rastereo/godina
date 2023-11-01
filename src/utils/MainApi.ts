/* eslint-disable class-methods-use-this */
// https://docs.pastvu.com/dev/api

// interface ResponseData {
//   result: {
//     can: {
//       [key: string]: string
//     }
//     photo: {
//       file: string,
//       year: number,
//       year2: number,
//       title: string,
//       regions: {}[],
//     }
//   }
// }

class MainApi {
  constructor(private baseUrl: string) { }

  private setParams(name: string, score: number): string {
    return `?new_score=${score}&name=${name}`;
  }

  private async getResponseData(res: Response): Promise<never | any> {
    if (res.ok) {
      return res.json();
    }

    const error = await res.text();
    return Promise.reject(JSON.parse(error));
  }

  public async getTopScore(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/get_all_scores`);

    return this.getResponseData(res);
  }

  public async setNewScore(name: string, score: number): Promise<any> {
    const res = await fetch(`${this.baseUrl}/send_score${this.setParams(name, score)}`);

    return this.getResponseData(res);
  }
}

const mainApi = new MainApi('https://seeing.monster/api');

export default mainApi;
