/**
 * Funzione che carica i dati del db riguardante i materiali di rifiuto
 * dell'applicazione
 */

function loadMaterials() {
    fetch('/api/v1/materials')
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
 * this sunction loads the data that correspond to the transportation choices. 
*/  

function loadVehicles() {
    fetch('/api/v1/vehicles')
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
 * function that searches for a product by its name and returns the 
 * list of corresponding products as a select menu
 */
function getProductsByName() {

    let item_name = document.getElementById("input_food_item").value;
    
    fetch('/api/v1/products')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 
        
        data = data.filter((elem)=>{
            return elem["name"].toLowerCase().includes(item_name.toLowerCase());
        });

        if (data.length <= 4){
            let res = "";
            data.forEach(element => {
                res += `<option value="${element['self']}">${element["name"]}</option>`;
            });

            floatingSelectProduct.innerHTML = res;
        }

    })
    .catch( error => console.error(error) ); // error handle
    
}

/**
 * function that fills the add food consumption form fields with the 
 * select option results of the search of the function getProductsByName
 */
function fillProductActivityForm(){
    let inputFoodName = document.getElementById("input_food_name");
    let inputFoodCode = document.getElementById("input_food_code");
    
    let productReference = document.getElementById("floatingSelectProduct").value;
    
    fetch(productReference)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 

        // fill the food consumption fields
        inputFoodName.value = data["name"];
        inputFoodCode.value = data["code"];
    })
    .catch( error => console.error(error) );  // error handle
}

/**
 * function that adds a new product to the system if it is not 
 * already registered and returns the id of the newly created resource 
 * or the id of the existing one
 */
function addNewProduct(name, code){
    return new Promise(function(resolve, reject) {
        
        let unitImpact = Math.floor(Math.random() * 20 + 1);

        let newProductData = { 
            name: name,
            code: code,
            unitImpact: unitImpact
        };

        fetch('/api/v1/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProductData),
        })
        .then((resp) => {
            let resoruceLocation = resp.headers.get("Location"); // get the location of the resource
            let resourceId = resoruceLocation.substring(resoruceLocation.lastIndexOf('/') + 1);

            resolve(resourceId);
        })
        .catch( error => console.error(error) ); // error handle
    });
    
}


/**
 * Inital calls
 */
loadMaterials();
loadVehicles();
getProductsByName();