const { freeFireApi } = require('./vm');

async function topupFreeFire(req, res) {
  try {
    const traxId = await freeFireApi();

    console.log(traxId);

    res.status(200).json({ status: 200 });
  } catch (error) {
    res.status(400).json({ status: 400, message: `${error.message}` });
  }
}

module.exports = {
  topupFreeFire,
};
