import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "./auth/passport.js";
import routes from "./routes/ExpenseRoutes.js";

const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Use routes from ExpenseRoutes.js
app.use("/", routes);

// Starts Express
app.listen(3000, () => console.log("Server running on http://localhost:3000"));

export default app;
