import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if(!jwtSecret) {
  throw new Error(
    `JWT secret was not supplied.`
  );
}

export default (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).send({ auth: false, message: 'No token provided.' });

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(403).send({ auth: false, message: 'Token is not in correct format.' });
  }

  const token = tokenParts[1];
  jwt.verify(token, jwtSecret, (err) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    next();
  });
};