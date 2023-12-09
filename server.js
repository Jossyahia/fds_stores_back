const express = require("express");
const cors = require("cors");
const app = express();
//app.use(cors());
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
//const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const apisRoutes = require("./routes/api");

//Use .env file in config folder
require("dotenv").config();

// Passport config
require("./config/passport")(passport);

//Connect To Database
//connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
//app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "ovap Technologies dope",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/api", apisRoutes);
app.use("/post", postRoutes);

//Server Running
const PORT = process.env.PORT || 2121;

const start = async () => {
  try {
    // connectDB
    await connectDB();
    app.listen(process.env.PORT, () =>
      console.log(`Server is runining and listening port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
