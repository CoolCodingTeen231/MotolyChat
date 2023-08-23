
(function () {
    const firebaseConfig = {apiKey: "AIzaSyBkHk2EXgb6B9gBiSWow2dobyUemaf0s38",authDomain: "motoly-495ee.firebaseapp.com",databaseURL: "https://motoly-495ee-default-rtdb.firebaseio.com",projectId: "motoly-495ee",storageBucket: "motoly-495ee.appspot.com",messagingSenderId: "201515826426",appId: "1:201515826426:web:9269bad9165d38c08c9d43",measurementId: "G-V65JG2766V"};
    firebase.initializeApp(firebaseConfig);
    const chatWindow = document.getElementById("chat-window");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const chatMessagesRef = firebase.database().ref("/chat");
    const audioPlayer = new Audio("https://us-tuna-sounds-files.voicemod.net/aa02eac1-621c-477a-a463-e58648e21813-1655827466080.mp3");
    const rainingTacosRef = firebase.database().ref("/music");
  
    rainingTacosRef.on("value", snapshot => {
      if (snapshot.val() === 1) audioPlayer.play();
      else if (snapshot.val() === 0) audioPlayer.pause(), audioPlayer.currentTime = 0;
    });

    messageInput.addEventListener("keydown", (event) => {
        if (event.keyCode === 13) { // Check if Enter key is pressed
            event.preventDefault(); // Prevent the newline character from being inserted
            sendButton.click(); // Simulate a click on the sendButton
        }
    });
  
    firebase.auth().onAuthStateChanged(user => {
      if (!user) location.href = "signup.html";
      else {
        const userId = user.uid;
        const userRef = firebase.database().ref(`/users/${userId}`);
        userRef.once("value", snapshot => {
          const userData = snapshot.val();
          if (userData && userData.username) {
            const senderUsername = userData.username;
            localStorage.setItem("senderUsername", senderUsername);
            sendButton.addEventListener("click", async () => sendMessage(senderUsername));
            chatMessagesRef.on("child_added", snapshot => {
              const message = snapshot.val();
              const senderUsername = localStorage.getItem("senderUsername");
              const messageDiv = document.createElement("div");
              messageDiv.classList.add("message-content");
              messageDiv.id = snapshot.key;
              const contentDiv = document.createElement("div");
              contentDiv.classList.add("content");
              const senderSpan = document.createElement("strong");
              senderSpan.textContent = `${message.sender}: `;
              senderSpan.classList.add("sender");
              contentDiv.appendChild(senderSpan);
              const contentP = document.createElement("text");
              contentP.textContent = message.content;
              contentP.classList.add("content");
              contentDiv.appendChild(contentP);
              if (message.sender === senderUsername) {
                addButton(contentDiv, "Edit", () => editMessage(snapshot.key, message));
                addButton(contentDiv, "Delete", () => deleteMessage(snapshot.key));
              }
              messageDiv.appendChild(contentDiv);
              chatWindow.appendChild(messageDiv);
              chatWindow.scrollTop = chatWindow.scrollHeight;
            });
            chatMessagesRef.on('child_removed', snapshot => {
              const key = snapshot.key;
              const messageElement = document.querySelector(`#${key}`);
              if (messageElement) messageElement.remove();
            });
            chatMessagesRef.on("child_changed", snapshot => {
              const updatedMessage = snapshot.val();
              if (updatedMessage) {
                const messageElement = document.querySelector(`#${snapshot.key}`);
                if (messageElement) messageElement.querySelector('text').textContent = updatedMessage.content;
              }
            });
          }
        });
      }
    });
  
    async function sendMessage(senderUsername) {
      const messageContent = messageInput.value;
      if (messageContent) {
        try {
          await chatMessagesRef.push({ sender: senderUsername, content: messageContent, timestamp: firebase.database.ServerValue.TIMESTAMP });
          messageInput.value = "";
        } catch (error) {
          console.error("Error sending message:", error.message);
        }
      }
    }
    function addButton(parent, text, onClick) {
      const button = document.createElement("button");
      button.textContent = text;
      button.classList.add(text.toLowerCase() + "-button");
      button.style = `background-color: #007bff; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; margin-left: 20px;`;
      button.addEventListener("click", onClick);
      parent.appendChild(button);
    }
    function editMessage(messageKey, message) {const newContent = prompt("Edit the message:", message.content);if (newContent !== null) chatMessagesRef.child(messageKey).update({ content: newContent });}
    function deleteMessage(messageKey) {if (confirm("Are you sure you want to delete this message?")) chatMessagesRef.child(messageKey).remove().catch(error => console.error("Error deleting message:", error.message));}
  })();
