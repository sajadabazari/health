require('dotenv').config({ path: __dirname + '/.env' })
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const { connectToDB } = require("./config/db");

//Routes _Admin
const mainRoutes = require("./routes/mainRoutes");
const vaccineRoutes = require("./routes/vaccineRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const healthCenterRoutes = require("./routes/healthCenterRoutes");
const questionRoutes = require("./routes/questionRoutes");

//Routes _Patient
const mainPatientRoutes = require("./routes/patient/mainPatientRoutes");

//Routes _Employer
const mainEmployerRoutes = require("./routes/employer/mainEmployerRoutes");

const { errorHandler } = require('./middlewares/errors');
const {initialSeeder} = require('./seeders/initialSeeder');

const app = express();

require('./controllers/userController');

//──── Server Port
const port = process.env.PORT || 4000;


//──── Static Folder
app.use(express.static(path.join(__dirname, 'public')));


//────Template Engine
app.set("view engine", "ejs");
app.set("views", "views");

//──── Middlewares

//app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge:  600000 }
  }))
//──── Routes
app.use(mainRoutes);
app.use(vaccineRoutes);
app.use(reportRoutes);
app.use(userRoutes);
app.use(patientRoutes);
app.use(healthCenterRoutes);
app.use(questionRoutes);
/// Patient User Routes
app.use(mainPatientRoutes);
/// Employer Routes
app.use(mainEmployerRoutes);

//──── Error Handler Middleware
app.use(errorHandler);
 app.use((req,res)=>{
    res.render('404');
});

connectToDB()
    .then((result) => {
        console.log(`Connected To Database`);
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
 
            initialSeeder();
        });
    })
    .catch(err => {
        console.log(err);
    });



