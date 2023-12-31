const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},

	surname: {
		type: String,
		required: true
	},

	username: {
		type: String,
		required: true,
		unique: true
	},

	books: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Book'
	  }]
});

const User = mongoose.model('User', userSchema);


module.exports = User;