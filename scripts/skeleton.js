//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   
		        // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('./text/nav_after_login.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
            console.log("Logged In!");
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('./text/nav_before_login.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
            console.log("Logged Out :(");
        }
        console.log($('#enterCodePlaceholder').load('./text/enter_code_modal.html'));
        console.log($('#enterCodeButtonPlaceholder').load('./text/enter_code_button.html'));
    });
}

loadSkeleton(); //invoke the function

