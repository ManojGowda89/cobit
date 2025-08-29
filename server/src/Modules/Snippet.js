
import { Sequelize } from "sequelize"
import Snippet from "../Modals/Snippet.js"

// --- Functions ---
const getSnippets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    let whereClause = { visibility: "public" };

    if (search) {
      whereClause[Sequelize.Op.or] = [
        { title: { [Sequelize.Op.iLike]: `%${search}%` } },
        { description: { [Sequelize.Op.iLike]: `%${search}%` } },
        { id: { [Sequelize.Op.iLike]: `%${search}%` } } // <-- search by ID
      ];
    }

    const count = await Snippet.count({ where: whereClause });

    const snippets = await Snippet.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      attributes: { exclude: ["userInfo", "visibility"] },
    });

    console.log("snippets fetched");
    res.json({
      snippets,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
        hasMore: page < Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching snippets:", err);
    res.status(500).json({ error: err.message });
  }
};

const getSnippetById = async (req, res) => {
  const { id } = req.params;
  try {
    const snippet = await Snippet.findByPk(id, {
      attributes: { exclude: ["visibility"] }, // keep excluding visibility
      raw: true, // flatten values instead of Sequelize instance
    });

    if (!snippet) return res.status(404).json({ error: "Snippet not found" });

    // Extract only what you need
    const response = {
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      username: snippet.userInfo?.username || "Guest", // only username
      createdAt: snippet.createdAt,
      updatedAt: snippet.updatedAt,
    };

    console.log("snippet fetched");
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSnippet = async (req, res) => {
  const { title, description, code } = req.body;
  try {
    const snippet = await Snippet.create({ title, description, code });
    console.log("snippet created");
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSnippet = async (req, res) => {
  const { id } = req.params;
  const { title, description, code } = req.body;

  try {
    const snippet = await Snippet.findByPk(id);

    if (!snippet) return res.status(404).json({ error: "Snippet not found" });

    await snippet.update({ title, description, code });

    // Shape response just like getSnippetById
    const response = {
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      username: snippet.userInfo?.username || "Guest", // 👈 only username
      createdAt: snippet.createdAt,
      updatedAt: snippet.updatedAt,
    };

    console.log("snippet updated");
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSnippet = async (req, res) => {
  const { id } = req.params;
  try {
    const snippet = await Snippet.findByPk(id);
    if (!snippet) return res.status(404).json({ error: "Snippet not found" });
    await snippet.destroy();
    console.log("snippet deleted");
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