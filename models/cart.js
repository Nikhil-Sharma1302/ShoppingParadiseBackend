const mongoose  = require("mongoose");


const cartSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]

});


const cart = mongoose.model('cart', cartSchema);

module.exports=cart;