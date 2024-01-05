const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require("dotenv").config();

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            bcrypt.compare(password, user.password, (err, res) => {
                console.log(password);

                if (res) {
                    // passwords match! log user in
                    console.log("match");
                    return done(null, user);
                } else {
                    console.log("no match");

                    // passwords do not match!
                    return done(null, false, { message: "Incorrect password" });
                }
            });
        } catch (err) {
            return done(err);
        }
    })
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JwtKey,
        },
        async function (jwtPayload, cb) {
            try {
                const user = await User.findById(jwtPayload.id);
                const userData = { id: user._id, username: user.username };
                return cb(null, userData);
            } catch (err) {
                return cb(err);
            }
        }
    )
);
passport.serializeUser(function (user, done) {
    // console.log(user);
    done(null, user._id);
});
passport.deserializeUser(async function (id, done) {
    // console.log(id);
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
