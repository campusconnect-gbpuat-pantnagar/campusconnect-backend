// Define an enum for status codes
exports.HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  I_AM_A_TEAPOT: 418,
  METHOD_NOT_ALLOWED: 405,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  PRECONDITION_FAILED: 412,
};
