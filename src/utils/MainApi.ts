/* eslint-disable class-methods-use-this */
// https://seeing.monster/docs#/Godina%20back%20API/send_score_api_send_score_post

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
