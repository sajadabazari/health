const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const puppeteer = require("puppeteer");
const path = require("path");
const User = require("../models/User");
const Report = require("../models/Report");
const Vaccine = require("../models/Vaccine");
const Patient = require("../models/Patient");
const {
  mToJalali,
  jalaliToM,
  mToJalaliTFormat,
} = require("../utils/getJalali");
const HealthCenter = require("../models/HealthCenter");
const { default: mongoose } = require("mongoose");

const reports = async (req, res, next) => {
  try {
    let rowsCount = 7;
    let page =
      req.params.page == undefined || req.params.page == 1
        ? 0
        : (req.params.page - 1) * rowsCount;
    const pCount = await Report.find({ user: req.session.user._id }).count();
    const reports = await Report.find({ user: req.session.user._id })
      .skip(page)
      .limit(rowsCount)
      .sort({ createdAt: -1 });
    let reportAction =
      req.session.reportAction || req.session.reportAction || null;
    req.session.reportAction = null;
    let vaccines = await Vaccine.find();

    res.render("panel/reports", {
      login: req.session.user,
      reports,
      vaccines,
      reportAction,
      rowsCount,
      mToJalaliTFormat,
      page: page / rowsCount == 0 ? 1 : page / rowsCount + 1,
      endPage: Math.ceil(pCount / rowsCount),
    });
  } catch (err) {
    next(err);
  }
};
const reportAllInfo = async (req, res, next) => {
  const users = await User.find();
  try {
    res.render("panel/report", { users }, async (err, data) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(data, {
        waitUntil: "networkidle0",
      });
      let pdfFileName = uuidv4();
      await page.pdf({
        path: path.join(__dirname, `../public/files/${pdfFileName}.pdf`),
        format: "a4",
        printBackground: true,
        margin: {
          left: "0px",
          top: "0px",
          right: "0px",
          bottom: "0px",
        },
      });
      await browser.close();

      /*             var file = fs.createReadStream(path.join(__dirname, `../public/files/${pdfFileName}.pdf`));
                        var stat = fs.statSync(path.join(__dirname, `../public/files/${pdfFileName}.pdf`));
                        res.setHeader('Content-Length', stat.size);
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}.pdf`);
                        file.pipe(res); */
    });
  } catch (err) {
    next(err);
  }
};

