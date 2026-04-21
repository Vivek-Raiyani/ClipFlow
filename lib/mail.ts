import nodemailer from "nodemailer";

export const sendInviteEmail = async (to: string, inviterName: string, inviteUrl: string) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP settings are missing. Simulating email send instead.");
    console.log(`[SIMULATED EMAIL] To: ${to} | Inviter: ${inviterName} | Link: ${inviteUrl}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: SMTP_PORT === "465", 
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"ClipFlow Team" <${SMTP_USER}>`,
    to,
    subject: `You've been invited to join ${inviterName}'s team on ClipFlow`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #111;">You're Invited!</h2>
        <p><strong>${inviterName}</strong> has invited you to collaborate on ClipFlow.</p>
        <p>ClipFlow is a high-performance content pipeline where creators and editors instantly sync files via Cloudflare R2 and publish to YouTube seamlessly.</p>
        <br/>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #2F80ED; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Accept Invitation & Join Team
          </a>
        </div>
        <br/>
        <p style="font-size: 12px; color: #777;">If you already have a ClipFlow account under this exact email address, you will automatically be linked to their team upon login.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
