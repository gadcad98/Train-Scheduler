// Initialize Firebase
var config = {
    apiKey: "AIzaSyBG-Hy7VAkZcqL7SNlfqOUIzFDNGsulunI",
    authDomain: "train-scheduler-82c16.firebaseapp.com",
    databaseURL: "https://train-scheduler-82c16.firebaseio.com",
    projectId: "train-scheduler-82c16",
    storageBucket: "",
    messagingSenderId: "787614523315"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

//   click event to capture data
$("#submit").click(function(event) {
    event.preventDefault();
    // alert("clicked");
    var freq = $("#freq").val()
    var time = $("#time").val()
    var name = $("#name").val().trim()
    var dest = $("#dest").val().trim()

    // sets data to send to firebase
    var data = {
        name: name,
        time: time,
        freq: freq,
        dest: dest
    };
    console.log(data)
    // pushes data to firebase
    database.ref().push(data);
});

// references data from firebase then pulls data according to the dateAdded value
database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val())
    console.log(snapshot.val().time)
    var timeArray = snapshot.val().time.split(":");
    // moment.js formulas to convert the times
    var firstTimeConverted = moment().hours(timeArray[0]).minutes(timeArray[1])
    // console.log(firstTimeConverted)

    var maxMoment = moment.max(moment(), firstTimeConverted);

    // console.log(maxMoment)

    var tTime = maxMoment.format("hh:mm: A")

    console.log(tTime)


    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % snapshot.val().freq;
    var tMinutesToTrain = snapshot.val().freq - tRemainder;
    var nextTrain = moment().add(tMinutesToTrain, "minutes");
    var arrival = moment(nextTrain).format("hh:mm");
    // creates table data dynamically
    var row = $('<tr>' + 
        '<td scope="col-lg">' + snapshot.val().name + '</td>' +
        '<td scope="col-lg">' + snapshot.val().dest + '</td>' +
        '<td scope="col-lg">' + snapshot.val().freq + '</td>' +
        '<td scope="col-lg">' + arrival + '</td>' +
        '<td scope="col-lg">' + tMinutesToTrain + '</td>' +
        '</tr>');
    $("#tbody").append(row);
});