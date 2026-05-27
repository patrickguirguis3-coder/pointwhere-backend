const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    
    const response = await fetch(
      `https://seats.aero/partnerapi/search?origin_airport=${origin}&destination_airport=${destination}&date=${date}&cabin=economy`,
      {
        headers: {
          'Partner-Authorization': 'pro_3EIPLarFByehDKcBLX4Xeki2Xt1',
          'accept': 'application/json',
        }
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/availability', async (req, res) => {
  try {
    const { origin, destination } = req.query;
    
    const response = await fetch(
      `https://seats.aero/partnerapi/availability?origin_airport=${origin}&destination_airport=${destination}`,
      {
        headers: {
          'Partner-Authorization': 'pro_3EIPLarFByehDKcBLX4Xeki2Xt1',
          'accept': 'application/json',
        }
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PointWhere backend running on port ${PORT}`));
