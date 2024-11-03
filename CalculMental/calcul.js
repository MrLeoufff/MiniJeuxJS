/*
TODOLIST 

X Lancer un minuteur de x minute(s) (utiliser celui du pendu)
X Générer un calcul (deux chiffres aléatoires, (+ - *) en aléatoire)
X Laisser l'utilisateur faire des propositions.

V2
X Paramétrer ma partie
X Le temps du compte à rebours
Les opérateurs de la partie
Gérer les divisions
*/

const reboursDiv = document.getElementById("minuteur");
const calculDiv = document.getElementById("calcul");
const propalInput = document.getElementById("resultPropal");
const messengerDiv = document.getElementById("messenger");
const showPlayingDiv = document.querySelectorAll(".showPlayingDiv");
const nbSecondsGameInput = document.getElementById("nbSecondsGame");
const maxNumberCalcInput = document.getElementById("maxNumberCalc");

let TempsMinuteurBase = 10;
let maxCalculNumber = 20;
let compteurInterval = null;
let TempsRestant = 0;
let calculEncours = null;
let cptGoodAnswer = 0;
let cptBadAnswer = 0;
let allCalculRecap = '';

document.getElementById("validPropal").addEventListener("click", () => {
    checkInputValue();
});

propalInput.addEventListener("keyup", event => {
    if (event.key === 'Enter') {
        checkInputValue();
    }
});

// function checkInputValue() {
//     if (parseInt(propalInput.value) === calculEncours.result) {
//         messengerDiv.textContent = "Bravo, vous avez trouvé !";
//         cptGoodAnswer++;
//         allCalculRecap += `${calculEncours.showCalculWithResult} | <span class="goodAnswer">${propalInput.value}</span><br/>`;
//     } else {
//         messengerDiv.textContent = `Ce n'est pas le bon résultat : ${calculEncours.showCalculWithResult}`;
//         cptBadAnswer++;
//         allCalculRecap += `${calculEncours.showCalculWithResult} | <span class="badAnswer">${propalInput.value}</span><br/>`;
//     }
//     propalInput.value = "";
//     generateCalcul();
// }

function checkInputValue() {
    const isCorrect = parseInt(propalInput.value) === calculEncours.result;
    showFeedback(isCorrect);

    if (isCorrect) {
        messengerDiv.textContent = "Bravo, vous avez trouvé !";
        cptGoodAnswer++;
        allCalculRecap += `${calculEncours.showCalculWithResult} | <span class="goodAnswer">${propalInput.value}</span><br/>`;
    } else {
        messengerDiv.textContent = `Ce n'est pas le bon résultat : ${calculEncours.showCalculWithResult}`;
        cptBadAnswer++;
        allCalculRecap += `${calculEncours.showCalculWithResult} | <span class="badAnswer">${propalInput.value}</span><br/>`;
    }
    propalInput.value = "";
    generateCalcul();
}

function launchGame() {
    if (nbSecondsGameInput.value) {
        TempsMinuteurBase = parseInt(nbSecondsGameInput.value);
    }

    if (maxNumberCalcInput.value) {
        maxCalculNumber = parseInt(maxNumberCalcInput.value);
    }

    allCalculRecap = "";
    cptGoodAnswer = 0;
    cptBadAnswer = 0;
    messengerDiv.textContent = "";
    lancerMinuteur(TempsMinuteurBase);
    generateCalcul();
    displayPlayingDiv(true);
}

function generateCalcul() {
    calculEncours = new Calcul(maxCalculNumber);
    calculDiv.textContent = calculEncours.showCalcul;
}

// function lancerMinuteur(tempsMinuteurBase) {
//     clearInterval(compteurInterval);
//     TempsRestant = tempsMinuteurBase;
//     reboursDiv.textContent = TempsRestant;
//     compteurInterval = setInterval(() => {
//         TempsRestant--;
//         reboursDiv.textContent = TempsRestant;
//         if (TempsRestant === 0) {
//             clearInterval(compteurInterval);
//             displayPlayingDiv(false);

