
import { Sequelize } from "sequelize";
// Create sequelize instance outside the function
const databaseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_DB_URL  // Production environment
    : process.env.LOCAL_DB_URL; // Local/development environment

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {}, // No SSL for local
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