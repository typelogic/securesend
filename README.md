# SecureSend

![ss](ss.png?raw=true "ss")

When a simple send suddenly becomes serious. This is a test React Native application to test the [react-native-bluetooth-secure](https://github.com/typelogic/react-native-bluetooth-secure) library.

## Steps taken to develop SecureSend test app:
```
npx react-native init securesend
cd securesend
npm install --save react-native-svg
npm install --save react-native-qrcode-svg
npm install --save react-native-camera
npm install --save react-native-qrcode-scanner
npm install --save react-native-permissions

npx react-native link react-native-svg
npx react-native link react-native-qrcode-scanner
npx react-native link react-native-camera
npx react-native link react-native-permissions

# finally, install the Bluetooth library
npm install --save react-native-bluetooth-secure

# Add 
# missingDimensionStrategy 'react-native-camera', 'general'
vi android/app/build.gradle

# Declare needed Android permissions
vi android/app/src/main/AndroidManifest.xml
```

## Notes

Noting here workarounds that helped me when encountering weird issues:

- `npm start -- --reset-cache` instead of `npx react-native start`

Open the **android** project in **Android Studio** and build the test app . If encountering errors, do `invalidate cache and restart`.
