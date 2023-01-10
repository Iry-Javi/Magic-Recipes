const express = require('express');
const router = express.Router();


const {isLoggedIn} = require("../middleware/index")

const Recipe =  require('../models/Recipe.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model')
const { isOwner } = require('../middleware/index');
const { isNotOwner } = require('../middleware/index');

router.get('/', (req, res, next) => {
  const  {cousine} = req.query
  if(cousine !== undefined) {
    console.log(req.query)
    Recipe.find({cousine})
    .then(recipes => {
      console.log(recipes.length)
      res.render('recipes/list', {recipes, user:req.session.currentUser})})
    .catch(err => console.log(err))
  }
  else{
    Recipe.find()
    .then(recipes => {
      console.log(recipes.length)
      res.render('recipes/list', {recipes, user:req.session.currentUser})})
    .catch(err => console.log(err))
  }
});
  
  
  


router.get('/create',  (req, res, next) => {
    console.log("when you click on create recipe", req.session.currentUser)
    res.render('recipes/create-form')
})


router.post('/create', async (req, res, next) => {
    const {cousine, title, imageUrl, duration, ingredients, preparation} = req.body;
  try{
    const user = await User.findById(req.session.currentUser._id)// finding the user at our database
    const recipe = await Recipe.create({cousine, title, imageUrl, duration, ingredients, preparation, owner:req.session.currentUser._id})//create the Recipe at our database
    user.recipes.push(recipe) // putting the recipe inside the user.recipes array
    await user.save() //save user

    res.redirect("/recipes")

  }
  catch(err){
    console.log(err)
  }
    



 /*    Recipe.create({
        title,
        preparation,
        imageUrl,
        owner: req.session.currentUser._id
    })
    .then((recipe) => user.recipes.push(recipe)  )
    .then(() => res.redirect('/recipes') )

    .catch(err => console.log(err)) */
})

router.get('/:id/edit', async (req, res, next) => {
    console.log("req.params",req.params)
    const { id } = req.params;
  
    const theRecipe = await Recipe.findById(id)
    if(theRecipe.owner.toString() === req.session.currentUser._id){
      Recipe.findById(id)
      .then(foundRecipe => res.render('recipes/update-form', foundRecipe))
      .catch(err => console.log(err))
    }else {
      res.redirect("/recipes" )
    }
   
  });
  
  router.post('/:id/edit', async (req, res, next) => {

    const { cousine, title, imageUrl, duration, ingredients, preparation } = req.body;

    const { id } = req.params;
  
    const theRecipe = await Recipe.findById(id)
    if(theRecipe.owner.toString() === req.session.currentUser._id){

        Recipe.findByIdAndUpdate(id, {cousine, title, imageUrl, duration, ingredients, preparation })

        .then(() => res.redirect('/recipes'))
        .catch(err => console.log(err))
      } 
    
  });
  
  router.post('/:id/delete', async (req, res, next) => {
    const { id } = req.params;
  
    const theRecipe = await Recipe.findById(id)
    
    if(theRecipe.owner.toString() === req.session.currentUser._id){
      Recipe.findByIdAndDelete(id)
      .then(() => res.redirect('/recipes'))
      .catch(err => console.log(err)) 
    } else {
      res.redirect("/recipes" )
    }
  
  });
  

  //////////////////////////////////////////////////

router.get('/:id/comment', isLoggedIn, isNotOwner, (req, res, next) => {

  const {id} = req.params

Recipe.findById(id)

  .then(foundRecipe => res.render('recipes/comment', foundRecipe))
  .catch(err => console.log(err))

});

router.post('/:recipeId/comment', (req, res, next) => {

  const {comment} = req.body
  console.log(comment)
  const userId = req.session.currentUser._id
  const {recipeId} = req.params
  console.log("USER ID", userId)

  if (!comment) {
      res.render('/:id/comment', { errorMessage: 'Please write a comment before sending the form.' });
      return;
    }

    Comment.create({user: userId, comment})
      .then((newComment) => {
        console.log(recipeId)
          Recipe.findById(recipeId)
          
              .then((commentedRecipe) => {
                  commentedRecipe.comments.push(newComment._id) 
                  commentedRecipe.save()
              })
              .catch(err => console.log(err))
      })
      .then(() => res.redirect('/recipes'))
      .catch(err => console.log(err))

});

  module.exports = router;
  