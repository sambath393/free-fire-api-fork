const speakeasy = require('speakeasy');
const { garenaAcc } = require('../utilities/dev');

// Main function
function generateHOTP() {
  // Constants
  const INTERVAL = 180;

  // Helper functions
  const now = () => Date.now() / 1000;

  const currentInterval = () => Math.floor(now() / INTERVAL);
  lastInterval = currentInterval();

  // Generate new HOTP code
  const otp = speakeasy.hotp({
    secret: garenaAcc.key,
    counter: lastInterval,
    encoding: 'base32',
  });

  return otp;
}

module.exports = {
  generateHOTP,
};
