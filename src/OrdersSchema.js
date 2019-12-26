let mongoose = require('mongoose')

var OrdersSchema = new mongoose.Schema({
    User: Number,
    productID: String,
    createdAt: { type: Date, default: Date.now },
    
    
   
  })
 
  var Orders =  mongoose.model("Orders",OrdersSchema)

  module.exports = Orders
 