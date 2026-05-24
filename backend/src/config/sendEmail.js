

const nodemailer = require('nodemailer');

async function sendEmail(email, subject, message) {
    try {
        // Configure for Gmail using the service shortcut
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.EMAIL_PASSWORD, // Use the 16-char code without spaces
            },
        });

        const info = await transporter.sendMail({
            from: process.env.MY_EMAIL,
            to: email,
            subject: subject,
            text: message,
        });

        console.log("✅ Email sent successfully!");
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        // Throw the error so your controller knows the email failed
        throw error;
    }
}

module.exports = sendEmail;