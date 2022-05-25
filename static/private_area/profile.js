
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

getAllFollowing();