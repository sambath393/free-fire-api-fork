require('dotenv').config();

const isDebug = () => process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 4000;

const garenaAcc = {
  username: 'sinocoraly3939',
  password: 'Naruto007?',
  key: 'FLVJE2QULHXIMSIV',
};

module.exports = {
  isDebug,
  port,
  garenaAcc,
};
