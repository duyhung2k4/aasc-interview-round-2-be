import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const emailTransporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
    service: 'gmail',
    auth: {
        user: "nguyenduyhung04092004@gmail.com",
        pass: "exrz crko utdb diob",
    }
});

export default emailTransporter;