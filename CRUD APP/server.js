const express = require("express")
const mongoose = require("mongoose")
const Product = require("./models/product");

const app = express();
// Connection to mongoDB.
const DB_URL = `mongodb+srv://crud:crud1234@products.6foe7z8.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(DB_URL)
    .then((results) => {
        const port = process.env.PORT || 7700;
        app.listen(7700, () => {
            console.log(`Listening on port: [${port}]`);
        });
    })
    .catch((error) => { })
//
app.use(express.json());
app.use(express.static('public'));
// For accepting form data.
app.use(express.urlencoded({ extended: true }));
// ROUTES...
// 
// Middleware...
app.use((req, res, next) => {
    const info = `
    [HOST: ${req.hostname}]
    [PATH: ${req.path}]
    [METHOD: ${req.method}]`;
    next();
})
// Responds with the home page.
app.get("/", (req, res) => {
    res.sendFile("./public/index.html", { root: __dirname })
})
// Getting all products.
app.get("/api/products/all", (req, res) => {
    Product.find()
        .then((results) => {
            res.json({ products: results, redirect: `/` })
        })
        .catch((error) => {
            res.json({ error: error })
        })
})

// Creating a new product to the database.
app.post("/api/products/create", (req, res) => {
    const { productName, productImage, currPrice, prevPrice, category, quantity } = req.body;
    const newProduct = new Product({
        productName,
        productImage,
        currPrice,
        prevPrice,
        category,
        quantity
    })
    newProduct.save()
        .then((results) => {
            res.json({ redirect: `/` })
        })
        .catch((error) => {
            res.json({ error: error })
        })
    // const product = new Product(req.body)
    // product
})
// Deleting a specific product by ID.
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
        .then((results) => {
            res.json({ product: results, redirect: `/` })
        })
        .catch((error) => {
            res.json({ error: error })
        })
})
// Updating a specific product by ID with new values.
app.put("/api/products/:id", (req, res) => {
    const id = req.params.id;
    Product.findByIdAndUpdate(id, req.body, { new: true })
        .then((results) => {
            res.json({ product: results, redirect: `/` })
        })
        .catch((error) => {
            res.json({ error: error })
        })
})







