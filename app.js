const { topupFreeFire } = require('./libs/topup');
const { port } = require('./utilities/dev');
const express = require('express');

const app = express();
const api = express();

app.use(express.json());

app.use('/api', api);

// middleware
app.use((req, res, next) => {
  return next();
});

api.get('/topup', topupFreeFire);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
