declare namespace data {
  export interface ISearchResults<T> {
    totalCount: number;
    items: T[];
  }

  export interface ISearchResultsFromId<T> {
    totalCount: number;
    items: T[];
    finalPage: boolean;
  }
}
