import axios from 'axios';
import MeterReading from '../schemas/meterreading.schema.js'; // Ensure you import User correctly



export async function getAllRoutes(req, res) {
    try {
        const routes = await MeterReading.find().distinct('Routes');
        res.status(200).json({ routes });
    } catch (error) {
        console.error('Error getting routes:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function odataReadings(req, res) {
    try {
        // Basic auth credentials
        const username = 'zubair';
        const password = 'Welcome@1234';

        // Constructing the OData URL with parameters
        const odataUrl = `http://is1:8000/sap/opu/odata/sap/ZMRA_PROJECT_SRV/GetMeterReadSet?$filter=Adatsoll eq datetime'2024-01-31T00:00:00' and Termschl eq 'MOHAN1'`;

        // Making the request to the SAP server using axios
        const response = await axios.get(odataUrl, {
            auth: {
                username: username,
                password: password
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Extract data from the OData response and remove "d" and "results"
        const odataResponse = response.data.d.results;

        // Returning the simplified response directly
        res.status(200).json({ success: true, data: odataResponse });
    } catch (error) {
        console.error('Error fetching OData from SAP:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function getRoute(req, res) {
    try {
        const route = req.params.route;
        const routes = await MeterReading.find({ Routes: route });

        if (!routes) {
            return res.status(404).json({ message: 'Route not found for the specified route' });
        }

        res.status(200).json({ meters: routes });
    } catch (error) {
        console.error('Error getting route:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function getAccountDetails(req, res) {
    try {
        const accNr = req.params.accNr;
        const accounts = await MeterReading.find({ 'AccNr': Number(accNr) });

        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ message: 'No accounts found for the specified account number' });
        }

        res.status(200).json({ accounts });
    } catch (error) {
        console.error('Error getting accounts:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function updateReadings(req, res) {
    try {
        const { mtNr, currentKva, currentKwh } = req.body;

        if (currentKva == undefined) {
            const account = await MeterReading.findOne({ 'MtNr': Number(mtNr), 'MetType': "ME01" });
            if (!account || account.length === 0) {
                return res.status(404).json({ message: 'No account found for the specified account number' });
            }
            if (currentKwh > account.CurrRead) {
                const MtrConsumption = currentKwh - account.CurrRead;
                const result = await MeterReading.findOneAndUpdate(
                    { MtNr: Number(mtNr), MetType: "ME01" },
                    { $set: { CurrRead: currentKwh, PrevRead: account.CurrRead, Consumption: MtrConsumption } }, { new: true }
                );
                const updatedAccounts = await MeterReading.find({ 'MtNr': Number(mtNr), 'MetType': "ME01" });
                return res.status(200).json({ accounts: updatedAccounts });
            } else {
                return res.status(422).json({ accounts: {}, message: "Current Kwh is less than previous Kwh" });
            }
        } else if (currentKva != undefined) {
            const accounts = await MeterReading.find({ 'MtNr': Number(mtNr) });
            if (!accounts || accounts.length === 0) {
                return res.status(404).json({ message: 'No account found for the specified account number' });
            }

            if (accounts && currentKwh > accounts[0].CurrRead) {
                const MtrConsumption = currentKwh - accounts[0].CurrRead;
                const result = await MeterReading.findOneAndUpdate(
                    { 'MtNr': Number(mtNr), 'MetType': "ME01" },
                    { $set: { 'CurrRead': currentKwh, 'PrevRead': accounts[0].CurrRead, 'Consumption': MtrConsumption } }, { new: true }
                );
                const result1 = await MeterReading.findOneAndUpdate(
                    { 'MtNr': Number(mtNr), 'MetType': "ME03" },
                    { $set: { 'CurrRead': currentKva, 'Consumption': currentKva } }, { new: true }
                );
                const updatedAccounts = await MeterReading.find({ 'MtNr': Number(mtNr) });
                return res.status(200).json({ accounts: updatedAccounts });
            } else {
                return res.status(422).json({ accounts: {}, message: "Current Kwh is less than previous Kwh" });
            }
        }
    } catch (error) {
        console.error('Error updating readings:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export async function submitReadings(req, res) {
    try {
        const { mtNr } = req.body;
        const account = await MeterReading.findOne({ 'MtNr': Number(mtNr) });
        if (!account) {
            return res.status(404).json({ error: 'No account found for the specified account number' });
        }
        const result = await MeterReading.updateMany(
            { MtNr: Number(mtNr) },
            { $set: { isSubmitted: true } }, { upsert: true, new: true }
        );
        return res.status(200).json({ success: result ? true : false });
    } catch (error) {
        console.error('Error submitting readings:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
