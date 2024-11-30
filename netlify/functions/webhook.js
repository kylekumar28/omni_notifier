const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
	// credential: admin.credential.cert(serviceAccount),
	credential: admin.credential.applicationDefault(),
	databaseURL:
		"https://omnnotifier-default-rtdb.europe-west1.firebasedatabase.app/",
});

const db = admin.database();

db.ref("messages")
	.push({ content: "Test message", timestamp: Date.now() })
	.then(() => console.log("Message saved successfully"))
	.catch((error) => console.error("Error saving message:", error));

exports.handler = async (event, context) => {
	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: "Method Not Allowed",
		};
	}

	try {
		// Parse the TradingView alert JSON payload
		const { content } = JSON.parse(event.body);

		if (!content) {
			return {
				statusCode: 400,
				body: 'Invalid payload: Missing "content"',
			};
		}

		// Save the content to Firebase
		const messagesRef = db.ref("messages");
		await messagesRef.push({ content, timestamp: Date.now() });

		return {
			statusCode: 200,
			body: "Message received and saved",
		};
	} catch (error) {
		console.error("Error processing webhook:", error);
		return {
			statusCode: 500,
			body: `Internal Server Error: ${error.message}`,
		};
	}
};
