// Hi Tech Oak Tree Script
/*
    !!! Script starts at 2958, 5202, 67 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Hi Tech Oak Replant Script on CivMC @ 2958, 5202, 67
    Written by Greltam 4/9/2024

*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/
//
//    Fully Fill Inventory with saplings
//    Set hotbar to left most slot (1)
//
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

//If Player falls off bridges, stop script.
//turn on when chopping trees, off when moving between tree layers
util.setQuitFromFalling(false)

saplingId = "minecraft:oak_sapling"
//In case of needing to restart mid tree chop
//change starting layer/row/tree to your current spot
//set restarting to true
//Stand directly in front of tree trunk when restarting.
restarting = true //default: restarting = false

startingLayer = 1 //default: startingLayer = 1
startingRow = 1 //default: startingRow = 1
startingTree = 1 //default: startingTree = 1

//total layers in the tree farm
totalLayers = 8 //default: totalLayers = 8
treesPerRow = 16 //default: treesPerRow = 16
rowsPerLayer = 16 //default: rowsPerLayer = 16
layerHeight = 12 //default: layerHeight = 12
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
//Player starts script at this location
xStartPosition = 2958
zStartPosition = 5202
yStartPosition = 67

util.setQuitFromFallingYLevel(yStartPosition)

//Cur(rent) stop and chest position
curX = xStartPosition
curZ = zStartPosition
curY = yStartPosition

rowWalkDuration = 22 * 20 // seconds * ticks per second

/*-----------------------
   2 Global Variables End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function fillHotbarWithSaplings(){

    inv = Player.openInventory()
    hotbarNumber = 0
    for(i = 9; i < 36; i++)  
    {   
        if(util.checkQuit()){
            inv.close()
            return
        }
        currentItem = inv.getSlot(i)
        if(saplingId == currentItem.getItemId()){
            inv.quick(i)
            util.spinTicks(1)
        }
    }
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/


Chat.log("Zeal Oak Replantinator, Booting...")
Chat.log("Press: " + util.getQuitKey() + " to end script")

//chop all the layers
for(let i = startingLayer; i <= totalLayers; i++){
    if(util.checkQuit()){break}
    //replace all saplings in hotbar
    fillHotbarWithSaplings()
    
    //start at lodestone - move to chop start
    if(!restarting){
        util.moveToLocation(
            xStartPosition - 92, zStartPosition, 
            yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
            0.2)
        util.moveToLocation(
            xStartPosition - 92.1,zStartPosition - 1, 
            yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
            0.2)
    }
    
    //turn on fall protection
    util.setQuitFromFallingYLevel(yStartPosition + ((i-1) * layerHeight) - 1)
    util.setQuitFromFalling(true)
    
    //replant all the rows
    for(let j = startingRow; j <= rowsPerLayer; j++){
        if(util.checkQuit()){break}
        
        //replant the row
        if(j%2 == 1){//row going north
            util.complexMove(
                ["key.keyboard.w","key.mouse.right"], 180, 45, rowWalkDuration)
        }
        else{//row coming south
            util.complexMove(
                ["key.keyboard.w","key.mouse.right"], 0, 45, rowWalkDuration)
        }
        
        //move to next row
        util.simpleMove("key.keyboard.w", -90, 0, 3*20)
        
        //select next hotbar
        util.nextHotbar()
        //if restarting, set restart to false and change starting back to defaults
        if(restarting){
            restarting = false
            startingLayer = 1
            startingRow = 1
            startingTree = 1
        }
    }//end Row Chop
    
    //turn off fall protection
    util.setQuitFromFalling(false)
    
    //move to lodestone for next start
    util.moveToLocation(
        xStartPosition, zStartPosition-1,
        yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
        0.2)
    util.moveToLocation(
        xStartPosition, zStartPosition,
        yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
        0.2)
    
    
    //jump to next lodestone. Turn off quitfromfalling and reset when on next layer
    util.simpleMove("key.keyboard.space",0, 0, 5)
    
}

//Reset keybinds to prevent phantom key holds.
KeyBind.key("key.keyboard.w", false)
KeyBind.key("key.keyboard.left.control", false)
KeyBind.key("key.keyboard.space", false)
KeyBind.key("key.mouse.right", false)
KeyBind.key("key.mouse.left", false)


Chat.log("Oak has been replantinated, shutting down...")

/*-------------------
   4 Program End
-------------------*/
