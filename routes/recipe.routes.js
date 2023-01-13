const express = require('express');
const router = express.Router();
const fileUploader = require("../config/cloudinary")

const {isLoggedIn} = require("../middleware/index")

const Recipe =  require('../models/Recipe.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model')
const { isOwner } = require('../middleware/index');
const { isNotOwner } = require('../middleware/index');
const { Error } = require('mongoose');


router.get('/', async (req, res, next) => {
  const  {cuisine} = req.query
  if(cuisine !== undefined) {
    console.log(req.query)
    Recipe.find({cuisine}).populate("comments")
    .then(recipes => {
      console.log(recipes.length)
      res.render('recipes/list', {recipes, user:req.session.currentUser})})
    .catch(err => console.log(err))
  }
  else{
    Recipe.find().populate("comments")
    .then(recipes => {
      console.log(recipes.length)
     
      // if it is add a property canEdit:true to the recipe
       res.render('recipes/list', {recipes, user:req.session.currentUser})})
    .catch(err => console.log(err))
  }

});
  

router.get('/create', isLoggedIn, (req, res, next) => {
    console.log("when you click on create recipe", req.session.currentUser)
    res.render('recipes/create-form')
})


router.post('/create', fileUploader.single("imageUrl"),  (req, res, next) => { //async
    const {cuisine, title, duration, ingredients, preparation} = req.body;
    console.log(req.file.path)

    User.findById(req.session.currentUser._id)
    .then((user)=>{
      Recipe.create({cuisine, title, imageUrl: req.file.path, duration, ingredients, preparation, owner:req.session.currentUser._id})
      .then((newRec) =>{
        console.log('my new recipe', newRec._id)
        user.recipes.push(newRec._id)
        user.save()
        res.redirect("/recipes")})
      })
      .catch((err) => console.log(err))

  })


router.get('/:id/edit', async (req, res, next) => {
    console.log("req.params",req.params)
    const { id } = req.params;
    
    const theRecipe = await Recipe.findById(id)
    console.log('recipe owner', theRecipe.owner)
    console.log('currentUser id', req.session.currentUser._id)
    if(theRecipe.owner && theRecipe.owner.toString() === req.session.currentUser._id){
      Recipe.findByIdAndUpdate(id)
      .then(foundRecipe => res.render('recipes/update-form', foundRecipe))
      .catch(err => console.log(err))
    }else {
      res.redirect("/recipes" )
    }
   
  });


  router.post('/:id/edit', fileUploader.single("imageUrl"), async (req, res, next) => {
    const { cuisine, title, existingImage, duration, ingredients, preparation } = req.body;
    console.log('req body', req.body)
    const { id } = req.params;
  
  
    let imageUrl;
    if (req.file) {
      const { path } = req.file;
      imageUrl = path;
    } else {
      imageUrl = existingImage;
    }
console.log(imageUrl)
    const theRecipe = await Recipe.findById(id)
    if(theRecipe.owner.toString() === req.session.currentUser._id){
        Recipe.findByIdAndUpdate(id, {cuisine, title, imageUrl, duration, ingredients, preparation })
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
  