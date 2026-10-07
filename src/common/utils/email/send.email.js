import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from "../../../config.js";
import { BadException } from "../../exceptions/error.exception.js";

export const UserEmailKey = ({email , subject})=>{
    return `User::${email}::${subject}::OTP`
}

export const UserEmailTrialsKey = ({email , subject})=>{
    return `${UserEmailKey({email , subject})}::Trials`
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service:"gmail" ,
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

export const sendEmail = async({
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    attachments = []
})=>{
    try {
    if (!to?.length && !cc?.length && !bcc?.length) {
        throw BadException('Missing Email Recipients')
    }
    if (!text?.length && !html?.length && !attachments?.length) {
        throw BadException('Missing Email Content')
    }
    const info = await transporter.sendMail({
    from: `${APPLICATION_NAME} <${APP_EMAIL}>`, // sender address
    to, // list of recipients
    cc,
    bcc,
    subject, // subject line
    text, // plain text body
    html, // HTML body
    attachments
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
}