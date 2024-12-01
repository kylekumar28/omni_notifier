global.self = global; // Define 'self' for Node.js compatibility

const admin = require("firebase-admin");

// const serviceAccount = JSON.par - self(process.env.FIREBASE_SERVICE_ACCOUNT);
const serviceAccount = self(process.env.FIREBASE_SERVICE_ACCOUNT);

console.log(serviceAccount);

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
	databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
});

const db = admin.database();

db.ref("messages")
	.push({ content: "Test message", timestamp: Date.now() })
	.then(() => console.log("Message saved successfully"))
	.catch((error) => console.error("Error saving message:", error));

exports.handler = async (event, context) => {
	console.log("Received event:", event.body);

	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: "Method Not Allowed",
		};
	}

	try {
		const { content } = JSON.parse(event.body);
		console.log("Parsed content:", content);

		if (!content) {
			return {
				statusCode: 400,
				body: 'Invalid payload: Missing "content"',
			};
		}

		const messagesRef = db.ref("messages");
		await messagesRef.push({ content, timestamp: Date.now() });

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST",
			},
			body: "Message received and saved",
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			statusCode: 500,
			body: `Internal Server Error: ${error.message}`,
		};
	}
};
