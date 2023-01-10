const express = require('express');
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn")

const Recipe =  require('../models/Recipe.model');

router.get('/', (req, res, next) => {
    Recipe.find()
    .then(recipes => res.render('recipes/list', {recipes, user:req.session.currentUser}))
    .catch(err => console.log(err))
});


router.get('/create',  (req, res, next) => {
    console.log("when you click on create recipe", req.session.currentUser)
    res.render('recipes/create-form')
})

router.post('/create', (req, res, next) => {
    const {title, preparation, imageUrl} = req.body;

    Recipe.create({
        title,
        preparation,
        imageUrl,
        owner: req.session.currentUser._id
    })
    .then(() => redirect('/recipes'))
    .catch(err => console.log(err))
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
    const { title, preparation, imageUrl } = req.body;
    const { id } = req.params;
  
    const theRecipe = await Recipe.findById(id)
    if(theRecipe.owner.toString() === req.session.currentUser._id){
        Recipe.findByIdAndUpdate(id, {title, preparation, imageUrl})
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
  
  module.exports = router;
  