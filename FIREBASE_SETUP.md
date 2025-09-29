# Firebase SMS Authentication Setup Guide

## 🔥 Firebase Project Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `directory-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Phone" provider
3. Add your domain for testing (for web): `localhost:3000`
4. Add your app's bundle ID for mobile testing

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon) → "General" tab
2. Scroll down to "Your apps" section
3. Click "Add app" → Choose "Web" (</>) 
4. Register app with name: `Directory App`
5. Copy the Firebase configuration object

### 4. Update Configuration Files

#### Update `app.json`:
```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "your_actual_api_key",
      "firebaseAuthDomain": "your-project-id.firebaseapp.com",
      "firebaseProjectId": "your-project-id",
      "firebaseStorageBucket": "your-project-id.appspot.com",
      "firebaseMessagingSenderId": "your_sender_id",
      "firebaseAppId": "your_app_id"
    }
  }
}
```

#### Or create `.env` file (recommended):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📱 Mobile App Configuration

### 1. Install Dependencies
```bash
npm install firebase @react-native-async-storage/async-storage
```

### 2. iOS Configuration
1. In Firebase Console, add iOS app
2. Download `GoogleService-Info.plist`
3. Place it in `ios/YourApp/` directory
4. Update `ios/YourApp/Info.plist` with URL schemes

### 3. Android Configuration
1. In Firebase Console, add Android app
2. Download `google-services.json`
3. Place it in `android/app/` directory
4. Update `android/app/build.gradle`

## 🔧 Testing Setup

### 1. Test Phone Numbers
1. Go to Firebase Console → Authentication → Sign-in method
2. Add test phone numbers in "Phone numbers for testing"
3. Use format: `+1234567890`
4. Set verification code: `123456`

### 2. Development vs Production
- **Development**: Use test phone numbers
- **Production**: Enable real SMS sending
- **Rate Limiting**: Configure in Firebase Console

## 🚀 Implementation Features

### ✅ What's Already Implemented:
- Firebase configuration setup
- SMS OTP sending with Firebase Auth
- OTP verification with Firebase
- Error handling and user feedback
- Phone number validation
- Resend OTP functionality
- Cross-platform support (iOS/Android/Web)

### 🔧 Key Features:
- **Phone Authentication**: Secure SMS-based login
- **OTP Verification**: 6-digit code verification
- **Error Handling**: User-friendly error messages
- **Rate Limiting**: Built-in Firebase protection
- **Persistence**: User session management
- **Cross-Platform**: Works on iOS, Android, and Web

## 🛠️ Usage

### Send OTP:
```typescript
const result = await authService.sendOTP('+1234567890');
if (result.success) {
  // Navigate to OTP screen
}
```

### Verify OTP:
```typescript
const result = await authService.verifyOTP('123456', verificationId);
if (result.success) {
  // User is authenticated
}
```

### Check Authentication:
```typescript
if (authService.isAuthenticated()) {
  // User is logged in
}
```

## 🔒 Security Considerations

1. **Rate Limiting**: Firebase automatically handles SMS rate limiting
2. **Phone Verification**: Only verified phone numbers can sign in
3. **Session Management**: Secure token-based authentication
4. **Error Handling**: No sensitive information in error messages
5. **Input Validation**: Phone number format validation

## 📋 Next Steps

1. **Update Firebase Config**: Replace placeholder values with actual Firebase config
2. **Test Authentication**: Use test phone numbers for development
3. **Deploy**: Configure production Firebase project
4. **Monitor**: Use Firebase Analytics for usage tracking

## 🆘 Troubleshooting

### Common Issues:
- **Invalid phone number**: Ensure format includes country code (+1, +44, etc.)
- **OTP not received**: Check Firebase Console for SMS delivery status
- **Rate limiting**: Wait before retrying, or use test numbers
- **Network errors**: Check internet connection and Firebase project status

### Debug Mode:
- Enable Firebase debug logging
- Check browser console for detailed error messages
- Use Firebase Console to monitor authentication attempts
