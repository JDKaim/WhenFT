const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/user.js");

const userRouter = express.Router();

userRouter.post("/create-user", async (req, res) => {
	const required = ["username", "password"];
	const hasRequiredKeys = required.every(
		(item) => req.body[item] != undefined
	);
	// If the passed in data was malformed, return an error
	if (!hasRequiredKeys) {
		return res.status(400).json({
			error: "All users require a username and password",
		});
	}
	// Create a new user with the provided information
	const user = new User({
		username: req.body.username,
		password: req.body.password,
	});
	// Try to save the user; if an error occurs, report the error
	try {
		await user.save();
		return res.status(201).json({
			message: "User creation was successful",
		});
	} catch (err) {
		console.error(err); // Log the error so we know what's up
		return res.status(500).json({
			error: "A database-related error occurred",
		});
	}
});

userRouter.post("/login", async (req, res) => {
	try {
		// Attempt to find the user by username
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		// Check to see if password matches hashed password
		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid password" });
		}
		// If login is successful, return message
		res.json({ message: "Login successful" });
	} catch (err) {
		console.error(err); // Log the error so we know what's up
		return res
			.status(500)
			.json({ message: "A database-related error occurred" });
	}
});

module.exports = userRouter;
