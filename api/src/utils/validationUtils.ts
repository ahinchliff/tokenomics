import * as Joi from "joi";

export type ValidationSchema<T> = { [P in keyof T]: Joi.Schema };

export const validate = async <T>(
  data: T,
  schema: ValidationSchema<T>
): Promise<
  | {
      isInvalid: true;
      errors: api.ValidationError[];
    }
  | { isInvalid: false }
> => {
  const validationSchema = Joi.object().keys(schema);
  try {
    validationSchema.validate(data, { abortEarly: false });
    return {
      isInvalid: false,
    };
  } catch (error) {
    const err = error as Joi.ValidationError;
    return {
      isInvalid: true,
      errors: err.details.map((e) => ({
        property: e.context?.key as string,
        message: e.message,
      })),
    };
  }
};
