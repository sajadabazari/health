const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User", {
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  fname: {
    type: String,
    trim: true,
    required: true,
  },
  lname: {
    type: String,
    trim: true,
    required: true,
  },
  mobileNumber: {
    type: String,
    default: "",
    required: true,
  },
  province: {
    type: String,
    default: "null",
  },
  city: {
    type: String,
    default: "null",
  },
  hcenter: {
    type: String,
    default: "null",
  },
  village: {
    type: String,
    default: "null",
  },
  nationalCode: {
    type: String,
    trim: true,
    unique: true,
    dropDups: true,
    required: true,
  },
  email: {
    type: String,
    default: "",
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  isPatient: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isRegister: {
    type: Boolean,
    default: false,
  },
  patientProfileStatus: { type: Boolean, default: false },
  userLevelLabel: { type: String, default: "بیمار" },
  accessibility: {
    ptnRegister: {
      type: Boolean,
      default: false,
    },
    ptnSearch: {
      type: Boolean,
      default: false,
    },
    ptnSideEffect: {
      type: Boolean,
      default: false,
    },
    deleteSideEffect: {
      type: Boolean,
      default: false,
    },
    editSideEffect: {
      type: Boolean,
      default: false,
    },
    deletePatient: {
      type: Boolean,
      default: false,
    },
    getReport: {
      type: Boolean,
      default: false,
    },
    editHistory: {
      type: Boolean,
      default: false,
    },
  },
});
User.find({ $or: [{ nationalCode: "1234567890" }] })
  .count()
  .then(async (e) => {
    if (!e) {
      const userPassword = await bcrypt.hash("123456", 12);
      const admin = {
        fname: "مدیر",
        lname: "سایت",
        nationalCode: "1234567890",
        email: "admin@gmail.com",
        mobileNumber: "09122",
        password: userPassword,
        isAdmin: true,
        isPatient: false,
        userLevelLabel: "مدیر کل سایت",
        accessibility: {
          ptnRegister: true,
          ptnSearch: true,
          ptnSideEffect: true,
          deleteSideEffect: true,
          editSideEffect: true,
          deletePatient: true,
          getReport: true,
          editHistory: true,
        },
      };
      const Admin = new User(admin);
      Admin.save();
    }
  })
  .catch((err) => next(err));
module.exports = User;
