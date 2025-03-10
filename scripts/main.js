// function getNameFromAuth() {
//     firebase.auth().onAuthStateChanged(user => {
//         // Check if a user is signed in:
//         if (user) {
//             // Do something for the currently logged-in user here: 
//             console.log(user.uid); //print the uid in the browser console
//             console.log(user.displayName);  //print the user name in the browser console
//             userName = user.displayName;

//             //method #1:  insert with JS
//             document.getElementById("name-goes-here").innerText = userName;    

//             //method #2:  insert using jquery
//             //$("#name-goes-here").text(userName); //using jquery

//             //method #3:  insert using querySelector
//             //document.querySelector("#name-goes-here").innerText = userName

//         } else {
//             // No user is signed in.
//             console.log ("No user is logged in");
//         }
//     });
// }
// getNameFromAuth(); //run the function

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;

                displayEvents(user.uid);
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}
insertNameFromFirestore();

function displayEvents(userID){     //Populate Event Gallery
    let template = document.getElementById("event-card-template");
    db.collection("users").doc(userID).collection("events").get()
        .then(allEvents => {
            allEvents.forEach(doc => {
                if (allEvents.size > 1){    //if more events than the init are present, create event cards
                    eventInfo = db.collection("events").doc(doc.id);
                    eventInfo.get().then(eventDoc => {
                    if(eventDoc.id != "init"){
                        let name = eventDoc.data().name;
                        let date = eventDoc.data().date;
                        let time = eventDoc.data().time;
                        let location = eventDoc.data().location;
                        let newCard = template.content.cloneNode(true);

                        newCard.querySelector('.card-title').innerHTML = name;
                        newCard.querySelector('.event-date').innerHTML = date;
                        newCard.querySelector('.event-time').innerHTML = time;
                        newCard.querySelector('.event-location').innerHTML = location;

                        document.getElementById("event-gallery").appendChild(newCard);
                    }
                    
                })

                }else{
                    console.log($('#event-gallery').load('./text/noEvents.html'));
                }
                
            })
        })
}