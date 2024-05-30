const { HttpStatusCode } = require("../enums/http-status-code.enum");
const { globalConstants } = require("../utils/constants");
const { verifyAccessToken } = require("../helpers/crypto.service");

exports.AuthMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        status: globalConstants.status.failed,
        message: "No authorization header | not authorized",
        error: globalConstants.statusCode.UnauthorizedException.statusCodeName,
        statusCode: globalConstants.statusCode.UnauthorizedException.code,
      });
    }

    //  if authorization header present but not in proper format

    const [bearer, token] = authorization.split(" ");

    if (bearer != "Bearer" || !token) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({
        status: globalConstants.status.failed,
        message:
          'Invalid authorization header format. Format is "Bearer <token>".',
        error: globalConstants.statusCode.UnauthorizedException.statusCodeName,
        statusCode: globalConstants.statusCode.UnauthorizedException.code,
      });
    }

    try {
      const JwtUserPayload = await verifyAccessToken(token);
      req.user = JwtUserPayload;
      console.log(req.user);
      next();
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        throw new Error(
          globalConstants.statusCode.UnauthorizedException.code,
          "Invalid  access token"
        );
      }
      throw new Error(
        globalConstants.statusCode.UnauthorizedException.code,
        "token exipre"
      );
    }
  } catch (err) {
    return res
      .status(globalConstants.statusCode.UnauthorizedException.code)
      .json({
        status: globalConstants.status.failed,
        message: err.message,
        data: null,
        statusCode: globalConstants.statusCode.UnauthorizedException.code,
      });
  }
};

exports.isAdmin = async (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== "admin") {
    return res.status(globalConstants.statusCode.ForbiddenException.code).json({
      status: globalConstants.status.failed,
      message: `ForbiddenException || operations are not allowed`,
      data: null,
      statusCode: globalConstants.statusCode.ForbiddenException.code,
    });
  }
  next();
};
