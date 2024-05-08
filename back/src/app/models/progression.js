import mongoose from "mongoose";
import Session from "./session.js";

const progressionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    level: {
        type: Number,
        required: true,
        default: 0,
    },
    grade: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 20,
    },
    teacherGradeOverride: {
        type: Boolean,
        required: true,
        default: false,
    },
    teacherGradeComment: {
        type: String,
        required: false,
    },
    helpedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
        required: false,
    },
    helped: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true,
        default: [],
    },
});

progressionSchema.methods.serialize = function () {
    return {
        userId: this.userId,
        sessionId: this.sessionId,
        level: this.level,
    };
};

progressionSchema.pre("save", async function (next) {
    if (!this.isModified("grade") || this.isNew) {
        return next();
    }
    if (this.grade > 20) {
        this.grade = 20;
    }
    if (this.grade < 0) {
        this.grade = 0;
    }
    try {
        const sess = await Session.findById(this.sessionId);
        const progressions = await Progression.find({ sessionId: this.sessionId });
        const filtered = progressions.filter((p) => p.id !== this.id);
        filtered.push(this);
        const grades = filtered.map((p) => p.grade);
        const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
        sess.meanGrades = avg;
        sess.standDevGrades = Math.sqrt(
            grades.map((grade) => Math.pow(grade - avg, 2)).reduce((a, b) => a + b, 0) / grades.length,
        );
        await sess.save();
        next();
    } catch (err) {
        next(err);
    }
});

progressionSchema.methods.setHelpedBy = async function (helpedBy) {
    const helpedByUsers = helpedBy.map((user) => user.id);
    const progressions = await Progression.find({
        $and: [
            { sessionId: this.sessionId },
            { userId: { $ne: this.userId } },
            { $or: [{ helped: { $in: [this.userId] } }, { userId: { $in: helpedByUsers } }] },
        ],
    });
    const helped = progressions.map((p) => {
        p.helped = p.helped.filter((id) => id.toString() !== this.userId.toString());
        if (helpedByUsers.some((id) => id.toString() === p.userId.toString())) {
            p.helped.push(this.userId);
        }
        return p;
    });
    await Promise.all(helped.map((p) => p.save()));
    this.helpedBy = helpedByUsers;
    await this.save();
};

export const Progression = mongoose.model("Progression", progressionSchema);
