const Vaccine = require("../models/Vaccine");

const vaccines = async (req, res, next) => {
    const vaccines = await Vaccine.find();
  res.render("panel/vaccines", {
    vaccines,
    login: req.session.user,
  });
};
const createVaccine = async (req, res, next) => {
    try{
        const {vaccineName:name} = req.body
        await Vaccine.create({name})
        res.json({
            statusCode: 200
        })
    }catch(err){next(err);}
};
const editVaccine = async (req, res, next) => {
    try{
        const {_id,name} = req.body
        await Vaccine.findByIdAndUpdate(_id,{name})
        res.json({
            statusCode: 200
        })
    }catch(err){next(err);}
};
const deleteVaccine = async (req, res, next) => {
    try{
        const {_id} = req.params
        await Vaccine.findByIdAndDelete(_id)
        res.redirect('/panel/vaccines')
    }catch(err){next(err);}
};

module.exports = {
  vaccines,
  createVaccine,
  editVaccine,
  deleteVaccine
};
