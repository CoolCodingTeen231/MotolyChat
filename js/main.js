const firebaseConfig = {
    apiKey: "AIzaSyBkHk2EXgb6B9gBiSWow2dobyUemaf0s38",
    authDomain: "motoly-495ee.firebaseapp.com",
    databaseURL: "https://motoly-495ee-default-rtdb.firebaseio.com",
    projectId: "motoly-495ee",
    storageBucket: "motoly-495ee.appspot.com",
    messagingSenderId: "201515826426",
    appId: "1:201515826426:web:9269bad9165d38c08c9d43",
    measurementId: "G-V65JG2766V"
};
firebase.initializeApp(firebaseConfig);

if (document.getElementById("signup-form")) {
  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;
      const userRef = await firebase.database().ref("users/" + userId);
      await userRef.set({
        username: username,
        email: email
      })
      document.getElementById("error").innerHTML = "Signing you...";

      document.getElementById("error").innerHTML = "User registered successfully.";
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}
