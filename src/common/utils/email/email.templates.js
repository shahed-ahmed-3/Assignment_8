import { APPLICATION_NAME } from "../../../config.js"
import { EmailSubjectEnum } from "../../enum/index.js"

export const templates ={
    [EmailSubjectEnum.CONFIRM_EMAIL]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        /* CSS Reset & Basic Styles */
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f7f6;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #333333;
            line-height: 1.6;
        }

        .email-wrapper {
            width: 100%;
            padding: 40px 0;
            background-color: #f4f7f6;
        }

        .email-container {
            max-width: 480px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e9ecef;
        }

        /* Header Style */
        .email-header {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            padding: 25px;
            text-align: center;
            color: #ffffff;
        }

        .email-header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        /* Body Style */
        .email-body {
            padding: 35px 30px;
            text-align: center;
        }

        .icon-box {
            width: 55px;
            height: 55px;
            background-color: #eeeffe;
            color: #4f46e5;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 20px;
        }

        .email-body h2 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 20px;
        }

        .email-body p {
            margin: 0 0 20px 0;
            color: #6b7280;
            font-size: 14px;
        }

        /* OTP Code Box */
        .otp-container {
            background-color: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 10px;
            padding: 15px 20px;
            margin: 25px 0;
            display: inline-block;
        }

        .otp-code {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #4f46e5;
            font-family: 'Courier New', Courier, monospace;
        }

        /* Divider & Hint */
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 25px 0 20px 0;
        }

        .hint {
            font-size: 12px;
            color: #9ca3af;
            margin: 0;
        }

        /* Footer Style */
        .email-footer {
            background-color: #f9fafb;
            padding: 18px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
    </style>
</head>
<body>

    <div class="email-wrapper">
        <div class="email-container">
            
            <!-- Header / App Name -->
            <div class="email-header">
                <h1>${APPLICATION_NAME}</h1>
            </div>

            <!-- Body Content -->
            <div class="email-body">
                <div class="icon-box">
                    🔒
                </div>
                
                <h2>Verification Code</h2>
                
                <p>
                    use the following Verification Code (OTP) to complete your verification process.
                </p>

                <!-- OTP Display Box -->
                <div class="otp-container">
                    <span class="otp-code">${data.code}</span>
                </div>

                <p style="font-size: 13px; color: #ef4444; margin-top: -10px;">
                    This code will expire in 2 minutes.
                </p>

                <div class="divider"></div>

                <p class="hint">
                    If you didn't request this code, please ignore this email or contact support if you have concerns.
                </p>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                &copy; 2026 ${APPLICATION_NAME}. All rights reserved.
            </div>

        </div>
    </div>

</body>
</html>`
    },
    [EmailSubjectEnum.FORGOT_PASSWORD]:(data)=>{
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        /* CSS Reset & Basic Styles */
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f7f6;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #333333;
            line-height: 1.6;
        }

        .email-wrapper {
            width: 100%;
            padding: 40px 0;
            background-color: #f4f7f6;
        }

        .email-container {
            max-width: 480px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e9ecef;
        }

        /* Header Style */
        .email-header {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            padding: 25px;
            text-align: center;
            color: #ffffff;
        }

        .email-header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        /* Body Style */
        .email-body {
            padding: 35px 30px;
            text-align: center;
        }

        .icon-box {
            width: 55px;
            height: 55px;
            background-color: #eeeffe;
            color: #4f46e5;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 20px;
        }

        .email-body h2 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 20px;
        }

        .email-body p {
            margin: 0 0 20px 0;
            color: #6b7280;
            font-size: 14px;
        }

        /* OTP Code Box */
        .otp-container {
            background-color: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 10px;
            padding: 15px 20px;
            margin: 25px 0;
            display: inline-block;
        }

        .otp-code {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #4f46e5;
            font-family: 'Courier New', Courier, monospace;
        }

        /* Divider & Hint */
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 25px 0 20px 0;
        }

        .hint {
            font-size: 12px;
            color: #9ca3af;
            margin: 0;
        }

        /* Footer Style */
        .email-footer {
            background-color: #f9fafb;
            padding: 18px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
    </style>
</head>
<body>

    <div class="email-wrapper">
        <div class="email-container">
            
            <!-- Header / App Name -->
            <div class="email-header">
                <h1>${APPLICATION_NAME}</h1>
            </div>

            <!-- Body Content -->
            <div class="email-body">
                <div class="icon-box">
                    🔑
                </div>
                
                <h2>Password Reset Request</h2>
                
                <p>
                    we received a request to reset your password. Use the OTP code below to proceed with resetting it.
                </p>

                <!-- OTP Display Box -->
                <div class="otp-container">
                    <span class="otp-code">${data.code}</span>
                </div>

                <p style="font-size: 13px; color: #ef4444; margin-top: -10px;">
                    This code is valid for {{ EXPIRATION_TIME_IN_MINUTES }} minutes.
                </p>

                <div class="divider"></div>

                <p class="hint">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                &copy; 2026 ${APPLICATION_NAME}. All rights reserved.
            </div>

        </div>
    </div>

</body>
</html>`
    },
    [EmailSubjectEnum.ENABLE_2FA]: ({ code }) => {
    return `<h1>Enable 2-Step Verification</h1><p>Your verification code is: <b>${code}</b></p>`;
    },
    [EmailSubjectEnum.LOGIN_2FA]: ({ code }) => {
    return `<h1>Login Verification Code</h1><p>Your 2FA login code is: <b>${code}</b></p>`;
  },
}

export const verifyEmailTemplate = (data) => {
    return templates[data.subject](data)
}