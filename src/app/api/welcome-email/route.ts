import dbConnect from "@/backend/lib/db";
import User from "@/backend/models/User";
import Utils from "@/utils/utils";
import { auth } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

interface EmailOptions {
    to: string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
}

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}


export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        console.error("User not authorized");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("POST log /api/welcome-email");
    try {
        await dbConnect();
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            console.error("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const email = user.email;
        if (!email) {
            console.error("User email not found");
            return NextResponse.json({ error: "User email not found" }, { status: 404 });
        }
        const emailConfig: EmailConfig = {
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || "",
                pass: process.env.SMTP_PASS || "",
            }
        };

        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
            throw new Error("SMTP_USER and SMTP_PASS environment variables are required");
        }

        const transporter = nodemailer.createTransport(emailConfig);

        // await transporter.verify();
        console.log("✅ SMTP connection verified successfully");

        const templatePath = path.join(process.cwd(), "src", "html", "email-template.html");
        if (!fs.existsSync(templatePath)) {
            console.error("❌ Default email template not found at:", templatePath);
            return NextResponse.json({ error: "Default email template not found" }, { status: 500 });
        }

        const htmlContent = fs.readFileSync(templatePath, "utf8");
        console.log("📧 Using default Sonexa email template");

        const subject = "🎵 Welcome to Sonexa!";
        const fromEmail = emailConfig.auth.user;

        const mailOptions = {
            from: fromEmail,
            to: email,
            subject,
            html: htmlContent,
            text: htmlContent.replace(/<[^>]*>/g, "")
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", email);

        return NextResponse.json({ success: true, messageId: result.messageId });
    } catch (error: unknown) {
        console.error("Error sending welcome email", error);
        const err = Utils.handleApiError(error);
        return NextResponse.json({ error: err }, { status: err.statusCode });
    }
}