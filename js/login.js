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

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log("Logged in user:", userCredential.user);
      const userId = userCredential.user.uid;
      const userRef = firebase.database().ref("/users/" + userId);
      userRef.once("value")
        .then(snapshot => {
          const userData = snapshot.val();
          if (userData) {
            const username = userData.username;
            localStorage.setItem('userName', btoa(username));
          }
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });

      location.href = 'index.html';
    } catch (error) {
      alert(error.message);
    }
  });
}
