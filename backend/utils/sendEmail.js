// backend/utils/sendEmail.js
import { createTransport } from "nodemailer"; // ← NAMED IMPORT

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransport({
      service: "gmail", // lowercase
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"NoteNest" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email failed:", error.message);
    throw error;
  }
};

export default sendEmail;