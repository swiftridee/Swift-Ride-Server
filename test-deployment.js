const axios = require('axios');

// Replace with your Vercel deployment URL
const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000';

async function testDeployment() {
  console.log('Testing deployment at:', BASE_URL);
  
  const tests = [
    {
      name: 'Welcome Route',
      url: '/',
      method: 'GET'
    },
    {
      name: 'Health Check',
      url: '/api/health',
      method: 'GET'
    },
    {
      name: 'Test Route',
      url: '/api/test',
      method: 'GET'
    },
    {
      name: 'Vehicles Route',
      url: '/api/vehicles',
      method: 'GET'
    },
    {
      name: 'Non-existent Route (should return 404)',
      url: '/api/nonexistent',
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n🧪 Testing: ${test.name}`);
      const response = await axios({
        method: test.method,
        url: `${BASE_URL}${test.url}`,
        timeout: 10000
      });
      
      console.log(`✅ ${test.name} - Status: ${response.status}`);
      console.log(`   Response:`, response.data);
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${test.name} - Status: ${error.response.status}`);
        console.log(`   Error:`, error.response.data);
      } else {
        console.log(`❌ ${test.name} - Network Error:`, error.message);
      }
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testDeployment().catch(console.error);
}

module.exports = testDeployment; 