import nodemailer from "nodemailer";

export async function verifyGmailCredentials(
  gmailAddress: string,
  appPassword: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: gmailAddress, pass: appPassword }
  });
  await transporter.verify();
}
