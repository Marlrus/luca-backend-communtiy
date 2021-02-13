const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const enforce = require("express-sslify");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/question.routes.js");
// const { seedDb } = require("./seed");

require("dotenv").config();

const app = express();

//Body Parser Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Cross Origin Request
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

//Server
const port = process.env.PORT || 5000;

http
  .createServer(app)
  .listen(port, () => console.log(`Server running on port ${port}`))
  .on("error", (err) => {
    throw err;
  });

//DB CONNECTION
mongoose
  .connect(
    `mongodb+srv://admin:tfZ0Swt3uhxLRefK@lucabackendcommunity0.ximb6.mongodb.net/LucaBackendCommunity0?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log(`Mongoose Connected to: ${mongoose.connection.name}`);
    // Uncomment import and fn call to seedDb
    // seedDb();
  })
  .catch((err) => {
    console.log(`Error: ${err.message}`);
  });

//VIs

app.use("/question", questionRoutes);
