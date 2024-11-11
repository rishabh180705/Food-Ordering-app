import jwt from 'jsonwebtoken';

const Authmiddleware = (req, res, next) => {
  const { token}=req.headers;
  const tokenValue=token;


  if (!tokenValue) {
    return res.status(401).json({ success: false, message: "Not Authorized. Please log in." });
  }

  try {
    // Verify the token using your JWT_SECRET
    const token_decode = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
   
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};

export default Authmiddleware;
