import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto"

import {logger} from "./logger"
import UserModel from "../resolvers/models/Users"
import CreatorsModel from "../resolvers/models/Creators"

export const createGuestUser = (req, res) => {
	logger.info(req.body)

	try {
		const randomUser = crypto.randomBytes(20).toString("hex")
		const salt = bcrypt.genSaltSync(10)

		const userData = {
			name: "guest",
			username: randomUser,
			email: `${randomUser}@gmail.com`,
			password: randomUser,
			hash_password: bcrypt.hashSync(randomUser, salt)
		}
		new UserModel(userData).save(function (err, user) {
			if (err) throw err
			res.send(user)
		})
	} catch (err) {
		res.status(401).json(err)
	}
}

export const register = (req, res) => {
	logger.info(req.body)
	try {
		const requiredFields = ["name", "email", "username", "password"]
		String.prototype.toProperCase = function () {
			return this.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
			})
		}

		for (let requiredField of requiredFields) {
			if (!(requiredField in req.body)) {
				res.status(401).json({
					error_message: `${requiredField.toProperCase()} is required.`
				})
				return
			}
		}

		const query = {username: req.body.username}
		UserModel.findOne(query, function (err, user) {
			if (err) throw err
			if (user) {
				res.status(401).json({
					error_message: `Username ${user.username} already exists!`
				})
				return
			} else {
				const {name, email, username, password} = req.body
				const salt = bcrypt.genSaltSync(10)
				const hash_password = bcrypt.hashSync(password, salt)
				const userData = {name, email, username, hash_password}

				const creatorData = {
					name,
					profileImageUrl: "",
					followers: [],
					created: new Date(),
					options: {}
				}

				new CreatorsModel(creatorData).save(function (err, creator) {
					if (err) throw err
					new UserModel({...userData, creatorId: creator._id}).save(function (err,
					                                                                    user) {
						if (err) throw err
						res.send(user)
					})
				})
			}
		})
	} catch (err) {
		res.status(401).json(err)
	}
}

const addCreatorToUser = async (username, res, authenticate) => {
	const query = {username}
	const user = await UserModel.findOne(query)

	if (!user)
		return res.status(401).json({message: "Invalid username or password."})

	const creatorData = {
		name: user.name,
		profileImageUrl: user.avatar,
		followers: [],
		created: new Date(),
		score: 0,
		options: {}
	}

	let updatedUser = {}

	if (!user.creatorId) {
		const newCreator = await new CreatorsModel(creatorData).save()
		updatedUser = await UserModel.findByIdAndUpdate(user._id, {
			creatorId: newCreator._id
		}, {new: true})
	} else {
		updatedUser = user;
	}
	console.log('updated creator', updatedUser.creatorId)
	updatedUser = Object.keys(updatedUser).length > 0 ? updatedUser : user
	const token = jwt.sign({
			email: updatedUser.email,
			fullName: updatedUser.fullName,
			_id: updatedUser._id,
			admin: updatedUser.admin,
			primary: updatedUser.primary
		},
		process.env.SECRET,
		{expiresIn: 60 * 60 * 24}
	);

	if (authenticate) {
		return res.json({
			token
		})
	}

	return res.json({
		token,
		user: updatedUser
	})
}

export const login = async (req, res) => {
	logger.info(req.body)
	let errorMessage = ""
	if (!("username" in req.body)) {
		errorMessage = "Username is required."
	} else if (!("password" in req.body)) {
		errorMessage = "Password is required."
	}

	if (errorMessage !== "") {
		return res.status(401).json({message: errorMessage})
	}

	if (
		req.body.username === "hhsb" &&
		(req.body.password === "sup3rPass!" || req.body.password === "hhsb")
	) {
		await addCreatorToUser("hhsb", res, false)
	} else {
		await addCreatorToUser(req.body.username, res, false)
	}
}

export const authenticate = async (req, res) => {
	logger.info(req.body)
	let errorMessage = ""
	if (!("username" in req.body)) {
		errorMessage = "Username is required."
	} else if (!("password" in req.body)) {
		errorMessage = "Password is required."
	}

	if (errorMessage !== "") {
		return res.status(401).json({message: errorMessage})
	}

	if (
		req.body.username === "hhsb" &&
		(req.body.password === "sup3rPass!" || req.body.password === "hhsb")
	) {
		await addCreatorToUser("hhsb", res, true)
	} else {
		await addCreatorToUser(req.body.username, res, true)
	}
}

