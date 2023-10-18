const Patient = require("../models/Patient");

const moment = require('jalali-moment');
const { getJalali } = require("../utils/getJalali");
const User = require("../models/User");
const Vaccine = require("../models/Vaccine");

const regDetails = async (req, res, next) => {
    let userId = req.body.user._id;
    let patient = req.body.patientData;
    patient.user = userId;
    const newPatient = new Patient(patient);
    newPatient.save().then(async () => {
        const updateUser = await User.findOne({_id: userId});
        updateUser.patientProfileStatus = true;
        updateUser.province = req.body.user.province;
        updateUser.city = req.body.user.city;
        updateUser.hcenter = req.body.user.hcenter;
        updateUser.village = req.body.user.village;
        await updateUser.save();
        res.json({
            statusCode: 200,
            message: `Patient created successfully`
        });
    }).catch(err => next(err))
}
const e_crfs = async (req, res, next) => {
    /*     if (!req.params.user) {
            res.redirect('/panel/patients');
        } */
    try {
        let patient = await Patient.findOne({ user: req.session.user._id });
        let birthday = moment(patient.birthday).locale('fa').format('YYYY/MM/DD');
        patient.birthday = birthday;
        patient.e_crf.forEach((e_crf) => {
            let injectVaccineDate = moment(e_crf.injectVaccineDate).locale('fa').format('YYYY/MM/DD');
            let sideEffectDate = moment(e_crf.sideEffectDate).locale('fa').format('YYYY/MM/DD');
            e_crf.injectVaccineDate = injectVaccineDate;
            e_crf.sideEffectDate = sideEffectDate;
        });
        let crfAction = (req.session.crfAction) || (req.session.crfAction) || null;
        req.session.crfAction = null;
        
        res.render('panel/patient/e_crfs', {
            login:req.session.user,
            e_crfs: patient.e_crf,
            crfAction,
            user: req.params.user,
            getJalali
        });
    }catch(err){next(err)};
}


const e_crf_create = async (req, res, next) => {
    /*     if (!req.params.user) {
            res.redirect('/panel/patients');
        } */
    const patient = await Patient.findOne({ user: req.session.user._id });
    const vaccines = await Vaccine.find();

    try {
        res.render('panel/patient/e_crf_create', {
            login:req.session.user,
            gender:patient.gender,
            vaccines,
            e_crf:(patient.e_crf.length > 0)?patient.e_crf[patient.e_crf.length-1]:undefined,
            user: req.session.user._id,
        });
    } catch (err) { next(err) }

}
const e_crf_edit = async (req, res, next) => {
    if (!req.session.user._id) {
        res.redirect('/panel');
    }
    try {
        let patient_crf = await Patient.findOne({ "e_crf._id": req.params.crfId });
        let birthday = moment(patient_crf.birthday).locale('fa').format('YYYY/MM/DD');
        patient_crf.birthday = birthday;
        patient_crf.e_crf.forEach((e_crf) => {
            let injectVaccineDate = moment(e_crf.injectVaccineDate).locale('fa').format('YYYY/MM/DD');
            let sideEffectDate = moment(e_crf.sideEffectDate).locale('fa').format('YYYY/MM/DD');
            e_crf.injectVaccineDate = injectVaccineDate;
            e_crf.sideEffectDate = sideEffectDate;
        });
        let e_crf = patient_crf.e_crf.filter((e) => {
            return e._id.toString() == req.params.crfId
        })
        const vaccines = await Vaccine.find();

        res.render('panel/patient/e_crf_edit', {
            login:req.session.user,
            gender:patient_crf.gender,
            e_crf: e_crf[0],
            vaccines,
            user: patient_crf.user,
            crfId: req.params.crfId,
            getJalali
        });
    } catch (err) { next(err) }

}

const crfCreate = async (req, res, next) => {
    let e_crf = req.body;
    let injectVaccineDate = moment.from(e_crf.injectVaccineDate.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')
    let sideEffectDate = moment.from(e_crf.sideEffectDate.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')

    e_crf.injectVaccineDate = injectVaccineDate;
    e_crf.sideEffectDate = sideEffectDate;
    try {
        let new_crf = await Patient.findOne({ user: req.session.user._id });
        new_crf.e_crf.push(e_crf);
        await new_crf.save();
        res.json({
            statusCode: 200,
        });
    }catch(err){next(err)};
}
const crfEdit = async (req, res, next) => {
    let e_crf = req.body;
    let injectVaccineDate = moment.from(e_crf.injectVaccineDate.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')
    let sideEffectDate = moment.from(e_crf.sideEffectDate.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')

    e_crf.injectVaccineDate = injectVaccineDate;
    e_crf.sideEffectDate = sideEffectDate;
    try {
        let patient_crf = await Patient.findOne({ user: req.session.user._id });
        patient_crf.e_crf = patient_crf.e_crf.filter((e, key) => {
            if (e._id.toString() == e_crf.crfId) {
                patient_crf.e_crf[key].vaccineName = e_crf.vaccineName;
                patient_crf.e_crf[key].injectVaccineDate = e_crf.injectVaccineDate;
                patient_crf.e_crf[key].typeSideEffect = e_crf.typeSideEffect;
                patient_crf.e_crf[key].sideEffectDate = e_crf.sideEffectDate;
                patient_crf.e_crf[key].vaccineDose = e_crf.vaccineDose;
                patient_crf.e_crf[key].age = e_crf.age;
                patient_crf.e_crf[key].weight = e_crf.weight;
                patient_crf.e_crf[key].height = e_crf.height;
                patient_crf.e_crf[key].BMI = parseFloat(e_crf.weight / ((e_crf.height/10) * (e_crf.height/10)));
                patient_crf.e_crf[key].pregnancyStatus = e_crf.pregnancyStatus;
                patient_crf.e_crf[key].brestFeedingStatus = e_crf.brestFeedingStatus;
                patient_crf.e_crf[key].smoking = e_crf.smoking;
                return e;
            } else {
                return e;
            }
        })
        await patient_crf.save();
        res.json({
            statusCode: 200,
        });
    }catch(err){next(err)};
}

const deleteCrf = async (req, res, next) => {
    if (!req.params.crfId) {
        res.redirect('/panel/patients');
    }
    try {
        let del_crf = await Patient.findOne({ "e_crf._id": req.params.crfId });
        del_crf.e_crf = del_crf.e_crf.filter((e) => {
            return e._id.toString() != req.params.crfId
        })
        await del_crf.save();
        req.session.crfAction = 'success-delete';
        res.redirect(`${process.env.SITEURL}/panel/patient/e_crfs/${del_crf.user}`);
    }catch(err){next(err)};
}

module.exports = {
    regDetails,
    e_crfs,
    crfCreate,
    crfEdit,
    deleteCrf,
    e_crf_create,
    e_crf_edit

}