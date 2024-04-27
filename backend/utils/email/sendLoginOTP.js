import nodemailer from "nodemailer"

export const sendOTPForLogin = async(user, otp) => {
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
        subject: `Login by OTP Mail`,
        html: `
        <h1>OTP Login</h1> \n \n
        <p>You are recieving this email because you are requesting to login through our application. Please enter this OPT to login. This OTP will expires in 15 minutes.</p> \n \n
        <p>OTP - ${otp}
        `
    }

    await transporter.sendMail(mailOption);
    console.log("<---------------------------Login in by OTP Mail--------------------------->");
    console.log("Successfully send mail for OTP login...");
}