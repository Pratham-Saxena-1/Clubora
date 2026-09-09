require('dotenv').config();
const mongoose = require('mongoose');
const Club = require('./src/models/Club');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Club.updateMany({ $or: [{ instagram: { $exists: false } }, { instagram: '' }] }, { instagram: '@clubora' });
  console.log('Updated clubs');
  process.exit(0);
});
