const path =  require('path');
const express= require('express');
const supabase = require('./db');
const bcrypt = require('bcrypt');
const verifyPassword = require('./verifyPassword');

const app = express(); //instantiates express
const PORT = process.env.PORT || 8080; //port at which server is listening

// async function storePass(){
//   try {
//     const passwordToHash = 'secretPass';
//     const saltRounds = 10; 
//     const hashedPassword = await bcrypt.hash(passwordToHash, saltRounds);

//     const {data, error} = await supabase
//       .from('passwords')
//       .insert([
//        { hashed_password : hashedPassword }
//       ]);

//       if (error) {
//         throw error;
//       }

//       console.log('password stored succesfully: ', data);

//   } catch(error) {
//     console.log('error storing password: ', error);
//   }
// }

// storePass();


//allows express to parse incoming data from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.post('/secret', verifyPassword, (req, res) => {
  return res.status(200).json({message: 'Password verified succesfully'});
} )

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

