const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;


// middlewares
app.use(cors());
app.use(express.json());


app.get("/" , (req , res) => {
    res.send("Server in running")
})


// H0zIWLDrQ7nMYHhF


const uri = "mongodb+srv://itzmesojib:H0zIWLDrQ7nMYHhF@cluster0.akmb2x3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

        // -------------------------- database add and collections ---------------------

        const spotsCollection = client.db("spotsDb").collection("spots");
        const countrysCollection = client.db("spotsDb").collection("countrys");

            // ------------------ spots add and getter --------------------------------
    app.post("/spots" , async(req , res) => {
        const newSpot = req.body;
        console.log(newSpot);
        const result = await spotsCollection.insertOne(newSpot);
        res.send(result);
        })
        // ------------------country getter ---------------------
        app.post("/countrys" , async(req , res) => {
            const newCountry = req.body;
            console.log(newCountry);
            const result = await countrysCollection.insertOne(newCountry);
            res.send(result);
        })
        // ------------------- spots update ----------------
        app.put("/spots/:id" , async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const updateSpot = req.body;
            const Spot = {
                $set: {
                    user_name: updateSpot.user_name,
                    tourists_spot_name: updateSpot.tourists_spot_name,
                    country_Name: updateSpot.country_Name,
                    location: updateSpot.location,
                    average_cost: updateSpot.average_cost,
                    seasonality: updateSpot.seasonality,
                    travel_time: updateSpot.travel_time,
                    totalVisitorsPerYear: updateSpot.totalVisitorsPerYear,
                    image: updateSpot.image,
                    details: updateSpot.details,
                }
            }
            const result = await spotsCollection.updateOne(filter, Spot, options);
            res.send(result);
        })
        // ----------- spot delete------------------------
        app.delete("/spots/:id", async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const result = await spotsCollection.deleteOne(filter);
            res.send(result);
        })
        // ------------------------- all spots find --------------------
        app.get("/spots", async(req, res) => {
            const allSpots = await spotsCollection.find({}).toArray();
            res.send(allSpots);
        })
        // ------------------- all country find --------------------
        app.get("/countrys" , async(req, res) => {
            const allCountry = await countrysCollection.find({}).toArray();
            res.send(allCountry);
        })
// ---------------------- spots details get --------------------
app.get("/spotDetails/:id" , async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await spotsCollection.findOne(query);
    res.send(result);
})
// ------------------------- spots find by email ------------------------
app.get("/my-spots/:email" , async(req, res) => {
    const mySpots = await spotsCollection.find({ email: req.params.email }).toArray();
    res.send(mySpots);
})
// --------------------- spots find by id ------------------------
app.get("/spots/:id" , async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await spotsCollection.findOne(query);
    res.send(result);
})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port , () => {
    console.log(`Server is running on port ${port}`)
})