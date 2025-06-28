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
