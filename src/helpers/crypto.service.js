const jwt = require("jsonwebtoken");
// JwtPayloadInterface
// gbpuatId
// id
// role

exports.verifyAccessToken = async (token) => {
  const options = {
    algorithm: "HS256",
    issuer: "CampusConnect",
  };

  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    options
  );

  return decoded;
};
