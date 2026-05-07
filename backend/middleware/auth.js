import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token and get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // We don't necessarily need to fetch the full user from DB for every request, 
      // but if we do, we could attach it to req.user. For now, attaching the id is enough.
      req.user = { id: decoded.id };

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
