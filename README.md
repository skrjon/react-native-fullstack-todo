# react-native-fullstack-todo
React Native, Docker, and Node express API

### Install Docker and containers

https://docs.docker.com/install/#supported-platforms
https://hub.docker.com/_/postgres

Install postgres
```
docker pull postgres
```

### npm install
```
cd app && npm install
cd web && npm install
```

### Next Create your config.js
With your google authentication information and a hash for JWT
The source for web/config.js should look like this
```
export const google = {
  callbackURL: 'http://mytesttodoapp:3000/auth/google/callback',
  clientID: 'INSERT-CLIENT-ID-HERE',
  clientSecret: 'INSERT-CLIENT-SECRET-HERE',
};

// The SECRET needs to be at least the same number of bits as the HS Algorithm
// You can use the crypto library to generate these secrets 32B = 256b
// crypto.randomBytes(32).toString('hex');
export const CRYPTO = {
  ACCESS_ALG: 'HS256',
  ACCESS_SECRET: 'INSERT-RANDOM-HASH-HERE',
  // To improve security we want a different level of enctyption with a different secret for the refresh token
  REFRESH_ALG: 'HS512',
  REFRESH_SECRET: 'INSERT-RANDOM-HASH-HERE',
};

```

### To launch the app you will need to run these three commands

```
cd docker && docker-compose up
cd web && npm start
cd app && react-native run-ios
```

After running docker-compose up you can connect psql to your postgres instance
```
docker exec -it postgres_db bash
```
OR
```
docker run -it --rm --net web_default --link postgres_db:postgres postgres psql -h postgres -U postgres
```

### Google Play setup
You'll need to create credientials for API access and you'll need to add a valid Authorized redirect URI. Google won't let you use an IP or an invalid TLD you have to use something valid.  If you know what your going to use thats great you can use that.  For this example app I used.
```
http://localhost:3000/auth/google/callback
http://mytesttodo.app:3000/auth/google/callback
```


### Android Setup

Your Android emulator needs to be running an APIs image in your Virtual Drives list the target should say "Android 8.0 (Google APIs)" NOT "Android 8.0 (Google Play)".  When you create your virtual device the "Recommended" images are all "Google Play", you'll need to look in x86 to find a Target of "Google APIs".

Change your Android image to allow writes and download the hosts file
```
adb root
adb remount
adb pull /system/etc/hosts .
```
It should say "restarting adbd as root" and "remount succeeded". If it doesn't and it says "adbd cannot run as root in production builds" It means your running a "Google Play" image and not a "Google APIs" image.

If it says "adb is already running as root", and then "remount of /system failed: Read-only file system remount failed".  You may have to go back to AVD Manager, wipe the data on the emulator and cold boot, or delete the image and start over, or download another image and completely start over...

Edit hosts file and add
```
10.0.2.2	mytesttodo.app
```
Upload your hosts file
```
adb push hosts /system/etc
```

### Fix BUG with RN and vector icons
https://github.com/oblador/react-native-vector-icons/issues/626

```
rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json
```

## References
### Basic setup of SafariView and Passport
https://rationalappdev.com/logging-into-react-native-apps-with-facebook-or-google/
https://github.com/rationalappdev/react-native-oauth-login-tutorial

### Not sure if I need this
https://www.pubnub.com/tutorials/react-native/chat-oauth-user-authentication/
https://github.com/pubnub/react-native-tutorial

### Redux organization
https://github.com/reactjs/redux/blob/master/examples/async/src/actions/index.js

### Tokens
https://alexanderpaterson.com/posts/add-social-authentication-to-a-react-native-application
https://github.com/hokaccha/node-jwt-simple
https://medium.com/@alexmngn/the-essential-boilerplate-to-authenticate-users-on-your-react-native-app-f7a8e0e04a42
https://goshakkk.name/auth-in-react-native-apps/

### Add linking to your app
https://facebook.github.io/react-native/docs/linking.html
https://facebook.github.io/react-native/docs/0.52/linking-libraries-ios.html
http://ihor.burlachenko.com/deep-linking-with-react-native

### Android Setup
http://www.bradcurtis.com/hosts-files-and-the-google-android-emulator
https://stackoverflow.com/questions/43923996/adb-root-is-not-working-on-emulator