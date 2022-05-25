function getCookie(name) { 
    const value = `; ${document.cookie}`; 
    const parts = value.split(`; ${name}=`); 
    if (parts.length === 2) return parts.pop().split(';').shift(); 
} 
 
/** 
 * Function that updates the user information 
 */ 
function updateProfile() { 
    let email = document.getElementById("email").value; 
    let username = document.getElementById("username").value; 
    let name = document.getElementById("name").value; 
    let surname = document.getElementById("surname").value; 
 
    fetch('/api/v1/users/update_profile', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
            email: email, 
            username: username, 
            surname: surname, 
            name: name, 
        }), 
    }) 
    .then((resp) => resp.json()) 
    .then(function (data) { 
        if (data.success) { 
            location.href = "/private_area/profile.html" 
        } else { 
            document.getElementById("error-message").innerHTML = data.message; 
        } 
    }) 
    .catch(error => console.error(error)); 
} 
 
/** 
 * Load the profile data 
 */ 
function loadProfile() { 
    let email = document.getElementById("email_placeholder"); 
    let username = document.getElementById("username_placeholder"); 
    let name = document.getElementById("name_placeholder"); 
    let surname = document.getElementById("surname_placeholder"); 
    let userId = getCookie('userId'); 
     
    fetch('/api/v1/users/' + userId) 
    .then((resp) => (resp.json())) 
    .then(function(data){ 
        email.innerHTML = data.email; 
        username.innerHTML = data.username; 
        name.innerHTML = data.name; 
        surname.innerHTML = data.surname; 
    }) 
    .catch(error => console.error(error)); 
} 
 
loadProfile();