const express = require("express");
const connectDB = require("./config/database.js"); // Get the function
const app = express();
const User = require('./model/userschema');
app.use(express.json());


connectDB()
  .then(() => {
    console.log("Datbase is connected");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch(() => {
    console.log("Datbase is not connected");
  });



app.post('/signin', async (req, res) => {
  // console.log("Body",req.body);
  try {
    // const { firstName, lastName, email, age, password, type } = req.body;
    // const data = {
    //   firstName:"Abdullah",
    //   lastName:"Manan",
    //   email:"abdullahmanan@gmail.com",
    //   age:20,
    //   password:"123456",
    //   gender:"male",
    // };
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User saved successfully', user });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: 'Error saving user', details: error.message });
  }
});


