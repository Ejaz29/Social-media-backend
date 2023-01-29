const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const port = process.env.PORT;
mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log('DB connection successful');
});

app.listen(port, () => {
  console.log('listening on port number 3000');
});
