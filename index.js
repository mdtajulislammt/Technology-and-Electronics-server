const express = require('express');
const  cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqui7fc.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const brandCollection = client.db("brandDB").collection("brand")
    const sellProductsCollection = client.db("sellItemsDB").collection("sellItems")
    const brandProductsCollection = client.db("brandProductsDB").collection("brandProducts")
    const myCartCollection = client.db("myCartsDB").collection("myCarts")

    //Sell Products  read
    app.get('/sellItems',async(req,res)=>{
      const sell = sellProductsCollection.find()
      const result = await sell.toArray();
      res.send(result)
    })
    //brand read
    app.get('/brand',async(req,res)=>{
      const brand = brandCollection.find()
      const result = await brand.toArray();
      res.send(result)
    })

    //brand Products read
    app.get('/brand/products',async(req,res)=>{
      const products = brandProductsCollection.find();
      const result = await products.toArray();
      res.send(result)
    })

    // get single product using id
    app.get("/brand/products/:id", async (req, res) =>{
      const id = req.params.id;
       const query = {
        _id: new ObjectId(id),
       }
       const result = await brandProductsCollection.findOne(query);
       res.send(result);
    })

    // update product 
    app.put("/brand/products/:id",async(req,res)=>{
      const id = req.params.id;
      const data = req.body;
      const options = {upset: true};
      const filter = {
        _id: new ObjectId(id),
       }
      const updateProduct = {
        $set:{
          name:data.name,
          brandname:data.brandname,
          type:data.type,
          price:data.price,
          description:data.description,
          rating:data.rating,
          img:data.img,
        }
      }
      const result = await brandProductsCollection.updateOne(filter,updateProduct,options);
      res.send(result);
    })




    //Add data singal post 
    app.post("/brand/products",async(req,res)=>{
      const addProduct = req.body;
      console.log(addProduct);
      const result = await brandProductsCollection.insertOne(addProduct)
      console.log(result);
      res.send(result)
    })
    

    //myCart data singal 
    app.post("/myCarts",async(req,res)=>{
      const myCarts = req.body;
      console.log(myCarts);
      const result = await myCartCollection.insertOne(myCarts)
      console.log(result);
      res.send(result)
    })

    app.get('/myCarts', async (req, res) =>{
      const myCart = myCartCollection.find();
      const result = await myCart.toArray();
      res.send(result)
    })

    // delete myCart 
    app.delete("/myCarts/:id", async (req, res) =>{
      const id = req.params.id;
       const query = {
        _id: new ObjectId(id),
       }
       const result = await myCartCollection.deleteOne(query);
       res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
     res.send(' Technology and Electronics server in running ')
});

app.listen(port,()=>{
     console.log(`server is running on port ${port}`)
})
