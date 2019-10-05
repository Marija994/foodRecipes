const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,

  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  favouriteRecipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);