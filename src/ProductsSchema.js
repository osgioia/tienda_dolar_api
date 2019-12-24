let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tienda_dolar_api', {useNewUrlParser: true, useUnifiedTopology: true} , function (err) {
 
    if (err) throw err;
  
    console.log('Successfully connected');
});


var ProductsSchema = new mongoose.Schema({
    title: String,
    type: String,
    price: Number,
    stock: Number,
    
   
  })
  ProductsSchema.index({'$**': 'text'})
  var Products =  mongoose.model("Products",ProductsSchema)

  module.exports = Products
 