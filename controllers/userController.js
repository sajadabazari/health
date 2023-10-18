const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Patient = require("../models/Patient");
const HealthCenter = require("../models/HealthCenter");
const mongoose = require("mongoose");
const { sendEmail } = require("../utils/sendEmail");

const moment = require("jalali-moment");
const ForgetPassword = require("../models/ForgetPassword");
const Province = require("../models/Province");
const City = require("../models/City");
const Village = require("../models/Village");

const loginUser = async (req, res, next) => {
  const { nationalCode, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      const error = new Error("Validation Error.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findOne({ nationalCode });
    if (!user) {
      const error = new Error("A user with this nationalCode could not be found");
      error.statusCode = 401;
      error.message = "userOrPassInCorrect";
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      error.message = "userOrPassInCorrect";
      throw error;
    }
    delete user.password;

    const token = await jwt.sign(
      {
        user
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );
    req.session.user = user;
    res
      .status(200)
      .json({ token, user: user._id.toString(), statusCode: 200 });
      console.log('ss')
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
const createUser = async (req, res, next) => {
  let user = req.body;
  if(user.userLevelLabel=='ادمین'){
    user.isAdmin = true;
  }
    user.province = user.province == null ? "null" : user.province;
    user.city = user.city == null ? "null" : user.city;
    user.hcenter = user.hcenter == null ? "null" : user.hcenter;
    user.village = user.village == null ? "null" : user.village;
    user.creatorId = req.session.user._id;
    user.password = await bcrypt.hash(user.password, 12);
    const newUser = new User(user);
    newUser
      .save()
      .then(async (_user) => {
        res.json({
          statusCode: 200,
          message: `User created successfully`,
        });
      })
      .catch((err) => {
        if (err.code == "11000") {
          res.json({
            statusCode: 408,
            message: `user with ${Object.keys(err.keyValue)[0]} = ${
              Object.values(err.keyValue)[0]
            } already exists_!`,
            data: err,
          });
        } else {
          res.json({
            statusCode: 500,
            message: `something was wrong`,
            data: err,
          });
        }
      });

};
const update = async (req, res, next) => {

  let {_id,fname,lname,nationalCode,mobileNumber,email,userLevelLabel,province,city,hcenter,village,accessibility} = req.body;
    const user = await User.findById(_id);
    if(userLevelLabel=='ادمین'){
      user.isAdmin = true;
    }else{
      user.isAdmin = false;
    }
    user.fname = fname;
    user.lname = lname;
    user.nationalCode = nationalCode;
    user.mobileNumber = mobileNumber;
    user.userLevelLabel = userLevelLabel;
    user.email = email;
    user.province = (province)==null?"null":province;
    user.city = (city)==null?"null":city;
    user.hcenter = (hcenter)==null?"null":hcenter;
    user.village = (village)==null?"null":village;
    user.accessibility = accessibility;
    try{
      await user.save();
      res.status(200).json({message:'success'});
    } catch (err) {
      next(err);
    }
};
const changePassword = async (req, res, next) => {
  let user = req.body;
  let editingUser = await User.findById(user._id);
      user.password = await bcrypt.hash(user.password, 12);
      editingUser.password = user.password;
      try{
        await editingUser.save();
        res.status(200).json({message:'success'});
      } catch (err) {
        next(err);
      }

};
const create = async (req, res, next) => {
  const provinces = await Province.find();
  const healthCenters = await HealthCenter.find();
  let isPatient = false;
  if (req.params.patient) {
    isPatient = true;
  }
  res.render("panel/users/create", {
    login: req.session.user,
    isPatient,
    provinces,
    healthCenters,
  });
};

const search = async (req, res, next) => {
  if (req.params.input == undefined) {
    res.redirect("/panel/users");
  }
  let page =
    req.params.page == undefined || req.params.page == 1
      ? 0
      : (req.params.page - 1) * 7;
  let countUsers = await User.find({
    $or: [
      { fname: { $regex: ".*" + req.params.input + ".*" } },
      { lname: { $regex: ".*" + req.params.input + ".*" } },
      { nationalCode: { $regex: ".*" + req.params.input + ".*" } },
      { email: { $regex: ".*" + req.params.input + ".*" } },
    ],
  });
  User.find({
    $or: [
      { fname: { $regex: ".*" + req.params.input + ".*" } },
      { lname: { $regex: ".*" + req.params.input + ".*" } },
      { nationalCode: { $regex: ".*" + req.params.input + ".*" } },
      { email: { $regex: ".*" + req.params.input + ".*" } },
    ],
  })
    .skip(page)
    .limit(7)
    .then((users) => {
      // res.render('panel/users',{users,login:req.session.user});
      let userAction = req.session.userAction || req.session.userAction || null;
      req.session.userAction = null;
      res.render("panel/users", {
        users,
        login: req.session.user,
        userAction,
        page: page / 7 == 0 ? 1 : page / 7 + 1,
        endPage: Math.ceil(countUsers / 7),
      });
    })
    .catch((err) => {
      next(err);
    });
};
const users = async (req, res, next) => {

  let users = await User.find({isPatient:false});
    res.render("panel/users/index", {
      users,
      login: req.session.user,
    });
};
const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => next(err));
};

const signOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.redirect("/panel/login");
  });
};
const checkUserExist = async (req, res, next) => {
  let checkData;
  if (req.body.username && req.body.nationalCode && req.body.email) {
    const userByUsername = await User.findOne({ username: req.body.username });
    const userByNationalCode = await User.findOne({
      nationalCode: req.body.nationalCode,
    });
    const userByEmail = await User.findOne({ email: req.body.email });
    checkData = {
      username: userByUsername ? false : true,
      nationalCode: userByNationalCode ? false : true,
      email: userByEmail ? false : true,
    };
  } else {
    let fieldName = Object.keys(req.body)[0];
    let filedValue = Object.values(req.body)[0];
    const field = await User.findOne().where(fieldName, filedValue);
    checkData = {
      field: field ? false : true,
    };
  }
  res.json(checkData);
};

