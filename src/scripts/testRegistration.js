const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/auth";

// Test user registration with CNIC
async function testRegistrationWithCNIC() {
  try {
    console.log("🧪 Testing User Registration with CNIC\n");

    // Test 1: Registration with CNIC
    console.log("1. Testing registration with CNIC...");
    const userWithCNIC = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      city: "Lahore",
      cnic: "1234567890123", // 13 digits
      gender: "male"
    };

    const response1 = await axios.post(`${BASE_URL}/register`, userWithCNIC);
    console.log("✅ Registration with CNIC successful:", response1.data);
    console.log("📋 User data:", response1.data.data.user);

    // Test 2: Registration without CNIC
    console.log("\n2. Testing registration without CNIC...");
    const userWithoutCNIC = {
      name: "Test User 2",
      email: "testuser2@example.com",
      password: "password123",
      city: "Karachi",
      gender: "female"
    };

    const response2 = await axios.post(`${BASE_URL}/register`, userWithoutCNIC);
    console.log("✅ Registration without CNIC successful:", response2.data);
    console.log("📋 User data:", response2.data.data.user);

    // Test 3: Registration with invalid CNIC format
    console.log("\n3. Testing registration with invalid CNIC format...");
    try {
      const userWithInvalidCNIC = {
        name: "Test User 3",
        email: "testuser3@example.com",
        password: "password123",
        city: "Islamabad",
        cnic: "123456", // Too short
        gender: "male"
      };

      await axios.post(`${BASE_URL}/register`, userWithInvalidCNIC);
    } catch (error) {
      console.log("✅ Invalid CNIC format correctly rejected:", error.response.data);
    }

    // Test 4: Registration with duplicate CNIC
    console.log("\n4. Testing registration with duplicate CNIC...");
    try {
      const userWithDuplicateCNIC = {
        name: "Test User 4",
        email: "testuser4@example.com",
        password: "password123",
        city: "Rawalpindi",
        cnic: "1234567890123", // Same as first user
        gender: "female"
      };

      await axios.post(`${BASE_URL}/register`, userWithDuplicateCNIC);
    } catch (error) {
      console.log("✅ Duplicate CNIC correctly rejected:", error.response.data);
    }

    console.log("\n🎉 Registration tests completed!");

  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Test validation errors
async function testValidationErrors() {
  try {
    console.log("\n🧪 Testing Validation Errors\n");

    // Test 1: Missing required fields
    console.log("1. Testing missing required fields...");
    try {
      await axios.post(`${BASE_URL}/register`, {
        name: "Test User",
        email: "test@example.com"
        // Missing password and city
      });
    } catch (error) {
      console.log("✅ Missing fields correctly rejected:", error.response.data);
    }

    // Test 2: Invalid email format
    console.log("\n2. Testing invalid email format...");
    try {
      await axios.post(`${BASE_URL}/register`, {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
        city: "Lahore"
      });
    } catch (error) {
      console.log("✅ Invalid email correctly rejected:", error.response.data);
    }

    // Test 3: Short password
    console.log("\n3. Testing short password...");
    try {
      await axios.post(`${BASE_URL}/register`, {
        name: "Test User",
        email: "test@example.com",
        password: "123", // Too short
        city: "Lahore"
      });
    } catch (error) {
      console.log("✅ Short password correctly rejected:", error.response.data);
    }

    console.log("\n🎉 Validation tests completed!");

  } catch (error) {
    console.error("❌ Validation test failed:", error.message);
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Registration Tests\n");
  
  await testRegistrationWithCNIC();
  await testValidationErrors();
  
  console.log("\n✨ All registration tests completed!");
  console.log("\n📝 To test with real data:");
  console.log("1. Replace email addresses with real ones");
  console.log("2. Use real CNIC numbers");
  console.log("3. Run the test again");
}

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testRegistrationWithCNIC,
  testValidationErrors,
  runTests
}; 