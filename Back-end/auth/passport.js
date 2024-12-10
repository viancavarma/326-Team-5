import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/SQLiteUsersModel.js";

dotenv.config(); //lodaing env vars from .env
.
passport.use( //used to auth users using their google account
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // This is the same URL that you specified in the Google Developers
      // Console. It is critical that you use the same URL here.
      callbackURL: "/auth/google/callback",
    },


    async (accessToken, refreshToken, profile, done) => { //happens when user successfully authed w/ google,
      let user = await User.findOne({ where: { googleId: profile.id } }); // user is either made or retrieved from the database
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          role: "user",
        });
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id)); //serialized id stored in session for retrieving user object

passport.deserializeUser(async (id, done) => { //retrieves user object from session by deserializing id; 
  const user = await User.findByPk(id); //user obj available in the req.user property in the request object
  done(null, user);
});

export default passport;
