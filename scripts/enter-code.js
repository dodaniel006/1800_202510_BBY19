// Event listener for the join button
 document.getElementById("join-btn").addEventListener("click", (e) => {
  const input = document.getElementById("inviteCode");
  const code = input.value;

  // Check if the code is in the correct format
  // The code should be 5 capital letters
  if (new RegExp("^[A-Z]{5}$").test(code)) {
    console.log("Acceptable code format. Looking for event with code: ", code);

    // Fetch the event with the code from the database
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
    input.classList.add('is-invalid');
  }
}); 