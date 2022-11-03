const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

// middle wares
app.use(cors());
app.use(express.json());

//Database connection
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { RssFeedRounded } = require("@material-ui/icons");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.irpitar.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//Function for Creating collection to the database
async function run() {
  try {
    const serviceCollection = client.db("carServicea").collection("services");
    const orderCollection = client.db("carServicea").collection("orders");

    //get all data from db
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //get element by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    //Orders api : Create order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    //Get orders data from db by email query

    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    //Delete orders by specific id
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    //Update doc with status
    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };

      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("Car Doctor server is running");
});

app.listen(port, () => {
  console.log(`Car Doctor server running on ${port}`);
});
