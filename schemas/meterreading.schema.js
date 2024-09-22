import { Schema, model } from 'mongoose';


const meterReadingSchema = new Schema({
    Routes: {
        type: String,
        required: true
    },
    AccNr: {
        type: Number,
        required: true
    },
    MetType: {
        type: String,
        enum: ['ME01', 'ME03'],
        required: true
    },
    SeqNo: {
        type: Number,
        required: true
    },
    MtNr: {
        type: Number,
        required: true
    },
    CurrRead: {
        type: Number,
        required: true
    },
    PrevRead: {
        type: Number,
        required: true
    },
    AccName: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    PreDec: {
        type: Number,
        required: true
    },
    PostDec: {
        type: Number,
        required: true
    },
    BillFactor: {
        type: Number,
        required: true
    },
    Resettable: {
        type: Boolean,
        required: false
    },
    Consumption: {
        type: Number,
        required: true
    },
    isSubmitted: {
        type: Boolean,
        required: false
    }
});

export default model('meterreading', meterReadingSchema);
