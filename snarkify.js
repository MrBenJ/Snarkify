Tweets = new Mongo.Collection("tweets");


if (Meteor.isClient) {
  // Code to run on client
  Meteor.subscribe("tweets");

  Template.body.events({
  // Body template events go in here

  "submit .tweet-box-form": function(event) {
    var text = event.target.text.value;
    console.log(text);

    if (text == "") {
      // Do nothing if no text is entered
    }

    else if (text.length >= 140) {
      // Tweet is too long
      alert("Everyone knows that tweets are 140 characters or less, but I mean, someone as dumb as you already knew that, right?");
    }

    else {
      // Submit a tweet 
      Meteor.call("createTweet", text);
    }
    // Clear out the form
    event.target.text.value = "";

    // Prefent default form submission
    return false;
  },




  }); // End template events


  Meteor.methods({
    createTweet: function(text) {

      var username = Meteor.user().profile.name;

        Tweets.insert({
          text: text,
          createdAt: new Date(),
          owner: Meteor.userId(),
          username: username,

        });
    },


  }); // End Meteor Methods

} // End Meteor.isClient

  

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    var T = new TwitMaker({
      consumer_key: "khi3agryJOzrrFG1Sso3CW9ce",
      consumer_secret: "yWF70HC4iSdkU4Si3wo3IZgvhjCWMLyBOMyO4h3V9cccFH8oXM",
      access_token: "2402661966-lQdI8oUHp2MXf8xpa1BXlyQ35Pm9IGfuKn0OvfL",
      access_token_secret: "ylm3YbvpjI6mEQK1xAArUHk1sKPcK34Vlv7DBrokMyx2K",
    });

    Meteor.methods({
      createTweet: function(text) {
        
        T.post('statuses/update', { status: text}, 
          function(err, data, response) {
            console.log(data);
        });
      }

    });

    T.get('search/tweets',
    
    {
      q: '#snark',
      count: 10,
      },

    function(err, data, response) {
      if(data) {
        for (var i = 0; i < data.length; i++) {
          console.log(data[i].text);
          console.log("Searched for a tweet and found this!");
        }
      }
    });



});

  Meteor.publish("tweets", function() {
    
  });
}