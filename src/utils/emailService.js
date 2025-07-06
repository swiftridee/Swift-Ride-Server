const nodemailer = require("nodemailer");
const config = require("../config/config");

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send messages");
  }
});

// Send booking confirmation email
exports.sendBookingConfirmation = async (booking, user) => {
  try {
    console.log("Attempting to send email with the following data:");
    console.log("User:", { name: user.name, email: user.email });
    console.log("Booking ID:", booking._id);
    console.log("Email Config:", {
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      user: config.EMAIL_USER,
      from: config.EMAIL_FROM,
    });

    const startDate = new Date(booking.startDate).toLocaleString();
    const endDate = new Date(booking.endDate).toLocaleString();

    const mailOptions = {
      from: config.EMAIL_FROM,
      to: user.email,
      subject: "Booking Confirmation - Swift Ride",
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Dear ${user.name},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Vehicle:</strong> ${booking.vehicle.brand} ${booking.vehicle.name}</li>
          <li><strong>Start Date:</strong> ${startDate}</li>
          <li><strong>End Date:</strong> ${endDate}</li>
          <li><strong>Pickup Location:</strong> ${booking.pickupLocation}</li>
          <li><strong>Drop Location:</strong> ${booking.dropLocation}</li>
          <li><strong>Total Price:</strong> $${booking.price}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Thank you for choosing Swift Ride!</p>
      `,
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    console.log("Message ID:", info.messageId);

    // Update booking to mark email as sent
    if (booking.updateOne) {
      await booking.updateOne({ emailSent: true });
      console.log("Booking updated to mark email as sent");
    }

    return true;
  } catch (error) {
    console.error("Detailed error sending booking confirmation email:", error);
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Please check email credentials.");
    }
    return false;
  }
};

// Send password reset OTP email
exports.sendPasswordResetOTP = async (user, otp) => {
  try {
    console.log("Attempting to send password reset OTP email:");
    console.log("User:", { name: user.name, email: user.email });
    console.log("OTP:", otp);

    const mailOptions = {
      from: config.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset OTP - Swift Ride",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
          <p>Dear ${user.name},</p>
          <p>We received a request to reset your password for your Swift Ride account.</p>
          <p>Your OTP (One-Time Password) is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h2>
          </div>
          <p><strong>Important:</strong></p>
          <ul>
            <li>This OTP will expire in 2 minutes</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>Never share this OTP with anyone</li>
          </ul>
          <p>If you have any questions, please contact our support team.</p>
          <p>Thank you,<br>Swift Ride Team</p>
        </div>
      `,
    };

    console.log("Sending password reset OTP email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset OTP email sent successfully:", info.response);
    console.log("Message ID:", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending password reset OTP email:", error);
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Please check email credentials.");
    }
    return false;
  }
};

// Send password reset confirmation email
exports.sendPasswordResetConfirmation = async (user) => {
  try {
    console.log("Attempting to send password reset confirmation email:");
    console.log("User:", { name: user.name, email: user.email });

    const mailOptions = {
      from: config.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Successful - Swift Ride",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #28a745; text-align: center;">Password Reset Successful</h1>
          <p>Dear ${user.name},</p>
          <p>Your password has been successfully reset for your Swift Ride account.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
          <p>For security reasons, we recommend:</p>
          <ul>
            <li>Using a strong, unique password</li>
            <li>Enabling two-factor authentication if available</li>
            <li>Regularly updating your password</li>
          </ul>
          <p>Thank you,<br>Swift Ride Team</p>
        </div>
      `,
    };

    console.log("Sending password reset confirmation email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset confirmation email sent successfully:", info.response);
    console.log("Message ID:", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending password reset confirmation email:", error);
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Please check email credentials.");
    }
    return false;
  }
};
