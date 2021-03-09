import * as Koa from "koa";

export const badRequest = (message: string): api.BadRequestGeneralResponse => ({
  statusCode: 400,
  reason: "bad_request",
  type: "general",
  message,
});

export const validationBadRequest = (
  errors: api.ValidationError[]
): api.BadRequestValidationResponse => ({
  statusCode: 400,
  reason: "bad_request",
  type: "validation",
  message: "Request had validation errors",
  validationErrors: errors,
});

export const notFound = (resource: string): api.NotFoundResponse => ({
  statusCode: 404,
  reason: "not_found",
  resource,
  message: "Resource could not be found.",
});

export const notAuthorized = () => {
  return error(
    401,
    "unauthorized",
    "This route requires authentication. Token may be invalid."
  );
};

export const forbidden = () => {
  return error(403, "forbidden", "You do not have permission.");
};

const error = (
  statusCode: number,
  reason: api.GeneralApiErrorResponseReasonType,
  message: string
): api.ErrorResponse => {
  return {
    statusCode,
    reason,
    message,
  };
};

export const addErrorToContext = (
  ctx: Koa.Context,
  error: api.ErrorResponse
) => {
  ctx.body = error;
  ctx.status = error.statusCode;
};
