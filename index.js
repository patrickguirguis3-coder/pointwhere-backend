const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

const SEATS_KEY = 'pro_3EIPLarFByehDKcBLX4Xeki2Xt1';
const AVIATION_KEY = 'b9c6d9d288a247b7dda379b5273ea963';

app.get('/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    // Get award availability from Seats.aero
    const seatsRes = await fetch(
      `https://seats.aero/partnerapi/search?origin_airport=${origin}&destination_airport=${destination}&date=${date}&cabin=economy`,
      { headers: { 'Partner-Authorization': SEATS_KEY, 'accept': 'application/json' } }
    );
    const seatsData = await seatsRes.json();

    // Get real flight schedules from AviationStack
    const aviationRes = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${AVIATION_KEY}&dep_iata=${origin}&arr_iata=${destination}&flight_date=${date}&limit=10`
    );
    const aviationData = await aviationRes.json();

    // Combine the data
    const flights = aviationData.data || [];
    const awards = seatsData.data || [];

    res.json({
      flights,
      awards,
      combined: true
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/availability', async (req, res) => {
  try {
    const { origin, destination } = req.query;
    const response = await fetch(
      `https://seats.aero/partnerapi/availability?origin_airport=${origin}&destination_airport=${destination}`,
      { headers: { 'Partner-Authorization': SEATS_KEY, 'accept': 'application/json' } }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PointWhere backend running on port ${PORT}`));
