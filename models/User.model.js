const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Email is required'],
			match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		passwordHash: {
			type: String,
			required: [true, 'Password required'],
		},
	},
	{
		timestamps: true,
	}
);

const User = model('User', userSchema);

module.exports = User;
