const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express();
app.use(bodyparser.json());
app.use(cors());

const port = 3000;
client.connect();

// Get all passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
});

// Save password
app.post('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult });
});

// Delete password by id
app.delete('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({ success: true, result: findResult });
});

// Update password by id
app.put('/:id', async (req, res) => {
    const { id } = req.params;  // Get the password ID from the URL
    const { site, username, password } = req.body;  // Get updated password details from the request body

    const db = client.db(dbName);
    const collection = db.collection('passwords');

    try {
        // Update the password document in MongoDB by matching the password id
        const result = await collection.updateOne(
            { _id: new MongoClient.ObjectId(id) },  // Ensure to match with the correct object ID
            { $set: { site, username, password } }  // Update the relevant fields
        );

        if (result.modifiedCount === 1) {
            res.status(200).send('Password updated successfully');
        } else {
            res.status(404).send('Password not found or no changes made');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating password');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
