const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;
const { Types } = require('mongoose');


const Size = global.Size;
const app = express();
const PORT = process.env.PORT || 3050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const mongoDBAtlasIP = 'mongodb+srv://mubashirhussain:ZNbjJ8gy1SHvPFEU@cluster0.a1bvhv9.mongodb.net/?retryWrites=true&w=majority';
// mongoose.connect(`${mongoDBAtlasIP}brontobyteDB`).then(() => {
//     console.log("mongodb connected")
// });

const mongoDBAtlasIP = 'mongodb+srv://mubashirhussain:ZNbjJ8gy1SHvPFEU@cluster0.a1bvhv9.mongodb.net/';

mongoose.connect(`${mongoDBAtlasIP}brontobyteDB`);

// const client = new MongoClient('mongodb+srv://mubashirhussain:ZNbjJ8gy1SHvPFEU@cluster0.a1bvhv9.mongodb.net/?retryWrites=true&w=majority');

// The connect() method does not attempt a connection; instead it instructs
// the driver to connect using the settings provided when a connection
// is required.
// await client.connect();

// const dbName = "brontobyteDB";
// const collectionName = "brontobyte";

// const database = client.db(dbName);
// const collection = database.collection(collectionName);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


const meterReadingSchema = new mongoose.Schema({
    Routes: {
        type: String,
        required: true
    },
    'Acc Nr': {
        type: Number,
        required: true
    },
    'Met Type': {
        type: String,
        enum: ['ME01', 'ME03'],
        required: true
    },
    'Seq No': {
        type: Number,
        required: true
    },
    'MtNr': {
        type: Number,
        required: true
    },
    'Curr Read': {
        type: Number,
        required: true
    },
    'Prev Read': {
        type: Number,
        required: true
    },
    'Acc Name': {
        type: String,
        required: true
    },
    'Address': {
        type: String,
        required: true
    },
    'Pre-Dec': {
        type: Number,
        required: true
    },
    'Post-Dec': {
        type: Number,
        required: true
    },
    'Bill Factor': {
        type: Number,
        required: true
    },
    'Resettable': {
        type: Boolean,
        required: false
    },
    'Consumption': {
        type: Number,
        required: true
    }
});

const MeterReading = mongoose.model('meterreading', meterReadingSchema);


app.get('/api/getAllRoutes', async (req, res) => {
    try {
        const routes = await MeterReading.find().distinct('Routes');
        res.status(200).json({ routes });
    } catch (error) {
        console.error('Error getting routes:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/api/getRoute/:route', async (req, res) => {
    try {
        const route = req.params.route;
        const routes = await MeterReading.find({ Routes: route });

        if (!routes) {
            return res.status(404).json({ error: 'Route not found for the specified route' });
        }

        res.status(200).json({ routes });
    } catch (error) {
        console.error('Error getting route:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/api/getAccountDetails/:accNr', async (req, res) => {
    try {
        const accNr = req.params.accNr;
        const accounts = await MeterReading.find({ 'AccNr': Number(accNr) });

        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ error: 'No accounts found for the specified account number' });
        }

        res.status(200).json({ accounts });
    } catch (error) {
        console.error('Error getting accounts:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/getAccountDetails/:mtNr', async (req, res) => {
    try {
        const mtNr = req.params.mtNr;
        const accounts = await MeterReading.find({ 'MtNr': Number(mtNr) });

        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ error: 'No accounts found for the specified account number' });
        }

        res.status(200).json({ accounts });
    } catch (error) {
        console.error('Error getting accounts:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

