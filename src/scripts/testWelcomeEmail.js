const { sendWelcomeEmail } = require("../utils/emailService");

// Test welcome email functionality
async function testWelcomeEmail() {
  try {
    console.log("🧪 Testing Welcome Email Functionality\n");

    // Test user data
    const testUser = {
      name: "John Doe",
      email: "test@example.com" // Replace with a real email for testing
    };

    console.log("📧 Sending welcome email to:", testUser.email);
    
    const result = await sendWelcomeEmail(testUser);
    
    if (result) {
      console.log("✅ Welcome email sent successfully!");
      console.log("📬 Check the email inbox for the welcome message");
    } else {
      console.log("❌ Welcome email failed to send");
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Test registration flow with welcome email
async function testRegistrationFlow() {
  try {
    console.log("\n🧪 Testing Registration Flow with Welcome Email\n");

    // Simulate user registration
    const newUser = {
      name: "Jane Smith",
      email: "jane@example.com", // Replace with a real email for testing
      city: "Lahore",
      role: "user",
      status: "active"
    };

    console.log("👤 New user registration:", newUser.name);
    console.log("📧 Sending welcome email...");
    
    const emailSent = await sendWelcomeEmail(newUser);
    
    if (emailSent) {
      console.log("✅ Registration flow completed successfully!");
      console.log("📬 Welcome email sent to:", newUser.email);
    } else {
      console.log("❌ Welcome email failed during registration");
    }
    
  } catch (error) {
    console.error("❌ Registration flow test failed:", error.message);
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Welcome Email Tests\n");
  
  await testWelcomeEmail();
  await testRegistrationFlow();
  
  console.log("\n✨ Welcome email tests completed!");
  console.log("\n📝 To test with real emails:");
  console.log("1. Replace 'test@example.com' with a real email address");
  console.log("2. Run the test again");
  console.log("3. Check the email inbox for the welcome message");
}

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testWelcomeEmail,
  testRegistrationFlow,
  runTests
}; 