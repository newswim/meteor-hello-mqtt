Meteor.startup(function() {
	// code to run on server at startup

});

var mqtt = Meteor.require("mqtt");

var mqttClient = mqtt.createClient(config.mqttPort, config.mqttHost);

// We are subscribing to every thing here. 
// In a better app we'd control subscriptions from the client end.
mqttClient.on("connect", function() {
	console.log("client connected");
	mqttClient.subscribe("#");
});



Meteor.publish('messages', function(filter) {
	var self = this,
		ready = false;
	console.log("FILTER ", filter);


	// initialize the mqtt client from mqtt npm-package
	mqttClient.on("message", function(topic, message) {
		console.log(topic + ": " + message);
		// build the object to store
		var msg = {
			message: message,
			topic: topic,
			ts: new Date()
		};
		// add the message to the collection (see below...)
		console.log("Message received and understood: ", msg);
		self.added("messages", new Date().toString(), msg);
	});
	self.ready();
	ready = true;

	self.onStop(function() {
		// subHandle.stop();
	});
});



Meteor.methods({
	// start receiving messages with the set topic-query
	startClient: function() {
		console.log("startClient called");
		mqttClient.subscribe("#");
	},
	// stop receiving messages
	stopClient: function() {
		console.log("stopClient called");
		mqttClient.unsubscribe(topicQuery);
	},
	// set a new topic query, unsubscribe from the old and subscribe to the new one
	setTopicQuery: function(newTopicQuery) {
		console.log("set new Topic: " + newTopicQuery);
		mqttClient.unsubscribe(topicQuery).subscribe(newTopicQuery);
		topicQuery = newTopicQuery;
	},
	// send the topic query to the caller
	getTopicQuery: function() {
		return topicQuery;
	},
	// publishes a message with a topic to the broker
	publishMessage: function(topic, message) {
		console.log("message to send: " + topic + ": " + message);
		mqttClient.publish(topic, message, function() {
			console.log("message sent: " + message);
		});
	},
	getConfigValues: function() {
		return config;
	}
});
