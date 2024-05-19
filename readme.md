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
   ` npm install express bcrypt path dotenv`
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
11. setup a supabase database
   `npm install @supabase/supabase-js`
12. save your password and username in a notes page:
   `SUPABASE_URL = URL`
   `SUPABASE_KEY = KEY`
13. declare a func, connectDB that connects to db asynchronously
    ```c
   1. use try/catch method to handle errors
   2. export func
      const {createClient} = require('@supabase/supabase-js');
      require('dotenv').config();
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;
      const supabase = createClient(supabaseUrl, supabaseKey);
      module.exports = supaabse;
      ```
14. invoke DB in server.js and import bcrypt
   ```c
   const supabase = require('./db');
   const bcrypt = require('bcrypt');
   ```
### Add single password to db and a func to retrieve password
15. create a one-time function to store a hashed password to db. We will use bcrypt to store our password for security. Bcrypt is essentially an algorithm that takes in text and returns a randomly generated text. To learn more, watch: https://www.youtube.com/watch?v=O6cmuiTBZVs&t=189s
   ```c
   //in server.js
   async function storePassword(){
      try{
         const passwordToHash = 'secretPasword';
         const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(passwordToHash, 10);

         const {data, error} = await supabase
            .from('passwords')
            .insert([{hashed_password: hashedPassword}])

         if (error) {
            throw error;
         }
         console.log('password hashed and stored succesfully: ', data);
      } catch (error) {
         console.log('Error storing password:', error)
      }
   }
   //invoke function one time then delete
   storePassword();
   ```
16. check if password is stored succesfully in supabase
17. create a new file, verifyPassword.js and create a function that verifies user input
   ```c
   const bcrypt = require('bcrypt');
   const supabase = require('supabase');

   function serverMessage() {
      this.message = '';
   }
   serverMessage.prototype.newMessage = function(message){
      this.message = message;
   }

   async function verifyPassword(req, res, next){
      const message = new serverMessage();
      try {
         const { password } = req.body;
         if (!password) {
            serverMessage.newMessage = 'password is required';
            return res.status(400).json(serverMessage);
         } 

         //retrieve stored hashed password
         const {data, error} = await supabase
            .from('passwords')
            .select('hashed_password')
            .single();

         if (error) {
            throw erorr;
         }
         if(!data) {
            serverMessage.newMessage = 'Password not found';
            return res.status(404).json(serverMessage);
         }

         const hashedPassword = data.hashed_password;

         //verify if password provided is a match to hashed password
         const isMatch = await bcrypt.compare(password, hashedPassword);
         if(!isMatch) {
            serverMessage.newMessage = 'Invalid Password';
            return res.status(401).json(serverMessage);
         }

         //if password is connect, we can go to next middleware
         next();
      } catch(error) {
         next(error);
      }

   }

   module.exports = verifyPassword;
   ```
18. setup route in server.js to verify password. Import verifyPassword function

   ```c
   const verifyPassword = require('./verifyPassword);

   app.post('/secret', verifyPassword, (req, res) => {
      res.status(200).json({message: 'Password verified succesfully'});
   });
   ```

19. test with postman
   a. start your express server 
   b. use postmasn to send a POST request to 'localhost:8080/secret' with a JSON body containing the following:
   ```c
   {
      "password": "secretPassword"
   }






#code/stream