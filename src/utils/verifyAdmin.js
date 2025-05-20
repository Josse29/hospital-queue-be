import jwt from "jsonwebtoken";
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};
export default protect;
