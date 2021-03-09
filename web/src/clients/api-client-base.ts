import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export interface ApiClientBaseOptions {
  apiBaseURL: string;
  onError(error: AxiosError, url: string, errorHandled?: boolean): void;
  responseDataMapper<T>(res: AxiosResponse<any>): T;
}

export class ApiClientBase<
  Options extends ApiClientBaseOptions = ApiClientBaseOptions
> {
  private apiClient: AxiosInstance;

  constructor(protected options: Options) {
    this.apiClient = Axios.create({
      baseURL: options.apiBaseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public setAuthorization = (authToken: string): void => {
    this.apiClient = Axios.create({
      baseURL: this.options.apiBaseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      responseType: "json",
    });
  };

  public clearAuthorization = (): void => {
    this.apiClient = Axios.create({
      baseURL: this.options.apiBaseURL,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
  };

  protected get = <T>(
    url: string,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.apiClient
      .get(url, axiosReqConfig)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch((err: AxiosError) => this.options.onError(err, url)) as Promise<T>;

  protected post = <T>(
    url: string,
    data?: object,
    reqConfig?: AxiosRequestConfig,
    errorHandled?: boolean
  ): Promise<T> =>
    this.apiClient
      .post(url, data, reqConfig)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch((err: AxiosError) =>
        this.options.onError(err, url, errorHandled)
      ) as Promise<T>;

  protected put = <T>(
    url: string,
    data?: any,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.apiClient
      .put(url, data, axiosReqConfig)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch((err: AxiosError) => this.options.onError(err, url)) as Promise<T>;

  protected delete = <T>(
    url: string,
    axiosReqConfig?: AxiosRequestConfig
  ): Promise<T> =>
    this.apiClient
      .delete(url, axiosReqConfig)
      .then((res: AxiosResponse) => this.options.responseDataMapper<T>(res))
      .catch((err: AxiosError) => this.options.onError(err, url)) as Promise<T>;
}
