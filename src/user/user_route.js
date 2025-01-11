import express from "express";
import { User } from "./user_model.js";

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
    const result = await User.create({
      name,
      email,
      password,
    });
    res.status(201).json({ id: result._id });
  } catch (err) {
    next(err);
  }
});

router.get("/view", async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
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

    if (user.password !== password) {
      const error = new Error("Inavlid Email or Password !!");
      error.statusCode = 400;
      next(error);
      return;
    }

    res.status(200).json({ message: "Login Sucessfull" });
  } catch (err) {
    next(err);
  }
});

router.put("/update-name", async (req, res, next) => {
  const { email, newname } = req.body;
  if (!email || !newname) {
    const error = new Error("Email and New Name are Required !!");
    error.statusCode = 400;
    next(error);
    return;
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
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

