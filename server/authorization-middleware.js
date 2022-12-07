const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

function authorizationMiddleware(req, res, next) {

  const xToken = req.headers['x-access-token'];
  if (!xToken) {
    throw new ClientError(401, 'authentication required');
  }

  const decoded = jwt.verify(xToken, process.env.TOKEN_SECRET);
  req.user = decoded;
  next();

}

module.exports = authorizationMiddleware;
