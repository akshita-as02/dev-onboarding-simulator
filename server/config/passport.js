// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const User = require('../models/user.model');

// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.JWT_SECRET,
// };

// module.exports = (passport) => {
//   passport.use(
//     new JwtStrategy(options, async (jwt_payload, done) => {
//       try {
//         const user = await User.findById(jwt_payload.id);
//         if (user) {
//           return done(null, user);
//         }
//         return done(null, false);
//       } catch (err) {
//         console.error('Error in JWT strategy', err);
//         return done(err, false);
//       }
//     })
//   );
// };

// server/config/passport.js
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');

module.exports = (passport) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set. Please check your .env file.');
  }
    
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
    };
    
    passport.use(
      new JwtStrategy(options, async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id);
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (err) {
          console.error('Error in JWT strategy', err);
          return done(err, false);
        }
      })
    );
};