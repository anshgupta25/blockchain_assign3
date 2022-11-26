App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("CourseReview.json", function(courseReview) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.CourseReview = TruffleContract(courseReview);
      // Connect provider to interact with contract
      App.contracts.CourseReview.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.CourseReview.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        console.log("yo fucker")
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var courseReviewInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.CourseReview.deployed().then(function(instance) {
      courseReviewInstance = instance;
      return courseReviewInstance.coursesCount();
    }).then(function(coursesCount) {
      var coursesResults = $("#coursesResults");
      coursesResults.empty();

      var coursesSelect = $('#coursesSelect');
      coursesSelect.empty();

      for (var i = 1; i <= coursesCount; i++) {
        courseReviewInstance.courses(i).then(function(course) {
          var id = course[0];
          var name = course[1];
          var voteCount = course[2];
          var rating = course[3];
          console.log("id: " + id + " name: " + name + " voteCount: " + voteCount + " rating: " + rating);

          // Render course Result
          var courseTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td><td>" + rating + "</tr>"
          coursesResults.append(courseTemplate);

          // Render course ballot option
          var courseOption = "<option value='" + id + "' >" + name + "</ option>"
          coursesSelect.append(courseOption);
        });
      }
      // return courseReviewInstance.students(App.account);
      
    }).then(function() {
      // Do not allow a user to vote
      // if() {
      //   $('form').hide();
      //   console.log(": " );
      // }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
      console.log("error: " + error);
    });
  },

  castVote: function() {
    var courseId = $('#coursesSelect').val();
    var courseRating = $('#courseRating').val();
    console.log("courseId: " + courseId + " courseRating: " + courseRating);
    App.contracts.CourseReview.deployed().then(function(instance) {
      //return courseId and courseRating to the contract
      return instance.vote(courseId, courseRating, { from: App.account });
      // return instance.vote(courseId,courseRating, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  addCourse: function() {
    var courseName = $('#courseName').val();
    console.log("courseName: " + courseName);
    App.contracts.CourseReview.deployed().then(function(instance) {
      //return courseId and courseRating to the contract
      return instance.addCourse(courseName, { from: App.account });
      // return instance.vote(courseId,courseRating, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });

  }



};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
