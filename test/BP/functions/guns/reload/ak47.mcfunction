# Condition pour vérifier si le joueur peut recharger
execute as @s[r=3] unless entity @s[hasitem={item=bridge:ak47_mag, data=0}] run say No magazines left!

# Actions lors de la recharge
scoreboard players set @s[hasitem={item=bridge:ak47_mag, data=0}] ak47 30
clear @s[scores={ak47=30}, hasitem={item=bridge:ak47_mag, data=0}] bridge:ak47_mag 0 1

scoreboard players set @s[hasitem={item=bridge:ak47_mag, data=1}] ak47 29
clear @s[scores={ak47=29}, hasitem={item=bridge:ak47_mag, data=1}] bridge:ak47_mag 1 1

# Continuez cette séquence jusqu'à 30...
# Ajoutez une ligne pour chaque magazine de 1 à 30

execute as @s[tag=!disable_empty_mags] run give @s[scores={ak47=1..}] bridge:ak47_mag 1 30
