import nodeMailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

type Options = {
  email: string;
  subject: string;
  message: string;
};

const sendEmail = async (options: Options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  } as SMTPTransport.Options);

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
