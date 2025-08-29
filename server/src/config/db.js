
import { Sequelize } from "sequelize";
// Create sequelize instance outside the function
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// Function to connect and sync
function connectionToDb() {
  sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.error("Database connection error:", err));

  sequelize
    .sync()
    .then(() => console.log("Database synchronized!"))
    .catch((err) => console.error("Sync error:", err));
}

export { connectionToDb, sequelize };