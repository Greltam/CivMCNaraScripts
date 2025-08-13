//Zeal Craft Bottles Script
/*

    Zeal Craft Bottles Script on CivMC
    Written by Greltam 5/3/2024
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script with glass in inventory
//Start script while looking at a crafting table

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

/*-----------------------
   2 Global Variables End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function containsGlass(){
    if(util.checkQuit()){
        return false
    }
    return util.inventoryContains("minecraft:glass")
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Zeal Bottle Popper, poppin' bottles all day!")
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

//craft all glass into bottles
if(continueCrafting){
    while(util.inventoryContains("minecraft:glass")){
        if(util.checkQuit()){
            break
        }
        util.craftManually(
         [["minecraft:glass",1],["minecraft:glass",3],
          ["minecraft:glass",5]],util.CRAFT_MAX)
    }
    //util.craftRecipe("minecraft:glass_bottle", true)
}


//util.resetKeyBinds()

Chat.log("Now time for the after party.")

/*-------------------
   4 Program End
-------------------*/
