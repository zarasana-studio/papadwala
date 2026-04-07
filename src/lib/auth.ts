import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins"; 
import { Resend } from "resend";
import { db } from "./db";
import * as schema from "./db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_DEBUG = process.env.RESEND_DEBUG === "true";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        }
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                const normalizedEmail = email.trim().toLowerCase();
                const subject =
                    type === "sign-in"
                        ? "Your Papadwala sign-in code"
                        : type === "email-verification"
                          ? "Verify your Papadwala email"
                          : "Reset your Papadwala password";

                if (RESEND_DEBUG) {
                    console.log("[auth][otp] Sending OTP email", {
                        to: normalizedEmail,
                        type,
                        from: process.env.RESEND_FROM_EMAIL || "noreply@papadwala.com",
                    });
                }

                try {
                    const response = await resend.emails.send({
                        from: process.env.RESEND_FROM_EMAIL! ,
                        to: normalizedEmail,
                        subject,
                        html: `
                        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                            <h2 style="color: #1a0a00; margin-bottom: 8px;">Papadwala</h2>
                            <p style="color: #555; margin-bottom: 24px;">Your one-time code is:</p>
                            <div style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #c85a00; background: #fff8f0; border-radius: 12px; padding: 20px; text-align: center;">
                                ${otp}
                            </div>
                            <p style="color: #999; font-size: 13px; margin-top: 24px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                        </div>
                    `,
                    });

                    if (RESEND_DEBUG) {
                        console.log("[auth][otp] Resend response", {
                            id: response.data?.id,
                            error: response.error,
                        });
                    }

                    if (response.error) {
                        throw new Error(response.error.message || "Resend API returned an error");
                    }
                } catch (error) {
                    console.error("[auth][otp] Failed to send OTP email", {
                        to: normalizedEmail,
                        type,
                        error,
                    });
                    throw error;
                }
            },
        }),
    ],
});