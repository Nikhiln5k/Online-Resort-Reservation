const admin = require("firebase-admin");

// Use your Firebase project's service account key
const serviceAccount = require("./resort-web-app-firebase-adminsdk-etjuh-26c775fc00.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
