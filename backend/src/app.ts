import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

//Middleware
app.use(express.json());
app.use(cors());

routes(app);

//Listener
app.listen(1337, () => {
  console.log("Server is up on port 1337");
});
