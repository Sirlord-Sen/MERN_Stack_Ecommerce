const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require('dotenv').config();
// Including routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const shopRoutes = require("./routes/shop");
const brainTreeRoutes = require("./routes/braintree");

//app
const app = express();
   
//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}).then(()=>{
    console.log("Database connected!")
})

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// Routes Middlewares
app.use("/api", authRoutes); 
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", shopRoutes);
app.use("/api", brainTreeRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})