const mongoose = require('mongoose');
const Patient = mongoose.model('Patient', {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        dropDups: true
    },
    birthday: {
        type: Date,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    educationRate: {
        type: String,
        default: ''
    },
    jobStatus: {
        type: String,
        default: ''
    },
    ecoStatus: {
        type: String,
        default: ''
    },
    address:{
        type: String,
        default: ''
    },
    phone: {
        home: {
            type: String,
            default: ''
        },
        cellphone: {
            type: String,
            default: ''
        },
        emergancy: {
            type: String,
            default: ''
        }
    },
    postCode: {
        type: String,
        default: ''
    },

    healthHistory: {
        chronicDiseases: { type: Array, default: [] },
        diseasesChecks: { type: Array, default: [] },
        testResult: {
            type: Boolean,
            default: false
        },
        allergy: {
            type: Boolean,
            default: false
        },
    },
    e_crf: [{
        vaccineName: {
            type: String,
            required: true
        },
        injectVaccineDate: {
            type: Date,
            required: true
        },
        typeSideEffect: {
            otherTypeSideEffect: { type: String, default: '' },
            typeSideEffectChecks: { type: Array, default: [] }
        },
        created_at: {
            type: Date,
            required: true
        },
        sideEffectDate: {
            type: Date,
            required: true
        },
        vaccineDose: {
            type: Number
        },
        age: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        BMI: {
            type: Number,
            required: true
        },
        pregnancyStatus: {
            type: Boolean,
            default: false
        },
        brestFeedingStatus: {
            type: Boolean,
            default: false
        },
        smoking: {
            type: Boolean,
            required: true
        },
    }
    ]
});

module.exports = Patient;