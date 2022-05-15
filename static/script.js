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
 * This function loads the data that correspond to the transportation choices. 
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
 * Function that searches for a product by its name and returns the 
 * list of corresponding products as a select menu
 */
function getProductsByName() {

    let item_name = document.getElementById("input_food_item").value;
    let floatingSelectProduct = document.getElementById("floatingSelectProduct");

    fetch('/api/v1/products')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 
        
        data = data.filter((elem)=>{
            return elem["name"].toLowerCase().includes(item_name.toLowerCase());
        });

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
    let productReference = document.querySelector("#floatingSelectProduct option[value='" + input_value + "']").dataset.value;

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

        fetch('/api/v1/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProductData),
        })
        .then((resp) => {
            let resourceLocation = resp.headers.get("Location"); // get the location of the resource
            let resourceId = resourceLocation.substring(resourceLocation.lastIndexOf('/') + 1);

            resolve(resourceId);
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


    // add the new product to the database (inserted only if it doesn't exists)
    addNewProduct(name, code).then((productId) => {
        console.log(productId);

        let newProductActivityData = { 
            userId: name,
            productId: productId,
            amount: quantity
        };

        fetch('/api/v1/activities/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProductActivityData),
        })
        .then((resp) => {
            console.log(resp);
            return;
        })
        .catch( error => console.error(error) ); // error handle
    })
    
}



/**
 * Inital calls
 */
loadMaterials();
loadVehicles();
getProductsByName();