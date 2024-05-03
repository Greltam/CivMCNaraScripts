//Zeal Craft Deepslate Tiles Script
/*

    Zeal Craft Deepslate Tiles Script on CivMC
    Written by Greltam 5/3/2024
    
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Start script with any of the 
//            precursor blocks to deepslate tiles in inventory
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

/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Zeal Deepslate Tile Converterble luxury test drive.")
//Chat.log("(Must have green recipe book open)")
Chat.log("Press: " + util.getQuitKey() + " to end script")

//craft all cobbled deepslate into polished deepslate
    util.craftRecipe("minecraft:polished_deepslate", true)
//craft all polished deepslate into deepslate bricks
    util.craftRecipe("minecraft:deepslate_bricks", true)
//craft all deepslate bricks into deepslate tiles
    util.craftRecipe("minecraft:deepslate_tiles", true)


//util.resetKeyBinds()

Chat.log("A wise choice, will that be cash or credit?")

/*-------------------
   4 Program End
-------------------*/
