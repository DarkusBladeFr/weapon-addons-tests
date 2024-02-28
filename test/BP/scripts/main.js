import { system, Player } from '@minecraft/server';
import "weaponManager.js"; import "menuMake.js"; import "arenaMods.js"
// This prevents world crash
system.beforeEvents.watchdogTerminate.subscribe(data => {
    data.cancel = true;
    console.warn(data.terminateReason);
});
Player.prototype.countItemInventory = function (itemType) {
    let count = 0;
    const playerInventory = this.getComponent('minecraft:inventory').container;
    for (let i = 0; i < playerInventory.size; i++) {
        const checkItem = playerInventory.getItem(i);
        if (checkItem && checkItem.typeId === itemType) {
            count += checkItem.count;
        }
    }
    return count;
}