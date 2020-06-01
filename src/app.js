const express = require("express")
const fs = require("fs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotenv = require("dotenv");
let products = require("./models/ProductsSchema")
let orders = require("./models/OrdersSchema")

dotenv.config()
let app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


let urlMongo = "";

if (process.env.DB_USER) {
    urlMongo = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&w=1`;
} else {
    urlMongo = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}

mongoose.set("useCreateIndex", true);

mongoose.connect(urlMongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});



function UpdateDB() {
 
  let data = fs.readFileSync("./db.json", "utf8")
  let collection = JSON.parse(data)

  let articles = []

  for (let i = 0; i < collection.products.length; ++i) {
    articles.push({
      title: collection.products[i].title,
      type:  collection.products[i].type,
      price: collection.products[i].price,
      stock: collection.products[i].stock,
    })
  }

  
  products.insertMany(articles,  (err, docs) => {
    if (err) return console.error(err)
  })
}

 UpdateDB()

app.get("/", (req, res, next) => {
  res.sendFile("index.html", { root: __dirname })
})

//1. Obtener el producto más caro
app.get("/expensive_product", async (req, res) => {
  const product = await products.find({}).sort({ price: -1.0 }).limit(1).exec()
  
    res.json(product)
})

//2. Obtener los 5 productos más baratos
app.get("/top_cheap_products", async (req, res) => {
  const query = await products.find({}).sort({ price: 1.0 }).limit(5).exec()
  
    res.json(query)
  
})

//3. Obtener la cantidad de productos por tipo
app.get("/products_by_type", async (req, res) => {
  const query = await products.aggregate().group({ _id: "$type", count: { $sum: 1 } }).exec()

    res.json(query)
})

/*4. Realizar una compra de un producto

    Si hay stock, permitir la compra y restar la cantidad comprada

    Si no hay stock, se deberá arrojar un error acorde
*/

app.post("/buy_by_id", async (req, res) => {
  const _id = req.body.product_id
  const query = products.findById(_id)

  await query.exec( (err, docs) => {
      if (err) res.status(500).send({ error: "Producto Inexistente!" })
      else {
        if (docs.stock > 0) {
          let compra = new orders()
          compra.user = req.body.user
          compra.product_id = req.body.product_id

          compra.save(function (err) {
            if (err) throw err
          })
          let queryUpdate = products.findByIdAndUpdate(_id, {
            $set: { stock: docs.stock - 1 },
          }).exec( (err, docs) => {
            res.status(200).send({ message: "Operation was Successful" })
          })
        } else {
          res.status(500).send({ error: "Sin Stock!" })
        }
      }
  })
})

//5. Búsqueda de productos por nombre
app.get("/search_by_name/:title", async (req, res) => {
  const query = await products.find({ $text: { $search: req.params.title } }).exec()

    res.json(query)
})

// Adicional 3 - Creación de producto
app.post("/insert_product",  (req, res) => {
  let product = new products()
  product.title = req.body.title
  product.type = req.body.type
  product.price = req.body.price
  product.stock = req.body.stock

  product.save( (err) => {
    if (err) res.status(500).send({ error: "Error al crear Producto" })
    else res.status(200).send({ message: "Operation was Successful" })
  })
})

app.listen(3000, () => {
  console.log("App listening on port 3000!")
})
