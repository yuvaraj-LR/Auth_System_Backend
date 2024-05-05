import nodemailer from "nodemailer"

export const sendPasswordResetEmail = async(user, token) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASS
        }
    });

    const mailOption = {
        from: process.env.SMPT_MAIL,
        to: user.email,
        subject: `Welcome to ${process.env.PROJECT_NAME} application.`,
        html: `
        <h1>Password Reset Mail</h1> \n \n
        <p>This is the reset link to change your password. ${process.env.BUILDENV === "dev" ? process.env.FRONT_DEV_URL : process.env.FRONT_LIVE_URL}/login/password/changepassword?username=${user.email}&token=${token} </p> 
        `
    }

    await transporter.sendMail(mailOption);
    console.log("<---------------------------Welcome Mail--------------------------->");
    console.log("Successfully send mail for reset password..");
}