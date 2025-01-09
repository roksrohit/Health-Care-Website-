require('dotenv').config()
const express = require('express');
const app = express()
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('cookie-session');
const compression = require('compression');
const Patient = require('./models/patient');
const Doctor = require('./models/doctor');
const IndexRoutes = require('./routes/index');
const PatientRoutes = require('./routes/patient');
const DoctorRoutes = require('./routes/doctor');
const path = require('path');

app.use(compression())

// mongodb connection........
// mongoose.connect("mongodb://127.0.0.1:27017/healthcares").then(()=> console.log("Connected to Database"))
// .catch((err)=> console.log("Failed to Connected"));


mongoose.connect(process.env.MongodbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
}).then(()=> console.log("Connected to Database"))
.catch((err)=> console.log("Failed to Connected"));

// mongoose.connect(process.env.MongodbUrl, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useFindAndModify: false,
// })
// .then(() => {
//   console.log("Connected to MongoDB");
// })
// .catch((err) => {
//   console.error("Failed to connect to MongoDB:", err);
// });





app.use(express.static(`${__dirname}/public`, {
  maxAge: 86400000,
  setHeaders(res, path) {
    // Set the 'Expires' header to one day from now
    const expiresDate = new Date(Date.now() + 86400000); // current time + 1 day in milliseconds
    res.setHeader('Expires', expiresDate.toUTCString());
  },
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true, useNewUrlParser: true }));
app.use(methodOverride('_method'));



//  PASSPORT CONFIGURATION //
app.use(
  session({
    secret: 'Project Healthcare is Awesome!',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use('doctorlocal', new LocalStrategy(Doctor.authenticate()));
passport.use('patientlocal', new LocalStrategy(Patient.authenticate()));
 

passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser((id, done) => {
    Patient.findById(id, (err, patient) => {
    if (err) return done(err, null);
    if (patient) return done(null, patient);
    Doctor.findById(id, (error, doctor) => {
      if (error) return done(error, null);
      if (doctor) return done(null, doctor);
    });
  });
});

app.use(IndexRoutes);
app.use(PatientRoutes);
app.use(DoctorRoutes);

app.use((req, res) => {
  res.status(404).render('404');
});

 

const Port = 3000;

app.listen(Port, () => {
  console.log(`Server running on Port ${Port}`);
});

