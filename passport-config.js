//Required modules and initialize variables
const LocalStrategy = require('passport-local').Strategy
const argon2 = require('argon2');
const User = require('./models/User.js')

//Authenticates a user upon login and deauthenticates a user upon logout
function initialize(passport, getUserById) {

  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email }); //determines if a user with the input email exists
      if (!user) {
        console.log('No user found');
        return done(null, false, { message: 'No user with that email' })
      }

      const isValid = await argon2.verify(user.password, password); //creates a variable of whether the input password matches the stored hashes password in the database

      if (!isValid) {
        return done(null, false, { message: 'Password Incorrect' })
      }
      return done(null, user)

    } catch {
      return done(err)
    }
  }

  //Strategy of what input passport is looking for (password is an additional default input), and how the user will be authenticated.
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

  //sets users database _id to a cookie within users browser
  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })
  //finds the users cookie off the users _id
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })
}

//exposes passport initialize function to the rest of the application
module.exports = initialize;
