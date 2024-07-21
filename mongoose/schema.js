const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    userID: {
        type: Number,
        required: true,
        unique: true,
        default: () => Math.floor(Math.random() * 100000), // Randomized userID
    },
    reservations: {
        type: Array,
        default: [],
    },
    difficulty: {
        type: Number,
        default: 0,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
            message: 'Invalid email address',
        },
    },
    newlyRegistered: {
        type: Boolean,
        default: true,
    },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Verify password
userSchema.methods.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};


const trailSchema = new Schema({
  trailID: Number,
  name: String,
  difficulty: Number,
  startLocation: String,
  endLocation: String,
  link: String,
});

const reservationSchema = new Schema({
  reservationID: Number,
  trailID: Number,
  difficulty: Number,
  attending: Number,
  limit: Number,
  time: String,
  date: String,
});

const volunteerSchema = new Schema({
  volunteerID: Number,
  name: String,
  age: Number,
});

module.exports = {
  user: mongoose.model('User', userSchema),
  trail: mongoose.model('Trail', trailSchema),
  reservation: mongoose.model('Reservation', reservationSchema),
  volunteer: mongoose.model('Volunteer', volunteerSchema),
};


