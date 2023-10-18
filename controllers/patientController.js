const Patient = require("../models/Patient");
const HealthCenter = require("../models/HealthCenter");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const {
  getJalali,
  mToJalali2,
  mToJalaliTFormat,
} = require("../utils/getJalali");
const moment = require("jalali-moment");
const Vaccine = require("../models/Vaccine");
const Province = require("../models/Province");
const City = require("../models/City");
const Village = require("../models/Village");
const { default: mongoose } = require("mongoose");

//admin
const patients = async (req, res, next) => {
  let login = req.session.user;
  try {
    let patients;
    if (login.isAdmin) {
     // patients = await Patient.find().populate("user");
      patients = await User.aggregate([
        {
          $match: {
            isPatient: true,
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "_id",
            foreignField: "user",
            as: "patient",
          },
        },
        {
          $unwind: {
            path: "$patient",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
    } else if (login.userLevelLabel == "مدیر") {
      patients = await User.aggregate([
        {
          $match: {
            isPatient: true,
            province: login.province,
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "_id",
            foreignField: "user",
            as: "patient",
          },
        },
        {
          $unwind: {
            path: "$patient",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
    } else if (login.userLevelLabel == "کارشناس ستادی") {
      patients = await User.aggregate([
        {
          $match: {
            isPatient: true,
            province: login.province,
            city: login.city,
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "_id",
            foreignField: "user",
            as: "patient",
          },
        },
        {
          $unwind: {
            path: "$patient",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
    } else if (login.userLevelLabel == "کارشناس محیطی") {
      patients = await User.aggregate([
        {
          $match: {
            isPatient: true,
            province: login.province,
            city: login.city,
            hcenter: login.hcenter,
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "_id",
            foreignField: "user",
            as: "patient",
          },
        },
        {
          $unwind: {
            path: "$patient",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
    } else if (login.userLevelLabel == "مراقب سلامت") {
      patients = await User.aggregate([
        {
          $match: {
            isPatient: true,
            province: login.province,
            city: login.city,
            hcenter: login.hcenter,
            village: login.village,
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "_id",
            foreignField: "user",
            as: "patient",
          },
        },
        {
          $unwind: {
            path: "$patient",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
    }
    // res.render('panel/users',{users,login:req.session.user});
    req.session.userAction = null;
    res.render("panel/patients/index", {
      login,
      patients,
    });
  } catch (err) {
    next(err);
  }
};
const deletePatient = async (req, res, next) => {
  if (!req.params.id) {
    res.redirect(`${process.env.SITEURL}/panel/patients`);
  }
  try {
    const delUser = await User.findByIdAndDelete(req.params.id);
    await Patient.findOneAndDelete({ user: req.params.id });
    if (delUser) {
      return res.status(200).json({
        message: "حذف بیمار با موفقیت انجام شد.",
      });
    }
  } catch (err) {
    next(err);
  }
};
const set_history = async (req, res, next) => {
  try {
    let patient_history = req.body;

    const upData = await Patient.findOne({ user: patient_history._id });
    upData.healthHistory = {
      allergy: patient_history.allergy == "yes" ? true : false,
      testResult: patient_history.testResult == "yes" ? true : false,
      chronicDiseases: patient_history.chronicDiseases,
      diseasesChecks: patient_history.diseasesChecks,
    };
    await upData.save();
    res.json({
      statusCode: 200,
      upData,
    });
  } catch (err) {
    next(err);
  }
};
const insert = async (req, res, next) => {
  let patient_crf = await Patient.findOne({
    user: "633e8699574ca7887bcf6a73",
  });
  patient_crf.e_crf.push({
    vaccineName: "dfgf",
    injectVaccineDate: "2010-03-9",
    typeSideEffect: "dfdfdf",
    sideEffectDate: "2010-03-9",
    vaccineDose: 99,
    age: 9.567,
    weight: 9.323,
    height: 23,
    BMI: 0.343,
    pregnancyStatus: true,
    brestFeedingStatus: true,
    smoking: true,
  });
  await patient_crf.save();
  res.end("s");
};
const regPatient = async (req, res, next) => {
  let user = req.body.userData;
  let patient = req.body.patientData;
  user.password = await bcrypt.hash(user.password, 12);
  user.creatorId = req.session.user._id;
  user.patientProfileStatus = true;
  user.mobileNumber = patient.phone.cellphone;
  const newUser = new User(user);
  newUser.save().then(async (_user) => {
    patient.user = _user._id.toString();
    let birthday = moment
      .from(patient.birthday.trim(), "fa", "YYYY/MM/DD")
      .format("YYYY/MM/DD");
    patient.birthday = new Date(birthday);
    patient.province = patient.province == null ? "null" : patient.province;
    patient.city = patient.city == null ? "null" : patient.city;
    patient.hcenter = patient.hcenter == null ? "null" : patient.hcenter;
    patient.village = patient.village == null ? "null" : patient.village;
    const newPatient = new Patient(patient);
    newPatient
      .save()
      .then(async (patient) => {
        res.json({
          statusCode: 200,
          _user,
          patient,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
const e_crf_create = async (req, res, next) => {
  if (!req.params._id) {
    res.redirect("/panel/patients");
  }
  try {
    const patient = await Patient.findById(req.params._id).populate("user");
    let vaccines = await Vaccine.find();
    res.render("panel/e_crfs/create", {
      login: req.session.user,
      gender: patient.gender,
      patient,
      vaccines,
      e_crf:
        patient.e_crf.length > 0
          ? patient.e_crf[patient.e_crf.length - 1]
          : undefined,
    });
  } catch (err) {
    next(err);
  }
};
const patient_e_crf_create = async (req, res, next) => {
  if (!req.params._id) {
    res.redirect("/panel/patient/e_crfs");
  }
  try {
    const patient = await Patient.findById(req.params._id).populate("user");
    let vaccines = await Vaccine.find();
    res.render("panel/e_crfs/create", {
      login: req.session.user,
      gender: patient.gender,
      patient,
      vaccines,
      e_crf:
        patient.e_crf.length > 0
          ? patient.e_crf[patient.e_crf.length - 1]
          : undefined,
    });
  } catch (err) {
    next(err);
  }
};
const e_crf_edit = async (req, res, next) => {
  /*   if (!req.params.crfId) {
    res.redirect("/panel/patients");
  } */
  try {
    let patient_crf = await Patient.findOne({
      "e_crf._id": req.params.crfId,
    }).populate("user");
    let birthday = moment(patient_crf.birthday)
      .locale("fa")
      .format("YYYY/MM/DD");
    patient_crf.birthday = birthday;
    patient_crf.e_crf.forEach((e_crf) => {
      let injectVaccineDate = moment(e_crf.injectVaccineDate)
        .locale("fa")
        .format("YYYY/MM/DD");
      let sideEffectDate = moment(e_crf.sideEffectDate)
        .locale("fa")
        .format("YYYY/MM/DD");
      e_crf.injectVaccineDate = injectVaccineDate;
      e_crf.sideEffectDate = sideEffectDate;
    });
    let e_crf = patient_crf.e_crf.filter((e) => {
      return e._id.toString() == req.params.crfId;
    });
    const vaccines = await Vaccine.find();

    res.render("panel/e_crfs/edit", {
      login: req.session.user,
      gender: patient_crf.gender,
      e_crf: e_crf[0],
      patient: patient_crf,
      vaccines,
      crfId: req.params.crfId,
      getJalali,
    });
  } catch (err) {
    next(err);
  }
};
const patient_e_crf_edit = async (req, res, next) => {
  /*   if (!req.params.crfId) {
    res.redirect("/panel/patients");
  } */
  try {
    let patient_crf = await Patient.findOne({
      "e_crf._id": req.params.crfId,
    }).populate("user");
    let birthday = moment(patient_crf.birthday)
      .locale("fa")
      .format("YYYY/MM/DD");
    patient_crf.birthday = birthday;
    patient_crf.e_crf.forEach((e_crf) => {
      let injectVaccineDate = moment(e_crf.injectVaccineDate)
        .locale("fa")
        .format("YYYY/MM/DD");
      let sideEffectDate = moment(e_crf.sideEffectDate)
        .locale("fa")
        .format("YYYY/MM/DD");
      e_crf.injectVaccineDate = injectVaccineDate;
      e_crf.sideEffectDate = sideEffectDate;
    });
    let e_crf = patient_crf.e_crf.filter((e) => {
      return e._id.toString() == req.params.crfId;
    });
    const vaccines = await Vaccine.find();

    res.render("panel/e_crfs/edit", {
      login: req.session.user,
      gender: patient_crf.gender,
      e_crf: e_crf[0],
      patient: patient_crf,
      vaccines,
      crfId: req.params.crfId,
      getJalali,
    });
  } catch (err) {
    next(err);
  }
};

const e_crfs = async (req, res, next) => {
  if (!req.params._id) {
    res.redirect("/panel/patients");
  }
  try {
    const id = mongoose.Types.ObjectId(req.params._id);

    let patient = await Patient.findById(id).populate("user");
    let birthday = moment(patient.birthday).locale("fa").format("YYYY/MM/DD");
    patient.birthday = birthday;
    patient.e_crf.forEach((e_crf) => {
      let injectVaccineDate = moment(e_crf.injectVaccineDate)
        .locale("fa")
        .format("YYYY/MM/DD");
      let sideEffectDate = moment(e_crf.sideEffectDate)
        .locale("fa")
        .format("YYYY/MM/DD");
      e_crf.injectVaccineDate = injectVaccineDate;
      e_crf.sideEffectDate = sideEffectDate;
    });
    /*     let crfAction = req.session.crfAction || req.session.crfAction || null;
    req.session.crfAction = null; */

    res.render("panel/e_crfs/index", {
      login: req.session.user,
      e_crfs: patient.e_crf,
      patient,
      getJalali,
    });
  } catch (err) {
    next(err);
  }
};
const e_crfs_patient = async (req, res, next) => {
  try {
    const id = req.session.user._id;

    let patient = await Patient.findOne({user:id}).populate("user");
    let birthday = moment(patient.birthday).locale("fa").format("YYYY/MM/DD");
    patient.birthday = birthday;
    patient.e_crf.forEach((e_crf) => {
      let injectVaccineDate = moment(e_crf.injectVaccineDate)
        .locale("fa")
        .format("YYYY/MM/DD");
      let sideEffectDate = moment(e_crf.sideEffectDate)
        .locale("fa")
        .format("YYYY/MM/DD");
      e_crf.injectVaccineDate = injectVaccineDate;
      e_crf.sideEffectDate = sideEffectDate;
    });
    /*     let crfAction = req.session.crfAction || req.session.crfAction || null;
    req.session.crfAction = null; */

    res.render("panel/e_crfs/index", {
      login: req.session.user,
      e_crfs: patient.e_crf,
      patient,
      getJalali,
    });
  } catch (err) {
    next(err);
  }
};
const crfCreate = async (req, res, next) => {
  let e_crf = req.body;

  let injectVaccineDate = moment
    .from(e_crf.injectVaccineDate.trim(), "fa", "YYYY/MM/DD")
    .format("YYYY/MM/DD");
  let sideEffectDate = moment
    .from(e_crf.sideEffectDate.trim(), "fa", "YYYY/MM/DD")
    .format("YYYY/MM/DD");

  e_crf.injectVaccineDate = injectVaccineDate;
  e_crf.sideEffectDate = sideEffectDate;
  e_crf.created_at = new Date(); 
  try {
    let new_crf = await Patient.findOne({ user: e_crf.user });
    delete e_crf.user;
    new_crf.e_crf.push(e_crf);
    await new_crf.save();
    res.json({
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
};
const crfEdit = async (req, res, next) => {
  let e_crf = req.body;

  let injectVaccineDate = moment
    .from(e_crf.injectVaccineDate.trim(), "fa", "YYYY/MM/DD")
    .format("YYYY/MM/DD");
  let sideEffectDate = moment
    .from(e_crf.sideEffectDate.trim(), "fa", "YYYY/MM/DD")
    .format("YYYY/MM/DD");

  e_crf.injectVaccineDate = injectVaccineDate;
  e_crf.sideEffectDate = sideEffectDate;
  try {

    let patient_crf = await Patient.findOne({ user: e_crf.user });
    patient_crf.e_crf = patient_crf.e_crf.filter((e, key) => {
      
      if (e._id.toString() == e_crf.crfId) {
        if(req.session.user.userLevelLabel == "مراقب سلامت" || req.session.user.userLevelLabel == "بیمار"){
          let dateOne = moment(patient_crf.e_crf[key].created_at);
          let dateTwo = moment(new Date());
          
          let diffDay = dateOne.diff(dateTwo, 'hours', true);
          if(diffDay < -24){
            const error = new Error("!");
            error.statusCode = 422;
            error.message = "امکان ویرایش فقط تا ساعت 24 روز ثبت عارضه وجود دارد.";
            throw error;
          }else if((moment().endOf('day').fromNow() - diffDay) > 24 ){
            const error = new Error("!");
            error.statusCode = 422;
            error.message = "امکان ویرایش فقط تا ساعت 24 روز ثبت عارضه وجود دارد.";
            throw error;
          }  
        }

        patient_crf.e_crf[key].vaccineName = e_crf.vaccineName;
        patient_crf.e_crf[key].injectVaccineDate = e_crf.injectVaccineDate;
        patient_crf.e_crf[key].sideEffectDate = e_crf.sideEffectDate;
        patient_crf.e_crf[key].typeSideEffect = e_crf.typeSideEffect;
        patient_crf.e_crf[key].vaccineDose = e_crf.vaccineDose;
        patient_crf.e_crf[key].age = e_crf.age;
        patient_crf.e_crf[key].weight = e_crf.weight;
        patient_crf.e_crf[key].height = e_crf.height;
        patient_crf.e_crf[key].BMI = e_crf.BMI;
        patient_crf.e_crf[key].pregnancyStatus = e_crf.pregnancyStatus;
        patient_crf.e_crf[key].brestFeedingStatus = e_crf.brestFeedingStatus;
        patient_crf.e_crf[key].smoking = e_crf.smoking;
        return e;
      } else {
        return e;
      }
    });
    await patient_crf.save();
    res.json({
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCrf = async (req, res, next) => {
  if(req.session.user.isPatient){
    if (!req.params.crfId) {
      res.redirect("/panel/patient/e_crfs");
    }
  }else{
    if (!req.params.crfId) {
      res.redirect("/panel/patients");
    }
  }

  try {
    let del_crf = await Patient.findOne({ "e_crf._id": req.params.crfId });
    del_crf.e_crf = del_crf.e_crf.filter((e) => {
      return e._id.toString() != req.params.crfId;
    });
    await del_crf.save();
    req.session.crfAction = "success-delete";
    if(req.session.user.isPatient){
      res.redirect(`${process.env.SITEURL}/panel/patient/e_crfs`);
    }else{
      res.redirect(`${process.env.SITEURL}/panel/patient/e_crfs/${del_crf._id}`);
    }
  } catch (err) {
    next(err);
  }
};

const search = async (req, res, next) => {
  if (req.params.input == undefined) {
    res.redirect("/panel/patients");
  }
  try {
    let page =
      req.params.page == undefined || req.params.page == 1
        ? 0
        : (req.params.page - 1) * 7;
    let countUsers = await User.find().count();

    const users = await User.find({
      $or: [
        { fname: { $regex: ".*" + req.params.input + ".*" } },
        { lname: { $regex: ".*" + req.params.input + ".*" } },
        { username: { $regex: ".*" + req.params.input + ".*" } },
        { nationalCode: { $regex: ".*" + req.params.input + ".*" } },
        { email: { $regex: ".*" + req.params.input + ".*" } },
      ],
    })
      .skip(page)
      .limit(7);
    const usersId = await User.find(
      {
        $or: [
          { fname: { $regex: ".*" + req.params.input + ".*" } },
          { lname: { $regex: ".*" + req.params.input + ".*" } },
          { username: { $regex: ".*" + req.params.input + ".*" } },
          { nationalCode: { $regex: ".*" + req.params.input + ".*" } },
          { email: { $regex: ".*" + req.params.input + ".*" } },
        ],
      },
      "_id"
    )
      .skip(page)
      .limit(7);
    let listId = [];
    usersId.forEach((_id) => {
      listId.push(_id._id.toString());
    });
    const patients = await Patient.find({ user: { $in: listId } });

    let merged = [];
    patients.forEach((patient, key) => {
      let p = users.find((u) => u._id.toString() == patient.user);
      //delete p._id
      user = p;
      merged.push({
        user,
        patient,
      });
    });

    // res.render('panel/users',{users,login:req.session.user});
    let userAction = req.session.userAction || req.session.userAction || null;
    req.session.userAction = null;
    res.render("panel/patients", {
      login: req.session.user,
      patients: merged,
      page: page / 7 == 0 ? 1 : page / 7 + 1,
      endPage: Math.ceil(countUsers / 7),
    });
  } catch (err) {
    next(err);
  }
};
const create = async (req, res, next) => {
  let login = req.session.user;
  let access = {
    province: false,
    city: false,
    hcenter: false,
    village: false,
  };
  let provinces = [],
    cities = [],
    hcenters = [],
    villages = [];
  if (
    login.province == "null" &&
    login.city == "null" &&
    login.hcenter == "null" &&
    login.village == "null"
  ) {
    provinces = await Province.find();
  } else if (
    login.province != "null" &&
    login.city == "null" &&
    login.hcenter == "null" &&
    login.village == "null"
  ) {
    provinces = await Province.find({ _id: login.province });
    cities = await City.find({ province: login.province });
    access.province = true;
  } else if ( 
    login.province != "null" &&
  login.city != "null" &&
  login.hcenter == "null" && login.village == "null") {
    provinces = await Province.find({ _id: login.province });
    cities = await City.find({ _id: login.city });
    hcenters = await HealthCenter.find({ city: login.city });
    access.province = true;
    access.city = true;
  } else if (login.province != "null" &&
  login.city != "null" &&
  login.hcenter != "null" &&
  login.village == "null") {
    provinces = await Province.find({ _id: login.province });
    cities = await City.find({ _id: login.city });
    hcenters = await HealthCenter.find({ _id: login.hcenter });
    villages = await Village.find({ hcenter: login.hcenter });
    access.province = true;
    access.city = true;
    access.hcenter = true;
  } else {
    provinces = await Province.find({ _id: login.province });
    cities = await City.find({ _id: login.city });
    hcenters = await HealthCenter.find({ _id: login.hcenter });
    villages = await Village.find({ _id: login.village });
    access.province = true;
    access.city = true;
    access.hcenter = true;
    access.village = true;
  }
  const healthCenters = await HealthCenter.find();

  let isPatient = false;
  if (req.params.patient) {
    isPatient = true;
  }
  res.render("panel/patients/create", {
    login,
    isPatient,
    access,
    provinces,
    healthCenters,
    cities,
    hcenters,
    villages,
  });
};
const edit = async (req, res, next) => {
  //let login: req.session.user,

  try {
    const id = mongoose.Types.ObjectId(req.params._id);
    const patient = await Patient.findById(id).populate("user");

    let login = req.session.user;
    let access = {
      province: false,
      city: false,
      hcenter: false,
      village: false,
    };
    let provinces = [],
      cities = [],
      hcenters = [],
      villages = [];
    if (
      login.province == "null" &&
      login.city == "null" &&
      login.hcenter == "null" &&
      login.village == "null"
    ) {
      provinces = await Province.find();
      cities = await City.find({ province: patient.user.province });
      hcenters = await HealthCenter.find({ city: patient.user.city });
      villages = await Village.find({ hcenter: patient.user.hcenter });
    } else if (
      login.city == "null" &&
      login.hcenter == "null" &&
      login.village == "null"
    ) {
      provinces = await Province.find({ _id: login.province });
      cities = await City.find({ province: login.province });
      hcenters = await HealthCenter.find({ city: patient.user.city });
      villages = await Village.find({ hcenter: patient.user.hcenter });
      access.province = true;
    } else if (login.hcenter == "null" && login.village == "null") {
      provinces = await Province.find({ _id: login.province });
      cities = await City.find({ province: patient.user.province });
      hcenters = await HealthCenter.find({ city: patient.user.city });
      villages = await Village.find({ hcenter: patient.user.hcenter });
      access.province = true;
      access.city = true;
    } else if (login.village == "null") {
      provinces = await Province.find({ _id: login.province });
      cities = await City.find({ _id: login.city });
      hcenters = await HealthCenter.find({ _id: login.hcenter });
      villages = await Village.find({ hcenter: patient.user.hcenter });
      access.province = true;
      access.city = true;
      access.hcenter = true;
    } else {
      provinces = await Province.find({ _id: login.province });
      cities = await City.find({ _id: login.city });
      hcenters = await HealthCenter.find({ _id: login.hcenter });
      villages = await Village.find({ _id: login.village });
      access.province = true;
      access.city = true;
      access.hcenter = true;
      access.village = true;
    }
    const healthCenters = await HealthCenter.find();

    let isPatient = false;
    if (req.params.patient) {
      isPatient = true;
    }

    res.render("panel/patients/edit", {
      login,
      patient,
      mToJalali2,
      isPatient,
      access,
      provinces,
      healthCenters,
      cities,
      hcenters,
      villages,
    });
  } catch (err) {
    next(err);
  }
};
const findPatient = async (req, res, next) => {
  try {
    /*     let listId = [];
    usersId.forEach((_id) => {
      listId.push(_id._id.toString());
    });
    let patients;
    if (req.session.user.isAdmin) {
      patients = await Patient.find({ user: { $in: listId } });
    }
 */
    let patients;
    if (
      req.session.user.isAdmin == false &&
      req.session.user.isPatient == false &&
      req.session.user.village == "null"
    ) {
      if (
        req.session.user.province != "null" &&
        req.session.user.city == "null" &&
        req.session.user.village == "null" &&
        req.session.user.hcenter == "null"
      ) {
        patients = await User.aggregate([
          {
            $match: {
              $or: [
                { fname: { $regex: ".*" + req.body.searchVal + ".*" } },
                { lname: { $regex: ".*" + req.body.searchVal + ".*" } },
                { nationalCode: { $regex: ".*" + req.body.searchVal + ".*" } },
                { email: { $regex: ".*" + req.body.searchVal + ".*" } },
              ],
              isPatient: true,
              province: req.session.user.province,
            },
          },
          {
            $lookup: {
              from: "patients",
              localField: "_id",
              foreignField: "user",
              as: "patient",
            },
          },
          {
            $unwind: {
              path: "$patient",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
      } else if (
        req.session.user.province != "null" &&
        req.session.user.city != "null" &&
        req.session.user.village == "null" &&
        req.session.user.hcenter == "null"
      ) {
        patients = await User.aggregate([
          {
            $match: {
              $or: [
                { fname: { $regex: ".*" + req.body.searchVal + ".*" } },
                { lname: { $regex: ".*" + req.body.searchVal + ".*" } },
                { nationalCode: { $regex: ".*" + req.body.searchVal + ".*" } },
                { email: { $regex: ".*" + req.body.searchVal + ".*" } },
              ],
              isPatient: true,
              province: req.session.user.province,
              city: req.session.user.city,
            },
          },
          {
            $lookup: {
              from: "patients",
              localField: "_id",
              foreignField: "user",
              as: "patients",
            },
          },
          {
            $unwind: {
              path: "$patient",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
      } else if (
        req.session.user.province != "null" &&
        req.session.user.city != "null" &&
        req.session.user.hcenter != "null" &&
        req.session.user.village == "null"
      ) {
        patients = await User.aggregate([
          {
            $match: {
              $or: [
                { fname: { $regex: ".*" + req.body.searchVal + ".*" } },
                { lname: { $regex: ".*" + req.body.searchVal + ".*" } },
                { nationalCode: { $regex: ".*" + req.body.searchVal + ".*" } },
                { email: { $regex: ".*" + req.body.searchVal + ".*" } },
              ],
              isPatient: true,
              province: req.session.user.province,
              city: req.session.user.city,
              hcenter: req.session.user.hcenter,
            },
          },
          {
            $lookup: {
              from: "patients",
              localField: "_id",
              foreignField: "user",
              as: "patients",
            },
          },
          {
            $unwind: {
              path: "$patient",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
      } else {
        patients = await User.aggregate([
          {
            $match: {
              $or: [
                { fname: { $regex: ".*" + req.body.searchVal + ".*" } },
                { lname: { $regex: ".*" + req.body.searchVal + ".*" } },
                { nationalCode: { $regex: ".*" + req.body.searchVal + ".*" } },
                { email: { $regex: ".*" + req.body.searchVal + ".*" } },
              ],
              isPatient: true,
              creatorId: req.session.user._id,
            },
          },
          {
            $lookup: {
              from: "patients",
              localField: "_id",
              foreignField: "user",
              as: "patients",
            },
          },
          {
            $unwind: {
              path: "$patient",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
      }
    }
    console.log(patients)
    res.json({ patients });
  } catch (err) {
    next(err);
  }
};
const checkVaccineDoseExist = async (req, res, next) => {
  try {
    let checkData;
    let vaccineDose = parseInt(req.body.vaccineDose);
    let userId = req.body.user;
    const patient = await Patient.findOne({ user:userId });
    let field = false;
    patient.e_crf.forEach((crf) => {
      if (crf.vaccineDose == vaccineDose) {
        field = true;
      }
    });
    checkData = {
      field: field ? false : true,
    };
    res.json(checkData);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  edit,
  patients,
  set_history,
  create,
  regPatient,
  e_crfs_patient,
  insert,
  e_crf_edit,
  patient_e_crf_edit,
  e_crf_create,
  patient_e_crf_create,
  e_crfs,
  crfCreate,
  deleteCrf,
  crfEdit,
  search,
  findPatient,
  checkVaccineDoseExist,
  deletePatient,
};
