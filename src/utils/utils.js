export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHtmlContent(otp) {
    return `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p style="font-size: 18px; color: #555;">Use the following OTP to Verify your email address:</p>
            <div style="font-size: 24px; font-weight: bold; color: #007BFF; margin: 20px 0;">${otp}</div>
        </div>
    `;
}

export function getLoginAlertHtmlContent() {
    return `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">New Login Alert</h2>
            <p style="font-size: 18px; color: #555;">A new login to your account was detected. If this was you, you can ignore this email. If this wasn't you, please change your password immediately.</p>
        </div>
    `;
}

export function getPasswordResetHtmlContent(otp){
    return `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="font-size: 18px; color: #555;">We received a request to reset your password. Use the following OTP to reset your password:</p>
            <div style="font-size: 24px; font-weight: bold; color: #007BFF; margin: 20px 0;">${otp}</div>
        </div>
    `;
}