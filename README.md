# Maps With Location Android Issue Example

## 🚀 How to reproduce

- Install packages with `npm install`.
- Run EAS development Build eas
  - `eas build --profile development --platform android`
- Install the build on android device
- OR You can try and use the development build I prepared for this project:
  https://expo.dev/accounts/oferrevi/projects/map-location/builds/46d5aa58-cb11-474c-bb5b-de78a0b9b87f
- Start Expo Development
  - `npx expo start`
  - open the installed app on the device
 
Works fine on Expo Go for Android and iOS

Fix 20/11/2024 provided "expo-location": "~18.0.2"
Problem is back 08/12/2024 with the latest "expo-location": "~18.0.3"
Fix 12/12/2024 provided "expo-location": "~18.0.4"
development build that works:
https://expo.dev/accounts/oferrevi/projects/map-location/builds/c4d91821-dbaa-4675-bd50-fced536c166f
