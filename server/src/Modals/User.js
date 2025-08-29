import { DataTypes }  from "sequelize"
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

(async () => {
  await sequelize.sync();
  console.log("✅ Synced User model with database");
})();

export default User;