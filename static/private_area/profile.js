
function getAllFollowing() {

    let followersList = document.getElementById("list_followers");

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