import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.APP_PORT || 4000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port} 🚀`);
});
