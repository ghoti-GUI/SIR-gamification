/**
 * @fileoverview This file defines the Session model using mongoose.
 * @author 28Pollux28
 */

import mongoose from "mongoose";
import crypto from "crypto";
import { logger } from "../app.js";

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // password: contains the hash of the password, the salt and the number of iterations
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
    teachers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        validate: [
            function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            "There must be at least one teacher",
        ],
        default: [],
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: [
            {
                validator: function (value) {
                    return this.startDate <= value;
                },
                msg: "endDate must be after startDate",
            },
            {
                validator: function (value) {
                    if (this.isNew) {
                        return value >= Date.now();
                    }
                    return true;
                },
                msg: "endDate must be in the future",
            },
        ],
    },
    TP: {
        type: String,
        enum: ["kafka", "scrapping"],
        required: true,
    },
    indexGrades: {
        type: Map,
        default: {},
        required: true,
    },
    meanGrades: {
        type: Number,
        default: 0,
    },
    standDevGrades: {
        type: Number,
        default: 0,
    },
});

/**
 * Method to serialize the session data for a teacher
 * @function serializeTeacher
 * @returns {Object} The serialized session data for a teacher
 */
sessionSchema.methods.serializeTeacher = function () {
    return {
        id: this.id,
        name: this.name,
        teachers: this.teachers,
        students: this.students,
        startDate: this.startDate,
        endDate: this.endDate,
        TP: this.TP,
        indexGrades: Array.from(this.indexGrades.entries()),
        status: this.startDate <= Date.now() ? (this.endDate <= Date.now() ? "done" : "inProgress") : "scheduled",
        mean: this.meanGrades,
        std: this.standDevGrades,
    };
};

/**
 * Method to serialize the session data for a student
 * @function serializeStudent
 * @returns {Object} The serialized session data for a student
 */
sessionSchema.methods.serializeStudent = function (userID) {
    return {
        id: this.id,
        name: this.name,
        teachers: this.teachers,
        startDate: this.startDate,
        endDate: this.endDate,
        TP: this.TP,
        indexGrades: Array.from(this.indexGrades.entries()),
        status: this.startDate <= Date.now() && (this.endDate <= Date.now() ? "done" : "inProgress"),
        joined: this.students.includes(userID),
    };
};

/**
 * Method to serialize the session data. By default, it uses the serializeStudent method.
 * @function serialize
 * @returns {Object} The serialized session data
 */
sessionSchema.methods.serialize = sessionSchema.methods.serializeStudent;

sessionSchema.methods.validatePassword = async function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, this.iterations, 64, "sha512").toString("hex");
    return this.password === hash;
};

sessionSchema.pre("save", async function (next) {
    if (this.isNew) {
        //hash and salt password
        const salt = crypto.randomBytes(16).toString("hex");
        this.salt = salt;
        this.iterations = 50000;
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
 * @type Session
 * @property {Object} name - The name of the session. It is required.
 * @property {Array} teachers - The list of teachers' IDs. It is an array of ObjectIds referencing the User model. It must contain at least one teacher.
 * @property {Array} students - The list of students' IDs. It is an array of ObjectIds referencing the User model. It can be empty.
 * @property {Date} startDate - The start date of the session. It is required.
 * @property {Date} endDate - The end date of the session. It is required and must be after the start date.
 * @property {String} TP - The type of TP. It is required.
 */
const Session = mongoose.model("Session", sessionSchema);
export default Session;
