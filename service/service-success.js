"use strict";

/**
 * Stores a colllection of success codes and messages that can be stored in a ServiceSuccess object
 */
const SUCCESS_VALUE = {
    account_signup_success: {code: 100, message: "account sign up successful"},
    account_signin_success: {code: 101, message: "user was signed in"},
    account_signout_success: {code: 102, message: "user was signed out"},
    account_activation_success: {code: 103, message: "activated account"},
    account_activation_email_sent: {code: 104, message: "sent activation email"},
    account_password_recovery_email_sent: {code: 105, message: "sent password recovery email"},
    account_password_recovery_code_valid: {code: 106, message: "valid recovery code"},
    account_password_changed: {code: 107, message: "changed account password"},
    account_password_reset: {code: 108, message: "reset account password"},
    user_info_retrieved: {code: 109, message: "retrieved user information"},

};

class ServiceSuccess {
    constructor(successValue) {
        if (typeof(successValue) === "string")
            this.success = SUCCESS_VALUE[successValue];
        else
            this.success = successValue;
    }
}

module.exports = {SUCCESS_VALUE, ServiceSuccess};





