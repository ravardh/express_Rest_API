import express from "express";
import { User } from "./user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/add", async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  //request Validation
  if (!name || !email || !password) {
    const error = new Error("All Feilds Required!!");
    error.statusCode = 400;
    next(error);
    return;
  }
  console.log("Creating User");
  //creating User
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      name,
      email,
      password: encryptedPassword,
    });
    res.status(201).json({ id: result._id });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and Password is Required !!");
    error.statusCode = 400;
    next(error);
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Inavlid Email or Password !!");
      error.statusCode = 401;
      next(error);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Inavlid Email or Password !!");
      error.statusCode = 401;
      next(error);
      return;
    }

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: 300,
    });
    console.log(token);
    res.status(200).json({ message: "Login Sucessfull", token });
  } catch (err) {
    next(err);
  }
});

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acess Denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Acess Denied" });
    }
    req.user = user;
    next();
  });
};

router.get("/view", authToken, async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.put("/update-name", authToken, async (req, res, next) => {
  const { newname } = req.body;
  if (!newname) {
    const error = new Error("New Name are Required !!");
    error.statusCode = 400;
    next(error);
    return;
  }

  try {
    const user = await User.findOneAndUpdate(
      req.user.userId ,
      { name: newname },
      { new: true }
    );

    if (!user) {
      const error = new Error("User Not Found");
      error.statusCode = 404;
      next(error);
      return;
    }

    res.status(200).json({
      message: "Name Updated Sucessfully",
      updatedUser: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
