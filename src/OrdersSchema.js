let mongoose = require('mongoose')

var OrdersSchema = new mongoose.Schema({
    User: Number,
    productID: String,
    DateTime: Date,
    
    
   
  })
 
  var Orders =  mongoose.model("Orders",OrdersSchema)

  module.exports = Orders
 