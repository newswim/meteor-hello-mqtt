Meteor.startup(function() {
	// code to run on server at startup

});

var mqtt = Meteor.require("mqtt");

// initialize the mqtt client from mqtt npm-package
var mqttClient = mqtt.createClient(config.mqttPort, config.mqttHost);

// We are subscribing to every thing here. 
// In a better app we'd control subscriptions from the client end.
// The # is a MQTT wildcard. Regular subscriptions look like 'home/livingroom/temperature'
mqttClient.on("connect", function() {
	console.log("client connected");
	mqttClient.subscribe("#");
});



Meteor.publish('messages', function(filter) {
	var self = this,
		ready = false;
	console.log("FILTER ", filter);


	//Every time we get an MQTT message, create a dummy
	// Document and add it to the collection
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
	// publishes a message with a topic to the broker
	publishMessage: function(topic, message) {
		console.log("message to send: " + topic + ": " + message);
		mqttClient.publish(topic, message, function() {
			console.log("message sent: " + message);
		});
	}
});
