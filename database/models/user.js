"use strict";

const mongoose = require("mongoose");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const validator = require("validator");
const {AccessType, UserToken} = require("./user-token");
const Hasher = require("../../utils/hasher");
const {ERROR_VALUE, ServiceError} = require("../../service/service-error");

const bcrypt = Promise.promisifyAll(require("bcryptjs"));

// Number of salt rounds used to hash password
const SALT_ROUNDS = 12;
// Number of days account expires in
const ACCOUNT_EXPIRY_PERIOD = 1;

let userSchema = new mongoose.Schema({
    auiID: {
        type: String,
        required: [true, "you need an ID from Al Akhawayn University"],
        index: true,
        unique: [true, "AUI ID is already in use"]
    },
    firstName: {
        type: String,
        required: false,
        index: true,
        unique: false
    },
    lastName: {
        type: String,
        required: false,
        index: true,
        unique: false
    },
    email: {
        type: String,
        // required: [true, "Email is required"],
        unique: [true, "Email is already in use"],
        index: true
    },
    hashedId: {
        type: String,
        unique: [true, "hashedId must be unique"]
    },
    phoneNumber: {
        type: String,
        // required: [true, "PhoneNumber is required"],
        unique: [false, "This phone number is already in use"],
    },
    isActivated: {
        type: Boolean,
        required: [true, "isActivated property is required"],
        default: false
    },
    dateOfBirth:{
      type: Date,
      required: [false],
        default: ""
    },
    password: {
        type: String,
        // required: [true, "Password is required"],
        minlength: [8, "Password must have at least 8 characters"]
    },
    confirmPassword: {
        type: String,
        // required: [true, "comfirmation Password is required"],
        minlength: [8, "Password must have at least 8 characters"]
    },
    gender: {
        type: Number,
        // required: [true, "Gender is not required"]
    },
    country: {
        type: String,
        index: true
        // required: [true, "Country is required"]
    },
    notificationArray: {
        type: Array,
        required: [false, "notificationArray is not required"],
        default: []
    }},
    {
        timestamps: true
    }

);



class UserClass {
    /**
     * Sets a new password for the user (Promise)
     */
    setPassword(password) {
        // Hash password
        return bcrypt.hashAsync(password, SALT_ROUNDS)
            .then(hashedPassword => {
                return this.update({
                    $set: {
                        password: hashedPassword
                    }
                });
            });
    }

    /**
     * Checks if the specified password hashes to the stored password (Promise)
     */
    isPasswordEqual(password) {
        // Compare password with stored hash in database
        return bcrypt.compareAsync(password, this.password)
            .then(result => {
                if (result)
                    return true;
                else
                    return false;
            });
    }

    /**
     * Returns the information of the user
     */
    getInfo() {
        return {
            username: this.username,
            auiID: this.auiID
        };
    }

    /**
     * Returns the post array
     */
    static getHashedId(user) {
        return user.hashedId;
    }
 
    /**
     * Removes the cover  image URL of the user (Promise)
     */
    removeUserCoverImageUrl() {
        // Remove image from Amazon S3
        return removeUserCoverImage(this.coverPhoto)
            .then(result => {
                if (!result)
                    throw new ServiceError(ERROR_VALUE.account_user_image_removal_failed);

                return this.update({
                    $set: {
                        coverPhoto: ""
                    }
                });
            });
    }

    /**
     * Activates the user account (Promise)
     */
    activateAccount() {
        // Delete existing activation token
        UserToken.delete(AccessType.ACTIVATION, this._id)
            .then(() => {
                return this.update({
                    $set: {
                        isActivated: true
                        // isActive: true
                    }
                    // ,
                    // $unset: {
                    //     expiresAt: ""
                    // }
                });
            });
    }

