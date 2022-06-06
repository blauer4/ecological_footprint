// function that returns a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

/**
 * this function loads the data that correspond to the garbage choices. 
 */
function loadMaterials() {
    fetch('/api/v2/materials')
        .then((resp) => resp.json())
        .then(function (data) {
            let select = document.getElementById("materialSelect");
            data.forEach(element => {
                let option = document.createElement("option");
                option.setAttribute("value", element.self);
                let text = document.createTextNode(element.name);
                option.appendChild(text);
                select.appendChild(option);
            });
        }).catch(error => console.error(error));
}

/**
 * This function loads the data that correspond to the transportation choices. 
*/  
function loadVehicles() {
    fetch('/api/v2/vehicles')
        .then((resp) => resp.json())
        .then(function (data) {
            let select = document.getElementById("vehicleSelect");
            data.forEach(element => {
                let option = document.createElement("option");
                option.setAttribute("value", element.self);
                let text = document.createTextNode(element.name);
                option.appendChild(text);
                select.appendChild(option);
            });
        }).catch(error => console.error(error));
}

/**
 * Function that searches for a product by its name and returns the 
 * list of corresponding products as a select menu
 */
function getProductsByName() {

    let item_name = document.getElementById("input_food_item").value;
    let floatingSelectProduct = document.getElementById("floatingSelectProduct");

    fetch('/api/v2/products')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 
        
        data = data.filter((elem)=>{
            return elem["name"].toLowerCase().includes(item_name.toLowerCase());
        });

        if (data.length == 0){
            document.getElementById("no_match_message").innerHTML = "no match found";
            document.getElementById("input_food_name").disabled = false;
            document.getElementById("input_food_code").disabled = false;
        } else {
            document.getElementById("no_match_message").innerHTML = "";
        }
        
        if (data.length <= 4){
            let res = "";
            data.forEach(element => {
                res += `<option data-value="${element['self']}" value="${element["name"]}"></option>`;
            });

            floatingSelectProduct.innerHTML = res;
        }

    })
    .catch( error => console.error(error) ); // error handle
    
}

/**
 * Function that fills the add food consumption form fields with the 
 * select option results of the search of the function getProductsByName
 */
function fillProductActivityForm(){
    let inputFoodName = document.getElementById("input_food_name");
    let inputFoodCode = document.getElementById("input_food_code");
    
    let input_value = document.getElementById("input_food_item").value;
    let productReference = document.querySelector('#floatingSelectProduct option[value="' + input_value + '"]').dataset.value;

    fetch(productReference)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 

        // fill the food consumption fields
        inputFoodName.value = data["name"];
        inputFoodCode.value = data["code"];
        inputFoodCode.disabled = true;
        inputFoodName.disabled = true;
    })
    .catch( error => console.error(error) );  // error handle
}

/**
 * Function that adds a new product to the system if it is not 
 * already registered and returns the id of the newly created resource 
 * or the id of the existing one
 */
function addNewProduct(name, code){
    return new Promise(function(resolve, reject) {
        
        let newProductData = { 
            name: name,
            code: code
        };

        fetch('/api/v2/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProductData),
        })
        .then((resp) => {
            if (resp.status == 201 ){
                let resourceLocation = resp.headers.get("Location"); // get the location of the resource
                let resourceId = resourceLocation.substring(resourceLocation.lastIndexOf('/') + 1);

                resolve(resourceId);

            }else{
                resp.text().then((msg)=>{
                    reject(msg);
                }).catch(error => console.error(error))
            }
            

        })
        .catch( error => console.error(error) ); // error handle
    });
    
}

/**
 * Function that adds a new product activity to the system. This is invoked
 * when the add button is clicked for a new product activity 
 */
function addProductActivity(){
    let name = document.getElementById("input_food_name").value;
    let code = document.getElementById("input_food_code").value;
    let quantity = document.getElementById("input_food_quantity").value;

    let userId = getCookie("userId");

    // add the new product to the database (inserted only if it doesn't exists)
    addNewProduct(name, code).then((productId) => {

        let newProductActivityData = { 
            userId: userId,
            productId: productId,
            amount: quantity
        };

        fetch('/api/v2/activities/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProductActivityData),
        })
        .then((resp) => {
            if (resp.status == 201){
                document.getElementById("resultCodeProduct").innerHTML = "Succesfully added the new activity";
            }else{
                resp.text().then((data)=>{
                    document.getElementById("resultCodeProduct").innerHTML = data;
                });
            }

            return;
        })
        .catch( error => console.error(error) ); // error handle
    }).catch( (errorMsg) => {
        document.getElementById("resultCodeProduct").innerHTML = errorMsg;
    }); 
    
}

/**
 * Function that adds a new garbage activity to the system. Invoked when 
 * the add button under the column is clicked
 */

 function addGarbageActivity(){
    let resourceLocation = document.getElementById("materialSelect").value;
    let quantity = document.getElementById("input_garbage_quantity").value;
    let garbageId = resourceLocation.substring(resourceLocation.lastIndexOf('/') + 1);

    let userId = getCookie("userId");

    let newGarbageActivityData = { 
        userId: userId,
        materialId: garbageId,
        amount: quantity
    };

    fetch('/api/v2/activities/garbage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGarbageActivityData),
    })
    .then((resp) => {
        if (resp.status == 201){
            document.getElementById("resultCodeGarbage").innerHTML = "Succesfully added the new activity";
        }else{
            resp.text().then((data)=>{
                document.getElementById("resultCodeGarbage").innerHTML = data;
            });
        }
        return;
    })
    .catch( error => console.error(error) ); // error handle

}

/**
 * Function that adds a new garbage activity to the system. Invoked when 
 * the add button under the column is clicked
 */

 function addTransportActivity(){
    let resourceLocation = document.getElementById("vehicleSelect").value;
    let distance = document.getElementById("input_distance").value;
    let vehicleId = resourceLocation.substring(resourceLocation.lastIndexOf('/') + 1);

    let userId = getCookie("userId");

    let newTransportActivityData = { 
        userId: userId,
        vehicleId: vehicleId,
        distance: distance
    };

    fetch('/api/v2/activities/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransportActivityData),
    })
    .then((resp) => {
        if (resp.status == 201){
            document.getElementById("resultCodeTransport").innerHTML = "Succesfully added the new activity";
        }else{
            resp.text().then((data)=>{
                document.getElementById("resultCodeTransport").innerHTML = data;
            });
        }
        return;
    })
    .catch( error => console.error(error) ); // error handle

}


function getRandomTip() {
    let tipMessageDiv = document.getElementById("tipMessage");
    
    fetch("/api/v2/tips")
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 

        let randomTip = data[Math.floor(Math.random()* data.length)];
        fetch(randomTip.self)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(tipDetails) { 

            tipMessageDiv.innerHTML = tipDetails.text;
            console.log(tipDetails.text)

        })
        .catch( error => console.error(error) );  // error handle

    })
    .catch( error => console.error(error) );  // error handle

}

/**
 * Inital calls
 */
loadMaterials();
loadVehicles();
getProductsByName();
getRandomTip();