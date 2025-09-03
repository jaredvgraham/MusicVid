import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ApiError } from "@/types/ApiError";

import User from "@/backend/models/User";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dbConnect from "@/backend/lib/db";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log("Admin bulk email API called");

    // Check if the current user is authenticated
    const { userId: currentUserId } = await auth();
    console.log("Current user ID:", currentUserId);

    const user = await currentUser();
    if (!user) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "You must be logged in to access this resource",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    // Check if user is admin
    if (
      user.primaryEmailAddress?.emailAddress !==
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "You must be an admin to access this resource",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    if (!currentUserId) {
      const error: ApiError = {
        _error: "Unauthorized",
        message: "You must be logged in to access this resource",
        statusCode: 401,
      };
      return NextResponse.json({ error }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { emails, subject, message, templateId } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      const error: ApiError = {
        _error: "Bad Request",
        message: "Emails array is required and must not be empty",
        statusCode: 400,
      };
      return NextResponse.json({ error }, { status: 400 });
    }

    // Validate that either custom content or template is provided
    if (!templateId && (!subject || !message)) {
      const error: ApiError = {
        _error: "Bad Request",
        message: "Either templateId or both subject and message are required",
        statusCode: 400,
      };
      return NextResponse.json({ error }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Verify all emails exist in the database
    const users = await User.find({ email: { $in: emails } });
    const foundEmails = users.map((user) => user.email);
    const notFoundEmails = emails.filter(
      (email) => !foundEmails.includes(email)
    );

    if (notFoundEmails.length > 0) {
      const error: ApiError = {
        _error: "Bad Request",
        message: `The following emails were not found in the database: ${notFoundEmails.join(
          ", "
        )}`,
        statusCode: 400,
      };
      return NextResponse.json({ error }, { status: 400 });
    }

    // Email configuration
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    };

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      const error: ApiError = {
        _error: "Configuration Error",
        message: "SMTP_USER and SMTP_PASS environment variables are required",
        statusCode: 500,
      };
      return NextResponse.json({ error }, { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport(emailConfig);

    // Determine final subject, message, and header
    let finalSubject: string;
    let finalMessage: string;
    let finalHeaderTitle: string;
    let finalHeaderSubtitle: string;

    if (templateId) {
      // Import templates dynamically to avoid circular dependencies
      const { EMAIL_TEMPLATES } = await import("@/lib/emailTemplates");
      const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);

      if (!template) {
        const error: ApiError = {
          _error: "Bad Request",
          message: `Template with id '${templateId}' not found`,
          statusCode: 400,
        };
        return NextResponse.json({ error }, { status: 400 });
      }

      finalSubject = template.subject;
      finalMessage = template.message;
      finalHeaderTitle = template.headerTitle;
      finalHeaderSubtitle = template.headerSubtitle;
    } else {
      finalSubject = subject;
      finalMessage = message;
      finalHeaderTitle = "🎵 Sonexa";
      finalHeaderSubtitle =
        "Create stunning lyric videos with AI-powered timing";
    }

    // Read email template
    const templatePath = path.join(
      process.cwd(),
      "src",
      "html",
      "email-template.html"
    );

    let htmlContent: string;
    if (fs.existsSync(templatePath)) {
      htmlContent = fs.readFileSync(templatePath, "utf8");

      // Replace header placeholder
      htmlContent = htmlContent.replace(
        /<!-- DYNAMIC_HEADER_PLACEHOLDER -->[\s\S]*?<!-- END_DYNAMIC_HEADER_PLACEHOLDER -->/,
        `<h1>${finalHeaderTitle}</h1>
        <p>${finalHeaderSubtitle}</p>`
      );

      // Convert markdown-style links to HTML buttons
      const convertLinksToButtons = (message: string) => {
        return message.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          (match, text, url) => {
            return `<a href="${url}" class="button" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; margin: 10px 0; font-weight: bold; font-size: 14px; text-align: center; box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);">${text}</a>`;
          }
        );
      };

      // Replace content placeholder with custom message
      htmlContent = htmlContent.replace(
        /<!-- CUSTOM_MESSAGE_PLACEHOLDER -->[\s\S]*?<!-- END_CUSTOM_MESSAGE_PLACEHOLDER -->/,
        `<div style="padding: 20px;">
          <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #333;">${finalSubject}</h2>
          <div style="font-size: 16px; line-height: 1.6; color: #333;">${convertLinksToButtons(
            finalMessage
          ).replace(/\n/g, "<br>")}</div>
        </div>`
      );
    } else {
      // Fallback HTML if template doesn't exist
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${finalSubject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; margin: 20px 0;">
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">${finalSubject}</h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">${finalMessage.replace(
              /\n/g,
              "<br>"
            )}</p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <p style="margin: 0; color: #666;">Best regards,<br>The Sonexa Team</p>
          </div>
        </body>
        </html>
      `;
    }

    // Send emails
    const results = await Promise.allSettled(
      emails.map(async (email) => {
        const mailOptions = {
          from: emailConfig.auth.user,
          to: email,
          subject: `🎵 ${finalSubject}`,
          html: htmlContent,
        };

        const result = await transporter.sendMail(mailOptions);
        return { email, messageId: result.messageId, success: true };
      })
    );

    // Process results
    const successful: string[] = [];
    const failed: Array<{ email: string; error: string }> = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successful.push(result.value.email);
      } else {
        failed.push({
          email: emails[index],
          error: result.reason?.message || "Unknown error",
        });
      }
    });

    console.log(`✅ Bulk email sending completed`);
    console.log(`   Successful: ${successful.length}`);
    console.log(`   Failed: ${failed.length}`);

    return NextResponse.json({
      success: true,
      message: `Bulk email sending completed`,
      results: {
        total: emails.length,
        successful: successful.length,
        failed: failed.length,
        successfulEmails: successful,
        failedEmails: failed,
      },
    });
  } catch (error: any) {
    console.error("Error sending bulk emails:", error);
    const apiError: ApiError = {
      _error: "Internal Server Error",
      message: error.message || "Failed to send bulk emails",
      statusCode: 500,
    };
    return NextResponse.json({ error: apiError }, { status: 500 });
  }
}
