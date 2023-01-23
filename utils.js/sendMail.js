const nodemailer = require("nodemailer");

module.exports = async function (email, subject, url) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: true,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS,
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL,
            to: email,
            subject: subject,
            html: `<p>${subject} ${url}</p>`
        });
        return "email sent successfully";
    } catch (error) {
        return "email not sent!"
        // return error;
    }
};