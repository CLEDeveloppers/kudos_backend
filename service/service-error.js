"use strict";

const JsonResponse = require("../utils/json-response");
const {Log, LogType} = require("../database/models/log");

/**
 * Stores a colllection of error codes and messages that can be stored in a ServiceError object
 */
const ERROR_VALUE = {
    service_internal_error: {code: 1, message: "service is unable to process your request."},
    service_unavailable: {code: 2, message: "service unavailable."},
    service_unauthorized: {code: 3, message: "unauthorized to access service"},
    resource_not_found: {code: 4, message: "item not found"},
    json_invalid_format: {code: 5, message: "invalid JSON format received"},
    app_token_invalid: {code: 6, message: "invalid app token"},

    account_not_found: {code: 100, message: "account not found"},
    account_email_exists: {code: 101, message: "an account with this email already exists"},
    account_auiID_exists: {code: 102, message: "an account with this Aui ID already exists"},
    account_phoneNumber_exists: {code: 103, message: "an account with this phone number already exists"},
    
    account_signin_invalid: {code: 104, message: "invalid account credentials"},
    account_not_activated: {code: 105, message: "account has not been activated"},
    account_activation_expired: {code: 106, message: "activation token has expired"},
    account_activation_invalid: {code: 107, message: "invalid activation token"},
    account_activation_exists: {code: 108, message: "account already activated"},
    account_password_recovery_expired: {code: 109, message: "recovery token has expired"},
    account_password_recovery_invalid: {code: 110, message: "invalid recovery token"},
    account_user_image_removal_failed: {code: 111, message: "unable to remove user image"},

    firstName_required: {code: 200, message: "firstName is required"},
    firstName_not_string: {code: 201, message: "firstName is not a string"},
    firstName_invalid_char: {code: 202, message: "firstName contains invalid characters"},
    firstName_exceed_length: {code: 203, message: "firstName exceeds allowed length"},

    lastName_required: {code: 204, message: "lastName is required"},
    lastName_not_string: {code: 205, message: "lastName is not a string"},
    lastName_invalid_char: {code: 206, message: "lastName contains invalid characters"},
    lastName_exceed_length: {code: 207, message: "lastName exceeds allowed length"},

    auiID_confirm_required: {code: 208, message: "auiID required"},
    auiID_confirm_required_not_string: {code: 209, message: "auiID is not a string"},
    auiID_invalid_char: {code: 210, message: "auiID must be entirely numeric"},
    
    email_required: {code: 211, message: "email is required"},
    email_not_string: {code: 212, message: "email is not a string"},
    email_invalid: {code: 213, message: "invalid email address"},
    
    password_required: {code: 214, message: "password is required"},
    password_not_string: {code: 215, message: "password is not a string"},
    password_length: {code: 216, message: "password must have at least 8 characters"},
    password_confirm_required: {code: 217, message: "confirmation password is required"},
    password_confirm_not_string: {code: 218, message: "confirmation password is not a string"},
    password_mismatch: {code: 219, message: "password fields do not match"},
    
    phoneNumber_confirm_required: {code: 220, message: "phone number required"},
    phoneNumber_confirm_required_not_string: {code: 221, message: "phone number is not a string"},
    phoneNumber_invalid_char: {code: 222, message: "phone number must be entirely numeric"},
    
    country_required: {code: 223, message: "country required"},
    country_not_string: {code: 224, message: "country is not a string"},
    country_invalid: {code: 225, message: "country must be entirely numeric"},
    
    gender_confirm_required: {code: 226, message: "gender required"},
    gender_confirm_required_not_numeric: {code: 227, message: "gender is not a numeric"},
    gender_length: {code: 228, message: "country must be one single digit"},
    

    // firstName_required: {code: 203, message: "firstName is required"},
    // firstName_not_string: {code: 204, message: "firstName is not a string"},
    // password_current_required: {code: 211, message: "current password is required"},
    // password_current_not_string: {code: 212, message: "current password is not a string"},
    // password_current_invalid: {code: 213, message: "invalid current password"},
    // password_new_required: {code: 214, message: "new password is required"},
    // password_new_not_string: {code: 215, message: "new password is not a string"},
    // password_new_length: {code: 216, message: "new password must have at least 8 characters"},
    // identity_required: {code: 217, message: "identity is required"},
    // identity_not_string: {code: 218, message: "identity is not a string"},
    
    


    merchant_not_String:{code: 243, message: "merchant is not a string"},
    name_of_merchant_not_found:{code: 244, message: "name of merchant not found"},
    description_not_found:{code: 245, message: "description not found"},
    description_not_String:{code: 246, message: "description is not a string"},
    category_not_found:{code: 247, message: "category not found"},
    category_not_numeric:{code: 248, message: "category is not numeric"},
    terms_and_conditions_not_found:{code: 249, message: "terms and conditions not found"},
    terms_and_conditions_not_string:{code: 250, message: "terms and conditions is not a string"},
    qr_codes_not_found: {code: 251, message: "qr codes not found"},
    qr_codes_not_array: {code: 252, message: "qr codes is not an array"},
    bar_codes_not_found: {code: 253, message: "bar codess not found"},
    bar_codes_not_array: {code: 254, message: "bar codess is not an array"},
    expiry_date_time_not_found: {code: 255, message: "expiry date time not found"},
    expiry_date_time_not_date: {code: 256, message: "expiry date time is not a date"},

    name_required: {code: 257, message: "name is required"},
    name_not_string: {code: 258, message: "name is not a string"},
    name_invalid_char: {code: 259, message: "name contains invalid characters"},
    name_exceed_length: {code: 260, message: "name exceeds allowed length"},
    merchantId_not_found: {code: 261, message: "merchant id not found"},

    activation_token_required: {code: 300, message: "activation token is required"},
    activation_token_not_string: {code: 301, message: "activation token is not a string"},
    activation_code_required: {code: 302, message: "activation code is required"},
    activation_code_not_string: {code: 303, message: "activation code is not a string"},
    activation_code_invalid: {code: 304, message: "invalid activation code"},

    recovery_token_required: {code: 400, message: "Recovery token is required"},
    recovery_token_not_string: {code: 401, message: "Recovery token is not a string"},
    recovery_code_required: {code: 402, message: "Recovery code is required"},
    recovery_code_not_string: {code: 403, message: "Recovery code is not a string"},
    recovery_code_invalid: {code: 404, message: "Invalid recovery code"},
    
    image_file_format_invalid: {code: 700, message: "invalid image file format"},
    correct_image_file_required: {code: 701, message: "number of attached images exceeds the limit (max:10)"},
    image_file_size_exceed_limit: {code: 702, message: "image file size exceeds limit"},

    user_not_found: {code: 1100, message: "user not found"},
    history_not_found: {code: 1101, message: "history not found"},
    memory_box_not_found: {code: 1102, message: "memory box not found"},
    notification_not_found: {code: 1103, message: "notification not found"},
    post_not_found: {code: 1104, message: "post not found"},
    post_not_found_in_user_document: {code: 1105, message: "post not found in user's document"},
    merchant_not_found: {code: 1106, message: "merchant not found"},

    value_not_found: {code: 1200, message: "value not found"},
    value_not_string: {code: 1201, message: "value is not a string"},
    value_not_numeric: {code: 1202, message: "value is not a numeric"},
    value_not_boolean: {code: 1203, message: "value is not a boolean"},
    value_not_array: {code: 1204, message: "value is not an array"},


    comment_not_string: {code: 1205, message: "comment string missing"},
    commenter_not_string: {code: 1206, message: "commenter string missing"},
    commenter_missing: {code: 1207, message: "commenter missing"},
    comment_missing: {code: 1208, message: "comment missing"},
    redemption_Id_not_valid: {code: 1209, message: "redemption id is not valid"},
    redemption_not_found: {code: 1210, message: "redemption not found"}
};

class ServiceError extends Error {
    constructor(errorValue) {
        super();
        if (typeof(errorValue) === "string")
            this.error = ERROR_VALUE[errorValue];
        else
            this.error = errorValue;
    }


    /**
     * Handles service errors with the appropriate status code
     */
    static handle(error, res, source) {
        if (error instanceof SyntaxError) {
            res.status(400)
                .json(JsonResponse.error(new ServiceError(ERROR_VALUE.json_invalid_format)));
        }
        else if (error instanceof ServiceError) {
            let statusCode;
            switch (error.code) {
                case ERROR_VALUE.service_unauthorized.code:
                    statusCode = 401;
                    break;
                case ERROR_VALUE.resource_not_found.code:
                    statusCode = 404;
                    break;
                default:
                    statusCode = 400;
                    break;
            }

            res.status(statusCode).json(JsonResponse.error(error));
        } else {
            Log.createNew(LogType.ERROR, error.stack, source);
            console.error(error);

            res.status(500)
                .json(JsonResponse.error(new ServiceError(ERROR_VALUE)));
        }
    }
}

module.exports = {ERROR_VALUE, ServiceError};