const passport = require("passport");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy; // require or import the LocalStrategy
//LocalStrategy her is class from this strategy so i start with capital letter
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy; // 1.In middleware/passport.js require(import) JWTStrategy.
//2. We will create a JWT strategy instance, which takes two arguments, an options object and a callback function
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

//localStrategy function that we will call before signin function
const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },

  async (username, password, next) => {
    try {
      //1.check username
      const user = await User.findOne({ username: username }); // will search in DB about the username that the user try to enter in FrontEnd i cane search by id or username
      // if he found this username gothrow the code if not return a meg for the user
      if (!user) {
        return next({ msg: "Username or password is wrong!" });
      }
      //2. check password
      //bcrypt.compare(data to be encryp,encrypted data)
      //data to be encrypt her is password that user entered in the input filed in FrontEnd "password"
      // encrypted data here is the password that we encypte in signup function and save it in DB IN "user.password"
      //bcrypt.compair will encrypt the password and compair it with the password that we encrypted before by bcrypt.hash
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword == false) {
        return next({ msg: "Username or password is wrong!" });
      }
      next(false, user); // will go to next function when it false it mean their is No error So we can now add user as an object(username,password) to the req
    } catch (error) {
      next(error);
    }
  }
  //local
);

// JwtStrategy
const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, next) => {
    //Her we will check if the token is expired or not
    if (Date.now() > payload.exp) {
      return next(null, false); // this will throw a 401
    }
    try {
      const user = await User.findById(payload._id);

      if (!user) {
        return next({ msg: "User not found!" });
      }
      next(null, user); // if there is no user, this will throw a 401
    } catch (error) {
      next(error);
    }
    // Remmember that localStrategy is amiddleware function that i call before signin/login function just to check if the username and password are already saved in DB before
    // now i will call it in app.js 1. app.use(pasport.initialize())
    //2. app.use("local",localStrategy)
  }
);
module.exports = { localStrategy, jwtStrategy };
