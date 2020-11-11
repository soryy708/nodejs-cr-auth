const axios = require('axios');
const { hash } = require('../common/crypto');
const config = require('../common/config');

(()=>{
    function setBusy(busy) {
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = busy;
    }

    function apiCall(method, route, data) {
        const apiUrl = `http://localhost:${config.apiPort}`;
        return axios(`${apiUrl}/${route}`, { method, data });
    }

    function handleLogin(event) {
        event.preventDefault();

        const usernameField = document.getElementById('usernameField');
        const passwordField = document.getElementById('passwordField');

        const username = usernameField.value;
        const password = passwordField.value;

        setBusy(true);
        apiCall('post', 'auth', { username }) // Request auth challenge
            .then(async challengeResponse => {
                const { nonce, salt, rounds, sessionId } = challengeResponse.data;
                const passwordHash  = await hash(password, salt, rounds);
                const challengeHash = await hash(passwordHash, nonce, rounds);
                return apiCall('post', 'auth', { sessionId, hash: challengeHash }); // Respond to challenge
            })
            .then(() => {
                window.alert('Auth success!');
            })
            .catch(() => {
                window.alert('Auth failed');
            })
            .finally(() => {
                setBusy(false);
            });
    }    

    function init() {
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', handleLogin);
    }

    init();
})();
