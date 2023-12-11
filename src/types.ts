export interface IContentPhoto {
  url: string,
  year: number,
  title: string,
  region: string,
}

export interface IApi {
  getPhoto: (
    id: number,
    isPhotoLoaded: boolean,
    randomInteger: (min: number, max: number) => number,
  ) => Promise<IContentPhoto | never>,
}

export interface IApiConfig {
  api: IApi,
  minId: number,
  maxId: number,
}
