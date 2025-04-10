function insertNameFromFirestore() {
  // Check if the user is logged in:
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid); // Let's know who the logged-in user is by logging their UID
      currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
      currentUser.get().then((userDoc) => {
        // Get the user name
        let userName = userDoc.data().name;
        console.log(userName);
        //$("#name-goes-here").text(userName); // jQuery
        document.getElementById("name-goes-here").innerText = userName;

        displayEvents(user.uid);
      });
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  });
}
insertNameFromFirestore();

function displayEvents(userID) {
  //Populate Event Gallery
  let template = document.getElementById("event-card-template");
  db.collection("users")
    .doc(userID)
    .collection("events")
    .get()
    .then((allEvents) => {
      allEvents.forEach((doc) => {
        if (allEvents.size > 1) {
          //if more events than the init are present, create event cards
          eventInfo = db.collection("events").doc(doc.id);
          eventInfo.get().then((eventDoc) => {
            if (eventDoc.id != "init") {
              let name = eventDoc.data().name;
              let date = eventDoc.data().date;

              // parse date to get first number and last numer, display it as March 20 - 26, 2025
              let dateString = date.split(" ");
              let month = dateString[0];
              let dateNums = dateString[1].split(",") || dateString[1];
              let startDate = dateNums[0];
              let endDate = dateNums[dateNums.length - 2] || "";
              let year = dateString[2];
              let dateFormatted =
                month + " " + startDate + " - " + endDate + ", " + year;

              let time = eventDoc.data().selectedTime;
              let location = eventDoc.data().location;
              let eventImg = eventDoc.data().eventImage;
              let newCard = template.content.cloneNode(true);

              if (eventImg == null) {
                eventImg = "./images/SweetSpot_Logo_1.0.png";
              } else {
                eventImg = "data:image/png;base64," + eventImg;
              }

              newCard.querySelector("img").src = eventImg;
              newCard.querySelector(".card-title").innerHTML = name;
              newCard.querySelector(".event-date").innerHTML = dateFormatted;
              newCard.querySelector(".event-time").innerHTML = time;
              newCard.querySelector(".event-location").innerHTML = location;
              console.log("Event ID: " + eventDoc.id);
              newCard.querySelector("a").href =
                "event-page.html?docID=" + eventDoc.id;

              document.getElementById("event-gallery").appendChild(newCard);
            }
          });
        } else {
          console.log($("#event-gallery").load("./text/no-events.html")); //if user has no events, prompt them to
        }
      });
    });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("logging out user");
      window.location.replace("./index.html");
    })
    .catch((error) => {
      console.log("firebase auth logout fail");
    });
}
