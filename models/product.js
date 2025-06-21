const {mongoose } = require("mongoose");


const productsSchema = new mongoose.Schema({
  productName: String,
  productDescription:String,
  productCategory:String,
  rating:{type:Number,min:0,max:5},
  productImage:String,
  productPrice:Number
});


const product = mongoose.model('products', productsSchema);

module.exports=product;