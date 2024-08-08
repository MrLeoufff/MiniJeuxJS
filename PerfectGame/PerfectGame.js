/**
 * DEROULEMENT D'UN TOUR :
 * OK Générer des cartes aléatoirement
 * OK Laisser les cartes visibles pendant 5 secondes
 * OK Choisir une carte au hasard parmi les cartes tirées
 * Laisser 3 secondes au joueur pour choisir une carte
 * OK Si gagné recommencer le tour
 * OK Si perdu, fin de la partie
 * 
 * Sauvegarder le score en cookie
 * 
 */

import { Utils } from "../lib/Utils/utils.js";

// Récupération des éléments du DOM
const plateau = document.getElementById("CardsPlateau");
const elementToFindDiv = document.getElementById("elementToFind");
const nbTourGagneSpan = document.getElementById("nbTourGagneSpan");
const nbCardsParam = 5; // Nombre de cartes à générer
let nbTourGagne = 0; // Nombre de tours gagnés
let classCardToFind; // Classe de la carte à trouver

// Configuration de la modal
let modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    beforeClose: function () {
        return true; // Fermer la modal
    }
});
// Ajouter un bouton à la modal
modal.addFooterBtn('OK', 'tingle-btn tingle-btn--danger', function () {
    modal.close();
});

// Ajout de l'événement pour le bouton "Nouvelle partie"
document.getElementById("newGameButton").addEventListener("click", newGame);

// Fonction pour démarrer une nouvelle partie
function newGame() {
    nbTourGagne = 0; // Réinitialiser le nombre de tours gagnés
    newTour(); // Démarrer un nouveau tour
}

// Fonction pour vider un élément
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Fonction pour démarrer un nouveau tour
function newTour() {
    nbTourGagneSpan.textContent = nbTourGagne; // Mettre à jour l'affichage du nombre de tours gagnés
    clearElement(plateau); // Vider le plateau
    clearElement(elementToFindDiv); // Vider l'élément à trouver
    generateCards(nbCardsParam); // Générer les cartes
    let nbCardToFind = Utils.getRandomInt(nbCardsParam); // Choisir une carte au hasard
    let cardsPlateau = plateau.querySelectorAll(".perso"); // Récupérer toutes les cartes générées
    classCardToFind = cardsPlateau[nbCardToFind].classList; // Définir la classe de la carte à trouver

    // Début du compte à rebours pour montrer les cartes
    let cptSeconds = 5;
    elementToFindDiv.textContent = cptSeconds;
    let CompteARebours = setInterval(() => {
        cptSeconds--;
        elementToFindDiv.textContent = cptSeconds;
        if (cptSeconds === 0) {
            clearInterval(CompteARebours); // Arrêter le compte à rebours
            let allCards = document.querySelectorAll(".perso");
            allCards.forEach(card => {
                card.classList.add("hidden"); // Cacher toutes les cartes
                card.addEventListener("click", function clickOnCard() {
                    if (card.classList.contains("hidden")) {
                        if (classCardToFind.value === card.classList.value) {
                            nbTourGagne++; // Incrémenter le nombre de tours gagnés
                            newTour(); // Démarrer un nouveau tour
                        } else {
                            // Afficher la modal de défaite
                            modal.setContent('Perdu, votre score est de ' + nbTourGagne);
                            modal.open();
                            allCards.forEach(cardWhenLoose => {
                                cardWhenLoose.classList.remove("hidden"); // Montrer toutes les cartes
                            });
                        }
                    }
                });
            });
            // Afficher la carte à trouver
            let newCardToFind = document.createElement("div");
            newCardToFind.classList = classCardToFind;
            newCardToFind.classList.remove("hidden");
            clearElement(elementToFindDiv); // Vider l'élément avant d'ajouter la carte à trouver
            elementToFindDiv.appendChild(newCardToFind);
        }
    }, 1000);
}

// Fonction pour générer des cartes
function generateCards(nbCards) {
    // Générer autant de cartes que nbCards
    for (let i = 0; i < nbCards; i++) {
        // Créer un div pour chaque carte
        let newCard = document.createElement("div");
        newCard.classList.add("perso");
        // Générer un chiffre aléatoire pour assigner une classe aléatoire à la carte
        let nbPersoAlea = Utils.getRandomInt(24);
        newCard.classList.add("perso" + nbPersoAlea);

        // Ajouter chaque carte au plateau
        plateau.appendChild(newCard);
    }
}
