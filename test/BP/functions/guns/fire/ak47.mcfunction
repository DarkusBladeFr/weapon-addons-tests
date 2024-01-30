# Condition pour vérifier si le joueur a suffisamment de munitions
execute as @s[scores={ak47=1..}] unless entity @s[distance=..3] run say Not enough ammo!

# Actions lors du tir

camerashake add @s[tag=sneaking] 0.02 0.2 rotational
camerashake add @s[tag=!sneaking] 0.04 0.2 rotational

scoreboard players remove @s[scores={ak47=1..}, m=!c] ak47 1
