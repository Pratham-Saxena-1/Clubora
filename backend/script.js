
const mongoose = require('mongoose');
const FormResponse = require('./src/models/FormResponse');
mongoose.connect('mongodb://127.0.0.1:27017/clubora').then(async () => {
  const responses = await FormResponse.find({'answers.value': { $regex: '^/uploads/' }});
  console.log(JSON.stringify(responses, null, 2));
  mongoose.disconnect();
});