const deleteUser = async (req, res, next) => {
  if (!req.params.id) {
    res.redirect(`${process.env.SITEURL}/panel/users`);
  }
  try {
    const delUser = await User.findByIdAndDelete(req.params.id);
    await Patient.findOneAndDelete({ user: req.params.id });
    if (delUser) {
      req.session.userAction = "success-delete";
      res.redirect(`${process.env.SITEURL}/panel/users`);
    }
  } catch (err) {
    next(err);
  }
};
const edit = async (req, res, next) => {


  if (!req.params._id) {
    res.redirect(`${process.env.SITEURL}/panel/users`);
  }


  //  console.log(new mongoose.Types.ObjectId(req.params.id.trim()))
  try {
    const healthCenters = await HealthCenter.find();
    const id = mongoose.Types.ObjectId(req.params._id);
    let user = await User.findById(id);

    let login = req.session.user;
    let access = {
      province: true,
      city: true,
      hcenter: true,
      village: true,
    };
    let provinces = [],
      cities = [],
      hcenters = [],
      villages = [];
    if (
      user.province == "null" &&
      user.city == "null" &&
      user.hcenter == "null" &&
      user.village == "null"
    ) {
      provinces = await Province.find();
    } else if (
      user.city == "null" &&
      user.hcenter == "null" &&
      user.village == "null"
    ) {
      provinces = await Province.find();
      cities = await City.find({ province: user.province });
      access.province = true;
    } else if (user.hcenter == "null" && user.village == "null") {
      provinces = await Province.find();
      cities = await City.find({ _id: user.city });
      hcenters = await HealthCenter.find({ city: user.city });
    } else if (user.village == "null") {
      provinces = await Province.find();
      cities = await City.find({ _id: user.city });
      hcenters = await HealthCenter.find({ _id: user.hcenter });
      villages = await Village.find({ hcenter: user.hcenter });

    } else {
      provinces = await Province.find();
      cities = await City.find({ _id: user.city });
      hcenters = await HealthCenter.find({ _id: user.hcenter });
      villages = await Village.find({ _id: user.village });
    }
    res.render("panel/users/edit", {
      login,
      access,
      provinces,
      healthCenters,
      cities,
      hcenters,
      villages,
      user,
    });
  } catch (err) {
    next(err);
  }
};
const userRegister = async (req, res, next) => {
  let user = req.body;
  console.log(user)
  if (user) {
    user.password = await bcrypt.hash(user.password, 12);
    const newUser = User(user);
    newUser
      .save()
      .then((user) => {
        req.session.user = user;
        res.json({
          statusCode: 200,
          message: `User created successfully`,
        });
      })
      .catch((err) => next(err));
  }
};
const sendForgetEmail = async (req, res, next) => {
  try {
    if (req.body) {
      let { email } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        const error = new Error();
        error.statusCode = 422;
        error.message = "ایمیل وارد شده یافت نشد.";
        throw error;
      }
      let key = await bcrypt.hash(user.password, 12);
      await ForgetPassword.findOneAndUpdate(
        { user: user.id },
        { key },
        { new: true, upsert: true }
      );
      //<h3><a href="${key}" taret="_blank">جهت باز نشانی گذرواژه کلیک کنید</a></h3>
      let options = {
        from: process.env.SENDER_MAIL,
        to: email,
        subject: `ss`,
        html: `<h3><a href="${process.env.SITEURL}/password/reset/${key}" taret="_blank">جهت باز نشانی گذرواژه کلیک کنید</a></h3>`,
      };
      sendEmail(options,res);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginUser,
  createUser,
  create,
  edit,
  update,
  deleteUser,
  changePassword,
  signOut,
  users,
  search,
  getUsers,
  userRegister,
  checkUserExist,
  sendForgetEmail,
};
