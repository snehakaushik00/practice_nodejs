const express = require("express");
const {connectMongoDb} = require("./connection");
const mongoose = require('mongoose');

const userRouter = require("./routes/user");

const { logReqRes } = require("./middlewares");

const app = express();
const PORT = 8000;

//connection
mongoose.connect("mongodb://127.0.0.1:27017/youtube-app-1").then(() => console.log("mongodb connected")
);






//middleware- plugin
app.use(express.urlencoded({extended: false}));
/*urlencoded -- yeh headers ko dekhte hi kam krte hai that kis trf ka data ara kis tarike se parse krna hai kya voh json data h ya image file kis trf ka data request se ara hai usko parse krke hamare request.body hame available krva deta hai*/


app.use(logReqRes("log.txt"));

 /* app.use((req,res,next) => {
  console.log("hello everyone middleware 1");
  req.myUserName = "piyushgarg.dev";
  next();
});

app.use((req,res,next) => {
  console.log("hello everyone middleware 2");
  next();
}); */


app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`))