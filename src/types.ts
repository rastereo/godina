export interface IContentPhoto {
  url: string,
  year: number,
  title: string,
  region: string,
}

export interface IApi {
  getPhoto: (ip: number, isPhotoLoaded: boolean) => Promise<IContentPhoto | never>,
}
