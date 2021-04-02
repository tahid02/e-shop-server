

const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
require('dotenv').config();
const { ObjectID } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z6ers.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("eShopDB").collection("eShopProducts");
  const orderCollection = client.db("eShopDB").collection("eShopOrders");

  console.log('database connected successfully')
  // perform actions on the collection object

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    // console.log('adding new event: ', newProduct)
    productCollection.insertOne(newProduct)
      .then(result => {
        // console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)

      })
  })

  app.get('/products', (req, res) => {

    productCollection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/checkOut/:id', (req, res) => {

    const id = ObjectID(req.params.id)
    // console.log(id)
    productCollection.find({ _id: id }).toArray((err, documents) =>  {
      res.send(documents[0])
    })

  })


  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log('adding new event: ', newOrder)
    orderCollection.insertOne(newOrder)
      .then(result => {
        // console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)

      })
  })


  app.get('/orders', (req,res) => {
    const queryEmail = req.query.email;
    orderCollection.find( {email: queryEmail} )
    .toArray( (err,documents) => {
      res.send(documents)
    })
  })

app.delete('/delete/:id',(req,res) =>{
  productCollection.deleteOne({ _id: ObjectID(req.params.id)})
  .then(result => res.send(result.deletedCount > 0))
})

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  //   client.close();
});




app.listen(port, () => {
  console.log(` listening at http://localhost:${port}`)
})