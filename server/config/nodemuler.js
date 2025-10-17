import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587, // استخدمي 587 مش 465
  secure: false, // خليه false مع 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // تجاهل التحقق من الشهادة
  },
});

export default transporter;
