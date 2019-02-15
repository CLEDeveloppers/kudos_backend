"use strict";

const {ServiceError} = require("../service/service-error");


// Checks the fields of the JSON sign up request
let signUpVerify = (req, res, next) => {
    req.checkBody("firstName")
        .exists().withMessage("firstName_required")
        .isString().withMessage("firstName_not_string")
        .isLength({min: 1, max: 30}).withMessage("firstName_exceed_length")
        .matches(/^[a-zA-Z0-9\s._-]*$/).withMessage("firstName_invalid_char");

    req.checkBody("lastName")
        .exists().withMessage("lastName_required")
        .isString().withMessage("lastName_not_string")
        .isLength({min: 1, max: 30}).withMessage("lastName_exceed_length")
        .matches(/^[a-zA-Z0-9\s._-]*$/).withMessage("lastName_invalid_char");

    req.checkBody("auiID")
        .exists().withMessage("auiID_confirm_required")
        .isString().withMessage("auiID_confirm_required_not_string")
        .matches("^[0-9]*$").withMessage("auiID_invalid_char");

    req.checkBody("email")
        .exists().withMessage("email_required")
        .isString().withMessage("email_not_string")
        .notEmpty().withMessage("email_required")
        .isEmail().withMessage("email_invalid");

    req.checkBody("password")
        .exists().withMessage("password_required")
        .isString().withMessage("password_not_string")
        .notEmpty().withMessage("password_required")
        .isLength({min: 8}).withMessage("password_length");

    req.checkBody("confirmPassword")
        .exists().withMessage("password_confirm_required")
        .isString().withMessage("password_confirm_not_string")
        .notEmpty().withMessage("password_confirm_required")
        .equals(req.body.password).withMessage("password_mismatch");

    req.checkBody("phoneNumber")
        .exists().withMessage("phoneNumber_confirm_required")
        .isString().withMessage("phoneNumber_confirm_required_not_string")
        .matches("^[0-9]*$").withMessage("phoneNumber_invalid_char");

    req.checkBody("country")
    .exists().withMessage("country_required")
    .isString().withMessage("country_not_string")
    .notEmpty().withMessage("country_invalid");
   
    req.checkBody("gender")
        .exists().withMessage("gender_confirm_required")
        .isNumeric().withMessage("gender_confirm_required_not_numeric")
        .isLength({max: 1}).withMessage("gender_length");

    //TODO: Check the dateOfBirth
    
    req.getValidationResult()
        .then(result => {
            if (!result.isEmpty()) // if result.isEmpty() returns false
                throw new ServiceError(result.array()[0].msg);

            req.sanitizeBody("username").trim();

            next();
        })
        .catch(error => {
            ServiceError.handle(error, res, "signUpVerify");
        });
};

module.exports = signUpVerify;