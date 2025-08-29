import { createApp } from '../mjs/server.config.js';
const { app, PORT } = createApp();
import { connectionToDb} from "./src/config/db.js"
import router from './src/main.js';
connectionToDb();
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
