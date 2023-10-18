const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const Answer = require("../models/Answer");
const { v4: uuidv4 } = require("uuid");

const index = async (req, res, next) => {
  questionFile = '';
  switch(req.session.user.userLevelLabel){
    case 'مدیر':
      questionFile = 'quModir';
      break;
    case 'کارشناس ستادی':
      questionFile = 'quSetad';
      break;
    case 'کارشناس محیطی':
      questionFile = 'quMohit';
      break;
    case 'مراقب سلامت':
      questionFile = 'quMorageb';
      break;
    case 'بیمار':
      questionFile = 'quBimar';
      break;
    default:
      questionFile = 'null';
  }
  res.render("panel/questions/index", {
    login: req.session.user,
    questionFile,
  });
};
const upload = async (req, res, next) => {
  res.render("panel/questions/upload", {
    login: req.session.user,
  });
};
const update = async (req, res, next) => {
  console.log(req.body);

  const uploadFolder = path.join(__dirname, "../public/uploads/");
  const form = new formidable.IncomingForm();
  let fieldName;
  /*     form.multiples = true;
    form.maxFileSize = 300 * 1024 * 1024; // 5MB
     */
  form.uploadDir = uploadFolder;

  await form.parse(req, async (err, fields, files) => {
    fieldName = fields;
    if (err) {
      return res.status(422).json({
        status: "Fail",
        message: "خطا در پارس اطلاعات فایل",
        error: err,
      });
    }
  });
  form.on("fileBegin", function (name, file) {
    file.filepath = uploadFolder + req.query.field + ".docx";
  });
  /*     form.on('file', function (name, file){
        console.log('Uploaded ' + file.originalFilename);
    }); */
  form.on("end", function (name, file) {
    return res.status(200).json({});
  });
};

const answers = async (req, res, next) => {
  const answers = await Answer.find().populate('user');
  console.log(answers)
  res.render("panel/questions/answers", {
    login: req.session.user,
    answers,
  });
};

const answerUpdate = async (req, res, next) => {
  console.log(req.body);

  const uploadFolder = path.join(__dirname, "../public/uploads/answers/");
  const form = new formidable.IncomingForm();
  let fieldName;
  /*     form.multiples = true;
    form.maxFileSize = 300 * 1024 * 1024; // 5MB
     */
  form.uploadDir = uploadFolder;

  let pdfFileName = uuidv4();
  form.on("fileBegin", function (name, file) {
    file.filepath = uploadFolder + pdfFileName + ".docx";
  });
  await form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(422).json({
        status: "Fail",
        message: "خطا در پارس اطلاعات فایل",
        error: err,
      });
    }
  });
  /*     form.on('file', function (name, file){
        console.log('Uploaded ' + file.originalFilename);
    }); */
  form.on("end", async function (name, file) {
    let answer = await Answer.findOne({user:req.session.user._id});
    if(answer){
      answer.file = `${pdfFileName}.docx`;
      answer.seen = false;
      try{
        await answer.save();
        return res.status(200).json({});
      }catch(err){
        next(err);
      }
    }else{
      try{
        const newAnswer = new Answer({
          user : req.session.user._id,
          file : `${pdfFileName}.docx`
        });
        await newAnswer.save();
        return res.status(200).json({});
      }catch(err){
        next(err);
      }
    }
  });
};
const setSeen = async (req, res, next) => {
  const answers = await Answer.findById(req.body.id);
  try{
    answers.seen = true;
   await answers.save();
   return res.status(200).json({});
  }catch(err){
    next(err);
  }
};

module.exports = {
  index,
  upload,
  update,
  answers,
  answerUpdate,
  setSeen,
};
