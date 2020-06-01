let mongoose = require('mongoose')
let Products = require('./models/ProductsSchema')


let fs=require('fs');
let data=fs.readFileSync('./db.json', 'utf8');

console.log(data)
/*
var _collection = JSON.parse(data);

var i;
var _Products = []
                 
 for(i=0;i<_collection.products.length;++i)
 {

    _Products.push({'title': _collection.products[i].title,
                    'type': _collection.products[i].type,
                    'price': _collection.products[i].price,
                    'stock':  _collection.products[i].stock})
    
 }

 Products.insertMany(_Products,function(err,docs){
    if(err)
    return console.error(err)
  
   })
*/

 