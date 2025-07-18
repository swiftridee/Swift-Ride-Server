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
    const startDate = booking.startDate;
    const endDate = booking.endDate;

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
          <li><strong>Total Price:</strong> RS: ${booking.price}</li>
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

    console.log(
      "Sending password reset confirmation email with options:",
      mailOptions
    );

    const info = await transporter.sendMail(mailOptions);
    console.log(
      "Password reset confirmation email sent successfully:",
      info.response
    );
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

// Send welcome email to new user
exports.sendWelcomeEmail = async (user) => {
  try {
    console.log("Attempting to send welcome email:");
    console.log("User:", { name: user.name, email: user.email });

    const mailOptions = {
      from: config.EMAIL_FROM,
      to: user.email,
      subject: "Welcome to Swift Ride! 🚗",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #007bff; margin: 0; font-size: 28px;">🚗 Welcome to Swift Ride!</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0;">Your journey starts here</p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h2 style="color: #333; margin-bottom: 15px;">Hello ${user.name}! 👋</h2>
              <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
                Welcome to Swift Ride! We're excited to have you as part of our community. 
                Your account has been successfully created and you're now ready to explore our 
                premium vehicle rental services.
              </p>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1976d2; margin-top: 0;">🎉 What's Next?</h3>
              <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>Browse Vehicles:</strong> Explore our wide range of vehicles</li>
                <li><strong>Make Bookings:</strong> Reserve your preferred vehicle</li>
                <li><strong>Track Rentals:</strong> Monitor your booking status</li>
                <li><strong>Get Support:</strong> Contact us anytime for assistance</li>
              </ul>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0;">🔐 Account Security</h3>
              <p style="color: #555; line-height: 1.6; margin-bottom: 10px;">
                Your account security is important to us. Here are some tips:
              </p>
              <ul style="color: #555; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Keep your password secure and unique</li>
                <li>Never share your login credentials</li>
                <li>Log out from shared devices</li>
                <li>Contact us immediately if you notice any suspicious activity</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Start Exploring 🚀
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">
                If you have any questions, feel free to contact our support team.
              </p>
              <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 14px;">
                Thank you for choosing Swift Ride! 🚗
              </p>
            </div>
          </div>
        </div>
      `,
    };

    console.log("Sending welcome email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully:", info.response);
    console.log("Message ID:", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Please check email credentials.");
    }
    return false;
  }
};

// Send contact us email
exports.sendContactUsEmail = async (contact) => {
  try {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: config.CONTACT_EMAIL || config.EMAIL_FROM, // fallback to default if not set
      subject: `Contact Us Message from ${contact.name}`,
      html: `
        <h2>Contact Us Submission</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Contact Us email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending Contact Us email:", error);
    return false;
  }
};

// Send booking cancellation email
exports.sendBookingCancellation = async (booking, user) => {
  try {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: user.email,
      subject: "Booking Cancellation Notice - Swift Ride",
      html: `
        <h1>Booking Canceled</h1>
        <p>Dear ${user.name},</p>
        <p>We regret to inform you that your booking has been canceled. Here are the details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Vehicle:</strong> ${booking.vehicle.brand} ${
        booking.vehicle.name
      }</li>
          <li><strong>Start Date:</strong> ${new Date(
            booking.startDate
          ).toLocaleString()}</li>
          <li><strong>End Date:</strong> ${new Date(
            booking.endDate
          ).toLocaleString()}</li>
          <li><strong>Pickup Location:</strong> ${booking.pickupLocation}</li>
          <li><strong>Drop Location:</strong> ${booking.dropLocation}</li>
        </ul>
        <p>If you have any questions or need further assistance, please contact our support team.</p>
        <p>We apologize for any inconvenience caused.</p>
        <p>Thank you,<br>Swift Ride Team</p>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Booking cancellation email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending booking cancellation email:", error);
    return false;
  }
};
