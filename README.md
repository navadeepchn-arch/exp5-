# Experiment 5

## Title
Club all the experiments in Experiment 5 as a single experiment.

## Description
This project implements a MongoDB + Mongoose experiment dashboard using HTML, CSS, and vanilla JavaScript. The dashboard serves as a launcher for three separate experiments:
1. **Experiment 5.1 – Mongoose CRUD — Product Catalog**
2. **Experiment 5.2 – Student Management System (MVC Pattern)**
3. **Experiment 5.3 – Product Catalog with Nested Schema, Aggregation & Stock Management**

The dashboard simulates the MongoDB/Mongoose functionality of each experiment in the browser. Each experiment runs independently with its own logic demonstrating core Mongoose ODM concepts including schema design, validation, middleware, nested documents, and aggregation pipelines.

## Learning Outcomes
- Connect a Node.js application to MongoDB using the Mongoose ODM.
- Define Mongoose schemas with validation rules, default values, and enum constraints.
- Implement full CRUD operations using Mongoose methods: `save()`, `find()`, `findById()`, `findByIdAndUpdate()`, and `findByIdAndDelete()`.
- Apply the MVC (Model-View-Controller) design pattern to structure a backend application.
- Design nested schemas with embedded sub-documents and arrays in MongoDB.
- Use Mongoose pre-save middleware to automatically compute and update derived fields.
- Write and execute MongoDB aggregation pipelines using `$unwind`, `$match`, `$group`, `$sort`, and `$avg`.
- Manage variant-level stock using `$set` and `$inc` operators on nested document fields.
- Prepare submission-ready structured backend projects for lab and viva.

## Tech Stack
- Node.js 18+
- Express.js
- MongoDB
- Mongoose ODM
- HTML5
- CSS3
- JavaScript (Vanilla)

## Demo URL
[https://25bcc80001-experiment5.netlify.app/]

## How to Run Locally

### Prerequisites
Make sure MongoDB is running before starting any experiment.
```bash
# Start MongoDB
mongod
```

### Experiment 5.1 – Mongoose CRUD Product Catalog
```bash
cd exp5.1
npm install
node server.js
```
Test endpoints at `http://localhost:3000` using Postman or browser.

### Experiment 5.2 – Student Management System
```bash
cd exp5.2
npm install
node server.js
```
Test endpoints at `http://localhost:3000` using Postman.

### Experiment 5.3 – Nested Schema & Aggregation
```bash
cd exp5.3
npm install
node server.js
```
Test endpoints at `http://localhost:3000` using Postman.

> Make sure MongoDB is running before starting any experiment.
> Start MongoDB: open terminal and run `mongod`
> Default MongoDB connection: `mongodb://localhost:27017`

## GitHub Repository
[https://github.com/navadeepchn-arch/Experiment-5]