
let express = require('express')
//let AWS = require('aws-sdk');
let mongoose = require('mongoose')
let Products = require('./ProductsSchema')
let fs = require('fs')
let bodyParser  = require("body-parser")
let Orders = require('./OrdersSchema')

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


/*
const s3 = new AWS.S3({
    AccessKeyID: 'AKIA44XOM6BBAFGN5LLX',
    SecretAccessKey: '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',
    Region: 'sa-east-1'
});
*/
async function UpdateDB () {
  /*
  try {
      const params = {
        Bucket: 'products.database.microverse',
        Key: 'db.json' 
      }
  
      const data = await s3.getObject(params).promise();
  
      return data.Body.toString('utf-8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
    */
   var data=fs.readFileSync('../db.json', 'utf8');
   var _collection = JSON.parse(data);
   
   var _Products = []
                    
    for(var i=0;i<_collection.products.length;++i)
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
   


  }

    UpdateDB(); 

app.get('/', function(req, res, next) {
  
  res.sendFile('index.html', { root: __dirname });
});

//1. Obtener el producto más caro
app.get('/ExpensiveProduct', function(req, res) {
 // Products.find({}).sort({"price" : -1.0}).limit(1)
 var query = Products.find({})
 query.sort({"price" : -1.0})
 query.limit(1)

 query.exec(function (err, docs) {
  //console.log(docs)
  res.json(docs)
});

})

//2. Obtener los 5 productos más baratos
app.get('/TopCheapProducts', function(req, res) {
  //Products.find({}).sort{"price" : 1.0}).limit(5);
  var query = Products.find({})
  query.sort({"price" : 1.0})
  query.limit(5)

  query.exec(function (err, docs) {
    //console.log(docs)
    res.json(docs)
  });

})

//3. Obtener la cantidad de productos por tipo
app.get('/ProductsByType', function(req, res) {
//Products.aggregate([{"$group" : {"_id" : {"type" : "$type"}, "COUNT(*)" : {"$sum" : NumberInt(1)}}},
// {"$project" : { "COUNT(*)" : "$COUNT(*)", "type" : "$_id.type", "_id" : NumberInt(0)}}], { "allowDiskUse" : true});
//[{'$group': {'_id': '$type','count': { '$sum': 1 }}  }]


  var query = Products.aggregate()
  query.group({'_id': '$type','count':{'$sum':1}})


  query.exec(function (err, docs) {
    //console.log(docs)
    res.json(docs)
  });

})


/*4. Realizar una compra de un producto

    Si hay stock, permitir la compra y restar la cantidad comprada

    Si no hay stock, se deberá arrojar un error acorde
*/
app.post('/BuyByID', function(req, res) {
// User, IDProducto, fechahora
 // console.log('POST')
  //console.log(req.body)
  //console.log(req.body.User)
  //console.log(req.body.IdProduct)

// db.getCollection("products").find({"_id" : ObjectId("5e040449f9280c53b4aed10f")}, {"stock" : 1.0});
var _id = req.body.IdProduct
var query = Products.findById(_id)


query.exec(function (err, docs) {
  if(err)
      res.status(500).send({ error: 'Producto Inexistente!' })
  else {
   // console.log(docs.stock)
    if (docs.stock > 0) {
      // registro la compra en la tabla Orders
      var _compra = new Orders()
      _compra.User = req.body.User
      _compra.IdProduct = req.body.IdProduct

      _compra.save(function(err){
        if (err) throw err; 
       })
       // Update al Stock
       //db.products.update({_id: ObjectId("5e04b61410a9383d50ac872a")},{$set: {"stock":2}})
       var queryUpdate = Products.findByIdAndUpdate(_id,{$set: {"stock": docs.stock - 1}})
       
       queryUpdate.exec(function (err, docs) {
        //console.log(docs)
        res.status(200).send({  message:'Operation was Successful' })
      });
       

    } 
    else {
      res.status(500).send({ error: 'Sin Stock!' })
    }
  }
})

})

//5. Búsqueda de productos por nombre
app.get('/SearchByName/:title', function(req, res) {
  // db.getCollection("products").find({ $text: { $search: "texto"}})
  //console.log('ID:', req.params.title);
  var query = Products.find({$text: {$search: req.params.title }})

  query.exec(function (err, docs) {
    //console.log(docs)
    res.json(docs)
  });

})

// Adicional 3 - Creación de producto
app.post('/InsertProduct', function(req, res) {
//title, type, price, stock
//console.log(req.body)
  var _product = new Products()
  _product.title = req.body.title
  _product.type  = req.body.type
  _product.price = req.body.price
  _product.stock = req.body.stock

  _product.save(function(err){
    if (err) res.status(500).send({ error: 'Error al crear Producto' });
    else  res.status(200).send({  message:'Operation was Successful' })
   })


})
  


app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