//             // Construction du message final
//             const message = document.createElement('div');
//             const goodAnswers = document.createElement('p');
//             goodAnswers.textContent = `Bonne(s) réponse(s) : ${cptGoodAnswer}`;
//             message.appendChild(goodAnswers);

//             const badAnswers = document.createElement('p');
//             badAnswers.textContent = `Mauvaise(s) réponse(s) : ${cptBadAnswer}`;
//             message.appendChild(badAnswers);

//             const totalQuestions = cptBadAnswer + cptGoodAnswer;
//             const pourcentageGoodAnswer = (100 * cptGoodAnswer / totalQuestions).toFixed(2);

//             const ratio = document.createElement('p');
//             ratio.textContent = `Ratio : ${pourcentageGoodAnswer}%`;
//             message.appendChild(ratio);

//             // Ajouter le récapitulatif des calculs
//             const recapDiv = document.createElement('div');
//             recapDiv.innerHTML = allCalculRecap; // Utilisation sécurisée car allCalculRecap est construit avec du contenu contrôlé
//             message.appendChild(recapDiv);

//             // Afficher le message dans messengerDiv
//             messengerDiv.textContent = ''; // Vider le contenu précédent
//             messengerDiv.appendChild(message);
//         }
//     }, 1000);
// }

function lancerMinuteur(tempsMinuteurBase) {
    clearInterval(compteurInterval);
    TempsRestant = tempsMinuteurBase;
    reboursDiv.textContent = TempsRestant;
    compteurInterval = setInterval(() => {
        TempsRestant--;
        reboursDiv.textContent = TempsRestant;

        if (TempsRestant <= 10) {
            reboursDiv.classList.add("blinking");
            console.log("Classe blinking ajoutée");
        } else {
            reboursDiv.classList.remove("blinking");
            console.log("Classe blinking retirée");
        }

        if (TempsRestant === 0) {
            clearInterval(compteurInterval);
            displayPlayingDiv(false);

            const message = document.createElement('div');
            const goodAnswers = document.createElement('p');
            goodAnswers.textContent = `Bonne(s) réponse(s) : ${cptGoodAnswer}`;
            message.appendChild(goodAnswers);

            const badAnswers = document.createElement('p');
            badAnswers.textContent = `Mauvaise(s) réponse(s) : ${cptBadAnswer}`;
            message.appendChild(badAnswers);

            const totalQuestions = cptBadAnswer + cptGoodAnswer;
            const pourcentageGoodAnswer = (100 * cptGoodAnswer / totalQuestions).toFixed(2);

            const ratio = document.createElement('p');
            ratio.textContent = `Ratio : ${pourcentageGoodAnswer}%`;
            message.appendChild(ratio);

            const recapDiv = document.createElement('div');
            recapDiv.innerHTML = allCalculRecap;
            message.appendChild(recapDiv);

            messengerDiv.textContent = '';
            messengerDiv.appendChild(message);
        }
    }, 1000);
}

function displayPlayingDiv(show) {
    let displayProperty = show ? "block" : "none";
    showPlayingDiv.forEach(element => {
        element.style.display = displayProperty;
    });
}

class Calcul {
    #operators = ['*', '-', '+'];
    nombre1;
    nombre2;
    operator;

    constructor(maximum) {
        this.nombre1 = this.#getRandomInt(maximum);
        this.nombre2 = this.#getRandomInt(maximum);
        this.operator = this.#operators[this.#getRandomInt(3)];
    }

    get result() {
        return eval(`${this.nombre1}${this.operator}${this.nombre2}`);
    }

    get showCalcul() {
        return `${this.nombre1} ${this.operator} ${this.nombre2}`;
    }

    get showCalculWithResult() {
        return `${this.showCalcul} = ${this.result}`;
    }

    #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

function showFeedback(isCorrect) {
    const feedbackElement = document.getElementById("feedback");
    if (isCorrect) {
        feedbackElement.textContent = "Bien joué ! Continuez comme ça ! 💪";
        feedbackElement.classList.remove("bad");
    } else {
        feedbackElement.textContent = "Essayez encore, vous pouvez y arriver !";
        feedbackElement.classList.add("bad");
    }
}
