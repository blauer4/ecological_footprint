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
 

function getAllFollowing() {

    let followersList = document.getElementById("list_followers");
    followersList.innerHTML = "";

    fetch(`/api/v2/friends`)
    .then(res => res.json()) 
    .then((friends)=>{
        
        friends.forEach((friend)=>{

            // li creation
            let li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            li.innerHTML = `<b>${friend.name}</b>`;

            followersList.appendChild(li);

        });
        
    });
}

function addFriend(){
    let friendName = document.getElementById("followNewUserName").value;

    fetch(`/api/v1/users`)
    .then((resp) => resp.json()) 
    .then(function(availableUsers) { 
        
        let userId;
        for (let i=0; i<availableUsers.length; i+=1){
            let user = availableUsers[i];

            if (user.username == friendName){
                userId = user.self.substring(user.self.lastIndexOf('/') + 1);;
                break;
            }
        }

        if (!userId){
            document.getElementById("error_add_user").innerHTML = "Unable to find a user with that username.";
            return;
        }else{
            document.getElementById("error_add_user").innerHTML = "";
        }


        fetch('/api/v2/friends', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({userId: userId}),
        })
        .then((resp) => {
            if (resp.status == 200 ){
                document.getElementById("error_add_user").innerHTML = "Friend added";
                getAllFollowing();
            }else{
                resp.text().then((msg)=>{
                    document.getElementById("error_add_user").innerHTML = msg;
                }).catch(error => console.error(error))
            }
            

        })
        .catch( error => console.error(error) ); // error handle


        
    });

}

getAllFollowing();
loadProfile();