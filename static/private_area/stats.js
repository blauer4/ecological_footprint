
function getAllActivities() {
    let activitiesList = document.getElementById("list_activities");

    // labels for each activity
    let activityLabelMap = {
        "product" : "Product activity",
        "garbage" : "Garbage activity",
        "transport" : "Transport activity"
    };

    fetch('/api/v1/activities')
    .then((resp) => resp.json())
    .then(function (data) {

        // sort the data according to the date
        data.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
        });

        data.forEach(element => {
            let date = new Date(element.date).toLocaleString().split(",")[0];

            let activityId = element.self.substring(element.self.lastIndexOf('/') + 1);;
            
            // li creation
            let li = document.createElement("li");
            li.classList.add("list-group-item");
            li.setAttribute("data-bs-toggle", "collapse");
            li.setAttribute("type", "button");
            li.setAttribute("data-bs-target", `#activity_${activityId}`);
            li.setAttribute("aria-expanded", "false");
            li.setAttribute("aria-controls", `activity_${activityId}`);
            li.innerHTML = `<b>${date}</b>&nbsp;-&nbsp;${activityLabelMap[element.type]}`;

            let collapseDiv = document.createElement("div");
            collapseDiv.classList.add("collapse", "card", "list-group-item");

            collapseDiv.setAttribute("id", `activity_${activityId}`);


            fetch(element.self)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) { 
                
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
            .catch( error => console.error(error) );  // error handle
            
        });


    }).catch(error => console.error(error));
}

getAllActivities();