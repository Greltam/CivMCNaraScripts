// Hi Tech Oak Tree Script
/*
    !!! Script starts at 2958, 5202, 67 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Hi Tech Oak Tree Chopper on CivMC @ 2958, 5202, 67
    Written by Greltam 4/9/2024
    
    With a largely expanded tree farm, I need a script I won't have to baby every hour
    for 8+hours that it can run. The old script only ever chopped or replanted 1 layer
    at a time.
    
    The idea is: start at a lodestone. move west to chopping start. For each time
    down the row, toss wood into the collectors. At the end of the layer, jump up
    a lodestone to the next layer, and repeat until finishing the top of the farm.

    I can write a similar script for replanting after this is done the heavy lifting.
    
    New Tech being written to swap out tools near breaking to new ones so script can
    fully run
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Player must place axe in the rightmost hotbar(9)
//Player must place hoe in the next rightmost hotbar(8)

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

//If Player wants to scuff harvest using just an axe, let them set to false
usingHoe = true //default: usingHoe = true

//In case of needing to restart mid tree chop
//change starting layer/row/tree to your current spot
//set restarting to true
//Stand directly in front of tree trunk when restarting.
restarting = false //default: restarting = false

startingLayer = 1 //default: startingLayer = 1
startingRow = 1 //default: startingRow = 1
startingTree = 1 //default: startingTree = 1

//total layers in the tree farm
totalLayers = 8 //default: totalLayers = 8
treesPerRow = 16 //default: treesPerRow = 16
rowsPerLayer = 16 //default: rowsPerLayer = 16
layerHeight = 12 //default: layerHeight = 12
rowWidth = 6 //default: rowWidth = 6
treeBridgeLength = 5 //default: treeBridgeLength = 5

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

//west side of the tree farm, beginning of chopping trees
xChopStartPosition = 2866
zRowEndPosition = 5116

floorCutTicks = 25
upperCutTicks = 50

util.setQuitFromFallingYLevel(yStartPosition)
/*-----------------------
   2 Global Variables End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/

//called at start of script to set position in tree farm
//especially for restarts
function setStartingPosition(){
    playerX = util.player.getX()
    playerY = util.player.getY()
    playerZ = util.player.getZ()
    
    //if we are at the lodestone level, set position as start of a layer and break
    if((playerY - yStartPosition) % layerHeight === 0){
        startingLayer = ((playerY - yStartPosition) / layerHeight) + 1
        startingRow = 1 
        startingTree = 1
        restarting = false
        return
    }
    //set layer, we are -1 y level while chopping trees
    startingLayer = ((playerY - yStartPosition + 1) / layerHeight) + 1
    startingLayer = Math.floor(startingLayer)
    Chat.log("starting layer = " + startingLayer)
    //set row
    startingRow = ((playerX - xChopStartPosition) / rowWidth) + 1
    startingRow = Math.floor(startingRow)
    Chat.log("starting Row = " + startingRow)
    //set tree
    if(startingRow % 2 === 1){
        startingTree = ((zStartPosition - playerZ) / treeBridgeLength) + 1
        startingTree = Math.floor(startingTree)
        if(startingTree <= 1){
            startingTree = 1
        }
        Chat.log("starting Tree = " + startingTree)
    }
    else{
        startingTree = ((playerZ - zRowEndPosition) / treeBridgeLength) + 1
        startingTree = Math.floor(startingTree)
        if(startingTree <= 1){
            startingTree = 1
        }
        Chat.log("starting Tree = " + startingTree)
    }
    restarting = true
}


function chopTree(layer, row, tree){

//figure out next tree destination location
    xDestination = xChopStartPosition + ((row - 1) * 6)
    yDestination = yStartPosition - 1 + ((layer-1) * layerHeight) + util.getEyeHeight()
    zDestination = 0
    
//separate for even/odd rows
    if(row % 2 == 1){//odd row, starting bottom and going up
        xDestination = xDestination + 0.2 //stay to the side to not hit glass
        zDestination = zStartPosition - 5 - ((tree-1) * 5) - 0.18
    }
    else{
        xDestination = xDestination + 0.2 //stay to the side to not hit glass
        zDestination = zStartPosition - 82 + ((tree-1) * 5) + 0.18
    }

//chop leaves in front of tree
    if(usingHoe){
        util.selectHotbar(7) //select Hoe
    }
    
    //try to move to the next tree, but if not, return false
    //to tell tree chop loop to redo next tree
    //Tried a while loop with call to chop last tree but got double recursion
    if(!util.complexMoveToLocation(["key.mouse.left"],
        xDestination, zDestination, yDestination, 0.05)){
        return false
    }
        
    //chop above leaves with hoe instead of making axe chop them
    //odd rows look 180. even rows look 0
    if(usingHoe){ 
        if(row % 2 == 1){
            util.simpleMove("key.mouse.left",180, -80, 5)
        }
        else{
            util.simpleMove("key.mouse.left",0, -80, 5)       
        }
    }
            
    
//chop tree
    util.selectHotbar(8) //select Axe
    //util.simpleMove("key.mouse.left",180, -80, 5)
    if(row % 2 == 1){
        //eye and foot level logs
        util.simpleMove("key.mouse.left",180, 45, floorCutTicks)
        //upper level logs
        util.simpleMove("key.mouse.left",180, -75, upperCutTicks)
    
    }
    else{
        //eye and foot level logs
        util.simpleMove("key.mouse.left",0, 45, floorCutTicks)
        //upper level logs
        util.simpleMove("key.mouse.left",0, -75, upperCutTicks)
    }
    return true
}

function tossLogs(row){
    //Chat.log("Tossing items")
    xLook = -150
    yLook = 0
    if(row % 2 == 1){xLook = 30}
    util.tossAllSpecificItems(
        ["minecraft:oak_log","minecraft:oak_sapling",
         "minecraft:stick", "minecraft:apple",
         "minecraft:oak_leaves"],
        xLook, yLook)
}

/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/


Chat.log("Zeal Oak Exterminator, Booting...")
Chat.log("Press: " + util.getQuitKey() + " to end script")

setStartingPosition()

//chop all the layers
for(let i = startingLayer; i <= totalLayers; i++){
    if(util.checkQuit()){break}
    
    //start at lodestone - move to chop start
    if(!restarting){
        util.moveToLocation(
            xChopStartPosition, zStartPosition, 
            yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
            0.2)
        util.moveToLocation(
            xChopStartPosition - 0.1, zStartPosition - 1, 
            yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
            0.2)
    }
    
    //turn on fall protection
    util.setQuitFromFallingYLevel(yStartPosition + ((i-1) * layerHeight) - 1)
    util.setQuitFromFalling(true)
    //chop all the rows
    for(let j = startingRow; j <= rowsPerLayer; j++){
        if(util.checkQuit()){break}
        
        //chop all the trees in each row
        for(let l = startingTree; l <= treesPerRow; l++){
            if(util.checkQuit()){break}
            while(!chopTree(i,j,l)){
                chopTree(i,j,l-1)
            }
        }
        //move to end, over, and turn around.
        if(j % 2 == 1){
            //move to end of row
            if(usingHoe){
                util.selectHotbar(7) //select Hoe
            }
            util.complexMoveToLocation(
                ["key.mouse.left"],
                xChopStartPosition + ((j - 1) * 6),
                zStartPosition - 86,
                yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
                0.2)
                
            //toss logs into collector
            tossLogs(j)
            //move to next row, sitting flush with the block so tree bridge chop is already aligned
            util.simpleMove("key.keyboard.w", -90,0,50)
            /*                
            //move over to next row
            util.moveToLocation(
                xChopStartPosition + (j * 6),
                zStartPosition - 86, 
                yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
                0.2)
            */
        }
        else{
            //move to end of row
            if(usingHoe){
                util.selectHotbar(7) //select Hoe
            }
            util.complexMoveToLocation(
                ["key.mouse.left"],
                xChopStartPosition + ((j - 1) * 6),
                zStartPosition - 1, 
                yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
                0.2)
            
            //toss logs into collector
            tossLogs(j)  
            //Last row needs to get to lodestone                     
            if(j == rowsPerLayer){
                break
            }
            //move to next row, sitting flush with the block so tree bridge chop is already aligned
            util.simpleMove("key.keyboard.w", -90,0,50)
            /*
            //move over to next row
            util.moveToLocation(
                xChopStartPosition + (j * 6),
                zStartPosition - 1, 
                yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
                0.2)
            */
        }
        
        //if restarting, set restart to false and change starting back to defaults
        if(restarting){
            restarting = false
            //startingLayer = 1
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
    
    //if restarting, set restart to false and change starting back to defaults
    if(restarting){
        restarting = false
       // startingLayer = 1
        startingRow = 1
        startingTree = 1
    }
}

//Reset keybinds to prevent phantom key holds.
KeyBind.key("key.keyboard.w", false)
KeyBind.key("key.keyboard.left.control", false)
KeyBind.key("key.keyboard.space", false)
KeyBind.key("key.mouse.right", false)
KeyBind.key("key.mouse.left", false)


Chat.log("Oak has been exterminated, shutting down...")

/*-------------------
   4 Program End
-------------------*/
