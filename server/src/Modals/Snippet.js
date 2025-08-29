import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

function generateUniqueId(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const Snippet = sequelize.define("Snippet", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => generateUniqueId(Math.floor(Math.random() * (20 - 8 + 1)) + 8),
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.TEXT, allowNull: false },
}, {
  timestamps: true,
});

// Sync table automatically
(async () => {
  await Snippet.sync();
  console.log("✅ Snippet table ready");
})();

export default Snippet;
