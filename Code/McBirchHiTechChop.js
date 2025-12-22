/*------------------------
   0 Title Start
------------------------*/
/*
    !!!! Hacked to work from Oak Script !!!!

    Name: Zeal GSEZ Hi Tech Birch Tree Script
    Location: CivMC @ 3054, 5153, 91
    Author: Greltam
    Date: 12/20/2025
    
    Description: A tower full of birch!
    
    Directions:
        Use lodestone @ 3054, 5153, 84 up to y91
        Activate farm script.
        
    Collector: @ 3010, 5150, 84
*/
/*------------------------
   0 Title End
------------------------*/

/*------------------------
   0.1 Player Requirements Start
------------------------*/
/*
    NOTE! If attempting to hoe the leaves:
        Place 2 full durability U3 hoes in each layers further barrel
        
    Pre-Start actions: 
        Required axe in the rightmost hotbar(9)
        Required hoe in the next rightmost hotbar(8)
        Required food in the next rightmost hotbar(7)
        Required empty the next rightmost hotbar(6)
        
        Fill Barrels on layers 1,5,9,13
            with 16 stacks of saplings for replanting
    Items Required:
        5 Diamond Efficiency 4-5 Unbreaking 3 Axes
        3 Diamond Unbreaking 3 Hoes
    
    Restarting: Anywhere inside the farm

*/
/*-----------------------
   0.1 Player Requirements End
-----------------------*/

/*------------------------
   1.1 Import Files Start
------------------------*/
const util = require("./McUtilityFile.js")

const config = require("./McUConfigFile.js")
config.initialize()

const visual = require("./McUVisualizer.js")
visual.clear()

/*-----------------------
   1.1 Import Files End
-----------------------*/

/*------------------------
   1.2 Player Configurables Start
------------------------*/
//player control initialization
quitKey = "key.keyboard.j" // default: "key.keyboard.j"
leftKey = "key.keyboard.a" // default: "key.keyboard.a"
rightKey = "key.keyboard.d" // default: "key.keyboard.d"
forwardKey = "key.keyboard.w" // default: "key.keyboard.w"
backwardKey = "key.keyboard.s" // default: "key.keyboard.s"
useKey = "key.mouse.right" // default: "key.mouse.right"
attackKey = "key.mouse.left" // default: "key.mouse.left"
lodestoneUpKey = "key.keyboard.space" // default: "key.keyboard.space"
lodestoneDownKey = "key.keyboard.left.shift" 
    // default: "key.keyboard.left.shift"
logDiscord = true // default: "true"
verboseLog = false // default: "false"
logoutOnCompletion = false // default: "false"

//hoe some leaves to help allow saplings to fall through canopy
hoeLeaves = false // default: "false"

quitKey = config.getString("quitKey", quitKey)
leftKey = config.getString("leftKey", leftKey)
rightKey = config.getString("rightKey", rightKey)
forwardKey = config.getString("forwardKey", forwardKey)
backwardKey = config.getString("backwardKey", backwardKey)
useKey = config.getString("useKey", useKey)
attackKey = config.getString("attackKey", attackKey)
lodestoneUpKey = config.getString("lodestoneUpKey", lodestoneUpKey)
lodestoneDownKey = config.getString("lodestoneDownKey", lodestoneDownKey)
logDiscord = config.getBool("logDiscord", logDiscord)
verboseLog = config.getBool("verboseLog", verboseLog)
logoutOnCompletion = config.getBool("logoutOnCompletion", logoutOnCompletion)
hoeLeaves = config.getBool("hoeLeaves", hoeLeaves)

//alter the default quitkey from j to whatever you want.
util.setQuitKey(quitKey) //default: util.setQuitKey("key.keyboard.j") 

/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/


farmName = "GSEZ Birch Tower"
regrowthTime = 19 * 3600 //hours multiplied by seconds per hour
harvestDuration = 80 //minutes to run a full harvest

