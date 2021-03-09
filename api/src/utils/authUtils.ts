import * as jwt from "jsonwebtoken";

export const generateJWT = (
  signingSecret: string,
  validForInHours: number
): string => {
  return jwt.sign({}, signingSecret, {
    expiresIn: `${validForInHours} hours`,
  });
};
