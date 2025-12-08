#!/usr/bin/env node

/**
 * Admin Authentication Test Script
 * Run with: node test-auth.js
 */

const BASE_URL = 'http://localhost:3000/api/v1';

console.log('🔐 Admin Authentication Test Examples');
console.log('=====================================\n');

// Test data
const testAdmin = {
  username: "test_admin",
  email: "test@example.com",
  password: "testpassword123",
  role: "EDITOR"
};

console.log('1. Register Admin');
console.log(`   POST ${BASE_URL}/admin/auth/register`);
console.log('   Body:', JSON.stringify(testAdmin, null, 2));
console.log('   curl -X POST', `${BASE_URL}/admin/auth/register \\`);
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d', `'${JSON.stringify(testAdmin)}'`);
console.log('');

console.log('2. Login Admin');
console.log(`   POST ${BASE_URL}/admin/auth/login`);
const loginData = { email: testAdmin.email, password: testAdmin.password };
console.log('   Body:', JSON.stringify(loginData, null, 2));
console.log('   curl -X POST', `${BASE_URL}/admin/auth/login \\`);
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d', `'${JSON.stringify(loginData)}'`);
console.log('');

console.log('3. Access Protected Route (using token from login)');
console.log(`   GET ${BASE_URL}/admin/auth/profile`);
console.log('   Headers:');
console.log('     Authorization: Bearer YOUR_JWT_TOKEN_HERE');
console.log('   curl -X GET', `${BASE_URL}/admin/auth/profile \\`);
console.log('        -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"');
console.log('');

console.log('4. Create Culture (protected route)');
console.log(`   POST ${BASE_URL}/admin/cultures`);
const cultureData = {
  namaBudaya: "Tari Pendet",
  pulauAsal: "Bali",
  provinsi: "Bali",
  kotaDaerah: "Denpasar",
  status: "DRAFT"
};
console.log('   Headers:');
console.log('     Authorization: Bearer YOUR_JWT_TOKEN_HERE');
console.log('     Content-Type: application/json');
console.log('   Body:', JSON.stringify(cultureData, null, 2));
console.log('   curl -X POST', `${BASE_URL}/admin/cultures \\`);
console.log('        -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \\');
console.log('        -H "Content-Type: application/json" \\');
console.log('        -d', `'${JSON.stringify(cultureData)}'`);
console.log('');

console.log('📝 Notes:');
console.log('- Replace YOUR_JWT_TOKEN_HERE with actual token from login response');
console.log('- All admin routes (except /auth/register and /auth/login) require authentication');
console.log('- Set JWT_SECRET in your .env file for production');
console.log('- First admin can be registered without authentication');
console.log('- Use different roles: SUPER_ADMIN, EDITOR, VIEWER');