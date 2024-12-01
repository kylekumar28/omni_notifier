// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCcrUXyy0O7ElgKsVpyR9lODhqIi3c2K1k",
	authDomain: "omnnotifier.firebaseapp.com",
	databaseURL:
		"https://omnnotifier-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "omnnotifier",
	storageBucket: "omnnotifier.firebasestorage.app",
	messagingSenderId: "456373027955",
	appId: "1:456373027955:web:1d535de3a121f69f541606",
	measurementId: "G-J71GGK70NY",
};

const app = firebase.initializeApp(firebaseConfig);

console.log("Firebase initialized:", app.name);

console.log(process.env.FIREBASE_SERVICE_ACCOUNT);

const db = firebase.database();

const messagesDiv = document.getElementById("messages");
const notificationSound = document.getElementById("notification-sound");
const pauseButton = document.getElementById("pause-sound");

let soundPlaying = false;

pauseButton.addEventListener("click", () => {
	notificationSound.pause();
	soundPlaying = false;
});

// Test
db.ref("messages").on("value", (snapshot) => {
	console.log("Realtime data:", snapshot.val());
});

// Listen for new messages
db.ref("messages").on("child_added", (snapshot) => {
	const message = snapshot.val();
	displayMessage(message);

	// Play sound
	if (!soundPlaying) {
		notificationSound.play();
		soundPlaying = true;
	}
});

// Display a message
function displayMessage(message) {
	const messageElement = document.createElement("p");
	messageElement.textContent = `${message.author}: ${message.content}`;
	messagesDiv.appendChild(messageElement);
}
