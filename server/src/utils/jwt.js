import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "supersecret"; // keep in .env

function generateToken(user) {
  return jwt.sign(
    { userId: user.userId, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
export { generateToken, verifyToken };
