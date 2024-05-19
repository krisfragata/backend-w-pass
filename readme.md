# How to build a backend that takes in a secure password
### Goals
1. Setup a database to store password using mongodb
2. setup a backend with express
   1. setup a hashed password system
3. connect the frontend with the backend

### disclaimer
* must download node.js and npm 
* [Downloading and installing Node.js and npm | npm Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
## Video 1
Goals: 
* setup boilerplate files and start server 
* connect to a database and store a password in the database
### preliminary setup
1. create a backend folder and cd into it
   ` cd backend `
2. install a node package and initiate node package modules
   ` npm init -y`
3. download express, mongoose, bcrypt as a dependency
   ` npm install express mongoose bcrypt path dotenv`
4. download nodemon as a dev dependency
   ` npm install -D nodemon`
5. add scripts to package.json
   ` “dev”: “nodemon server.js” `
6. create following files: server.js, db.js, .env
7. outside the backend folder create a .gitignore file and make sure to ignore .env and node_modules
   ```c
   backend/node_modules
   .env 

### server setup
8. setup server by importing path, express,
   ` const path =  require('path'); `
   ` const express= require('express');`
9. The following lines of code are general boilerplate
   ```c
   import path from 'path';
   import express from 'express';

   const app = express(); //instantiates express
   const PORT = process.env.PORT || 8080; //port at which server is listening

   //allows express to parse incoming data from frontend
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));


   // catch-all route handler for any requests to an unknown route
   app.use((req, res) => res.status(404).send('Page not found'));

   //global error handler
   app.use((err, req, res, next) => {
   const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
   };
   const errorObj = Object.assign({}, defaultErr, err);
   console.log(errorObj.log);
   return res.status(errorObj.status).json(errorObj.message);
   });

   app.listen(PORT, ()=>{
      console.log('Server is running on port: ', PORT)
   })

10. load static files
   `app.use(express.static(path.join(__dirname, '../public')));`

### set up database
11. setup a mongodb database
12. save your password and username in a notes page:
   `const mongoose = require('mongoose');`
   `require('dotenv').config;`
13. declare a func, connectDB that connects to db asynchronously
    ```c
   1. use try/catch method to handle errors
   2. export func
      const connectDB = async () => {
      try{
      await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'test',
      writeConcern: { w: 'majority' },
      })
      console.log('connected to MongoDB')
      }
      catch(error){
         console.log('Error connecting to MongoDB: ', error)
      }
      }
      module.exports = connectDB;
      ```
14. invoke DB in server.js
    `const connectDB = require('./db'); `
    ` connectDB(); `
15. add uri to .env file





#code/stream