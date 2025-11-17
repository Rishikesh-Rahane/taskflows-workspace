// utils/email.ts
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

interface InviteEmailOptions {
  to: string;
  name?: string;
  inviteToken: string;
}

interface ResetPasswordEmailOptions {
  to: string;
  name?: string;
  resetToken: string;
}

export interface SignupOtpEmailOptions {
  to: string;
  name?: string;
  otp: number; // the verification code
}

// Create transporter
const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendEmail({
  to,
  subject,
  html,
  text
}: EmailOptions): Promise<SentMessageInfo> {
  if (!process.env.EMAIL_FROM) {
    throw new Error('EMAIL_FROM is not defined');
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html
  });

  return info;
}


export async function sendSignupOtpEmail({
  to,
  name,
  otp,
}: SignupOtpEmailOptions): Promise<SentMessageInfo> {
  const html = `
    <p>Hi ${name || ''},</p>
    <p>Welcome! Please verify your email address to activate your account.</p>
    <p>Your One-Time Password (OTP) is:</p>
    <h2>${otp}</h2>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not initiate this signup, please ignore this email.</p>
  `;

  return sendEmail({
    to,
    subject: 'Verify your email - Signup OTP',
    html,
  });
}

export async function sendInviteEmail({
  to,
  name,
  inviteToken
}: InviteEmailOptions): Promise<SentMessageInfo> {
  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
  }

  const link = `${process.env.BASE_URL}/auth/accept-invite?token=${inviteToken}`;
  const html = `
    <p>Hi ${name || ''},</p>
    <p>You were invited to join. Click below to accept and set your password:</p>
    <p><a href="${link}">${link}</a></p>
    <p>This link expires in 24 hours.</p>
  `;

  return sendEmail({ to, subject: 'You are invited', html });
}

export async function sendResetPasswordEmail({
  to,
  name,
  resetToken
}: ResetPasswordEmailOptions): Promise<SentMessageInfo> {
  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is not defined');
  }

  const link = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`;
  const html = `
    <p>Hi ${name || ''},</p>
    <p>To reset your password, click the link below:</p>
    <p><a href="${link}">${link}</a></p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail({ to, subject: 'Reset your password', html });
}