const getReport = async (req, res, next) => {
  try {
    let reportFrom = jalaliToM(req.body.reportFrom);
    let reportTo = jalaliToM(req.body.reportTo);
    let { reportOptions } = req.body;
    let patients = [];
    const _pipeline = [
      {
        $match: {
          "e_crf.sideEffectDate": {
            $gte: new Date(reportFrom),
            $lt: new Date(reportTo),
          },
        },
      },
      { $unwind: "$e_crf" },
    ];
    if (reportOptions.gender) {
      _pipeline.unshift({
        $match: {
          gender: { $in: reportOptions.gender },
        },
      });
    }
/*     if (reportOptions.educationRate) {
      _pipeline.unshift({
        $match: {
          educationRate: { $in: reportOptions.educationRate },
        },
      });
    }
    if (reportOptions.ecoStatus) {
      _pipeline.unshift({
        $match: {
          ecoStatus: { $in: reportOptions.ecoStatus },
        },
      });
    } */
    if (reportOptions.diseasesChecks) {
      if (reportOptions.diseasesChecks.includes("others")) {
        _pipeline.unshift({
          $match: {
            $or: [
              {
                "healthHistory.diseasesChecks": {
                  $in: reportOptions.diseasesChecks,
                },
              },
              {
                "healthHistory.chronicDiseases": { $exists: true, $ne: [] },
              },
            ],
          },
        });
      } else {
        _pipeline.unshift({
          $match: {
            "healthHistory.diseasesChecks": {
              $in: reportOptions.diseasesChecks,
            },
          },
        });
      }
    }
    if (reportOptions.testResult) {
      _pipeline.unshift({
        $match: {
          "healthHistory.testResult": reportOptions.testResult.value,
        },
      });
    }
    if (reportOptions.allergy) {
      _pipeline.unshift({
        $match: {
          "healthHistory.allergy": reportOptions.allergy.value,
        },
      });
    }
    if (reportOptions.vaccineName) {
      _pipeline.push({
        $match: {
          "e_crf.vaccineName": { $in: reportOptions.vaccineName },
        },
      });
    }
    if (reportOptions.typeSideEffect) {
      if (reportOptions.typeSideEffect.includes("others")) {
        _pipeline.push({
          $match: {
            $or: [
              {
                "e_crf.typeSideEffect.typeSideEffectChecks": {
                  $in: reportOptions.typeSideEffect,
                },
              },
              {
                "e_crf.typeSideEffect.otherTypeSideEffect": {
                  $exists: true,
                  $ne: "",
                },
              },
            ],
          },
        });
      } else {
        _pipeline.push({
          $match: {
            "e_crf.typeSideEffect.typeSideEffectChecks": {
              $in: reportOptions.typeSideEffect,
            },
          },
        });
      }
    }
    if (reportOptions.vaccineDose) {
      _pipeline.push({
        $match: {
          "e_crf.vaccineDose": reportOptions.vaccineDose,
        },
      });
    }
/*     if (reportOptions.age) {
      _pipeline.push({
        $match: {
          "e_crf.age": {
            $gte: reportOptions.age.min,
            $lte: reportOptions.age.max,
          },
        },
      });
    } */
    if (reportOptions.smoking) {
      _pipeline.unshift({
        $match: {
          "e_crf.smoking": reportOptions.smoking.value,
        },
      });
    }
    if (reportOptions.pregnancyStatus) {
      _pipeline.unshift({
        $match: {
          "e_crf.pregnancyStatus": reportOptions.pregnancyStatus.value,
        },
      });
    }
    if (reportOptions.brestFeedingStatus) {
      _pipeline.unshift({
        $match: {
          "e_crf.brestFeedingStatus": reportOptions.brestFeedingStatus.value,
        },
      });
    }
    if (reportOptions.weight) {
      _pipeline.push({
        $match: {
          "e_crf.weight": {
            $gte: reportOptions.weight.min,
            $lte: reportOptions.weight.max,
          },
        },
      });
    }
    if (reportOptions.height) {
      _pipeline.push({
        $match: {
          "e_crf.height": {
            $gte: reportOptions.height.min,
            $lte: reportOptions.height.max,
          },
        },
      });
    }
    if (reportOptions.bmi) {
      _pipeline.push({
        $match: {
          "e_crf.BMI": {
            $gte: reportOptions.bmi.min,
            $lte: reportOptions.bmi.max,
          },
        },
      });
    }

    _pipeline.push(
      {
        $match: {
          "e_crf.sideEffectDate": {
            $gte: new Date(reportFrom),
            $lt: new Date(reportTo),
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          list: { $push: "$e_crf" },
          user: { $first: "$user" },
          birthday: { $first: "$birthday" },
          gender: { $first: "$gender" },
          educationRate: { $first: "$educationRate" },
          jobStatus: { $first: "$jobStatus" },
          healthHistory: { $first: "$healthHistory" },
          ecoStatus: { $first: "$ecoStatus" },
          phone: { $first: "$phone" },
          address: { $first: "$address" },
          user: { $first: "$user" },
        },
      }
    );
    if (req.session.user.isAdmin) {
      patients = await Patient.aggregate(_pipeline);
    }
    if (
      req.session.user.isAdmin == false &&
      req.session.user.isPatient == false
    ) {
      if (
        req.session.user.province != "null" &&
        req.session.user.city == "null" &&
        req.session.user.hcenter == "null" &&
        req.session.user.village == "null" 
      ) {
        patients = await User.aggregate([
          {
            $match: {
              isPatient: true,
              province: req.session.user.province,
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
        ]);
      } else if (
        req.session.user.province != "null" &&
        req.session.user.city != "null" &&
        req.session.user.hcenter == "null" &&
        req.session.user.village == "null" 
      ) {
        patients = await User.aggregate([
          {
            $match: {
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
        ]);
      } else {
        patients = await User.aggregate([
          {
            $match: {
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
        ]);
      }
  
      const listId = [];
      patients.map((patient) => {
        listId.push(patient._id);
      });
      // const expertCity = await HealthCenter.findById(req.session.user.isEmployer.HealthCenter);
      _pipeline.unshift({
        $match: {
          user: { $in: listId },
        },
      });
      let patientss = await Patient.aggregate(_pipeline);
      patients = await Patient.populate(patientss, {
        path: "user",
        populate: {
          path: 'city',
          model: 'City'
        }
      });
      
    }
    console.log('sss',patients)
/*     const usersId = patients.map((p) => p.user);
    const users = await User.find({ _id: { $in: usersId } });

    patients.forEach((patient, key) => {
      let p = users.find((u) => u._id.toString() == patient.user);
      user = p;
      patients[key].user = user;
    }); */
    res.render("panel/report", { patients, mToJalali }, async (err, data) => {
      const browser = await puppeteer.launch({
        args: ["--force-color-profile=srgb"],
      });
      const page = await browser.newPage();
      await page.setContent(data, {
        waitUntil: "networkidle0",
      });
      let pdfFileName = uuidv4();
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
      );

      await page.pdf({
        path: path.join(__dirname, `../public/files/${pdfFileName}.pdf`),
        format: "a4",
        printBackground: true,
        landscape: true,
        margin: {
          left: "0px",
          top: "0px",
          right: "0px",
          bottom: "0px",
        },
      });
      await browser.close();
      const report = await Report.create({
        user: req.session.user._id.toString(),
        fileName: pdfFileName,
        reportType: "overall",
        reportDirection: "overall",
        filePath: `/files/${pdfFileName}.pdf`,
        createdAt: new Date(),
      });
      /*          var file = fs.createReadStream(path.join(__dirname, `../public/files/${pdfFileName}.pdf`));
                        var stat = fs.statSync(path.join(__dirname, `../public/files/${pdfFileName}.pdf`));
                        res.setHeader('Content-Length', stat.size);
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}.pdf`);
                        file.pipe(res); */
      res.json({
        statusCode: 200,
        report,
      });
    });
  } catch (err) {
    next(err);
  }
};
const rep = async (req, res, next) => {
  const patients = await Patient.aggregate([
    {
      $match: {
        "e_crf.sideEffectDate": {
          $gte: new Date(2012, 7, 14),
          $lt: new Date(2022, 12, 15),
        },
      },
    },
    { $unwind: "$e_crf" },
    {
      $match: {
        "e_crf.sideEffectDate": {
          $gte: new Date(2012, 7, 14),
          $lt: new Date(2022, 12, 15),
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        list: { $push: "$e_crf" },
        user: { $first: "$userId" },
        birthday: { $first: "$birthday" },
        gender: { $first: "$gender" },
        educationRate: { $first: "$educationRate" },
        jobStatus: { $first: "$jobStatus" },
        ecoStatus: { $first: "$ecoStatus" },
        phone: { $first: "$phone" },
        address: { $first: "$address" },
        user: { $first: "$user" },
      },
    },
  ]);
  const usersId = patients.map((p) => p.user);
  const users = await User.find({ _id: { $in: usersId } });

  patients.forEach((patient, key) => {
    let p = users.find((u) => u._id.toString() == patient.user);
    user = p;
    patients[key].user = user;
  });
  res.render("panel/rep", { patients, mToJalali });
};

const deleteReport = async (req, res, next) => {
  if (!req.params.id) {
    res.redirect(`/panel/reports`);
  }
  try {
    const delUser = await Report.findOneAndDelete({ _id: req.params.id });
    if (delUser) {
      fs.unlink(
        path.join(__dirname, `../public/files/${delUser.fileName}.pdf`),
        () => {
          req.session.reportAction = "success-delete";
          res.redirect(`/panel/reports`);
        }
      );
    }
  } catch (err) {
    next(err);
  }
};
const uInfoReport = async (req, res, next) => {
  let patients;
  const educationRateCountPipe = [
    {
      $group: {
        _id: "$educationRate",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        counts: {
          $push: { k: "$_id", v: "$count" },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$counts" },
      },
    },
  ];
  const genderCountPipe = [
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        counts: {
          $push: { k: "$_id", v: "$count" },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$counts" },
      },
    },
  ];
  const ecoStatusCountPipe = [
    {
      $group: {
        _id: "$ecoStatus",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        counts: {
          $push: { k: "$_id", v: "$count" },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$counts" },
      },
    },
  ];
  if (
    req.session.user.isAdmin == false &&
    req.session.user.isPatient == false
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
            isPatient: true,
            province: req.session.user.province,
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
      ]);
    } else {
      patients = await User.aggregate([
        {
          $match: {
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
      ]);
    }

    const listId = [];
    patients.map((patient) => {
      listId.push(patient._id);
    });
    // const expertCity = await HealthCenter.findById(req.session.user.isEmployer.HealthCenter);

    educationRateCountPipe.unshift({
      $match: {
        user: { $in: listId },
      },
    });
    genderCountPipe.unshift({
      $match: {
        user: { $in: listId },
      },
    });
    ecoStatusCountPipe.unshift({
      $match: {
        user: { $in: listId },
      },
    });
  }

  const educationRateCount = await Patient.aggregate(educationRateCountPipe);
  const genderCount = await Patient.aggregate(genderCountPipe);
  const ecoStatusCount = await Patient.aggregate(ecoStatusCountPipe);
  res.render("panel/uInfoReport", {
    login: req.session.user,
    educationRateCount:
      educationRateCount.length == 0 ? [{}] : educationRateCount,
    genderCount: genderCount.length == 0 ? [{}] : genderCount,
    ecoStatusCount: ecoStatusCount.length == 0 ? [{}] : ecoStatusCount
  });
};
const chart = async (req, res, next) => {
  const educationRateCount = await Patient.aggregate([
    {
      $group: {
        _id: "$educationRate",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        counts: {
          $push: { k: "$_id", v: "$count" },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$counts" },
      },
    },
  ]);
  const genderCount = await Patient.aggregate([
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        counts: {
          $push: { k: "$_id", v: "$count" },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$counts" },
      },
    },
  ]);
  const ecoStatusCount = await Patient.aggregate([
    {
      $group: {
        _id: "$ecoStatus",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        counts: {
          $push: { k: "$_id", v: "$count" },
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: { $arrayToObject: "$counts" },
      },
    },
  ]);
  res.render("panel/chart", {
    login: req.session.user,
  });
};
const getChartInfo = async (req, res, next) => {
  let chartData = {};
  try {
    const educationRateCountPipe = [
      {
        $group: {
          _id: "$educationRate",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          counts: {
            $push: { k: "$_id", v: "$count" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: "$counts" },
        },
      },
    ];
    const genderCountPipe = [
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          counts: {
            $push: { k: "$_id", v: "$count" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: "$counts" },
        },
      },
    ];
    const ecoStatusCountPipe = [
      {
        $group: {
          _id: "$ecoStatus",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          counts: {
            $push: { k: "$_id", v: "$count" },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: "$counts" },
        },
      },
    ];
    if (req.session.user.accessibility.userLevel == "Expert") {
      let ExpertHealthCenter = await HealthCenter.findById(
        req.session.user.isEmployer.HealthCenter
      );
      let listHCenters, healthCarePatients;
      if (ExpertHealthCenter.city == "") {
        healthCenters = await HealthCenter.find(
          { province: ExpertHealthCenter.province },
          "_id"
        );
      } else if (
        ExpertHealthCenter.village == "" &&
        ExpertHealthCenter.name == ""
      ) {
        healthCenters = await HealthCenter.find(
          { city: ExpertHealthCenter.city },
          "_id"
        );
      } else {
        healthCenters = await HealthCenter.find({
          name: ExpertHealthCenter.name,
        });
      }
      listHCenters = healthCenters.map((field) => field._id);
      healthCarePatients = await User.find(
        {
          $or: [
            { "accessibility.userLevel": "HealthCare" },
            { "accessibility.userLevel": "Expert" },
          ],
          "isEmployer.HealthCenter": { $in: listHCenters },
        },
        "isEmployer.createdPatients"
      );

      const listId = [];
      healthCarePatients.map((field) => {
        listId.push(...field.isEmployer.createdPatients);
      });
      // const expertCity = await HealthCenter.findById(req.session.user.isEmployer.HealthCenter);

      educationRateCountPipe.unshift({
        $match: {
          user: { $in: listId },
        },
      });
      genderCountPipe.unshift({
        $match: {
          user: { $in: listId },
        },
      });
      ecoStatusCountPipe.unshift({
        $match: {
          user: { $in: listId },
        },
      });
    }
    if (req.session.user.accessibility.userLevel == "HealthCare") {
      const usersId = await User.find({ "isEmployer.is": false }, "_id");
      let listId = [];
      usersId.forEach((_id) => {
        listId.push(_id._id.toString());
      });
      const HealthCare = await User.findOne({ _id: req.session.user._id });

      let createdListId = listId.filter((value) =>
        HealthCare.isEmployer.createdPatients.includes(value)
      );

      educationRateCountPipe.unshift({
        $match: {
          user: { $in: createdListId },
        },
      });
      genderCountPipe.unshift({
        $match: {
          user: { $in: createdListId },
        },
      });
      ecoStatusCountPipe.unshift({
        $match: {
          user: { $in: createdListId },
        },
      });
    }
    const educationRateCount = await Patient.aggregate(educationRateCountPipe);
    const genderCount = await Patient.aggregate(genderCountPipe);
    const ecoStatusCount = await Patient.aggregate(ecoStatusCountPipe);
    chartData.educationRateCount =
      educationRateCount.length == 0 ? [{}] : educationRateCount[0];
    chartData.genderCount = genderCount.length == 0 ? [{}] : genderCount[0];
    chartData.ecoStatusCount =
      ecoStatusCount.length == 0 ? [{}] : ecoStatusCount[0];

    res.json(chartData);
  } catch (err) {
    next(err);
  }
};
const patientReport = async (req, res, next) => {
  try {
    let selectedPatient = undefined;
    if (req.params._id) {
      let user = await User.findOne({ _id: req.params._id });
      selectedPatient = await Patient.findOne({ user: req.params._id });
      selectedPatient.user = user;
    }
    res.render("panel/patientReport", {
      login: req.session.user,
      selectedPatient,
      mToJalaliTFormat,
    });
  } catch (err) {
    next(err);
  }
};
const getReportPatient = async (req, res, next) => {
  try {
    let _userId = req.body._id;

    let patients = await Patient.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(_userId)
        },
      },
      {
        $match: {
          "e_crf.sideEffectDate": {
            $gte: new Date(1850, 1, 1),
            $lt: new Date(),
          },
        },
      },
      { $unwind: "$e_crf" },
      {
        $match: {
          "e_crf.sideEffectDate": {
            $gte: new Date(1850, 1, 1),
            $lt: new Date(),
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          list: { $push: "$e_crf" },
          user: { $first: "$user" },
          birthday: { $first: "$birthday" },
          gender: { $first: "$gender" },
          educationRate: { $first: "$educationRate" },
          jobStatus: { $first: "$jobStatus" },
          ecoStatus: { $first: "$ecoStatus" },
          phone: { $first: "$phone" },
        },
      }, 
    ]);

/*     const usersId = patients.map((p) => p.user);
    const users = await User.find({ _id: { $in: usersId } });

    patients.forEach((patient, key) => {
      let p = users.find((u) => u._id.toString() == patient.user);
      user = p;
      patients[key].user = user;
    }); */
    patients = await Patient.populate(patients, {
      path: "user",
      populate: {
        path: 'city',
        model: 'City'
      }
    });
    console.log(patients)
    res.render(
      "panel/rep_patient_temp",
      { patients, mToJalali },
      async (err, data) => {
        const browser = await puppeteer.launch({
          args: ["--force-color-profile=srgb"],
        });
        const page = await browser.newPage();
        await page.setContent(data, {
          waitUntil: "networkidle0",
        });
        let pdfFileName = uuidv4();
        await page.setUserAgent(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
        );

        await page.pdf({
          path: path.join(__dirname, `../public/files/${pdfFileName}.pdf`),
          format: "a4",
          printBackground: true,
          landscape: true,
          margin: {
            left: "0px",
            top: "0px",
            right: "0px",
            bottom: "0px",
          },
        });
        await browser.close();
        const report = await Report.create({
          user: req.session.user._id.toString(),
          reportType: "patient",
          reportDirection: _userId,
          fileName: pdfFileName,
          filePath: `/files/${pdfFileName}.pdf`,
          createdAt: new Date(),
        });
    
        res.json({
          statusCode: 200,
          report,
        });
      }
    ); 
    console.log('jjj',patients)
  } catch (err) {
    next(err);
  }
};
const repp = async (req, res, next) => {
  let _userId = req.body._id;
  const patients = await Patient.aggregate([
    {
      $match: {
        user: "633e8909574ca7887bcf6ac8",
      },
    },
    {
      $match: {
        "e_crf.sideEffectDate": {
          $gte: new Date(1950, 1, 1),
          $lt: new Date(),
        },
      },
    },
    { $unwind: "$e_crf" },
    {
      $match: {
        "e_crf.sideEffectDate": {
          $gte: new Date(1950, 1, 1),
          $lt: new Date(),
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        list: { $push: "$e_crf" },
        user: { $first: "$userId" },
        birthday: { $first: "$birthday" },
        gender: { $first: "$gender" },
        educationRate: { $first: "$educationRate" },
        jobStatus: { $first: "$jobStatus" },
        ecoStatus: { $first: "$ecoStatus" },
        phone: { $first: "$phone" },
        address: { $first: "$address" },
        user: { $first: "$user" },
      },
    },
  ]);
  const usersId = patients.map((p) => p.user);
  const users = await User.find({ _id: { $in: usersId } });

  patients.forEach((patient, key) => {
    let p = users.find((u) => u._id.toString() == patient.user);
    user = p;
    patients[key].user = user;
  });
  res.render("panel/rep_patient_temp", { patients, mToJalali });
};

const testAdvanced = async (req, res, next) => {
  try {
    let reportFrom = "2022-09-22";
    let reportTo = "2022-11-22";
    let { reportOptions } = req.body;
    const _pipeline = [
      {
        $match: {
          "e_crf.sideEffectDate": {
            $gte: new Date(reportFrom),
            $lt: new Date(reportTo),
          },
        },
      },
      { $unwind: "$e_crf" },
    ];
    if (reportOptions.gender) {
      _pipeline.unshift({
        $match: {
          gender: { $in: reportOptions.gender },
        },
      });
    }
    if (reportOptions.educationRate) {
      _pipeline.unshift({
        $match: {
          educationRate: { $in: reportOptions.educationRate },
        },
      });
    }
    if (reportOptions.ecoStatus) {
      _pipeline.unshift({
        $match: {
          ecoStatus: { $in: reportOptions.ecoStatus },
        },
      });
    }
    if (reportOptions.diseasesChecks) {
      _pipeline.unshift({
        $match: {
          "healthHistory.diseasesChecks": { $in: reportOptions.diseasesChecks },
        },
      });
    }
    if (reportOptions.testResult) {
      _pipeline.unshift({
        $match: {
          "healthHistory.testResult": reportOptions.testResult.value,
        },
      });
    }
    if (reportOptions.allergy) {
      _pipeline.unshift({
        $match: {
          "healthHistory.allergy": reportOptions.allergy.value,
        },
      });
    }
    if (reportOptions.vaccineName) {
      _pipeline.push({
        $match: {
          "e_crf.vaccineName": { $in: reportOptions.vaccineName },
        },
      });
    }
    if (reportOptions.typeSideEffect) {
      _pipeline.push({
        $match: {
          "e_crf.typeSideEffect.typeSideEffectChecks": {
            $in: reportOptions.typeSideEffect,
          },
        },
      });
    }
    if (reportOptions.vaccineDose) {
      _pipeline.push({
        $match: {
          "e_crf.vaccineDose": reportOptions.vaccineDose,
        },
      });
    }
    if (reportOptions.age) {
      _pipeline.push({
        $match: {
          "e_crf.age": {
            $gte: reportOptions.age.min,
            $lte: reportOptions.age.max,
          },
        },
      });
    }
    if (reportOptions.smoking) {
      _pipeline.unshift({
        $match: {
          "e_crf.smoking": reportOptions.smoking.value,
        },
      });
    }
    if (reportOptions.pregnancyStatus) {
      _pipeline.unshift({
        $match: {
          "e_crf.pregnancyStatus": reportOptions.pregnancyStatus.value,
        },
      });
    }
    if (reportOptions.brestFeedingStatus) {
      _pipeline.unshift({
        $match: {
          "e_crf.brestFeedingStatus": reportOptions.brestFeedingStatus.value,
        },
      });
    }
    if (reportOptions.weight) {
      _pipeline.push({
        $match: {
          "e_crf.weight": {
            $gte: reportOptions.weight.min,
            $lte: reportOptions.weight.max,
          },
        },
      });
    }
    if (reportOptions.height) {
      _pipeline.push({
        $match: {
          "e_crf.height": {
            $gte: reportOptions.height.min,
            $lte: reportOptions.height.max,
          },
        },
      });
    }
    if (reportOptions.bmi) {
      _pipeline.push({
        $match: {
          "e_crf.BMI": {
            $gte: reportOptions.bmi.min,
            $lte: reportOptions.bmi.max,
          },
        },
      });
    }

    _pipeline.push(
      {
        $match: {
          "e_crf.sideEffectDate": {
            $gte: new Date(reportFrom),
            $lt: new Date(reportTo),
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          list: { $push: "$e_crf" },
          user: { $first: "$userId" },
          birthday: { $first: "$birthday" },
          gender: { $first: "$gender" },
          educationRate: { $first: "$educationRate" },
          jobStatus: { $first: "$jobStatus" },
          healthHistory: { $first: "$healthHistory" },
          ecoStatus: { $first: "$ecoStatus" },
          phone: { $first: "$phone" },
          address: { $first: "$address" },
          user: { $first: "$user" },
        },
      }
    );
    let patients = [];
    patients = await Patient.aggregate(_pipeline);

    const usersId = patients.map((p) => p.user);
    const users = await User.find({ _id: { $in: usersId } });

    patients.forEach((patient, key) => {
      let p = users.find((u) => u._id.toString() == patient.user);
      user = p;
      patients[key].user = user;
    });
    return res.json(patients);
    /*         res.render('panel/report', { patients, mToJalali }, async (err, data) => {
            const browser = await puppeteer.launch({
                args: ['--force-color-profile=srgb'],
            })
            const page = await browser.newPage();
            await page.setContent(data, {
                waitUntil: 'networkidle0'
            })
            let pdfFileName = uuidv4();
            await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

            await page.pdf({
                path: path.join(__dirname, `../public/files/${pdfFileName}.pdf`),
                format: 'a4',
                printBackground: true,
                landscape: true,
                margin: {
                    left: '0px',
                    top: '0px',
                    right: '0px',
                    bottom: '0px'
                },
            });
            await browser.close();
            const report = await Report.create({
                user: req.session.user._id.toString(),
                fileName: pdfFileName,
                reportType: 'overall',
                reportDirection: 'overall',
                filePath: `/files/${pdfFileName}.pdf`,
                createdAt: new Date()
            });
            res.json({
                statusCode: 200,
                report
            });
        }); */
  } catch (err) {
    next(err);
  }
};
const testReport = (req, res) => {
  res.render("panel/testReport");
};
module.exports = {
  getReport,
  reportAllInfo,
  reports,
  rep,
  deleteReport,
  uInfoReport,
  chart,
  getChartInfo,
  patientReport,
  getReportPatient,
  repp,
  testAdvanced,
  testReport,
};
