const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testPasswordChange() {
    try {
        // 1. Register a temp user
        const email = `test_${Date.now()}@example.com`;
        const password = "password123";

        console.log(`Registering user: ${email}`);
        await axios.post(`${BASE_URL}/auth/register`, {
            name: "Test User",
            email,
            password
        });

        // 2. Login
        console.log("Logging in...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password
        });
        const token = loginRes.data.token;
        console.log("Login successful. Token received.");

        // 3. Change Password
        console.log("Changing password...");
        const newPassword = "newpassword456";
        await axios.post(
            `${BASE_URL}/users/change-password`,
            {
                oldPassword: password,
                newPassword: newPassword
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log("✅ Password changed successfully!");

        // 4. Verify new password by logging in again
        console.log("Verifying new password...");
        await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password: newPassword
        });
        console.log("✅ Login with new password successful!");

    } catch (err) {
        console.error("❌ Test Failed:", err.response ? err.response.data : err.message);
    }
}

testPasswordChange();
