import { AxiosError, AxiosResponse } from "axios";
import { ApiClientBase } from "./api-client-base";

export default class Api extends ApiClientBase {
  constructor(
    protected endpoint: string,
    onError: (
      apiError: AxiosError,
      url: string,
      errorHandled?: boolean
    ) => never
  ) {
    super({
      apiBaseURL: endpoint,
      onError: (apiError: AxiosError, url: string, errorHandled?: boolean) =>
        onError(apiError, url, errorHandled),
      responseDataMapper(res: AxiosResponse<any>) {
        return res.data;
      },
    });
  }

  // public login = async (
  //   data: api.LoginRequestBody
  // ): Promise<api.LoginResponseBody> => {
  //   return this.post<api.LoginResponseBody>("/auth/login", data);
  // };

  // public setSystemState = async (
  //   data: api.SetSystemStateRequestBody
  // ): Promise<api.SystemState> => {
  //   return this.post<api.SystemState>("/user", data);
  // };

  // public getSystemState = async (): Promise<api.SystemState> => {
  //   return this.get<api.SystemState>("/user");
  // };

  public getInterestRevenueStats = async (): Promise<api.MakerInterestRevenueStats> => {
    return this.get<api.MakerInterestRevenueStats>("/maker/interest-revenue");
  };

  public getPSMRevenueStats = async (): Promise<api.PSMRevenueStats> => {
    return this.get<api.PSMRevenueStats>("/maker/psm-revenue");
  };
}
