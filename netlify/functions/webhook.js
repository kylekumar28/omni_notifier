const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL:
		"https://omnnotifier-default-rtdb.europe-west1.firebasedatabase.app/",
});

const db = admin.database();

exports.handler = async (event, context) => {
	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: "Method Not Allowed",
		};
	}

	try {
		const message = JSON.parse(event.body); // Discord webhook payload
		const messagesRef = db.ref("messages");
		await messagesRef.push(message);

		return {
			statusCode: 200,
			body: "Message received and saved",
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: `Error: ${error.message}`,
		};
	}
};
