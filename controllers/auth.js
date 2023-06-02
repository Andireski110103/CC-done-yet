const {firebase, database} = require("./../config/firebase");

exports.register = (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    return res.status(422).json({
      name: "name is required",
      email: "email is required",
      password: "password is required",
    });
  }


  const isGoogleEmail = req.body.email.endsWith("@gmail.com") || req.body.email.endsWith("@googlemail.com");
  if (!isGoogleEmail) {
    return res.status(422).json({
      email: "Only Google emails are allowed",
    });
  }

  // Create user in Firebase Authentication
  firebase
    .auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((userData) => {
      const uid = userData.user.uid;
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;

      // Save user name in Realtime Database
      firebase
        .database()
        .ref("users/" + uid)
        .set({
          name: name,
          email: email,
          password: password,
          uid: uid,
        })
        .then(() => {
          // Send email verification
          firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
              return res.status(201).json(userData);
            })
            .catch((error) => {
              return res.status(500).json({ error: error.message });
            });
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode == "auth/weak-password") {
        return res.status(500).json({ error: errorMessage });
      } else {
        return res.status(500).json({ error: errorMessage });
      }
    });
};

// signin
exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).json({
      email: "email is required",
      password: "password is required",
    });
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email, req.body.password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        return res.status(401).json({ error: "Email not verified. Please verify your email first." });
      }

      const uid = user.uid;
      const newPassword = req.body.password;

      // Update password in Realtime Database
      firebase
        .database()
        .ref("users/" + uid)
        .update({ password: newPassword })
        .then(() => {
          return res.status(200).json(user);
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === "auth/wrong-password") {
        return res.status(500).json({ error: errorMessage });
      } else {
        return res.status(500).json({ error: errorMessage });
      }
    });
};


// forget password
exports.forgetPassword = (req, res) => {
  if (!req.body.email) {
    return res.status(422).json({ email: "email is required" });
  }
  firebase
    .auth()
    .sendPasswordResetEmail(req.body.email)
    .then(function () {
      return res.status(200).json({ status: "Password Reset Email Sent" });
    })
    .catch(function (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode == "auth/invalid-email") {
        return res.status(500).json({ error: errorMessage });
      } else if (errorCode == "auth/user-not-found") {
        return res.status(500).json({ error: errorMessage });
      }
    });
};

exports.getRegisteredUid = () => {
  // Pastikan Anda sudah login sebelumnya
const user = firebase.auth().currentUser;
if (user) {
  const uid = user.uid;
  console.log('UID:', uid);
} else {
  console.log('Pengguna belum login.');
}

};
