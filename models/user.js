const {mongoose } = require("mongoose");


const usersSchema = new mongoose.Schema({
  name: String,
  email:String,
  password:String,
});


const user = mongoose.model('signup', usersSchema);

module.exports=user;