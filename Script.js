const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/product");
const Cart = require("./models/cart");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/facebook")
  .then(() => console.log("MongoDB connected to 'facebook'"))
  .catch((err) => console.error("Connection error:", err));

app.post("/sign", async (req, res) => {
    console.log(req.body);
  try {
    
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send("The data is submitted");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.get("/check", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port 5000");
});
 
app.post("/addProduct",async(req,res)=>{
    try{
        const {productName, productDescription,productCategory,rating,productImage,productPrice} = req.body;
   const newProduct = new Product({productName, productDescription,productCategory,rating,productImage,productPrice});
   await newProduct.save();
    res.send("The data is submitted");
    }catch(error){
        res.status(500).send("Server error")
    }
})
app.get("/product",async(req,res)=>{
  const product =await Product.find({});
  res.send(product);
})
app.post("/editproduct",async(req,res)=>{
  const edit = await Product.findOneAndUpdate({"_id":req.body._id},{$set :{productDescription:req.body.productDescription,prodductName:req.body.prodductName,productPrice:req.body.productPrice,productImage:req.body.productImage,rating:req.body.rating}})
  if(edit){
    res.json({
      status: true,
      message: "Data Updated Successfully !"
    })
  } else{
    res.json({
      status:false
    })
  }
})

app.post("/deleteproduct",async(req,res)=>{
  const edit = await Product.findOneAndDelete({"_id":req.body._id});
  if(edit){
    res.json({
      status: true,
      message: "Data Deleted Successfully !"
    })
  } else{
    res.json({
      status:false
    })
  }
})

app.post("/addToCart", async (req, res) => {
  try {
    const { userEmail, productId } = req.body;

    let cart = await Cart.findOne({ userEmail });

    if (cart) {
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

      if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      await cart.save();
    } else {
      const newCart = new Cart({
        userEmail,
        products: [{ productId, quantity: 1 }]
      });
      await newCart.save();
    }

    res.json({ status: true, message: "Product added to cart" });

  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

app.post("/getCart", async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ status: false, message: "Missing userEmail" });
    }


    const cart = await Cart.findOne({ userEmail }).populate("products.productId");

    res.json({ status: true, cart });

  } catch (error) {
    console.error("ERROR in /getCart:", error.message);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});

app.post("/updateCart", async (req, res) => {
  const { userEmail, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userEmail });

    if (!cart) return res.json({ status: false, message: "Cart not found" });

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      if (quantity <= 0) {
        cart.products.splice(productIndex, 1); 
      } else {
        cart.products[productIndex].quantity = quantity;
      }
      await cart.save();
      res.json({ status: true, message: "Quantity updated" });
    } else {
      res.json({ status: false, message: "Product not in cart" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
});

app.post("/deleteCart", async (req, res) => {
  const { userEmail, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userEmail });

    if (!cart) return res.json({ status: false, message: "Cart not found" });

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
     cart.products.splice(productIndex, 1); 
      await cart.save();
      res.json({ status: true, message: "Product Deleted" });
    } else {
      res.json({ status: false, message: "Product not in cart" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server error" });
  }
});

