import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// socket
import { createServer } from "node:http";
import { Server } from "socket.io";
// routes
import poliRoutes from "./src/routes/Poli.js";
import screenRoutes from "./src/routes/Screen.js";
import hospitalRoutes from "./src/routes/Hospital.js";
// initial express app & socket
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// cors
app.use(cors());
// configure dotenv
dotenv.config();
// parsing json in server
app.use(express.json());
// routes
app.use("/api/poli", poliRoutes);
app.use("/api/screen", screenRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use((req, res, next) => {
  res.status(404).json({
    errMsg: "Endpoint not found",
  });
});
// connect to mongodb atlas/compas
// "mongodb://127.0.0.1:27017/medical"
const host = process.env.MONGO_URI;
const port = process.env.PORT;
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(host);
    console.log("connected to atlas/compass succcess");
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};

// socket init
io.on("connection", (socket) => {
  console.log("socket connected");
  // only trigger when print queue it's real time update poli
  socket.on("poli:print", () => {
    io.emit("poli:print");
  });
  // only trigger when ring queue it's realtime update poli at main screen
  socket.on("poli:ring", (activeNo) => {
    io.emit("poli:ring", activeNo);
  });
  // only trigger when ring queue it's realtime update poli at main screen
  socket.on("poliUpdated:ring", () => {
    io.emit("poliUpdated:ring");
  });
  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});
// start server and socket
server.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server running on http://localhost:${port}`);
});
// josse
// billionaireWFH100%
