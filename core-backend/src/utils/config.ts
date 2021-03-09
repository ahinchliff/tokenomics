export const getEnvVariable = (
  property: string,
  canBeUndefined = false
): any => {
  const value = process.env[property];

  if (!canBeUndefined && !value) {
    throw new Error(`${property} environment variable is not set`);
  }

  return value;
};
