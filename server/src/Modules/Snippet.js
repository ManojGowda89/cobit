/**
 * Snippet Module - Handles CRUD operations for code snippets
 * 
 * Current Date and Time: 2025-08-29 09:38:18 (UTC)
 * User: ManojGowda89
 */

import { Sequelize } from "sequelize";
import Snippet from "../Modals/Snippet.js";
import { set, get, del, connectRedis, default as client } from "../config/redisClient.js";

// Connect to Redis (or in-memory cache)
connectRedis();

// --- Helper function to delete keys by pattern ---
const delPattern = async (pattern) => {
  try {
    if (client && client.scanIterator) {
      const iter = client.scanIterator({ MATCH: pattern });
      for await (const key of iter) {
        await del(key);
      }
      console.log(`Cache keys matching '${pattern}' invalidated`);
    } else {
      console.log("Pattern deletion not available, skipping cache invalidation");
    }
  } catch (err) {
    console.error("Error deleting pattern keys:", err);
  }
};

// --- Get paginated snippets ---
const getSnippets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  const cacheKey = `snippets:page=${page}:limit=${limit}:search=${search}`;

  try {
    const cached = await get(cacheKey);
    if (cached) {
      console.log("✅ Returned snippets from cache");
      return res.json(cached);
    }

    let whereClause = { visibility: "public" };
    if (search) {
      whereClause[Sequelize.Op.or] = [
        { title: { [Sequelize.Op.iLike]: `%${search}%` } },
        { description: { [Sequelize.Op.iLike]: `%${search}%` } },
        { id: { [Sequelize.Op.iLike]: `%${search}%` } },
      ];
    }

    const count = await Snippet.count({ where: whereClause });
    const snippets = await Snippet.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      attributes: { exclude: ["userInfo"] },
    });

    const response = {
      snippets,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
        hasMore: page < Math.ceil(count / limit),
      },
    };

    await set(cacheKey, response);
    console.log("✅ Snippets cached");

    res.json(response);
  } catch (err) {
    console.error("Error fetching snippets:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- Get a single snippet by ID ---
const getSnippetById = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `snippet:${id}`;

  try {
    const cached = await get(cacheKey);
    if (cached) {
      console.log("✅ Returned snippet from cache");
      return res.json(cached);
    }

    const snippet = await Snippet.findByPk(id);

    if (!snippet) return res.status(404).json({ error: "Snippet not found" });

    const response = {
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      visibility: snippet.visibility,
      username: snippet.userInfo?.username || "Guest",
      createdAt: snippet.createdAt,
      updatedAt: snippet.updatedAt,
    };

    await set(cacheKey, response);
    console.log("✅ Snippet cached");

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Create a new snippet ---
const createSnippet = async (req, res) => {
  const { title, description, code, visibility } = req.body;
  try {
    const snippet = await Snippet.create({ title, description, code, visibility });
    console.log("✅ Snippet created");

    // Invalidate relevant cache
    await delPattern("snippets:*");

    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Update a snippet ---
const updateSnippet = async (req, res) => {
  const { id } = req.params;
  const { title, description, code } = req.body;

  try {
    const snippet = await Snippet.findByPk(id);
    if (!snippet) return res.status(404).json({ error: "Snippet not found" });

    await snippet.update({ title, description, code });

    const response = {
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      username: snippet.userInfo?.username || "Guest",
      createdAt: snippet.createdAt,
      updatedAt: snippet.updatedAt,
    };

    // Invalidate cache
    await del(`snippet:${id}`);
    await delPattern("snippets:*");

    console.log("✅ Snippet updated");
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Delete a snippet ---
const deleteSnippet = async (req, res) => {
  const { id } = req.params;
  try {
    const snippet = await Snippet.findByPk(id);
    if (!snippet) return res.status(404).json({ error: "Snippet not found" });

    await snippet.destroy();

    // Invalidate cache
    await del(`snippet:${id}`);
    await delPattern("snippets:*");

    console.log("✅ Snippet deleted");
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet,
};