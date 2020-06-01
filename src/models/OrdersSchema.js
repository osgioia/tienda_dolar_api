const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrdersSchema = new Schema({
    user: Number,
    product_id: String,
    createdAt: { type: Date, default: Date.now },
  })
 
  module.exports = mongoose.model("Orders",OrdersSchema)
 