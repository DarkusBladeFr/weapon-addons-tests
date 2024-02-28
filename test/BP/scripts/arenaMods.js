import { world, system } from "@minecraft/server";
world.afterEvents.entityDie.subscribe((result) => {
    const killer = result.damageSource.cause;
    let victim = result.deadEntity.typeId;
    let objective = world.scoreboard.getObjective(killboard);
    if (!objective) {
        world.scoreboard.addObjective(killboard, killboard);
        objective = world.scoreboard.getObjective(killboard);
    }
    if (killer.typeId == "player" && victim == "player") {
        objective.addScore(killer.nameTag, 1);
    }
});
//mode elimination :
//code qui génère l'objectif
//code qui génère un scoreboard secondaire avec le nombre d'éliminations de chaque joueurs
//code qui retourne la liste de tous les participants et qui initialise leur score à 0
//code qui génère 2 scores à l'objectifs, soit 1 par équipes
//fonction permettant de tester lorsqu'un joueur tue un autre et lui ajoute 1 au score
//méthode qui génère le score de chaque équipes en fonction de la comptabilité des points de chaque joueurs
//procédure qui permet de vérifier les conditions de finalité de la partie
//méthode qui permet de définir qui a gagné si le score maximale a été atteint
//méthode qui permet de définir qui a gagné dès que le timer est fini
//code qui réinitialise tout dès que fini