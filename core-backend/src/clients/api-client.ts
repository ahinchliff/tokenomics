import Axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from "axios";

export default class Api {
  private apiClient: AxiosInstance;
  constructor() {
    this.apiClient = Axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public get = <T>(
    url: string,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> => this.apiClient.get(url, axiosReqConfig).then(this.toData);

  public post = <T>(
    url: string,
    data?: object,
    reqConfig?: AxiosRequestConfig
  ): Promise<T> => this.apiClient.post(url, data, reqConfig).then(this.toData);

  public put = <T>(
    url: string,
    data?: any,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.apiClient.put(url, data, axiosReqConfig).then(this.toData);

  public delete = <T>(
    url: string,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> => this.apiClient.delete(url, axiosReqConfig).then(this.toData);

  public toData = (res: AxiosResponse) => res.data;
}
