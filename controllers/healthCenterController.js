const HealthCenter = require("../models/HealthCenter")
const City = require("../models/City")
const Province = require("../models/Province")
const Village = require("../models/Village")

const index = async (req, res, next) => {
    try {
       //let page = (req.params.page == undefined || req.params.page == 1) ? 0 : (req.params.page - 1) * 7;
        //let hCCount = await HealthCenter.find().count();
        const healthCenters = await HealthCenter.find().populate('city','name').populate('province','name');
  
             //   city = await City.find().populate('province','name');

     //   let hCAction = (req.session.hCAction) || (req.session.hCAction) || null;
        req.session.hCAction = null;
        const provinces = await Province.find();
        console.log(provinces)
        res.render('panel/centers/index', {
            login:req.session.user,
            healthCenters,
            provinces
        })
    } catch (err) { next(err) };
}
const villages = async (req, res, next) => {
    try {
        if(req.params.id == undefined){
            res.redirect('/panel/healthcenters');
        }  
        let villages = await Village.find({hcenter:req.params.id});
     const healthCenter = await HealthCenter.findById(req.params.id).populate('city','name').populate('province','name');
        res.render('panel/villages/index', {
            login:req.session.user,
            villages,
            healthCenter
        })
    } catch (err) { next(err) };
}
const getCount = async (req, res, next) => {
    /*     try {
    
        } catch (err) { next(err) }; */
    let hCCount = await HealthCenter.find().count();
    res.json({
        count: hCCount
    })
}
const getCities = async (req, res, next) => {
    /*     try {
    
        } catch (err) { next(err) }; */
        let id = req.body.id;
    let cities = await City.find({province:id});
    res.json(cities)
}
const getHCenters = async (req, res, next) => {
    let id = req.body.id;
    let hcenters = await HealthCenter.find({city:id});
    res.json(hcenters)
}
const getVillages = async (req, res, next) => {
    let id = req.body.id;
    let villages = await Village.find({hcenter:id});
    res.json(villages)
}
const create = async (req, res, next) => {
    const hcenter = new HealthCenter(req.body);
    try {
        await hcenter.save();
        res.json({
            statusCode: 200
        })
    } catch (err) { next(err) }

}
const regHCenter = async (req, res, next) => {
    let hcenter = new HealthCenter(req.body);
    try {
        const province = await Province.findById(req.body.province);
        const city = await City.findById(req.body.city);
        hcenter = await hcenter.save();
        res.json({
            hcenter,
            province,
            city,
            statusCode: 200
        })
    } catch (err) { next(err) }

}
const regVillage = async (req, res, next) => {
    let village = new Village(req.body);

    try {
        village = await village.save();
        const hcenter = await HealthCenter.findById(req.body.hcenter).populate('city','name').populate('province','name');

        res.json({
            village,
            hcenter,
            statusCode: 200
        })
    } catch (err) { next(err) }

}
const edit = async (req, res, next) => {
    try {
        await HealthCenter.findOneAndUpdate({ _id: req.body._id }, req.body.hInfo);
        res.json({
            statusCode: 200,
        })
    } catch (err) { next(err) }

}
const updateVillage = async (req, res, next) => {
    try {
        await Village.findOneAndUpdate({ _id: req.body.id }, {name:req.body.name});
        res.json({
            statusCode: 200,
        })
    } catch (err) { next(err) }

}
const updateHCenter = async (req, res, next) => {
    try {
        await HealthCenter.findOneAndUpdate({ _id: req.body.id }, {name:req.body.name});
        res.json({
            statusCode: 200,
        })
    } catch (err) { next(err) }

}

const deleteVillage = async (req, res, next) => {
    try {
        await Village.findOneAndDelete({ _id: req.body.id });
        res.json({'status':200});
    } catch (err) { next(err) }

}
const deleteHCenter = async (req, res, next) => {
    try {
        await HealthCenter.findOneAndDelete({ _id: req.body.id });
        res.json({'status':200});
    } catch (err) { next(err) }

}
const search = async (req, res, next) => {
    if (req.params.input == undefined) {
        res.redirect('/panel/healthcenters');
      }
    let page = (req.params.page == undefined || req.params.page == 1) ? 0 : (req.params.page - 1) * 7;
    let hCCount = await HealthCenter.find({$or: [
        { 'name': { $regex: '.*' + req.params.input + '.*' } }, 
        { 'province': { $regex: '.*' + req.params.input + '.*' } },
        { 'city': { $regex: '.*' + req.params.input + '.*' } }
    ]});
    HealthCenter.find({$or: [
        { 'name': { $regex: '.*' + req.params.input + '.*' } }, 
        { 'province': { $regex: '.*' + req.params.input + '.*' } },
        { 'city': { $regex: '.*' + req.params.input + '.*' } }
    ]}).skip(page).limit(7).then((healthCenters) => {
        // res.render('panel/users',{users,login:req.session.user});
        let hCAction = (req.session.hCAction) || (req.session.hCAction) || null;
        req.session.hCAction = null;
        res.render('panel/health_centers', {
            healthCenters, login:req.session.user,
            hCAction,
            page: (page / 7) == 0 ? 1 : (page / 7) + 1,
            endPage: Math.ceil(hCCount / 7)
        });
    }).catch(err => next(err));
}

module.exports = {
    index,
    getCount,
    create,
    edit,
    search,
    deleteVillage,
    deleteHCenter,
    updateHCenter,
    updateVillage,
    getCities,
    getHCenters,
    getVillages,
    regHCenter,
    regVillage,
    villages
}