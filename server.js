const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

const LoginSchema = new mongoose.Schema({
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const Login = mongoose.model('Login', LoginSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Missing fields');
  }

  await Login.create({ email, password });
  res.send('Data received and stored');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
