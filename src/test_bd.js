let mongoose = require('mongoose')
let Products = require('./ProductsSchema')


var fs=require('fs');
var data=fs.readFileSync('../db.json', 'utf8');
var words = JSON.parse(data);

var i;
// var DBProduct = new Products(words)
var _Products = []
                 
 for(i=0;i<words.products.length;++i)
 {

    _Products.push({'title': words.products[i].title,
                    'type': words.products[i].type,
                    'price': words.products[i].price,
                    'stock':  words.products[i].stock})
    
 }

 Products.insertMany(_Products,function(err,docs){
    if(err)
    return console.error(err)
  
   })

 