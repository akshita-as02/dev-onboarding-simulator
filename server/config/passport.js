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
  // Check if JWT_SECRET is available
  const secretOrKey = process.env.JWT_SECRET;
  if (!secretOrKey) {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
    // Set a temporary secret for development (not recommended for production)
    const tempSecret = 'temporary_dev_secret_' + Date.now();
    console.warn(`Using temporary secret: ${tempSecret}`);
    
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: tempSecret,
    };
    
    passport.use(
      new JwtStrategy(options, async (jwt_payload, done) => {
        try {
          // Always return false since we're using a temporary key
          return done(null, false);
        } catch (err) {
          console.error('Error in JWT strategy', err);
          return done(err, false);
        }
      })
    );
  } else {
    console.log('JWT_SECRET successfully loaded');
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretOrKey,
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
  }
};