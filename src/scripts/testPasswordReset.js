const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/auth";

// Test password reset functionality
async function testPasswordReset() {
  try {
    console.log("🧪 Testing Password Reset Functionality\n");

    // Test 1: Send OTP for password reset
    console.log("1. Testing forgot password (send OTP)...");
    const forgotPasswordResponse = await axios.post(`${BASE_URL}/forgot-password`, {
      email: "test@example.com" // Replace with a real email from your database
    });
    
    console.log("✅ Forgot password response:", forgotPasswordResponse.data);
    
    // Note: In a real scenario, you would check the email for the OTP
    // For testing, you can check the database or logs for the OTP
    console.log("\n📧 Check your email for the OTP or check the database/logs");
    console.log("💡 You can also check the server logs to see the OTP that was generated");
    
    // Test 2: Verify OTP (commented out as it requires the actual OTP)
    /*
    console.log("\n2. Testing verify OTP...");
    const verifyOTPResponse = await axios.post(`${BASE_URL}/verify-otp`, {
      email: "test@example.com",
      otp: "123456" // Replace with the actual OTP from email
    });
    
    console.log("✅ Verify OTP response:", verifyOTPResponse.data);
    */
    
    // Test 3: Reset password with OTP (commented out as it requires the actual OTP)
    /*
    console.log("\n3. Testing reset password...");
    const resetPasswordResponse = await axios.post(`${BASE_URL}/reset-password`, {
      email: "test@example.com",
      otp: "123456", // Replace with the actual OTP from email
      newPassword: "newPassword123"
    });
    
    console.log("✅ Reset password response:", resetPasswordResponse.data);
    */
    
    console.log("\n🎉 Password reset API tests completed!");
    console.log("\n📝 To complete the test:");
    console.log("1. Check your email for the OTP");
    console.log("2. Uncomment the verify OTP test");
    console.log("3. Replace '123456' with the actual OTP");
    console.log("4. Run the test again");
    
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Test validation errors
async function testValidationErrors() {
  try {
    console.log("\n🧪 Testing Validation Errors\n");

    // Test 1: Invalid email format
    console.log("1. Testing invalid email format...");
    try {
      await axios.post(`${BASE_URL}/forgot-password`, {
        email: "invalid-email"
      });
    } catch (error) {
      console.log("✅ Invalid email validation:", error.response.data);
    }

    // Test 2: Missing email
    console.log("\n2. Testing missing email...");
    try {
      await axios.post(`${BASE_URL}/forgot-password`, {});
    } catch (error) {
      console.log("✅ Missing email validation:", error.response.data);
    }

    // Test 3: Invalid OTP format
    console.log("\n3. Testing invalid OTP format...");
    try {
      await axios.post(`${BASE_URL}/verify-otp`, {
        email: "test@example.com",
        otp: "12345" // Too short
      });
    } catch (error) {
      console.log("✅ Invalid OTP validation:", error.response.data);
    }

    // Test 4: Short password
    console.log("\n4. Testing short password...");
    try {
      await axios.post(`${BASE_URL}/reset-password`, {
        email: "test@example.com",
        otp: "123456",
        newPassword: "123" // Too short
      });
    } catch (error) {
      console.log("✅ Short password validation:", error.response.data);
    }

    console.log("\n🎉 Validation tests completed!");

  } catch (error) {
    console.error("❌ Validation test failed:", error.message);
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Password Reset API Tests\n");
  
  await testPasswordReset();
  await testValidationErrors();
  
  console.log("\n✨ All tests completed!");
}

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testPasswordReset,
  testValidationErrors,
  runTests
}; 