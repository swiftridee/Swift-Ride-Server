const nodemailer = require("nodemailer");
const config = require("../config/config");

console.log("🧪 Testing Email Configuration\n");

console.log("📧 Current Email Configuration:");
console.log(`Host: ${config.EMAIL_HOST}`);
console.log(`Port: ${config.EMAIL_PORT}`);
console.log(`User: ${config.EMAIL_USER}`);
console.log(`From: ${config.EMAIL_FROM}`);
console.log(`Password: ${config.EMAIL_PASS ? '***' + config.EMAIL_PASS.slice(-4) : 'NOT SET'}`);
console.log("");

// Create transporter with more detailed options
const transporter = nodemailer.createTransporter({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

// Test email connection
async function testEmailConnection() {
  try {
    console.log("🔗 Testing SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection successful!");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
    
    if (error.code === "EAUTH") {
      console.log("\n🔧 Authentication Error - Solutions:");
      console.log("1. Make sure 2-Factor Authentication is enabled on Gmail");
      console.log("2. Generate a new App Password from Google Account Security");
      console.log("3. Use the 16-character App Password (no spaces)");
      console.log("4. Make sure the email address is correct");
    }
    
    return false;
  }
}

// Test sending email
async function testSendEmail() {
  try {
    console.log("\n📤 Testing email sending...");
    
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: config.EMAIL_USER, // Send to yourself for testing
      subject: "Test Email - Swift Ride Server",
      text: "This is a test email from Swift Ride Server",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Email Test Successful!</h1>
          <p>This is a test email from your Swift Ride Server.</p>
          <p>If you received this email, your email configuration is working correctly.</p>
          <p>You can now use the password reset functionality.</p>
          <p>Thank you,<br>Swift Ride Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Email sent to: ${config.EMAIL_USER}`);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    
    if (error.code === "EAUTH") {
      console.log("\n🔧 Authentication Error - Common Solutions:");
      console.log("1. Enable 2-Factor Authentication on your Gmail account");
      console.log("2. Generate an App Password (not your regular password)");
      console.log("3. Use the App Password in your config.js file");
      console.log("4. Make sure the App Password has no spaces");
    }
    
    return false;
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Email Tests\n");
  
  const connectionOk = await testEmailConnection();
  
  if (connectionOk) {
    await testSendEmail();
  }
  
  console.log("\n✨ Email tests completed!");
}

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testEmailConnection,
  testSendEmail,
  runTests
};
