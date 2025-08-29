// src/login.js
import { Router } from "express"  
const router = Router();                
// const User = require("./db/Modals/config.modal.user");
// const { generateToken, verifyToken } = require("./utils/jwt");

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



// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user || user.password !== password) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const token = generateToken(user);
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Verify route
// router.post("/verify", (req, res) => {
//   const { token } = req.body;
//   const decoded = verifyToken(token);
//   if (!decoded) {
//     return res.status(401).json({ valid: false, error: "Invalid token" });
//   }
//   res.json({ valid: true, email: decoded.email, userId: decoded.userId });
// });

// // Register route (plain password)
// router.post("/register", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const userId = email.split("@")[0];

//     const user = await User.create({ userId, email, password });
//     res.json({ userId: user.userId, email: user.email });
//   } catch (err) {
//     res.status(500).json({ error: "User creation failed" });
//   }
// });

export default router;