//Zeal Craft Chests Script
/*

    Zeal Craft Chests Script on CivMC
    Written by Greltam 5/3/2024
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script with logs and/or planks in inventory
//Start script while looking at a crafting table
//Have at least 3 empty slots for when logs gets turned to planks.

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

listOfAllPlanks = [
    "minecraft:oak_planks",
    "minecraft:spruce_planks",
    "minecraft:birch_planks",
    "minecraft:jungle_planks",
    "minecraft:acacia_planks",
    "minecraft:dark_oak_planks",
    "minecraft:crimson_planks",
    "minecraft:warped_planks"
    ]
    
listOfAllLogs = [
    "minecraft:oak_log",
    "minecraft:spruce_log",
    "minecraft:birch_log",
    "minecraft:jungle_log",
    "minecraft:acacia_log",
    "minecraft:dark_oak_log",
    "minecraft:crimson_stem",
    "minecraft:warped_stem"
    ]
    
/*-----------------------
   2 Global Variables End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function containsWood(){
    if(util.checkQuit()){
        return false
    }
    //Chat.log("Checking for wood.")
    for(let i = 0; i < listOfAllPlanks.length; i++){
        if(util.inventoryContains(listOfAllPlanks[i])){
            //Chat.log(listOfAllPlanks[i] + " found.")
            return true
        }
    }
    
    for(let i = 0; i < listOfAllLogs.length; i++){
        if(util.inventoryContains(listOfAllLogs[i])){
            //Chat.log(listOfAllLogs[i] + " found.")
            return true
        }
    }
    //Chat.log("No wood found.")
    return false
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Zeal Chest Doctor, free exam commencing.")
Chat.log("(Must be looking at a crafting table)")
Chat.log("(Must have green recipe book open)")
Chat.log("Press: " + util.getQuitKey() + " to end script")

//open crafting table
util.spinTicks(15)
Player.getPlayer().interact()
util.spinTicks(15)


//check if player is using a crafting table
inventory = Player.openInventory()
//Chat.log("Inventory Type: " + inventory.getType())
if(inventory.getType() != "Crafting Table"){
    Chat.log("Please face a crafting table.") 
    continueCrafting = false
}

//craft all wood into chests
if(continueCrafting){
    //if we have any type of wood in our inventory
    while(containsWood()){
        //craft chest if we have the recipe available
        if(util.getRecipeIndex("minecraft:chest") != -1){
            //Chat.log("Crafting: minecraft:chest")
            util.craftRecipe("minecraft:chest", false)
        }
        
        // else craft planks
        for(let i = 0; i < listOfAllPlanks.length; i++){  
            if(util.getRecipeIndex(listOfAllPlanks[i]) != -1){
                //Chat.log("Crafting: " + listOfAllPlanks[i])
                util.craftRecipe(listOfAllPlanks[i], false)
                break
            }
        }
    }
}


//util.resetKeyBinds()

Chat.log("Nice Chests bro.")

/*-------------------
   4 Program End
-------------------*/
