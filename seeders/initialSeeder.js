const Province = require("../models/Province");
const City = require("../models/City");
const provincesJson = require("../public/json/provinces.json");
const citiesJson = require("../public/json/cities.json");
var _ = require('lodash');
const HealthCenter = require("../models/HealthCenter");

const initialSeeder = async () => {
let a = 0;

  Province.find().then(async (provinces) => {
    if (provinces.length == 0) {
      provincesJson.forEach(async (val) => {
        let province = await Province.create({
             name: val.name, 
            });
          let prCities = _.filter(citiesJson, function(o) { return o.province_id == val.id; })
          prCities.forEach(async (val) => {
            let city =  await City.create({ 
                province: province._id,
                name: val.name,
            });
            if(a==0){
              await HealthCenter.create({ 
                province: province._id,
                city: city._id,
                name: 'Aniro',
            });
            }
            a++;
          });
      });
    }
  });

};

module.exports = { initialSeeder };
