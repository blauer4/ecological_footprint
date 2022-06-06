/**
 * Invalidates the token that was given to the client
 */
function logout(){
    fetch('/api/v2/login/logout').then(function(){
        location.href = "/login.html";
        return;
    });
}