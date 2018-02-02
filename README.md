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
  callbackURL: 'http://localhost:3000/auth/google/callback',
  clientID: 'INSERT-CLIENT-ID-HERE',
  clientSecret: 'INSERT-CLIENT-SECRET-HERE',
};

export const SECRET = "INSERT-RANDOM-HASH-HERE";
```

### To launch the app you will need to run these three commands

```
cd docker && docker-compose up
cd web && npm start
cd app && react-native run-ios
```

After running docker-compose up you can connect psql to your postgres instance
```
docker run -it --rm --net web_default --link postgres_db:postgres postgres psql -h postgres -U postgres
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

