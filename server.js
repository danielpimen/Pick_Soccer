const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//DB Configuration
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log('Mongo Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello'));

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running on port ${port}`));