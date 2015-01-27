
  // counter starts at 0
  Session.setDefault("counter", 0);
  
  collection = new Meteor.Collection("messages");
  
  collection.find({}).observe({
	  added: function(item) {
		  console.log(item);
		  Session.set("message", item.message);
		  Session.set("counter", Session.get("counter") + 1);
		  if(item.topic == "temperature") {
			  Session.set("temperature", item.message);
		  }
	  }
  })
  
  
  Meteor.subscribe("messages", "house/garden-room/temperature");

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    },
	message: function() {
		return Session.get("message");
	},
	temperature: function() {
		return Session.get("temperature");
	}
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
		Meteor.call("publishMessage", "commands", "led_off");
    }
  });


