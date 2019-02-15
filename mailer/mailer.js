"use strict";

const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const mailgun = require("nodemailer-mailgun-transport");

const {Log, LogType} = require("../database/models/log");

// Set Mailgun authentication
let auth = {
  auth: {
    api_key: process.env.MAILER_API_KEY,
    domain: process.env.DOMAIN
  },
};

let transporter = nodemailer.createTransport(mailgun(auth));

// Set template options
let templates = {
  viewPath: "templates/email",
  extName: ".hbs"
};

transporter.use("compile", hbs(templates));

// Set activation mail information
let activationMailOptions = {
  from: "Admissions-Capstone <no-reply@sandboxdaa20787c9d04ecdb0ee78066dacb902.mailgun.org>",
  to: "",
  subject: "Admissions-Capstone - Activate Account",
  template: "activation/activation",
  context: {
    recoveryUrl: ""
  }
};

// Set recovery mail information
let recoveryMailOptions = {
  from: "Admissions-Capstone <no-reply@sandboxdaa20787c9d04ecdb0ee78066dacb902.mailgun.org>",
  to: "",
  subject: "Admissions-Capstone - Reset Password",
  template: "recovery/recovery",
  context: {
    recoveryUrl: ""
  }
};

class Mailer {
  /**
   * Sends an activation email to a user
   */
  static sendActivationMail(email, activationCode) {
    activationMailOptions.to = email;
    activationMailOptions.context.activationCode = activationCode;
    activationMailOptions.context.copyrightYear = (new Date()).getFullYear();

    transporter.sendMail(activationMailOptions)
      .then(() => {
        console.log(`Sent activation email to ${email} with activation code ${activationCode}`);
      })
      .catch(error => {
        console.log("ERROR: ",error)
      });
  }

  /**
   * Sends a recovery email to a developer
   */
  static sendRecoveryMail(email, recoveryCode) {
    recoveryMailOptions.to = email;
    recoveryMailOptions.context.recoveryCode = recoveryCode;
    recoveryMailOptions.context.copyrightYear = (new Date()).getFullYear();

    transporter.sendMail(recoveryMailOptions)
      .then(() => {
        console.log(`Sent recovery email to ${email} with recovery code ${recoveryCode}`);
      })
      .catch(error => {
        console.log("ERROR: ",error)
      });
  }
}

module.exports = Mailer;
