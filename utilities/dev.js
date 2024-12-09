require('dotenv').config();

const isDebug = () => process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 4000;

const garenaAcc = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  key: process.env.KEY,
};

module.exports = {
  isDebug,
  port,
  garenaAcc,
};
