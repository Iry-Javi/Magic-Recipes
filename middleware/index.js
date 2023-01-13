
const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect("/auth/login");
    }
    next();
  };
  


  const isOwner = (req, res, next) => {
    const recipeId = req.params
    const userId = req.session.currentUser._id

    Recipe.findById(recipeId)
      .then((foundRecipe) => {
        const recipeOwner = foundRecipe.owner
        if (recipeOwner === userId){
          next()
        }
      })
  }

  const isNotOwner = (req, res, next) => {
    if(req.session.currentUser && req.session.currentUser._id != req.params) {
      next ()
      
    }
    else {
      return res.redirect('/recipes/list');
      }
  }
   
  module.exports = {
    isLoggedIn,
    isOwner,
    isNotOwner
  };


