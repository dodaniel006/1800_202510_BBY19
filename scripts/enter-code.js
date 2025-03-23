document.getElementById("join-btn").addEventListener("click", (e) => {
  const code = document.getElementById("inviteCode").value;

  if (new RegExp("^[A-Z]{5}$").test(code)) {
    console.log("Acceptable code format. Looking for event with code: ", code);

    db.collection("events")
      .where("eventCode", "==", code)
      .get()
      .then((event) => {
        // Firebase always gets us a query result, even if the query is empty. Thus we need to check if the query is empty.
        // And throw an alert if it is.
        if (event.empty) {
          alert("No matching event found.");
          console.log("No matching event found.");
          return;
        }
        console.log("event found -> ", event.docs[0].id);
        window.location.href = "event-page.html?docID=" + event.docs[0].id;
      })
      .catch((error) => {
        // The catch is fired if there is an error with the connection to the db (I think)
        console.error("Error fetching events:", error);
      });
  } else {
    alert("Invalid code. Please enter a valid code.");
  }
});
