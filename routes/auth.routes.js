const bcrypt = require('bcryptjs');
const router = require("express").Router();
const saltRounds = 10;

const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut } = require('../middleware/index');

router.get("/signup", (req, res) => {
  res.render("auth/signup", { loggedIn: false} );
})
router.post("/signup", async (req, res ) => {
  const { username, password, email } = req.body;
 

  if (!username || !password || !email) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if(!regex.test(password)){
    res
    .status(500)
    .render("auth/signup", {errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'});
    return;
  }
  const passwordHash = await bcrypt.hash(password, saltRounds);

  User.create({username, email, password: passwordHash})
  .then((newUser) => {
    req.session.currentUser = {username: newUser.username};
    res.redirect(`/auth/login`)
  })
  .catch(err => console.log(err))
})

router.get("/login", (req, res) => {
  res.render("auth/login", { loggedIn: true} )
})
router.post("/login", (req, res ) => {
  const { username, password } = req.body;
  console.log('req.body', req.body)

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  User.findOne({ username })
  .then(user => { 
      console.log('user', user)
    if (!user) { 
      res.render('auth/login', { errorMessage: 'Username is not registered. Try with other email.' });
      return;
    } else if (bcrypt.compareSync(password, user.password)) { 

      
      req.session.currentUser =  user ; 
      console.log( "the req.sessio",req.session.currentUser)
      res.redirect('/auth/profile')
      
    } else {
      res.render('auth/login', { errorMessage: 'Incorrect password.' });
    }
  })
  .catch(error => console.log(error));
})


router.get("/profile", async (req, res) => {
  console.log(req.session.currentUser)
  const user = await User.findById(req.session.currentUser._id).populate("recipes")

  res.render("auth/profile", {user})

})

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/');
  });
});



module.exports = router;