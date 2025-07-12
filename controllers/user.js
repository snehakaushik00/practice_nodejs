const User = require('../models/user');


async function handleGetAllUsers(req,res){
  const allDBUsers = await User.find({});
  return res.json(allDBUsers);
}

async function handleGetUserById(req, res){
  const user = await User.findById(req.params.id); 
  if(!user) return res.status(404).json({error: "user not found"});
  return res.json(user);
}

async function handleUpdateUserById(req, res){
   await User.findByIdAndUpdate(req.params.id, { last_name: " changed"});
  return res.json({status: "success"});
}

async function handleDeleteUserById(req,res){
  await User.findByIdAndDelete(req.params.id);
  return res.json({status: "success"});
}

async function handleCreateNewUser(req,res){
  const body = req.body;
 if(!body ||
    !body.first_name ||
    !body.email ||
    !body.gender ||
    !body.last_name ||
    !body.job_title
  ){
  return res.status(400).json({msg: "all fields are required"});
 }
 const result = await User.create({
  first_name:body.first_name,
  last_name:body.last_name,
  email:body.email,
  gender:body.gender,
  jobTitle:body.job_title,
 });
 
 return res.status(201).json({msg: "Success", id: result._id});
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
}