import * as jwt from "jsonwebtoken";

export default class AuthService implements api.IAuthService {
  constructor(private config: api.Config["jwt"]) {}

  public decodeJWT = async (
    token: string,
    logger: api.Logger
  ): Promise<{} | undefined> => {
    if (!token) {
      return undefined;
    }

    try {
      return jwt.verify(token, this.config.secret) as {};
    } catch (error) {
      logger.debug(error);
      return undefined;
    }
  };
}
