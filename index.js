const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());






const uri = "mongodb+srv://lamda:m49L1xNUzSOvbdfh@cluster0.j4ods.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('db connected')
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect();
        console.log('db connected');
        const EmployeeCollection = client.db('LamdaTask1').collection('employee');

        app.get('/employees', async (req, res) => {
            const query = {};
            const cursor = EmployeeCollection.find(query);
            const employees = await cursor.toArray();
            res.send(employees)

        })

        app.post('/employees', async (req, res) => {
            const employee = req.body;
            console.log('running');
            const result = await EmployeeCollection.insertOne(employee);
            res.send(result);
        })

        app.get('/employees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const employee = await EmployeeCollection.findOne(query);
            res.send(employee);
        })
        app.put('/employees/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: user
            }
            const employee = await EmployeeCollection.updateOne(filter, updateDoc, option)
            res.send(employee);
        })
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const employee = await EmployeeCollection.findOne(query);
            res.send(employee);
        })



    }
    finally {
        // await client.close()
    }
}



run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello From Lambda Task 1")
})
app.listen(port, () => {
    console.log(`Lamda task 1 is listening on port ${port} `)
})