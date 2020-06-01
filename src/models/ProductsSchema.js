const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductsSchema = new Schema({
    title: String,
    type: String,
    price: Number,
    stock: Number,
  })

  ProductsSchema.index({'$**': 'text'})
  
  module.exports = mongoose.model("Products",ProductsSchema)
 