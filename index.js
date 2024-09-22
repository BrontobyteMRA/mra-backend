import express, { json, urlencoded } from 'express';
import mongoose, { connect } from 'mongoose';
const { Schema } = mongoose;
const Size = global.Size;
const app = express();
const PORT = process.env.PORT || 3050;
app.use(urlencoded({ extended: true }));
app.use(json());

// const mongoDBAtlasIP = 'mongodb+srv://mubashirhussain:ZNbjJ8gy1SHvPFEU@cluster0.a1bvhv9.mongodb.net/?retryWrites=true&w=majority';
// mongoose.connect(`${mongoDBAtlasIP}brontobyteDB`).then(() => {
//     console.log("mongodb connected")
// });

// const mongoDBAtlasIP = 'mongodb+srv://mubashirhussain:ZNbjJ8gy1SHvPFEU@cluster0.a1bvhv9.mongodb.net/';

// mongoose.connect(`${mongoDBAtlasIP}brontobyteDB`);

import authRoutes from './routes/auth.routes.js';
import meterRoutes from './routes/meter.routes.js';
import roleRoutes from './routes/roles.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/meters', meterRoutes);
app.use('/api/roles', roleRoutes);
const mongoDBAtlasIP = 'mongodb+srv://mubashirhussain:ZNbjJ8gy1SHvPFEU@cluster0.a1bvhv9.mongodb.net/?retryWrites=true&w=majority';

connect(`${mongoDBAtlasIP}brontobyteDB`, {
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// const MeterReading = mongoose.model('meterreading', meterReadingSchema);
// const User = mongoose.model('user', userSchema);

// app.post('/api/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ 'username': username, 'password': password });
//     if (!user) {
//         return res.status(401).send('Invalid credentials');
//     }
//     res.json({ message: 'Login successful', user });
// });

// app.post('/api/signup', async (req, res) => {
//     const { username, password, role } = req.body;
//     try {
//         // const newUser = await User.create({ Username: username, Password: password, Role: role });
//         const newUser = await User.create({ username, password, role });
//         res.status(201).json(newUser);
//     } catch (err) {
//         console.log(err);
//         res.status(400).send('Error creating user');
//     }
// });

// app.get('/api/getAllRoutes', async (req, res) => {
//     try {
//         const routes = await MeterReading.find().distinct('Routes');
//         res.status(200).json({ routes });
//     } catch (error) {
//         console.error('Error getting routes:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

// app.get('/api/getRoute/:route', async (req, res) => {
//     try {
//         const route = req.params.route;
//         const routes = await MeterReading.find({ Routes: route });

//         if (!routes) {
//             return res.status(404).json({ message: 'Route not found for the specified route' });
//         }

//         res.status(200).json({ meters: routes });
//     } catch (error) {
//         console.error('Error getting route:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

// app.get('/api/getAccountDetails/:accNr', async (req, res) => {
//     try {
//         const accNr = req.params.accNr;
//         const accounts = await MeterReading.find({ 'AccNr': Number(accNr) });

//         if (!accounts || accounts.length === 0) {
//             return res.status(404).json({ message: 'No accounts found for the specified account number' });
//         }

//         res.status(200).json({ accounts });
//     } catch (error) {
//         console.error('Error getting accounts:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });


// app.post('/api/updateReadings', async (req, res) => {
//     try {
//         const mtNr = req.body.mtNr;
//         const currentKva = req.body.currentKva;
//         const currentKwh = req.body.currentKwh;
//         if (currentKva == undefined) {
//             const account = await MeterReading.findOne({ 'MtNr': Number(mtNr), 'MetType': "ME01" });
//             if (!account || account.length === 0) {
//                 return res.status(404).json({ message: 'No account found for the specified account number' });
//             }
//             if (account && currentKwh > account.CurrRead) {
//                 const MtrConsumption = currentKwh - account.CurrRead;
//                 const result = await MeterReading.findOneAndUpdate(
//                     { 'MtNr': Number(mtNr), 'MetType': "ME01" },
//                     { $set: { 'CurrRead': currentKwh, 'PrevRead': account.CurrRead, 'Consumption': MtrConsumption } }, { new: true }
//                 );
//                 const updatedAccounts = await MeterReading.find({ 'MtNr': Number(mtNr), 'MetType': "ME01" });
//                 return res.status(200).json({ accounts: updatedAccounts });
//             } else {
//                 return res.status(422).json({ accounts: {}, message: "Current Kwh is less than previous Kwh" });
//             }
//         } else if (currentKva != undefined) {
//             const accounts = await MeterReading.find({ 'MtNr': Number(mtNr) });
//             if (!accounts || accounts.length === 0) {
//                 return res.status(404).json({ message: 'No account found for the specified account number' });
//             }
//             try {
//                 if (accounts && currentKwh > accounts[0].CurrRead) {
//                     const MtrConsumption = currentKwh - accounts[0].CurrRead;
//                     const result = await MeterReading.findOneAndUpdate(
//                         { 'MtNr': Number(mtNr), 'MetType': "ME01" },
//                         { $set: { 'CurrRead': currentKwh, 'PrevRead': accounts[0].CurrRead, 'Consumption': MtrConsumption } }, { new: true }
//                     );
//                     const result1 = await MeterReading.findOneAndUpdate(
//                         { 'MtNr': Number(mtNr), 'MetType': "ME03" },
//                         { $set: { 'CurrRead': currentKva, 'Consumption': currentKva } }, { new: true }
//                     );
//                     const updatedAccounts = await MeterReading.find({ 'MtNr': Number(mtNr) });
//                     return res.status(200).json({ accounts: updatedAccounts });
//                 } else {
//                     return res.status(422).json({ accounts: {}, message: "Current Kwh is less than previous Kwh" });
//                 }
//             } catch (error) {
//                 console.log(error);
//             }

//         }
//         // res.status(200).json({ account: account });
//     } catch (error) {
//         console.error('Error getting accounts:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

// app.post('/api/submitReadings', async (req, res) => {
//     try {
//         const mtNr = req.body.mtNr;
//         // const kva = req.body.kva;
//         const account = await MeterReading.findOne({ 'MtNr': Number(mtNr) });
//         if (!account || account.length === 0) {
//             return res.status(404).json({ error: 'No account found for the specified account number' });
//         }
//         if (account) {
//             const result = await MeterReading.updateMany(
//                 { 'MtNr': Number(mtNr) },
//                 { $set: { 'isSubmitted': true } }, { upsert: true, new: true }
//             );
//             return res.status(200).json({ success: result ? true : false });
//         } else {
//             return res.status(422).json({ accounts: {} });
//         }
//         // res.status(200).json({ account: account });
//     } catch (error) {
//         console.error('Error getting accounts:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

// app.get('/api/admin', checkRole('Admin'), (req, res) => {
//     res.send(`Welcome ${req.user.role}: ${req.user.username}`);
// });

// app.get('/api/vendor', checkRole('Vendor'), (req, res) => {
//     res.send(`Welcome ${req.user.role}: ${req.user.username}`);
// });

// app.get('/api/user', checkRole('User'), (req, res) => {
//     res.send(`Welcome ${req.user.role}: ${req.user.username}`);
// });