//Player starts script at this location
xStartPosition = 3054 
zStartPosition = 5153
yStartPosition = 91

//west side of the tree farm, beginning of chopping trees
zChopStartPosition = 5245
xRowEndPosition = 2968

//set item list and look vector for tossing items into collector
util.setTossItemList(["minecraft:birch_log",
         "minecraft:stick", "minecraft:apple",
         "minecraft:birch_leaves"])
util.setTossLookVector([-150,0])

//sapling to replant
treeSapling = "minecraft:birch_sapling"

//If Player falls off bridges, stop script.
//turn on when chopping trees, off when moving between tree layers
util.setQuitFromFalling(false)
util.setQuitFromFallingYLevel(yStartPosition)

//If Player wants to scuff harvest using just an axe, let them set to false
usingHoe = true //default: usingHoe = true

//In case of needing to restart mid tree chop
restarting = false //default: restarting = false
startingLayer = 1 //default: startingLayer = 1
startingRow = 1 //default: startingRow = 1
startingTree = 1 //default: startingTree = 1

//total layers in the tree farm
totalLayers = 4 //default: totalLayers = 8
treesPerRow = 16 //default: treesPerRow = 16
rowsPerLayer = 16 //default: rowsPerLayer = 16
layerHeight = 12 //default: layerHeight = 12
rowWidth = 6 //default: rowWidth = 6
treeBridgeLength = 5 //default: treeBridgeLength = 5

floorCutTicks = 25
upperCutTicks = 50

/*-----------------------
   2 Global Variables End
-----------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("GSEZ", "dark_aqua"),
        util.simpleJSONString(" Birch", "white"),
        util.simpleJSONString(" Tower", "dark_green"),
        util.simpleJSONString(", booting...", "gold")
    ])
)
    
quitText =  Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("To ", "white"),
        util.simpleJSONString("Quit", "red"),
        util.simpleJSONString(", Press: ", "white"),
        util.simpleJSONString(util.getQuitKey(), "gold")
    ])
)

finishedText =  Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("GSEZ", "dark_aqua"),
        util.simpleJSONString(" Birch", "white"),
        util.simpleJSONString(" Tower", "dark_green"),
        util.simpleJSONString(", shutting down...", "red")
    ])
)
    
/*-----------------------
   2.1 Formatted Strings End
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
        startingLayer = 
            ((playerY - yStartPosition) / layerHeight) + 1
        startingRow = 1 
        startingTree = 1
        restarting = false
        return
    }
    //set layer, we are -1 y level while chopping trees
    startingLayer = ((playerY - yStartPosition + 1) 
        / layerHeight) + 1
    startingLayer = Math.floor(startingLayer)
    //Chat.log("starting layer = " + startingLayer)
    //set row
    Chat.log("ZCSP: " + zChopStartPosition + " - " + playerZ) 
    startingRow = ((zChopStartPosition - playerZ + 1) / rowWidth) + 1
    startingRow = Math.floor(startingRow)
    //Chat.log("starting Row = " + startingRow)
    //set tree
    if(startingRow % 2 === 1){
        startingTree = ((xStartPosition - playerX) / treeBridgeLength) + 1
        startingTree = Math.floor(startingTree)
        if(startingTree <= 1){
            startingTree = 1
        }
        //Chat.log("starting Tree = " + startingTree)
    }
    else{
        startingTree = ((playerX - xRowEndPosition) / treeBridgeLength) + 1
        startingTree = Math.floor(startingTree)
        if(startingTree <= 1){
            startingTree = 1
        }
        //Chat.log("starting Tree = " + startingTree)
    }
    restarting = true
}

function getHoe(){
    util.selectHotbar(7) //select Hoe
    
    heldItem = util.getItemInSelectedHotbar()
    
    //if we don't have a hoe
    if(heldItem.getItemId() != "minecraft:diamond_hoe"){
        //move from inventory to hotbar
        util.moveItemToHotbar("minecraft:diamond_hoe",7)
    }
}
function replantSapling(){
    //move hotbar to slot 5
    util.selectHotbar(5)
    //check if holding sapling
    heldItem = util.getItemInSelectedHotbar()
    
    //if we don't have sapling
    if(heldItem.getItemId() != treeSapling){
        //move from inventory to hotbar
        util.moveItemToHotbar(treeSapling,5)
    }
    
    //we do have sapling
    util.simpleMove(
        useKey, util.player.getYaw(), 70, 5
    )
    util.spinTicks(10)
    
    //check if we used any.
}

function chopTree(layer, row, tree){

//figure out next tree destination location
    zDestination = zChopStartPosition - ((row - 1) * 6)
    yDestination = yStartPosition - 1 + ((layer-1) * layerHeight)
    xDestination = 0
    
//separate for even/odd rows
    if(row == 1){
        zDestination = zDestination + 0.2 //stay to the left as flush with start location
        xDestination = xStartPosition - 5 - ((tree-1) * 5) - 0.33
    }
    else if(row % 2 == 1){//odd row, starting bottom and going up
        zDestination = zDestination - 0.2 //stay to the side to not hit glass
        xDestination = xStartPosition - 5 - ((tree-1) * 5) - 0.33
    }
    else{
        zDestination = zDestination - 0.2 //stay to the side to not hit glass
        xDestination = xStartPosition - 82 + ((tree-1) * 5) + 0.33
    }

//chop leaves in front of tree
    if(usingHoe){
        getHoe() //select Hoe
    }
    
    //try to move to the next tree, but if not, return false
    //to tell tree chop loop to redo next tree
    //Tried a while loop with call to chop last tree but got double recursion
    
    
    /*
    Chat.log("Layer: " + layer + 
             " Row: " + row + 
             " Tree: " + tree
    )
    Chat.log("Attempting tree at: " + 
        "X: " + xDestination +
        " Y: " + yDestination +
        " Z: " + zDestination
    )
    */
    if(!util.complexMoveToLocation([attackKey],
        xDestination, zDestination, yDestination, 0.2)){
        return false
    }
        
    //chop above leaves with hoe instead of making axe chop them
    //odd rows look 180. even rows look 0
    if(usingHoe){
        if(row % 2 == 1){
            util.simpleMove(attackKey,90, -80, 5)
        }
        else{
            util.simpleMove(attackKey,-90, -80, 5)       
        }
    }

