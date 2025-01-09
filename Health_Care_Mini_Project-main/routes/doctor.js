const express = require('express');
const passport = require('passport');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');

const { ConvertChosenTime, convert, isLoggedIn, isAuthorizedDoctor,} = require('./helper');

const router = express.Router({ mergeParams: true });

// GET ROUTES

router.get('/doctorregistration', (req, res) => {
  const data = {};
  data.user = req.user;
  
  res.render('doctorregistration', { data });
});


router.get('/doctorlogin', (req, res) => {
  const data = {};
  data.user = req.user;
  
  res.render('doctorlogin', { data });
});

router.get('/doctorhome', isLoggedIn, (req, res) => {
  const futureappointment = [];
  
  const data = {};
  

  const SearchAppointmentPromise = new Promise((resolve, reject) => {
    Appointment.find({ DoctorId: req.user._id })
      .populate('PatientId')
       
      .exec((err, appointment) => {
        if (err) {
          reject(err);
        } else {
          resolve(appointment);
        }
      });
  });
  
  SearchAppointmentPromise.then((result) => {
    result.forEach((item) => {
      const obj = {};

      // date1: Appointment time
      const date1 = new Date(item.AppointmentDate);

      // date2: Current date
      const date2 = new Date();

      obj.PatientId = item.PatientId._id;
      obj.DoctorId = item.DoctorId;
      obj.AppointmentId = item._id;
      obj.AppointmentDate = convert(item.AppointmentDate);
      obj.AppointmentTime = ConvertChosenTime(item.AppointmentDate);
      obj.Disease = item.Disease;
      obj.Status = item.Status;
      obj.SerialNumber = item.SerialNumber;
      obj.PatientName = item.PatientId.name;
      obj.PatientPhone = item.PatientId.phone;
      
      if (date1.getTime() > date2.getTime()) {
        futureappointment.push(obj);
      }  
    });
  }).catch((error) => {
    console.log(`Error From promise ${error}`);
  });

  Promise.all([SearchAppointmentPromise])
    .then((result) => {
      data.user = req.user;
      data.futureappointment = futureappointment;
      
      console.log(result);
      res.render('doctorhome', { data });
    })
    .catch((error) => {
      console.log(`Error From promise ${error}`);
    });
});

router.get('/doctorhome/:appointmentid/accept', isLoggedIn, (req, res) => {
  Appointment.findByIdAndUpdate(
    req.params.appointmentid,
    { Status: 'accepted' },
    { new: true },
    (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/doctorhome');
    }
  );
});

router.get('/doctorhome/:appointmentid/reject', isLoggedIn, (req, res) => {
  Appointment.findByIdAndUpdate(
    req.params.appointmentid,
    { Status: 'rejected' },
    { new: true },
    (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/doctorhome');
    }
  );
});

 
 
router.get('/doctorhome/:doctorid/edit', isAuthorizedDoctor, (req, res) => {
  const ShowDoctorPromise = new Promise((resolve, reject) => {
    Doctor.findById(req.params.doctorid).exec((err, item) => {
      if (err) {
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
  ShowDoctorPromise.then((result) => {
    const data = {};
    data.user = req.user;
    
    data.doctor = result;
    res.render('doctoredit', { data });
  }).catch((error) => {
    console.log(`Error From promise ${error}`);
    res.redirect('back');
  });
});

// POST ROUTES

// Doctor Login
router.post(
  '/doctorlogin',
  passport.authenticate('doctorlocal', {
    successRedirect: '/doctorhome',
    failureRedirect: '/doctorlogin',
  })
);

router.post('/doctorregistration', (req, res) => {
  const doctorreq = new Doctor({
    username: req.body.username,
    usertype: req.body.usertype,
    name: req.body.name,
    phone: req.body.phone,
    specialization: req.body.specialization,
    address: req.body.address,
  });

  Doctor.register(doctorreq, req.body.password, (err, item) => {
    if (err) {
      console.log(err);
      const data = {};
      data.user = req.user;
      console.log(item);
      res.render('doctorregistration', { data });
    }
    passport.authenticate('doctorlocal')(req, res, () => {
      res.redirect('/doctorhome');
    });
  });
});

// UPDATE ROUTES

// Update Doctor Credentials
router.put('/doctorhome/:id/edit', isLoggedIn, (req, res) => {
  Doctor.findByIdAndUpdate(req.params.id, req.body, (err, item) => {
    if (err) {
      console.log(err);
      res.redirect('/doctorhome');
    } else {
      console.log(item);
      res.redirect('/doctorhome');
    }
  });
});

module.exports = router;
