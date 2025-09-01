# Android Release Configuration for Google Play Store

## Pre-Build Setup Required

### 1. Update Capacitor Configuration for Production
The current `capacitor.config.ts` has been updated to remove the development server URL. For production builds, ensure you have:

```typescript
server: {
  cleartext: true
}
```

### 2. Android Build Configuration

Create `android/app/build.gradle` modifications:

```gradle
android {
    compileSdkVersion 34
    defaultConfig {
        targetSdkVersion 34
        minSdkVersion 24
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. Permissions Required in AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### 4. App Signing Setup
1. Generate a signing key:
   ```bash
   keytool -genkey -v -keystore ai-complete-me.keystore -alias ai-complete-me -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Create `android/keystore.properties`:
   ```
   storeFile=../ai-complete-me.keystore
   storePassword=YOUR_STORE_PASSWORD
   keyAlias=ai-complete-me
   keyPassword=YOUR_KEY_PASSWORD
   ```

## Build Steps for Google Play Store

### Prerequisites
1. Export project to GitHub via Lovable
2. Clone the repository locally
3. Install dependencies: `npm install`
4. Add Android platform: `npx cap add android`

### Production Build Process
```bash
# 1. Build the web app for production
npm run build

# 2. Update Android project with latest web build
npx cap update android

# 3. Sync all changes to Android
npx cap sync android

# 4. Open Android Studio for final build
npx cap open android
```

### In Android Studio:
1. Select "Build" > "Generate Signed Bundle / APK"
2. Choose "Android App Bundle (AAB)" for Play Store
3. Select your keystore file and credentials
4. Choose "release" build variant
5. Generate the AAB file

## Upload Checklist for Google Play Console

### Required Assets
- [ ] App Icon (512x512px adaptive icon)
- [ ] Feature Graphic (1024x500px)
- [ ] Phone Screenshots (4-8 images, 16:9 or 9:16 ratio)
- [ ] Tablet Screenshots (4-8 images, if targeting tablets)
- [ ] Privacy Policy URL (must be accessible)
- [ ] Terms of Service URL (must be accessible)

### Store Listing Information
- [ ] App Name: "AI Complete Me"
- [ ] Short Description (80 characters)
- [ ] Full Description (4000 characters max)
- [ ] Category: Dating
- [ ] Content Rating: Complete questionnaire for mature/dating apps
- [ ] Target Age: 18+ (Mature audiences)

### App Content
- [ ] Age verification implemented and working
- [ ] Privacy controls accessible
- [ ] Terms and Privacy links functional
- [ ] No external advertising networks (if using ads, declare)
- [ ] In-app purchases properly declared

### Technical Requirements
- [ ] Target SDK 34 (Android 14)
- [ ] 64-bit architecture support
- [ ] App Bundle (AAB) format
- [ ] All permissions justified and declared
- [ ] ProGuard/R8 enabled for obfuscation

## Testing Before Submission
1. **Internal Testing:** Upload to Google Play Console internal track
2. **Closed Testing:** Test with limited group of users
3. **Open Testing:** Optional pre-launch testing track
4. **Production:** Full release

## Important Notes
- **Dating apps require extra review time** - allow 7-14 days for approval
- **Age verification is critical** - must work correctly for 18+ requirement
- **Privacy policy must be accessible** before and after sign-in
- **Content rating questionnaire** is mandatory for dating apps
- **Regional restrictions** may apply in some countries

## Common Rejection Reasons to Avoid
1. Age verification not working properly
2. Privacy policy not accessible
3. Inappropriate content not properly gated
4. Missing content ratings
5. Permissions not justified
6. Target SDK too low
7. App crashes on startup

## Post-Launch Monitoring
- Monitor crash reports in Google Play Console
- Track user reviews and ratings
- Update regularly for security and features
- Respond to user feedback promptly