//chop tree
    util.selectHotbar(8) //select Axe
    //util.simpleMove("key.mouse.left",180, -80, 5)
    if(row % 2 == 1){
        //eye and foot level logs
        util.simpleMove(attackKey,90, 45, floorCutTicks)
        //upper level logs
        util.simpleMove(attackKey,90, -77.5, upperCutTicks)
    
    }
    else{
        //eye and foot level logs
        util.simpleMove(attackKey,-90, 45, floorCutTicks)
        //upper level logs
        util.simpleMove(attackKey,-90, -77.5, upperCutTicks)
    }
    
//hoe leaves
    if(hoeLeaves){
        getHoe() //select Hoe
        
        if(row % 2 == 1){
            util.smoothLookAt(-180,-60)
            util.key(attackKey, true)
            
            util.smoothLookAt(-180,-75)
            //util.spinTicks(5)
            util.panLook(-180, -75, 180, -75, 10)
            
            util.smoothLookAt(-180,-60)
            //util.spinTicks(5)
            util.panLook(-180, -60, 180, -60, 10)
            
            util.smoothLookAt(-180,-40)
            //util.spinTicks(5)
            util.panLook(-180, -40, 180, -40, 10)
            
            util.smoothLookAt(-180,-10)
            //util.spinTicks(5)
            util.panLook(-180, -10, 180, -10, 10)
        }
        else{
            util.smoothLookAt(0,-60)
            util.key(attackKey, true)
            util.smoothLookAt(0,-75)
            //util.spinTicks(5)
            util.panLook(0, -75, -180, -75, 5)
            util.panLook(180, -75, 0, -75, 5)
            
            util.smoothLookAt(180,-60)
            //util.spinTicks(5)
            util.panLook(0, -60, -180, -60, 5)
            util.panLook(180, -60, 0, -60, 5)
            
            util.smoothLookAt(180,-40)
            //util.spinTicks(5)
            util.panLook(0, -40, -180, -40, 5)
            util.panLook(180, -40, 0, -40, 5)
            
            util.smoothLookAt(180,-25)
            //util.spinTicks(5)
            util.panLook(0, -10, -180, -10, 5)
            util.panLook(180, -10, 0, -10, 5)
        }
        //function panLook(xStart, yStart, xEnd, yEnd, ticks)
        util.key(attackKey, false)
    }
    
    //Try to replant
    replantSapling()
    return true
}

