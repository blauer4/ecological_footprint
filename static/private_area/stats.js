// function that returns a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function getAllActivities() {
    let activitiesList = document.getElementById("list_activities");
    activitiesList.innerHTML = "";

    // labels for each activity
    let activityLabelMap = {
        "product": "Product activity",
        "garbage": "Garbage activity",
        "transport": "Transport activity"
    };

    fetch('/api/v1/activities')
        .then((resp) => resp.json())
        .then(function (data) {

            if (data.length == 0) {
                let li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                li.innerHTML = "No activity found";

                activitiesList.appendChild(li);
                return;
            }

            // sort the data according to the date
            data.sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });

            data.forEach(element => {

                if (element.userId == getCookie("userId")) {
                    let date = new Date(element.date).toLocaleString().split(",")[0];

                    let activityId = element.self.substring(element.self.lastIndexOf('/') + 1);;

                    // li creation
                    let li = document.createElement("li");
                    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                    li.innerHTML = `<b>${date}</b>&nbsp;${activityLabelMap[element.type]}`;

                    let span = document.createElement("span");
                    span.classList.add("badge");

                    // info activity button
                    let infoButton = document.createElement("button");
                    infoButton.classList.add("btn-sm", "btn-success");
                    infoButton.setAttribute("data-bs-toggle", "collapse");
                    infoButton.setAttribute("data-bs-target", `#activity_${activityId}`);
                    infoButton.setAttribute("aria-expanded", "false");
                    infoButton.setAttribute("aria-controls", `activity_${activityId}`);
                    infoButton.innerHTML = `<i class="fa fa-info"></i>`

                    // remove activity button
                    let removeButton = document.createElement("button");
                    removeButton.classList.add("btn-sm", "btn-danger");
                    removeButton.setAttribute("onclick", `removeActivity('${activityId}', '${element.type}')`);
                    removeButton.innerHTML = `<i class="fa fa-trash"></i>`
                    span.appendChild(infoButton)
                    span.appendChild(removeButton)


                    li.appendChild(span);

                    let collapseDiv = document.createElement("div");
                    collapseDiv.classList.add("collapse", "card", "list-group-item");

                    collapseDiv.setAttribute("id", `activity_${activityId}`);


                    fetch(element.self)
                        .then((resp) => resp.json()) // Transform the data into json
                        .then(function (data) {

                            collapseDiv.innerHTML = `Impact: ${data.impact}<br />`;

                            switch (element.type) {
                                case "product":
                                    collapseDiv.innerHTML += `Product: ${data.product.name}<br />`;
                                    collapseDiv.innerHTML += `Quantity: ${data.amount}<br />`;
                                    break;
                                case "garbage":
                                    collapseDiv.innerHTML += `Garbage material: ${data.material.name}<br />`;
                                    collapseDiv.innerHTML += `Quantity: ${data.amount}<br />`;
                                    break;
                                case "transport":
                                    collapseDiv.innerHTML += `Vehicle: ${data.vehicle.name}<br />`;
                                    collapseDiv.innerHTML += `Quantity: ${data.distance}<br />`;
                                    break;
                                default:
                                    break;
                            }

                            activitiesList.appendChild(li);
                            activitiesList.appendChild(collapseDiv);
                        })
                        .catch(error => console.error(error));  // error handle

                }

            });


        }).catch(error => console.error(error));
}


function removeActivity(activityId, type) {

    fetch(`/api/v1/activities/${type}/${activityId}`, {
        method: 'DELETE',
    })
        .then(res => res.text())
        .then((res) => {
            getAllActivities();
            loadPersonalImpact();
        });
}


/**
 * Funzione che carica i dati delle impronte ecologiche del singolo utente
 * DA FARE
 */

function loadPersonalImpact() {
    fetch('/api/v1/activities/total_impact')
    .then((resp) => resp.json())
    .then(function (data) {
        let h1 = document.getElementById("personal_total");
        h1.innerHTML = data.total_impact;
    }).catch(error => console.error(error));
}

function compareImpact( a, b ) {
    if ( a.totalImpact < b.totalImpact ){
        return -1;
    }
    if ( a.totalImpact > b.totalImpact ){
        return 1;
    }
    return 0;
}
  
function getChartFollowing() {
  
    let followersList = document.getElementById("list_followers_stats");
    followersList.innerHTML = "";

    let friends_ranking = [];
    let waitPromises = [];     // used to wait for all the fetch promises

    fetch('/api/v1/activities/total_impact')
    .then((resp) => resp.json())
    .then(function (data) {
            
        // add the current user to the ranking
        friends_ranking.push({
            name: "You",
            surname: "",
            totalImpact: data.total_impact
        });

        // get the friends impact
        fetch(`/api/v2/friends`)
        .then(res => res.json())
        .then((friends) => {

            friends.forEach(friend => {
                waitPromises.push(fetch(friend.self).then((resp) => resp.json()));
            });

            // wait for all the fetch promises
            Promise.all(waitPromises).then((friends) => {
                
                friends.forEach(friend => {

                    friends_ranking.push(friend);

                });
                friends_ranking = friends_ranking.sort(compareImpact);

                // generate the friends ranking
                friends_ranking.forEach(friend => {
                    let li = document.createElement("li");
                    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                    if (friend.name == "You"){
                        li.innerHTML = `<b>${friend.name} ${friend.surname}</b> ${friend.totalImpact} `;
                    }else{
                        li.innerHTML = `<span>${friend.name} ${friend.surname}</span> ${friend.totalImpact} `;
                    }

                    followersList.appendChild(li);
                });

            })

            


        });
    }).catch(error => console.error(error));

    
}

/**
 * Funzione che carica i dati delle impronte ecologiche degli utenti e ne calcola la media
 */
 function loadGlobalImpact() {
    let somma = 0;
    let counter = 0;
    
    fetch('/api/v1/generalStats')
    .then((resp) => resp.json())
    .then(function (data) {
        let h1 = document.getElementById("average_placeholder");
        h1.innerHTML = data.total_impact;
    }).catch(error => console.error(error));

    fetch('/api/v1/activities/total_impact')
    .then((resp) => resp.json())
    .then(function (data) {
        // planets summary
        if (data.total_impact > 1000){
            worldsCount = 4;
        }else if (data.total_impact > 700) {
            worldsCount = 3;
        }else if (data.total_impact > 700) {
            worldsCount = 2;
        }else {
            worldsCount = 1;
        }

        for (let i=0; i<worldsCount; i++){
            document.getElementById(`world_${i+1}`).src = "/img/earth.png";
        }
        

        document.getElementById("planets").innerHTML = `If everyone would live like you, we'd need ${worldsCount} Planets!`;
    }).catch(error => console.error(error));
    

}

loadGlobalImpact();
getChartFollowing();
loadPersonalImpact();
getAllActivities();