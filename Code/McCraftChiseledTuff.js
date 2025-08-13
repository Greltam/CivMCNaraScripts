//Zeal Craft Chiseled Tuff Script
/*

    Zeal Craft Chiseled Tuff Script on CivMC
    Written by Greltam 5/3/2024
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script with 12 stacks of Tuff
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

function containsTuff(){
    if(util.checkQuit()){
        return false
    }
    if(util.inventoryContains("minecraft:tuff")){
        return true
    }
    
    //Chat.log("No tuff found.")
    return false
}
//manual mode
function craftPolishedTuff(){
    if(util.checkQuit()){
        return false
    }
    util.craftManually(
        [["minecraft:tuff",1],["minecraft:tuff",2],
         ["minecraft:tuff",4],["minecraft:tuff",5]],
        util.CRAFT_MAX)
}
function craftBricksTuff(){
    if(util.checkQuit()){
        return false
    }
    util.craftManually(
        [["minecraft:polished_tuff",1],
         ["minecraft:polished_tuff",2],
         ["minecraft:polished_tuff",4],
         ["minecraft:polished_tuff",5]],
        util.CRAFT_MAX)
}
function craftBrickSlabsTuff(){
    if(util.checkQuit()){
        return false
    }
    util.craftManually(
        [["minecraft:tuff_bricks",1],
         ["minecraft:tuff_bricks",2],
         ["minecraft:tuff_bricks",3]],
        util.CRAFT_MAX)
}
function craftChiseledBrickTuff(){
    if(util.checkQuit()){
        return false
    }
    util.craftManually(
        [["minecraft:tuff_brick_slab",1],
         ["minecraft:tuff_brick_slab",4]],
        util.CRAFT_MAX)
}

/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Zeal Tuff Guy Trainer, Now Getting Fit.")
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

if(continueCrafting){
    //if we have any type of wood in our inventory
    while(containsTuff()){
        if(util.checkQuit()){
            break
        }
        craftPolishedTuff()
        craftPolishedTuff()
        craftPolishedTuff()
        craftBricksTuff()
        craftBricksTuff()
        craftBricksTuff()
        craftBrickSlabsTuff()
        craftBrickSlabsTuff()
        craftBrickSlabsTuff()
        craftBrickSlabsTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        craftChiseledBrickTuff()
        //Recipe based crafting
        /*
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
        */
    }
}


//util.resetKeyBinds()

Chat.log("Bye Mr. Tuff guy.")

/*-------------------
   4 Program End
-------------------*/
