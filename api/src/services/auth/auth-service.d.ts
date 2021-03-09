declare namespace api {
  interface IAuthService {
    decodeJWT(token: string, logger: api.Logger): Promise<{} | undefined>;
  }
}
