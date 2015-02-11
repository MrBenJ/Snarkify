Tweets = new Mongo.Collection("tweets");
parseTweets = new Mongo.Collection("fromTwitter");

if (Meteor.isClient) {
  // Code to run on client
  Meteor.subscribe("tweets");
  Meteor.subscribe("parseTweets");

  Template.body.helpers({

    snarks: function () {
      return Tweets.find();
    },

    tweets: function() {
      return parseTweets.find();
    }


  });

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
      Meteor.call("createTweet", "I'm a moron who is using #snarkify to make a tweet longer than 140 characters");
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

  "click #refresh": function(event) {
    Meteor.call("removeAllPosts");
    Meteor.call("refreshTweets");
  },

  "click #clear": function(event) {
    Meteor.call("removeUserPosts");
  },




  }); // End template events


  Meteor.methods({

    // Client side methods go in here


  }); // End Client Meteor Methods

} // End Meteor.isClient

  

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.publish("tweets", function() {
          return Tweets.find({ createdBy: this.userId }, {sort: {createdAt: -1}});
    
          });
    Meteor.publish("parseTweets", function() {
          return parseTweets.find({});
    })

    var T = new TwitMaker({
      consumer_key: "YOUR_TWITTER_CONSUMER_KEY",
      consumer_secret: "YOUR_TWITTER_CONSUMER_SECRET",
      access_token: "YOUR_TWITTER_ACCESS_TOKEN",
      access_token_secret: "YOUR_TWITTER_ACCESS_TOKEN_SECRET",
    });

    Meteor.methods({
      createTweet: function(text) {
        
        T.post('statuses/update', { status: text}, 
          function(err, data, response) {
            // Callback here, but not needed???
        });

        var username = Meteor.user().profile.name;

        Tweets.insert({
          text: text,
          createdAt: new Date(),
          createdBy: this.userId,
          username: username,
        });

        

      }, // End createTweet

      removeAllPosts: function() {
        parseTweets.remove({});
      }, // end removeAllPosts

      removeUserPosts: function() {
        Tweets.remove({});
      }, // end removeUserPosts

      refreshTweets: function() {
        T.get('search/tweets',
    
    {
      q: '#snark',
      count: 25,
      }, Meteor.bindEnvironment(

    function(err, data, response) {

      for(i=0; i < 25; i++) {

        var screen_name = "@" + data.statuses[i].user.screen_name;
        var name = data.statuses[i].user.name;
        var text = data.statuses[i].text;

        

        parseTweets.insert({
          screen_name: screen_name,
          name: name,
          text: text,
        });
      };

    } // end callBack
    )); // end bindEnvironment

        

    },  // End refreshTweets


    }); // End Server Meteor Methods

    



});

  
}