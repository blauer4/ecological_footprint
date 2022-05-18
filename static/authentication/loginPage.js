/**
 * function used to authenticate a user to the system and store the new jwt token
 * into a cokkie, that is passed to the api across all the requests.
 */
function login(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    fetch('/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) 
    .then(function(data) { 
        
        // set the token cookie that is stored across all the pages of the site
        document.cookie = `token=${data.token}`;
        location.href = "/private_area/activities.html"
        
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}