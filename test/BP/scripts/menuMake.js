import { world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
// ui menu :
world.afterEvents.itemUse.subscribe(async (result) => {
    if (result.itemStack.typeId == "minecraft:compass" && result.itemStack.nameTag == "menu") {
        mainMenuGenerate(result);
    }
});

//mainMenu generator :
let mainMenu = new ActionFormData();
mainMenu.title("Menu Principal");
mainMenu.body("Choisissez le mode de jeu");
mainMenu.button("Mode Aventure", "textures/items/wood_pickaxe");
mainMenu.button("Mode Arène", "textures/items/iron_sword");
mainMenu.button("Mode Apocalypse", "textures/items/firework_rocket");
mainMenu.button("Boutique", "textures/items/gold_ingot");
mainMenu.button("Quitter");
function mainMenuGenerate(result) {
    mainMenu.show(result.source).then(r => {
        if (r.canceled) return;
        let response = r.selection;
        switch (response) {
            case 0:
                storyGenerate(result);
                break;
            case 1:
                arenaGenerate(result);
                break;
            case 2:
                //apocalypse menu
                break;
            case 3:
                //shop menu
                break;
            case 4:
                exitGenerate(result);
                break;
        }
    }).catch(e => {
        console.error(e);
    });
}

//story generator :
let storyMenu = new ActionFormData();
storyMenu.title("Mode Histoire");
storyMenu.body("Choisissez l'épisode");
storyMenu.button("Acte I - Partie 1");
storyMenu.button("Retour");
function storyGenerate(result) {
    storyMenu.show(result.source).then(r => {
        if (r.canceled) return;
        let response = r.selection;
        switch (response) {
            case 0:
                //program for start part one
                break;
            case 1:
                mainMenuGenerate(result);
                break;
        }
    })
}

//Arena generator :
let arenaMenu = new ActionFormData();
arenaMenu.title("Mode Arène");
arenaMenu.body("Configurez la partie");
arenaMenu.button("Choix mode");
arenaMenu.button("Choix carte");
arenaMenu.button("Option de mutation");
arenaMenu.button("Lancer la partie");
arenaMenu.button("Retour");
function arenaGenerate(result) {
    arenaMenu.show(result.source).then(r => {
        if (r.canceled) return;
        let response = r.selection;
        switch (response) {
            case 0:
                //arena modes list
                break;
            case 1:
                //arena maps list
                break;
            case 2:
                arenaMutationGenerate(result);
                break;
            case 3:
                //program to start the game
                break;
            case 4:
                mainMenuGenerate(result);
                break;
        }
    })
}

//arenaMutationGenerator :
let arenaMutation = new ModalFormData();
arenaMutation.toggle("Armes principales autorisées", true);
arenaMutation.toggle("Armes secondaires autorisées", true);
arenaMutation.toggle("Armures de spécialistes autorisées", true);
arenaMutation.toggle("Autoriser les équipements mortelles", true);
arenaMutation.toggle("Autoriser les équipements secondaires", true);
arenaMutation.toggle("Armes de corps-à-corps autorisées", true);
let healOptions = ["Automatique", "Point de soin", "Aucun"];
arenaMutation.dropdown("Option de soin", healOptions, 0);
let hourOptions = ["Jour", "Midi", "Crépuscule", "Nuit"];
arenaMutation.dropdown("Créneau horaire", hourOptions, 0);
function arenaMutationGenerate(result) {
    arenaMutation.show(result.source).then(r => {
        if (r.canceled) {
            arenaGenerate(result);
        }
    });
}
//exit generator :
let exitMenu = new MessageFormData();
exitMenu.title("Quitter le jeu");
exitMenu.body("Vous êtes sûr ?");
exitMenu.button1("Non, je reste");
exitMenu.button2("Oui, je suis sûr");
function exitGenerate(result) {
    exitMenu.show(result.source).then(r => {
        if (r.canceled) return;
        let response = r.selection;
        switch (response) {
            case 0:
                mainMenuGenerate(result);
                break;
            case 1:
                //no i'm quit
                break;
        }
    }).catch(e => {
        console.error(e);
    });
}