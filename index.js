const express = require("express");
const { MongoClient, AggregationCursor } = require("mongodb");
const app = express();
const port = 3000;

const url = "mongodb://localhost:27017"; // Change this to your MongoDB connection string
const client = new MongoClient(url);

let postsCollection; // Define the collection outside route handlers

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db("ReduxDatabase"); // Replace 'mydatabase' with your database name
        postsCollection = db.collection("posts"); // Initialize the collection
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Call the connection function
connectToMongo();



app.get("/", async (req, res) => {
    try {
        res.status(200).send("hello dear Ibrahim");
    } catch (error) {
        res.status(500).json({ error: "Oh no, there was an error, try again." });
    }
});

// 


// Create a new post
app.post("/posts", async (req, res) => {
    try {
        const { name } = req.body;

        const result = await postsCollection.insertOne({ name });
        const post = result.ops[0];

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Oh no, there was an error, try again." });
    }
});

// Update a post by ID
app.put("/posts/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        const result = await postsCollection.findOneAndUpdate(
            { _id: id },
            { $set: { name } },
            { returnOriginal: false }
        );

        const post = result.value;

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Oh no, there was an error, try again." });
    }
});

// Delete a post by ID
app.delete("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await postsCollection.deleteOne({ _id: id });

        if (result.deletedCount === 1) {
            res.json({ message: "Post deleted successfully." });
        } else {
            res.status(404).json({ error: "Post not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Oh no, there was an error, try again." });
    }
});

// Get all posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await postsCollection.find().toArray();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Oh no, there was an error, try again." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