function tossLogs(row){
    //Chat.log("Tossing items")
    xLook = 120
    yLook = 0
    
    if(row % 2 == 1){xLook = -120}
    
    util.setTossLookVector([xLook,yLook])
    util.tossItems()
}

/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   3.9 Pre-Program Start
-------------------*/
//GUI overlay
visual.fullText("farmName", farmName, 0xdddddd,0,0)
visual.fullText("toQuit", "Quit key: " + quitKey,0xffaaaa,0,8)
visual.fullText("birch","Birch: " 
    + util.getTossedItemAmount("minecraft:birch_log"), 0xffa500,0,16)
visual.fullText("timeLeft",
            "Remaining time: " + harvestDuration, 0x999999,0,24)

//restart farm on reconnect
GlobalVars.putBoolean("farmRunning",true)
GlobalVars.putBoolean("killsnitch", false)


Chat.log(greetingsText)
Chat.log(quitText)
    
//output to Discord
if(logDiscord){
    util.logScriptStart(farmName)
}

//protect from tabbed out dysfunction
try{
    Client.grabMouse()
}catch(error){
    Chat.log("Could not grab mouse.")
}

/*-------------------
   3.9 Pre-Program End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

setStartingPosition()

//chop all the layers
for(let i = startingLayer; i <= totalLayers; i++){
    if(util.checkQuit()){break}
    
    util.checkHunger() //eat food if hungry
    
    //check for replant chest
    if(!restarting){
        if((i % 4) == 1){            
            //chest current saplings
            util.chestSpecificItems(90,-90,
                "minecraft:birch_sapling", true)
            //if we have even more, toss into collector
            util.tossAllSpecificItems(
                ["minecraft:birch_sapling"], 90, 0)
            
            if(hoeLeaves){
                //hoeing leaves with fortunes nets us ~3 stacks per layer
                //just need a stack to start out with
                util.chestItems(90,-90,0,1)
            }
            else{
                //pick up oak saplings from chest
                //saplings will be in barrel from slot 0 to 15
                util.chestItems(90,-90,0,16)
            }
            
        }
        if(hoeLeaves){
            //move barrel hoes to inventory
            util.chestSpecificItems(90,-55,
                "minecraft:diamond_hoe", false)
        }
        
        //protect from tabbed out dysfunction
        //due to barrel interaction
        try{
            Client.grabMouse()
        }catch(error){
            Chat.log("Could not grab mouse.")
        }
    }
    
    //start at lodestone - move to chop start
    if(!restarting){
        util.moveToLocation(
            xStartPosition, zChopStartPosition, 
            yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
            0.2)
    }
    
    //turn on fall protection
    util.setQuitFromFallingYLevel(yStartPosition + ((i-1) * layerHeight) - 1)
    util.setQuitFromFalling(true)
    
    
    
    //chop all the rows
    for(let j = startingRow; j <= rowsPerLayer; j++){
        if(util.checkQuit()){break}
        
        util.checkHunger() //eat food if hungry
        
        //chop all the trees in each row
        for(let l = startingTree; l <= treesPerRow; l++){
            if(util.checkQuit()){break}
            while(!chopTree(i,j,l)){
                xLookCurrent = Player.getPlayer().getYaw()
                
                //attempt to clear leaves
                util.selectHotbar(7) //select Hoe
                util.key(attackKey, true)
                util.panLook(-180, 0, 180, 0, 20)
                util.key(attackKey, false)
                
                //walk as forward as possible
                util.simpleMove(forwardKey,
                    xLookCurrent,
                    Player.getPlayer().getPitch(),
                    40)
                    
                //clear logs if possible
                util.selectHotbar(8) //select Axe
                util.simpleMove(attackKey,
                    xLookCurrent, 
                    45, floorCutTicks)
                
                //reset to last tree.
                //chopTree(i,j,l-1)
            }
            visual.setText("timeLeft", "Remaining time: " 
                + util.remainingMinutes(
                i,((j-1) * treesPerRow) + l,totalLayers,
                rowsPerLayer*treesPerRow,harvestDuration))
        }
        //move to end, over, and turn around.
        if(j % 2 == 1){
            //move to end of row
            if(usingHoe){
                getHoe() //select Hoe
            }
            util.complexMoveToLocation(
                [attackKey],
                xStartPosition - 86,
                zChopStartPosition - ((j - 1) * 6),
                yStartPosition + ((i-1) * layerHeight) - 1,
                0.2)
                
            //toss logs into collector
            tossLogs(j)
            visual.setText("birch", "Birch: " 
                + util.getTossedItemAmount("minecraft:birch_log"))
            //move to next row, sitting flush with the block so tree bridge chop is already aligned
            util.simpleMove(forwardKey, -180,0,50)
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
                getHoe() //select Hoe
            }
            util.complexMoveToLocation(
                [attackKey],
                xStartPosition - 1, 
                zChopStartPosition - ((j - 1) * 6),
                yStartPosition + ((i-1) * layerHeight) - 1,
                0.2)
            
            //toss logs into collector
            tossLogs(j)
            visual.setText("birch", "Birch: " 
                + util.getTossedItemAmount("minecraft:birch_log"))
            //Last row needs to get to lodestone                     
            if(j == rowsPerLayer){
                break
            }
            //move to next row, sitting flush with the block so tree bridge chop is already aligned
            util.simpleMove(forwardKey, -180,0,50)
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
        xStartPosition - 1, zStartPosition,
        yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
        0.2)
    util.moveToLocation(
        xStartPosition, zStartPosition,
        yStartPosition + ((i-1) * layerHeight) - 1 + util.getEyeHeight(),
        0.2)
    
    
    //dump old hoes in sapling barrel
    if(hoeLeaves){
        util.chestSpecificItems(90,-55,
            "minecraft:diamond_hoe", true) 
    }
    //jump to next lodestone. Turn off quitfromfalling and reset when on next layer
    util.simpleMove(lodestoneUpKey, 0, 0, 5)
    
    //if restarting, set restart to false and change starting back to defaults
    if(restarting){
        restarting = false
       // startingLayer = 1
        startingRow = 1
        startingTree = 1
    }
}
/*-------------------
   4 Program End
-------------------*/

/*-------------------
   4.1 Shutdown Start
-------------------*/

//prevent reconnect from restarting farm
GlobalVars.putBoolean("farmRunning", false)

//Reset keybinds to prevent phantom key holds.
util.resetKeys()

//log script completion
Chat.log(finishedText)

//output to Discord
if(logDiscord){
    util.logScriptEnd(farmName, regrowthTime, verboseLog)
}

//clear all GUI overlays
visual.clear()

//Exit server if on a delay start or desired
if(logoutOnCompletion || GlobalVars.getBoolean("delayFarm")){
    GlobalVars.putBoolean("delayFarm", false)
    GlobalVars.putBoolean("killsnitch", true)
    Chat.say("/logout")
}
/*-------------------
   4.1 Shutdown End
-------------------*/
