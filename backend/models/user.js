const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10; // Higher factor means more security (slower hashing)

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: [8, "Password must be at least 8 characters"],
	},
});

// Pre-save hook to hash user's password
userSchema.pre("save", function (next) {
	const user = this;

	// Only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();

	// Generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err);

		// Hash the password using our new salt
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) return next(err);

			// Override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

module.exports = mongoose.model("user", userSchema);
