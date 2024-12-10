import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/SQLiteUsersModel.js";

dotenv.config();

const factoryResponse = (status, message) => ({ status, message });

const existsUser = async (username) => {
  const user = await User.findOne({ where: { username } });
  return user;
};

export const register = async (req, res) => { //route creates new user in database
  const { username, password } = req.body;

  if (await existsUser(username))
    return res.status(400).json(factoryResponse(400, "Username already taken"));

  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, password: hash });
  res.json(factoryResponse(200, "Registration successful"));
  console.log("User registered successfully");
};

export const login = async (req, res, next) => { //route checks user's credentials and logs them in
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json(factoryResponse(401, "Invalid credentials"));
  }

  // user obj serialized and stored in session, accessable using req.user
  req.login(user, (err) => 
    err ? next(err) : res.json(factoryResponse(200, "Login successful"))
  );
};

export const logout = (req, res) => { //route logs out user with the req.logout() func from Passport
  req.logout(function (err) {
    if (err) {
      res.json(factoryResponse(500, "Logout failed"));
      return;
    }
    res.json(factoryResponse(200, "Logout successful"));
  });
};

export const googleAuthCallback = (req, res) => { // google authentication callback route called by google after user auth's redirecting to home page
  res.redirect("/");
};

export const getProfile = (req, res) => { //profile route uses isAuthenticated for 
  res.json(factoryResponse(200, `Welcome to Budget Better, ${req.user.username}`)); //returns a welcome message
};
