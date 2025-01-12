import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import userRouter from "./src/user/user_route.js";

const app = express(); //Creating express instance

try {    // connecting to DB
  connectDB();
  console.log("Connected to DB");
} catch (err) {
  console.error(err);
  process.exit(1);
}

app.use(express.json()); //Using Express Formator as middleware

app.use(cors()); //Using Cors Middleware


//Custom Middleware
const reqlogger = (req, res, next) => { 
  console.log(`${req.method}    ${req.url}  ${new Date().toISOString()}`);
 next();
};

//Calling Custom middleware Globally
app.use(reqlogger);

//Calling UserRouter Middleware
app.use("/user", userRouter);


//Get Router
app.get("/", (req, res) => {
  res.send("Hello I am Home Page");
});



//Error Handelling by express Defalut middleware
app.use((err, req, res, next) => {
 
  console.log(err.stack);
  const StatusCode = err.statusCode || 500;
  res.status(StatusCode).json({ Message: err.message });
});

const PORT = process.env.PORT || 4500;
//listening to a particular port after server Starts
app.listen(PORT, () => {
  console.log(`Server started at port : ${PORT}`);
});
