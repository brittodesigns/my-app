#!/usr/bin/env node

/**
 * Firebase Configuration Test Script
 * 
 * This script tests if Firebase is properly configured
 * Run with: node scripts/test-firebase.js
 */

const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

// Test Firebase configuration
const firebaseConfig = {
  apiKey: "test-api-key",
  authDomain: "test-project.firebaseapp.com",
  projectId: "test-project",
  storageBucket: "test-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "test-app-id"
};

try {
  console.log('🔥 Testing Firebase Configuration...\n');
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Initialize Auth
  const auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
  
  console.log('\n🎉 Firebase is properly configured!');
  console.log('\n📋 Next Steps:');
  console.log('1. Update app.json with your actual Firebase config');
  console.log('2. Enable Phone Authentication in Firebase Console');
  console.log('3. Test with your phone number');
  
} catch (error) {
  console.error('❌ Firebase configuration error:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check if Firebase is installed: npm list firebase');
  console.log('2. Verify your Firebase config in app.json');
  console.log('3. Make sure you have a valid Firebase project');
}
