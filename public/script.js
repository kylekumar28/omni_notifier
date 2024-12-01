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

const db = firebase.database();

const messagesDiv = document.getElementById("messages");
const notificationSound = document.getElementById("notification-sound");
const pauseButton = document.getElementById("pause-sound");
const connectionStatusBadge = document.getElementById("connection-status");

let soundPlaying = false;

function formatTimestamp(timestamp) {
	const date = new Date(timestamp);
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${hours}:${minutes} ${day}/${month}/${year}`;
}

pauseButton.addEventListener("click", () => {
	if (soundPlaying) {
		notificationSound.pause();
		soundPlaying = false;

		// Disable pause button
		pauseButton.disabled = true;
	}
});

// Monitor connection status
db.ref(".info/connected").on("value", (snapshot) => {
	const isConnected = snapshot.val();
	if (isConnected) {
		connectionStatusBadge.textContent = "Connected";
		connectionStatusBadge.classList.remove("disconnected");
		connectionStatusBadge.classList.add("connected");
	} else {
		connectionStatusBadge.textContent = "Disconnected";
		connectionStatusBadge.classList.remove("connected");
		connectionStatusBadge.classList.add("disconnected");
	}
});

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

		// Enable pause button
		pauseButton.disabled = false;
	}
});

// Display a message
function displayMessage(message) {
	const messageElement = document.createElement("p");
	const formattedTimestamp = formatTimestamp(message.timestamp);

	messageElement.textContent = `${message.content} - ${formattedTimestamp}`;
	// Set it as bold since it's the newest
	messageElement.style.fontWeight = "bold";

	// Insert at the top of the messages div
	messagesDiv.prepend(messageElement);

	// Set all other messages to normal weight
	const allMessages = messagesDiv.querySelectorAll("p");
	allMessages.forEach((msg, index) => {
		if (index > 0) {
			msg.style.fontWeight = "normal";
		}
	});
}
