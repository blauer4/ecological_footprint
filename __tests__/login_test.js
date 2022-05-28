//const fetch = require("node-fetch");
const url = process.env.HEROKU || "http://localhost:3000"


it('logging in with valid credentials', async () => {
    expect.assertions(1)
    var response = await fetch(url + '/api/v1/login', {
        method: 'POST', body: JSON.stringify({ email: 'ciao@vitt.jpg', password: "12345678" }),
        headers: { 'Content-Type': 'application/json' }
    })
    expect((await response.json()).success).toEqual(true);
})

it('logging in with non-valid credentials', async () => {
    expect.assertions(2)
    var response = await fetch(url + '/api/v1/login', {
        method: 'POST', body: JSON.stringify({ email: 'non_logged_user', password: "non_existing_psw" }),
        headers: { 'Content-Type': 'application/json' }
    })
    expect((await response.json()).success).toEqual(false);

    var response = await fetch(url + '/api/v1/login', {
        method: 'POST', body: JSON.stringify({ email: 'ciao@vitt.jpg', password: "wrong_pws" }),
        headers: { 'Content-Type': 'application/json' }
    })
    expect((await response.json()).success).toEqual(false);
})