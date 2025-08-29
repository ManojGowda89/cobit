// src/login.js
import { Router } from "express"  
const router = Router();                
import User from "./Modals/User.js"

import { generateToken, verifyToken } from "./utils/jwt.js";

import {  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet,} from "./Modules/Snippet.js"


router.get("/snippets", getSnippets);
router.get("/snippets/:id", getSnippetById);
router.post("/snippets", createSnippet);
router.put("/snippets/:id", updateSnippet);
router.delete("/snippets/:id", deleteSnippet);



const decodeBasicAuth = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) return null;

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [email, password] = credentials.split(":");
  return { email, password };
};

// Login route using Basic Auth
router.get("/login", async (req, res) => {
  const creds = decodeBasicAuth(req);
  if (!creds) return res.status(401).json({ error: "Missing or invalid Authorization header" });

  const { email, password } = creds;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Register route using Basic Auth
router.get("/register", async (req, res) => {
  const creds = decodeBasicAuth(req);
  if (!creds) return res.status(401).json({ error: "Missing or invalid Authorization header" });

  const { email, password } = creds;
  try {
    const userId = email.split("@")[0];

    const user = await User.create({ userId, email, password });
    res.json({ userId: user.userId, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User creation failed" });
  }
});

// Verify route
router.get("/verify", (req, res) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  const decoded = verifyToken(token);    // your existing verifyToken function

  if (!decoded) {
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }

  res.json({ valid: true, email: decoded.email, userId: decoded.userId });
});

export default router;