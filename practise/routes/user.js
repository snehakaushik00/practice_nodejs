const express = require("express");
const {handleGetAllUsers, handleGetUserById, handleUpdateUserById, handleDeleteUserById,handleCreateNewUser} = require('../controllers/user');


const router = express.Router();

//Routes


//if it is /api then it will thorough json data if uske agge /api nhi hai toh html data through karega
router.route("/")
.get(handleGetAllUsers)
.post(handleCreateNewUser);

router
  .route('/:id')
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);
  
router.post("/", handleCreateNewUser);



module.exports = router;