global.self = global; // Define 'self' for Node.js compatibility

const admin = require("firebase-admin");

// const serviceAccount = JSON.par - self(process.env.FIREBASE_SERVICE_ACCOUNT);

// console.log("hi");

// const serviceAccount = JSON - self(process.env.FIREBASE_SERVICE_ACCOUNT);

// console.log(serviceAccount);

// Initialize Firebase Admin SDK
// admin.initializeApp({
// 	// credential: admin.credential.cert(serviceAccount),
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL:
// 		"https://omnnotifier-default-rtdb.europe-west1.firebasedatabase.app/",
// 	options: {
// 		databaseAuthVariableOverride: {
// 			uid: "server-worker",
// 		},
// 	},
// });

// admin.initializeApp({
// 	credential: admin.credential.applicationDefault(), // Default credentials for testing
// 	databaseURL: "https://omnnotifier.firebaseio.com",
// });

// Use the Firebase Admin SDK
admin.initializeApp({
	credential: admin.credential.cert(
		JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
	),
	databaseURL:
		"https://omnnotifier-default-rtdb.europe-west1.firebasedatabase.app/",
});

console.log(
	"Firebase initialized with database URL:",
	admin.database().ref().toString()
);

const db = admin.database();

// db.ref("messages")
// 	.push({ content: "Test message", timestamp: Date.now() })
// 	.then(() => console.log("Message saved successfully"))
// 	.catch((error) => console.error("Error saving message:", error));

exports.handler = async (event, context) => {
	console.log("Received event:", event);

	try {
		// Parse the incoming payload
		const body = JSON.parse(event.body);
		console.log("Parsed body:", body);

		const content = body.content;
		if (!content) {
			return {
				statusCode: 400,
				body: 'Invalid payload: "content" is missing',
			};
		}

		// Log what we will save
		console.log("Content to save:", content);

		// Save the message to Firebase Realtime Database
		const db = admin.database();
		await db.ref("messages").push({
			content: content,
			timestamp: Date.now(),
		});

		// Simulate saving to Firebase (replace this with your actual code)
		console.log("Simulating saving to Firebase...");

		return {
			statusCode: 200,
			body: "Message received and saved",
		};
	} catch (error) {
		console.error("Error in webhook function:", error);
		return {
			statusCode: 500,
			body: `Internal Server Error: ${error.message}`,
		};
	}
};
