/**
 * @fileoverview This file defines the User model using mongoose.
 * @author 28Pollux28
 */

import mongoose from "mongoose";
import crypto from "crypto";
import { logger } from "../app.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    iterations: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ["admin", "teacher", "student"],
        default: "student",
    },
    tps: {
        type: [String],
        enum: ["kafka", "scrapping"],
    },
});

/**
 * Checks if the provided password is valid.
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if the password is valid, false otherwise.
 */
userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, this.iterations, 64, "sha512").toString("hex");
    return this.password === hash;
};

/**
 * Checks if the user is an admin.
 * @returns {boolean} - Returns true if the user is an admin, false otherwise.
 */
userSchema.methods.isAdmin = function () {
    return this.type === "admin";
};

/**
 * Checks if the user is a teacher.
 * @returns {boolean} - Returns true if the user is a teacher or an admin, false otherwise.
 */
userSchema.methods.isTeacher = function () {
    return this.type === "teacher" || this.isAdmin();
};

/**
 * Checks if the user is a student.
 * @returns {boolean} - Returns true if the user is a student, false otherwise.
 */
userSchema.methods.isStudent = function () {
    return this.type === "student";
};

/**
 * Serializes the user object.
 * @returns {object} - Returns an object with the user's username, name, surname, email, and type.
 */
userSchema.methods.serialize = function () {
    return {
        id: this.id,
        username: this.username,
        name: this.name,
        surname: this.surname,
        email: this.email,
        type: this.type,
    };
};

/**
 * Serializes the user object for public view.
 * @returns {object} - Returns an object with the user's name and surname.
 */
userSchema.methods.serializePublic = function () {
    return {
        id: this.id,
        name: this.name,
        surname: this.surname,
        type: this.type,
    };
};

userSchema.methods.serializeTeacherUser = function () {
    return {
        id: this.id,
        name: this.name,
        surname: this.surname,
        type: this.type,
        tps: this.tps,
    };
};

userSchema.pre("save", function (next) {
    if (this.isNew) {
        //hash and salt password
        const salt = crypto.randomBytes(16).toString("hex");
        this.salt = salt;
        this.iterations = 210000;
        try {
            this.password = crypto.pbkdf2Sync(this.password, salt, this.iterations, 64, "sha512").toString("hex");
        } catch (e) {
            logger.error(e);
            return next(e);
        }
    }
    next();
});

/**
 * @type User
 * @property {string} username - The username - eg: johnDoe - required
 * @property {string} password - The password - required
 * @property {string} name - The user's name - eg: John - required
 * @property {string} surname - The user's surname - eg: Doe - required
 * @property {string} email - The user's email - eg: johndoe@example.com - required
 * @property {string} type - The user's type - eg: admin, teacher, student - default: student - required
 */
const User = mongoose.model("User", userSchema);
export default User;
