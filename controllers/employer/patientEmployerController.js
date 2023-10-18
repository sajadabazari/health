const HealthCenter = require("../../models/HealthCenter");
const Patient = require("../../models/Patient");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const { getJalali } = require("../../utils/getJalali");

const moment = require('jalali-moment');
const Vaccine = require("../../models/Vaccine");

const patients = async (req, res, next) => {
    try {
        let merged = []
        let pCount;
        //  const users = await User.find({ "isEmployer.is": false });
        let page = (req.params.page == undefined || req.params.page == 1) ? 0 : (req.params.page - 1) * 7;
        if (req.session.user.accessibility.userLevel == 'Expert') {
            const users = await User.find({ "isEmployer.is": false });
            const _usersId = await User.find({ "isEmployer.is": false }, '_id');
            let __listId = []
            _usersId.forEach((_id) => {
                __listId.push(_id._id.toString());
            });            
            const Expert = await User.findOne({ _id: req.session.user._id });
            
            let createdListId = __listId.filter(value => Expert.isEmployer.createdPatients.includes(value));
            Expert.isEmployer.createdPatients = createdListId;
            await Expert.save();


            let ExpertHealthCenter = await HealthCenter.findById(req.session.user.isEmployer.HealthCenter);
            let listHCenters,healthCarePatients;
            if(ExpertHealthCenter.city == ''){
                healthCenters = await HealthCenter.find({province:ExpertHealthCenter.province},'_id');
            }else if(ExpertHealthCenter.village == '' && ExpertHealthCenter.name == ''){
                healthCenters = await HealthCenter.find({city:ExpertHealthCenter.city},'_id');
            }else{
                healthCenters = await HealthCenter.find({name:ExpertHealthCenter.name});
                
            }

            listHCenters = healthCenters.map(field => field._id);
            healthCarePatients = await User.find({$or:[{"accessibility.userLevel":'HealthCare'},{"accessibility.userLevel":'Expert'}],"isEmployer.HealthCenter":{$in:listHCenters}},"isEmployer.createdPatients")
            
            const listId=[];
            healthCarePatients.map((field)=>{
                    listId.push(...field.isEmployer.createdPatients);
                })
            pCount = await Patient.find({ 'userId': { $in: listId } }).count();
            const patients = await Patient.find({ 'userId': { $in: listId } }).skip(page).limit(7).sort({ _id: -1 });
            patients.forEach((patient, key) => {
                let p = users.find(u => u._id.toString() == patient.user)
                //delete p._id
                user = p;
                merged.push({
                    user,
                    patient
                });

            })
        } else {
            let healthCenter = await HealthCenter.findOne({ _id: req.session.user.isEmployer.HealthCenter })
            const users = await User.find({ "isEmployer.is": false });
            const usersId = await User.find({ "isEmployer.is": false }, '_id');
            let listId = []
            usersId.forEach((_id) => {
                listId.push(_id._id.toString());
            });
            const HealthCare = await User.findOne({ _id: req.session.user._id });
            
            let createdListId = listId.filter(value => HealthCare.isEmployer.createdPatients.includes(value));
            HealthCare.isEmployer.createdPatients = createdListId;
            await HealthCare.save();
            pCount = await Patient.find({ 'userId': { $in: createdListId } }).count();
            const patients = await Patient.find({ 'userId': { $in: createdListId } }).skip(page).limit(7).sort({ _id: -1 });
            patients.forEach((patient, key) => {
                let p = users.find(u => u._id.toString() == patient.user)
                //delete p._id
                user = p;
                merged.push({
                    user,
                    patient
                });

            })

        }
        let userAction = (req.session.userAction) || (req.session.userAction) || null;
        req.session.userAction = null;
        res.render('panel/employer/patients', {
            login: req.session.user,
            users: merged,
            userAction,
            page: (page / 7) == 0 ? 1 : (page / 7) + 1,
            endPage: Math.ceil(pCount / 7)
        });

    } catch (err) { next(err) }

}
const create = async (req, res, next) => {
    try {
        const healthCenter = await HealthCenter.findById(req.session.user.isEmployer.HealthCenter)
        res.render('panel/employer/create_user', {
            login: req.session.user,
            healthCenter
        });
    } catch (err) { next(err) }
}
const edit = async (req, res, next) => {
    if (!req.params._id) {
        res.redirect(`${process.env.SITEURL}/panel/em/patients`);
    }
    //  console.log(new mongoose.Types.ObjectId(req.params.id.trim()))
    try {
        const id = mongoose.Types.ObjectId(req.params._id);
        let editingUser = await User.findById(id);
        let patient = await Patient.findOne({ user: editingUser._id });
        if (!patient) {
            patient = {
                user: '',
                birthday: '',
                gender: '',
                educationRate: '',
                jobStatus: '',
                ecoStatus: '',
                phone: {
                    home: '',
                    work: '',
                    cellphone: '',
                    fax: '',
                    cellular: '',
                    healthCarePrxy: '',
                    emergancy: '',
                    emergancy: ''
                },
                address: {
                    province: '',
                    city: '',
                    village: '',
                    postCode: '',
                }
            }
        } else {
            if (patient.birthday != '') {
                const date = new Date(patient.birthday);
                //extract the parts of the date
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                patient.birthday = `${year}/${month}/${day}`;
            }
        }
        res.render('panel/employer/edit_user', {
            login: req.session.user,
            user: editingUser,
            patient

        });
    } catch (err) {
        next(err);
    }
}
const ptnCreate = async (req, res, next) => {
    let user = req.body.userData;
    let patient = req.body.patientData;
    let birthday = moment.from(patient.birthday.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')
    patient.birthday = birthday;
    try {
        user.password = await bcrypt.hash(user.password, 12);
        user.patientProfileStatus = true;
        const newUser = new User(user);
        newUser.save().then(async (_user) => {
            patient.user = _user._id.toString();
            //if (req.session.user.accessibility.userLevel == 'HealthCare') {
                const upCreatedList = await User.findOne({ _id: req.session.user._id });
                upCreatedList.isEmployer.createdPatients.push(_user._id.toString());
                await upCreatedList.save();
           // }
            const newPatient = new Patient(patient);
            newPatient.save().then(async () => {
                res.json({
                    statusCode: 200
                });
            }).catch((err) => { next(err) })
        });
    } catch (err) { next(err) }
}
const ptnEdit = async (req, res, next) => {
    let user = req.body.userData;
    let patient = req.body.patientData;
    let editingUser = await User.findById(user._id);

    if (user.password != '') {
        user.password = await bcrypt.hash(user.password, 12);
        editingUser.password = user.password;
    }
    editingUser.fname = user.fname;
    editingUser.lname = user.lname;
    editingUser.nationalCode = user.nationalCode;
    editingUser.email = user.email;
    editingUser.username = user.username;
    editingUser.isEmployer = user.isEmployer;
    editingUser.accessibility = user.accessibility;
    editingUser.save().then(async () => {
        patient.user = user._id.toString();
        const editingPatient = await Patient.findOne({ user: user._id });
        if (editingPatient) {
            let birthday = moment(editingPatient.birthday).locale('fa').format('YYYY/MM/DD');
            editingPatient.user = patient.user;
            editingPatient.birthday = birthday;
            editingPatient.gender = patient.gender;
            editingPatient.educationRate = patient.educationRate;
            editingPatient.jobStatus = patient.jobStatus;
            editingPatient.ecoStatus = patient.ecoStatus;
            editingPatient.address = patient.address;
            editingPatient.phone = patient.phone;

            editingPatient.save().then(async () => {
                res.json({
                    statusCode: 200
                });
            }).catch(err => next(err))
        } else {
            try {
                const newPatient = new Patient(patient);
                await newPatient.save();
                res.json({
                    statusCode: 200
                });
            } catch (err) { next(err) };

        }

    }).catch(err => next(err));


}
const deleteUser = async (req, res, next) => {
    if (!req.params.id) {
        res.redirect(`${process.env.SITEURL}/panel/em/patients`);
    }
    try {
        const delUser = await User.findByIdAndDelete(req.params.id);
        await Patient.findOneAndDelete({ 'userId': req.params.id });
        if (delUser) {
            req.session.userAction = 'success-delete';
            res.redirect(`${process.env.SITEURL}/panel/em/patients`);
        }
    } catch (err) {
        next(err);
    }
}
const set_history = async (req, res, next) => {
    try {
        let patient_history = req.body;

        const upData = await Patient.findOne({ user: patient_history._id })
        upData.healthHistory = {
            allergy: (patient_history.allergy == 'yes') ? true : false,
            testResult: (patient_history.testResult == 'yes') ? true : false,
            chronicDiseases: patient_history.chronicDiseases
        }
        await upData.save();
        res.json({
            statusCode: 200,
            b: patient_history.chronicDiseases

        })
    } catch (err) { next(err); }
}
const search = async (req, res, next) => {
    if (req.params.input == undefined) {
        res.redirect('/panel/em/patients');
    }
    try {
        let page = (req.params.page == undefined || req.params.page == 1) ? 0 : (req.params.page - 1) * 7;
        let countUsers = await User.find().count();

        const users = await User.find({
            $or: [
                { 'fname': { $regex: '.*' + req.params.input + '.*' } },
                { 'lname': { $regex: '.*' + req.params.input + '.*' } },
                { 'username': { $regex: '.*' + req.params.input + '.*' } },
                { 'nationalCode': { $regex: '.*' + req.params.input + '.*' } },
                { 'email': { $regex: '.*' + req.params.input + '.*' } }
            ]
        }).skip(page).limit(7);
        const usersId = await User.find({
            $or: [
                { 'fname': { $regex: '.*' + req.params.input + '.*' } },
                { 'lname': { $regex: '.*' + req.params.input + '.*' } },
                { 'username': { $regex: '.*' + req.params.input + '.*' } },
                { 'nationalCode': { $regex: '.*' + req.params.input + '.*' } },
                { 'email': { $regex: '.*' + req.params.input + '.*' } }
            ]
        }, '_id').skip(page).limit(7);
        let listId = []
        usersId.forEach((_id) => {
            listId.push(_id._id.toString());
        });
        const patients = await Patient.find({ 'userId': { $in: listId } });


        let merged = []
        patients.forEach((patient, key) => {

            let p = users.find(u => u._id.toString() == patient.user)
            //delete p._id
            user = p;
            merged.push({
                user,
                patient
            });

        })

        // res.render('panel/users',{users,login:req.session.user});
        let userAction = (req.session.userAction) || (req.session.userAction) || null;
        req.session.userAction = null;
        res.render('panel/employer/patients', {
            login: req.session.user,
            users: merged,
            userAction,
            page: (page / 7) == 0 ? 1 : (page / 7) + 1,
            endPage: Math.ceil(countUsers / 7)
        });
    } catch (err) { next(err) };

}


//=====================================CRF==========================================

const e_crf_create = async (req, res, next) => {
    if (!req.params.user) {
        res.redirect('/panel/em/patients');
    }
    try {
        const patient = await Patient.findOne({ user: req.params.user });
        let user = await User.findById(patient.user);
        const vaccines = await Vaccine.find();

        res.render('panel/employer/e_crf_create', {
            login: req.session.user,
            gender: patient.gender,
            e_crf: (patient.e_crf.length > 0) ? patient.e_crf[patient.e_crf.length - 1] : undefined,
            user,
            vaccines,
            user: req.params.user
        });
    } catch (err) { next(err) }

}
const e_crf_edit = async (req, res, next) => {
    if (!req.params.crfId) {
        res.redirect('/panel/em/patients');
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
        let user = await User.findById(patient_crf.user);
        const vaccines = await Vaccine.find();

        res.render('panel/employer/e_crf_edit', {
            login: req.session.user,
            gender: patient_crf.gender,
            e_crf: e_crf[0],
            user,
            vaccines,
            user: patient_crf.user,
            crfId: req.params.crfId,
            getJalali
        });
    } catch (err) { next(err) }

}

const e_crfs = async (req, res, next) => {
    if (!req.params.user) {
        res.redirect('/panel/em/patients');
    }
    try {
        let patient = await Patient.findOne({ user: req.params.user });
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
        let user = await User.findById(patient.user);

        res.render('panel/employer/e_crfs', {
            login: req.session.user,
            e_crfs: patient.e_crf,
            user,
            crfAction,
            user: req.params.user,
            getJalali
        });
    } catch (err) { next(err) };
}
const crfCreate = async (req, res, next) => {
    let e_crf = req.body;
    let injectVaccineDate = moment.from(e_crf.injectVaccineDate.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')
    let sideEffectDate = moment.from(e_crf.sideEffectDate.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')

    e_crf.injectVaccineDate = injectVaccineDate;
    e_crf.sideEffectDate = sideEffectDate;
    try {
        let new_crf = await Patient.findOne({ user: e_crf.user });
        delete e_crf.user;
        new_crf.e_crf.push(e_crf);
        await new_crf.save();
        res.json({
            statusCode: 200,
        });
    } catch (err) {
        next(err)
    };
}
const crfEdit = async (req, res, next) => {
    let e_crf = req.body;
    let injectVaccineDate = moment.from(e_crf.injectVaccineDate.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')
    let sideEffectDate = moment.from(e_crf.sideEffectDate.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')

    e_crf.injectVaccineDate = injectVaccineDate;
    e_crf.sideEffectDate = sideEffectDate;
    try {
        let patient_crf = await Patient.findOne({ user: e_crf.user });
        patient_crf.e_crf = patient_crf.e_crf.filter((e, key) => {
            if (e._id.toString() == e_crf.crfId) {
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
        })
        await patient_crf.save();
        res.json({
            statusCode: 200,
        });
    } catch (err) { next(err) };
}

const deleteCrf = async (req, res, next) => {
    if (!req.params.crfId) {
        res.redirect('/panel/em/patients');
    }
    try {
        let del_crf = await Patient.findOne({ "e_crf._id": req.params.crfId });
        del_crf.e_crf = del_crf.e_crf.filter((e) => {
            return e._id.toString() != req.params.crfId
        })
        await del_crf.save();
        req.session.crfAction = 'success-delete';
        res.redirect(`${process.env.SITEURL}/panel/em/patient/e_crfs/${del_crf.user}`);
    } catch (err) { next(err) };
}

module.exports = {
    patients,
    create,
    ptnCreate,
    edit,
    ptnEdit,
    deleteUser,
    set_history,
    search,
    e_crf_edit,
    e_crf_create,
    e_crfs,
    crfCreate,
    deleteCrf,
    crfEdit,
}