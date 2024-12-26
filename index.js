import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.js";
import tourRouter from "./routes/tour.js";

const app = express();


app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/users", userRouter); // http://localhost:5000/users/signup
app.use("/tour", tourRouter);
app.get("/", (req, res) => {
  res.send("Welcome to Dress API");
});

const mongourl = "mongodb+srv://abdul:abdulhadhi@cluster0.eiczdgf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const port = 5000;

mongoose
  .connect(mongourl)
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
