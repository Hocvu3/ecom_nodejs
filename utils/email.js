const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Hoc Vu <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if(process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    async send(template, subject) {
        console.log('hi2');

        // const html = pug.renderFile(
        //     `${__dirname}/../views/email/${template}.pug`,
        //     {
        //     firstName: this.firstName,
        //     url: this.url,
        //     subject
        // });
        console.log('hi');
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            // html,
            // text: htmlToText.fromString(html)
        }
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Tours!');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token');
    }
}