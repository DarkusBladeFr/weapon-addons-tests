import { system, world, Player } from "@minecraft/server";
world.afterEvents.playerSpawn.subscribe((result) => {
    const player = result.player;
    player.runCommand("tag @s add canShoot");
});
class WeaponController {
    constructor(weaponName, maxAmmo, shootDelay, reloadDelay, bulletNum, ammunitionType, triggerShot) {
        this.weaponName = weaponName;
        this.maxAmmo = maxAmmo;
        this.shootDelay = shootDelay;
        this.reloadDelay = reloadDelay;
        this.bulletNum = bulletNum;
        this.ammunitionType = ammunitionType;
        this.triggerShot = triggerShot;
    }
    initScoreAmmo(player, currentItemName) {
        let objective = world.scoreboard.getObjective(currentItemName);
        if (!objective) {
            world.scoreboard.addObjective(currentItemName, currentItemName);
            objective = world.scoreboard.getObjective(currentItemName);
            player.runCommand("scoreboard players set @a " + currentItemName + " " + this.maxAmmo);
        }
        let scoreAmmo = objective.getScore(player);
        return scoreAmmo;
    }
    weaponShot(player, currentItemName, shootDelay, bulletNum, triggerShot) {
        if (player.hasTag("canShoot")) {
            const timeBetweenShot = shootDelay / bulletNum;
            player.runCommand("tag @s remove canShoot");
            function shootBullet(timeBetweenShot) {
                if (bulletNum > 0) {
                    player.triggerEvent(triggerShot);
                    player.runCommand("scoreboard players add " + player.name + " " + currentItemName + " -1");
                    bulletNum--;
                    system.runTimeout(() => {
                        shootBullet(timeBetweenShot);
                    }, timeBetweenShot);
                } else {
                    system.runTimeout(() => {
                        player.runCommand("tag @s add canShoot");
                    }, shootDelay);
                }
            }
            shootBullet(timeBetweenShot);
        }
    }
    weaponReload(player, reloadDelay, ammunitionType, currentItemName, maxAmmo) {
        if (player.checkInventory(ammunitionType)) {
            player.runCommand("title @s actionbar §6> Rechargement en cours <");
            system.runTimeout(() => {
                player.runCommand("title @s actionbar §2> Rechargement effectué <");
                player.runCommand("clear " + player.name + " " + ammunitionType + "  0  1");
                player.runCommand("scoreboard players set " + player.name + " " + currentItemName + " " + maxAmmo);
            }, reloadDelay);
        } else {
            player.runCommand("title @s actionbar §4> Impossible de recharger sans munitions <");
        }
    }
}
class semiAutoWeapon extends WeaponController {
    constructor(weaponName, maxAmmo, shootDelay, reloadDelay, bulletNum, ammunitionType, triggerShot) {
        super(weaponName, maxAmmo, shootDelay, reloadDelay, bulletNum, ammunitionType, triggerShot);
        world.afterEvents.itemUse.subscribe((result) => {
            const player = result.source;
            const currentItemStack = result.itemStack;
            this.handlesemiAutoWeaponUse(player, currentItemStack);
        });
    }
    handlesemiAutoWeaponUse(player, currentItemStack) {
        if (currentItemStack?.typeId === this.weaponName) {
            const scoreAmmo = this.initScoreAmmo(player, currentItemStack.typeId);
            if (scoreAmmo > 0) {
                this.weaponShot(player, currentItemStack.typeId, this.shootDelay, this.bulletNum, this.triggerShot);
            } else {
                this.weaponReload(player, this.reloadDelay, this.ammunitionType, currentItemStack.typeId, this.maxAmmo);
            }
        }
    }
}
class autoWeapon extends WeaponController {
    constructor(weaponName, maxAmmo, shootDelay, reloadDelay, bulletNum, ammunitionType, triggerShot) {
        super(weaponName, maxAmmo, shootDelay, reloadDelay, bulletNum, ammunitionType, triggerShot);
        world.afterEvents.itemStartUse.subscribe((result) => {
            const player = result.source;
            const currentItemStack = result.itemStack;
            player.runCommand("tag " + player.name + " add isUsing");
            const isUsing = system.runInterval(() => {
                this.handleAutoWeaponUse(player, currentItemStack, isUsing);
            }, shootDelay);
        });
    }
    handleAutoWeaponUse(player, currentItemStack, isUsing) {
        if (player.hasTag = "isUsing") {
            if (currentItemStack?.typeId === this.weaponName) {
                const scoreAmmo = this.initScoreAmmo(player, currentItemStack.typeId);
                if (scoreAmmo > 0) {
                    this.weaponShot(player, currentItemStack.typeId, this.shootDelay, this.bulletNum, this.triggerShot);
                } else {
                    this.weaponReload(player, this.reloadDelay, this.ammunitionType, currentItemStack.typeId, this.maxAmmo);
                }
            }
        } else {
            system.clearRun(isUsing);
        }
    }
}
const semiAutoWeaponList = [
    new semiAutoWeapon("bridge:m1917", 8, 7, 40, 1, "minecraft:dirt", "bridge:shot")
];
const autoWeaponList = [
    //new autoWeapon("bridge:m1917", 8, 7, 40, 1, "minecraft:dirt", "bridge:shot")
];
world.afterEvents.itemStopUse.subscribe((result) => {
    const player = result.source;
    if (player.hasTag("isUsing")) {
        player.runCommand("tag " + player.name + " remove isUsing");
    }
});
Player.prototype.checkInventory = function (itemType) {
    const playerInventory = this.getComponent('minecraft:inventory').container;
    for (let i = 0; i < playerInventory.size; i++) {
        const checkItem = playerInventory.getItem(i);
        if (checkItem && checkItem.typeId === itemType) {
            return true;
        }
    }
    return false;
}