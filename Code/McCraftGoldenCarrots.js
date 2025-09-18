//Zeal Craft Golden Carrots Script
/*

    Zeal Craft Golden Carrots Script on CivMC
    Written by Greltam 9/18/2024
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

/*
Directions: 
    Go to Golden Carrot Crafting Station at the GSEZ
    Fill Left side DC's with carrots
    Fill Top Barrel with 10 stacks of Gold Blocks
    Activate Script
*/
/*-----------------------
   0.1 Player Requirements to Start End
-----------------------*/


/*------------------------
   1.1 Import Files Start
------------------------*/
const util = require("./McUtilityFile.js")
/*-----------------------
   1.1 Import Files End
-----------------------*/

/*------------------------
   1.2 Player Configurables Start
------------------------*/

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 

/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
continueCrafting = true
carrotChest = 1
carrotSlot = 0
goldSlot = 0
/*-----------------------
   2 Global Variables End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/

function getGoldBlocks(){
    if(util.checkQuit()){
        return false
    }

    //pick up a stack of gold blocks
    util.chestItems(-180,0,goldSlot,1)
    goldSlot = goldSlot + 1
    if(goldSlot >= 26){
        return false
    }
    return true
}
function dumpGoldNuggets(){
    if(util.checkQuit()){
        return false
    }
    //chest golden nuggets
    util.chestSpecificItems(-180,0,
        "minecraft:gold_nugget", true)
    return true
}
function getCarrots(){
    if(util.checkQuit()){
        return false
    }
    
    //get chest carrots
    if(carrotChest == 1){
        util.chestItems(145,0,carrotSlot,10)
        carrotSlot = carrotSlot + 10
        if(carrotSlot >= 50){
            carrotSlot = 0
            carrotChest = 2
        }
    }
    else if(carrotChest == 2){
        util.chestItems(145,30,carrotSlot,10)
        carrotSlot = carrotSlot + 10
        if(carrotSlot >= 50){
            carrotSlot = 0
            carrotChest = 3
        }
    }
    else{
        return false
    }
    
    return true
}
function dumpCarrots(){
    if(util.checkQuit()){
        return false
    }
    //chest golden carrots
    util.chestSpecificItems(-145,0,
        "minecraft:golden_carrot", true) 
    util.chestSpecificItems(-145,30,
        "minecraft:golden_carrot", true)
    return true
}
function craftGoldCarrots(){
    if(util.checkQuit()){
        return false
    }
    util.smoothLookAt(180,32)
    Player.getPlayer().interact()
    util.spinTicks(15)

    //check if player is using a crafting table
    inventory = Player.openInventory()
    //Chat.log("Inventory Type: " + inventory.getType())
    if(inventory.getType() != "Crafting Table"){
        return false
    }
    //craft our 64 gold blocks into 9 stacks of gold ingots
    util.craftManually(
        [["minecraft:gold_block",1]],util.CRAFT_MAX)
    
    //for our 9 stacks of gold ingot, craft 1 stack into gold nuggets
    //use 8 stacks of nuggets and 1 stack of carrot to make gold carrots
    //have 10 stacks worth of gold and carrots to use
    for(j = 0; j < 10; j++){
        util.craftManually(
            [["minecraft:gold_ingot",1]],util.CRAFT_MAX)
            
        util.craftManually(
            [["minecraft:gold_nugget",1],
             ["minecraft:gold_nugget",2],
             ["minecraft:gold_nugget",3],
             ["minecraft:gold_nugget",4],
             ["minecraft:carrot",5],
             ["minecraft:gold_nugget",6],
             ["minecraft:gold_nugget",7],
             ["minecraft:gold_nugget",8],
             ["minecraft:gold_nugget",9]],util.CRAFT_MAX)
    
    }
    inventory.close()
    return true
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Zeal Midas Touching of the Carrots.")
//Chat.log("(Must have green recipe book open)")
Chat.log("Press: " + util.getQuitKey() + " to end script")

for(i = 0; i < 10; i++){
    Chat.log("i = " + i)
    if(util.checkQuit()){
        break
    }
    if(!getGoldBlocks()){
        break
    }
    if(!getCarrots()){
        break
    }
    if(!craftGoldCarrots()){
        break
    }
    if(!dumpCarrots()){
        break
    }
    if(!dumpGoldNuggets()){
        break
    }
}
Chat.log("Carrots have been Midas Touched")

/*-------------------
   4 Program End
-------------------*/