    /**
     * Creates a new user with a specified firstName, lastName, auiID, email, password, phoneNumber, country, gender, dateOfBirth and IP address (Promise)
     */
    static createNew(firstName, lastName, auiID, email, password, phoneNumber, country, gender, dateOfBirth) {
        let user;
        let hashedIdValue = Hasher.generate();

        return bcrypt.hashAsync(password, SALT_ROUNDS)
            .then(hashedPassword => {
                let newUser;
                if( !firstName || firstName === ""){
                    newUser = {
                        firstName: "N/A",
                        lastName,
                        auiID,
                        email,
                        password: hashedPassword,
                        country,
                        gender,
                        dateOfBirth,
                        phoneNumber,
                        hashedId: hashedIdValue
                    };
                }
                if( !lastName || lastName === ""){
                    newUser = {
                        firstName,
                        lastName: "N/A",
                        auiID,
                        email,
                        password: hashedPassword,
                        country,
                        gender,
                        dateOfBirth,
                        phoneNumber,
                        hashedId: hashedIdValue
                    };
                }
                if( (!lastName || lastName === "") && (!firstName || firstName === "")){
                    newUser = {
                        firstName: "N/A",
                        lastName: "N/A",
                        auiID,
                        email,
                        password: hashedPassword,
                        country,
                        gender,
                        dateOfBirth,
                        phoneNumber,
                        hashedId: hashedIdValue
                    };
                }else{
                    newUser = {
                        firstName,
                        lastName,
                        auiID,
                        email,
                        password: hashedPassword,
                        country,
                        gender,
                        dateOfBirth,
                        phoneNumber,
                        hashedId: hashedIdValue
                    };
                }


                // Get IP address if it exists
                // if (ipAddress)
                //     newUser.ipAddress = ipAddress;

                // Set user account to expire in 1 day
                newUser.expiresAt = moment().add(ACCOUNT_EXPIRY_PERIOD, "days").toDate();

                // Create new user in database
                return this.create(newUser);
            })
            .then(createdUser => {
                user = createdUser;

                // Generate activation token
                return UserToken.generate(AccessType.ACTIVATION, user._id);
            })
            .then(() => {
                return user;
            });
    }

   
    /**
     * Returns gender of the user
     */
    static getGender(user) {
        return user.gender;
    }
    /**
     * Updates gender of the user
     */
    static setGender(value) {
        return this.update({
            $set: {
                gender: value
            }
        });
    }

    /**
     * Returns the country of the user
     */
    static getCountry(user) {
        return user.country;
    }
    /**
     * Returns the "about the user" of the user
     */
    
    /**
     * Updates the country of the user
     */
    static setCountry(value) {
        return this.update({
            $set: {
                country: value
            }
        });
    }

    /**
     * Returns a user account with a specified email/username and password (Promise)
     */
    static findByCredentials(identity, password) {
        let user;

        return this.findOne({
            $or: [
                { email: identity },
                { auiID: identity },
            ]
        }).then(userResult => {
            if (!userResult)
                throw new Error("User not found");

            user = userResult;
            if(user.isActivated == false) {
                throw new Error("Account not activated");
            }
            // Compare password with stored hash in database
            return bcrypt.compareAsync(password, user.password);
        })
            .then(result => {
                if (!result)
                    return -1;
                else
                    return user;
            })
            .catch(() => {
                return user;
            });
    }

    /**
     * Returns a user account with a specified email/auiID and password (Promise)
     */
    static searchByCredentials(identity) {
        let user;

        return this.find({
            $or: [
                { email: { "$regex": "^" + identity, '$options' : 'i' } },
                { auiID: { "$regex": "^" + identity, '$options' : 'i'} },
            ]
        }).then(userResult => {
            if (!userResult)
                throw new Error("User not found");

            return userResult;
        })
    }

    /**
     * Returns a user account with a specified email/auiID (Promise)
     */
    static findByIdentity(identity) {
        return this.findOne({
            $or: [
                { email: identity },
                { auiID: identity },
            ]
        });
    }

    /**
     * Returns a user account with a specified email (Promise)
     */
    static findByEmail(email) {
        return this.findOne({ email });
    }

    static findByPhoneNumber(phoneNumber) {
        return this.findOne({phoneNumber});
    }

    /**
     * Returns a user account with a specified username (Promise)
     */
    static findByAUIID(auiID) {
        return this.findOne({ auiID });
    }
    static findByToken(token) {
        if (!token)
            return Promise.resolve(null);

        // Check if JWT
        if (token.split(".").length - 1 === 2) {
            try {
                // Verify JWT
                jwt.verify(token, process.env.JWT_MAIN_KEY);
            }
            catch(error) {
                return Promise.resolve(-1);
            }
        }

        return UserToken.findByValue(token)
            .then(token => {
                if (!token)
                    return null;

                return token.user_id;
            });
    }
}

userSchema.loadClass(UserClass);
let User = mongoose.model("user", userSchema);

module.exports = User;
