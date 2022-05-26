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
    let errordiv = document.getElementById("errorMessage");

    if(!String(email).toLocaleLowerCase().match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
        errordiv.innerHTML = '<div class="alert alert-danger alert-dismissible show fade" role="alert"><i class="bi bi-exclamation-triangle-fill"></i>&nbsp; ' 
        + ' Email is not valid <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
            return;
    };
    
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
            errordiv.innerHTML = '<div class="alert alert-danger alert-dismissible show fade" role="alert"><i class="bi bi-exclamation-triangle-fill"></i>&nbsp; ' + data.message
            + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
        } 
    }) 
    .catch(error => console.error(error)); 
} 
 
/** 
 * Load the profile data 
 */ 
function loadProfile() { 
    let email_p = document.getElementById("email_placeholder"); 
    let username_p = document.getElementById("username_placeholder"); 
    let name_p = document.getElementById("name_placeholder"); 
    let surname_p = document.getElementById("surname_placeholder"); 
    let email = document.getElementById("email"); 
    let username = document.getElementById("username"); 
    let name = document.getElementById("name"); 
    let surname = document.getElementById("surname"); 
    let userId = getCookie('userId'); 
     
    fetch('/api/v1/users/' + userId) 
    .then((resp) => (resp.json())) 
    .then(function(data){ 
        email.value = data.email; 
        username.value = data.username; 
        name.value = data.name; 
        surname.value = data.surname; 
        email_p.innerHTML = data.email; 
        username_p.innerHTML = data.username; 
        name_p.innerHTML = data.name; 
        surname_p.innerHTML = data.surname; 
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
            let friendId = friend.self.substring(friend.self.lastIndexOf('/') + 1);;

            // li creation
            let li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            li.innerHTML = `<b>${friend.username}</b>`;

            // remove friend button
            let removeButton = document.createElement("button");
            removeButton.classList.add("btn-sm", "btn-danger");
            removeButton.setAttribute("onclick", `removeFriend('${friendId}')`);
            removeButton.innerHTML = `<i class="fa fa-trash"></i>`

            li.appendChild(removeButton)
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

function removeFriend(userId) {

    fetch(`/api/v2/friends`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userId: userId}),
    })
    .then(res => res.text()) 
    .then((res)=>{
        document.getElementById("error_add_user").innerHTML = res;
        getAllFollowing();
    });
}

getAllFollowing();
loadProfile();