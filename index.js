const express = require("express");

const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 8000;

//connection
mongoose.connect("mongodb://127.0.0.1:27017/youtube-app-1")
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("Mongo error", err));

//schema
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
  },
  gender: {
    type: String,
  },
}, {timestamps: true}
);
const User = mongoose.model("user", userSchema);


//middleware- plugin
app.use(express.urlencoded({extended: false}));
/*urlencoded -- yeh headers ko dekhte hi kam krte hai that kis trf ka data ara kis tarike se parse krna hai kya voh json data h ya image file kis trf ka data request se ara hai usko parse krke hamare request.body hame available krva deta hai*/

app.use((req,res , next) => {
  fs.appendFile('log.txt', `${Date.now()}: ${req.ip} ${req.method}: ${req.path}`, (err, data) => {
    next();
  }
);
});

app.use((req,res,next) => {
  console.log("hello everyone middleware 1");
  req.myUserName = "piyushgarg.dev";
  next();
});

app.use((req,res,next) => {
  console.log("hello everyone middleware 2");
  next();
}); 


//Routes
app.get('/users', async(req,res) => {
  const allDBUsers = await User.find({});
  const html = `
  <ul>
  ${allDBUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
  </ul>`;
  res.send(html);
});

//if it is /api then it will thorough json data if uske agge /api nhi hai toh html data through karega
app.get("/api/users", async(req,res) => {
  const allDBUsers = await User.find({});
  /* res.setHeader('X-myName', 'Sneha kaushik'); //custom header
  //always add X to custom headers */
  return res.json(allDBUsers);
});

 /* app.get("/api/users/:id",(req,res)=>{
  const id = Number(req.params.id);
   const user = users.find(user => user.id === id);
  if(!user) return res.status(404).json({error: "user not found"});
  return res.json(user);
});  */

 app.post("/api/users", async(req,res) => {
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
 
 return res.status(201).json({msg: "Success"});

});

app.patch("/api/users/:id", (req,res) => {
  //todo: edit the user with id
  return res.json({status: "pending"});
});

app.delete("/api/users/:id", (req,res) => {
  //todo: delete the user with id
  return res.json({status: "pending"});
}) 

  //merge
  app.route('/api/users/:id').get(async(req,res)=>{const user = await User.findById(req.params.id);
 // const id = Number(req.params.id);
  // const user = users.find(user => user.id === id);
  if(!user) return res.status(404).json({error: "user not found"});
  return res.json(user);
})
.patch(async(req,res) => {
  //edit user with id
  await User.findByIdAndUpdate(req.params.id, { last_name: " changed"});
  return res.json({status: "success"});
})
.delete(async(req,res) => {
  //delete user with id
  await User.findByIdAndDelete(req.params.id);
  return res.json({status: "success"});
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`))