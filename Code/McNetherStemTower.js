/*------------------------
   0 Title Start
------------------------*/
/*
    Name: GNC Nether Stem Tower Script
    Location: CivMC @ 2264, 8146, 1
    Author: Greltam
    Date: 9/14/2025
    
    Description: A tower full of nether stems!
    
    Directions:
        Enter building, go north to lodestone inside 
        Use lodestone @ 2265, 8097, 2 up to y34
        Enter first tree cell
        Activate farm script.
        
    Collector: Lower level of Nether Stem building
*/
/*------------------------
   0 Title End
------------------------*/
    
/*------------------------
   0.1 Player Requirements to Start
------------------------*/
/*
    !!!IMPORTANT!!!
    Clear any stray wart blocks present in front of all doors
    on each row of each layer. (East side only)
    !!!IMPORTANT!!!
    
    Inventory will be filled with:
    20 stacks of warped fungus
    2 stacks of bone blocks
    3 stacks of bonemeal
    2 e(4/5)u3 diamond axes
    1 e5u3 diamond hoe
    1 stack of porkchop
    1 stack of sticks
    
    Player must place axe in the rightmost hotbar(9)
    Player must place hoe in the next rightmost hotbar(8)
    Hoe should be high durability
    Player must place fungus in next rightmost hotbar(7)
    Player must place bonemeal in next rightmost hotbar(6)
    Player must place sticks in the next rightmost hotbar(5)
    
*/
/*-----------------------
   0.1 Player Requirements to Start End
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


//alter the default quitkey from j to whatever you want.
util.setQuitKey(quitKey) //default: util.setQuitKey("key.keyboard.j") 

/*-----------------------
   1.2 Player Configurables End
-----------------------*/


/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "GSEZNether Stem Tower"
if(util.player.getY() >= 40){
    farmName = "GNC Crimson Nether Stem Tower"
}
//Warped is below Crimson
else{
    farmName = "GNC Warped Nether Stem Tower"
}

regrowthTime = 24 * 3600 //hours multiplied by seconds per hour
harvestDuration = 350 //minutes to complete full harvest

//Player starts script at this location
//Top of the Tower, North side
xStartPosition = 2265 
zStartPosition = 8097
yStartPosition = 34

//west side of the stem farm
xChopStartPosition = 2262

xRowEndPosition = 2202
zNorthStartPosition = 8098
zSouthStartPosition = 8144.5 //the .5 is to account for player centering

//Time for stem chopping
floorCutTicks = 30
upperCutTicks = 50

nextCellMoveTicks = 30

//set either to true to plant entire farm as one stem type
plantAllCrimson = false //default: plantAllCrimson = false
plantAllWarped = true //default: plantAllWarped = false

//set item list and look vector for tossing items into collector
util.setTossItemList(["minecraft:crimson_stem",
    "minecraft:stripped_crimson_stem",
    "minecraft:nether_wart_block",
    "minecraft:warped_stem",
    "minecraft:stripped_warped_stem",
    "minecraft:warped_wart_block",
    "minecraft:shroomlight"])
util.setTossLookVector([-140,0])

//If Player wants to scuff harvest using just an axe, let them set to false
usingHoe = true //default: usingHoe = true

//In case of needing to restart mid tree chop
restarting = false //default: restarting = false
startingLayer = 1 //default: startingLayer = 1
startingRow = 1 //default: startingRow = 1
startingTree = 1 //default: startingTree = 1

//total layers in the tree farm
totalLayers = 4 //default: totalLayers = 4
treesPerRow = 20 //default: treesPerRow = 20
rowsPerLayer = 16 //default: rowsPerLayer = 16
layerHeight = 9 //default: layerHeight = 9

rowWidth = 3 //default: rowWidth = 3
treeCellLength = 3 //default: treeBridgeLength = 3
/*-----------------------
   2 Global Variables End
-----------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("GSEZNether", "dark_purple"),
        util.simpleJSONString(" Nether Stem", "light_purple"),
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
        util.simpleJSONString("GSEZNether", "dark_purple"),
        util.simpleJSONString(" Nether Stem", "light_purple"),
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
    
    //set replanting fungus depending on y level
    //Crimson's lowest level is at y43
    if(playerY >= 40){
        plantAllCrimson = true
        plantAllWarped = false
        yStartPosition = 70
    }
    //Warped is below Crimson
    else{
        plantAllCrimson = false
        plantAllWarped = true
        yStartPosition = 34
    }
    
    //At the starting position of a layer
    //if we are at the lodestone level, set position as start of a
    //layer and break
    /*
    if((yStartPosition - playerY) % layerHeight === 0){
        startingLayer = ((yStartPosition - playerY) / layerHeight) + 1
        startingRow = 1 
        startingTree = 1
        restarting = false
        return
    }
    */
    
    //set layer
    startingLayer = ((yStartPosition - playerY) / layerHeight) + 1
    startingLayer = Math.floor(startingLayer)
    ////
    Chat.log("starting layer = " + startingLayer)
    
    
    //Set row depending on layer
    //Layer starts north side
    if(startingLayer % 2 === 1){
        startingRow = ((playerZ - zNorthStartPosition) / rowWidth) + 1
    }
    //Layer starts south side
    else{
        startingRow = ((zSouthStartPosition - playerZ) / rowWidth) + 1
    }
    startingRow = Math.floor(startingRow)
    //if(startingRow < 1){ startingRow = 1} //if we are before row starts
    ////
    Chat.log("starting Row = " + startingRow)
    
    
    //Set tree if row starts east side
    if(startingRow % 2 === 1){
        startingTree = ((xStartPosition - playerX) / treeCellLength) + 1
    }
    //Set tree if row starts west side
    else{
        startingTree = ((playerX - xRowEndPosition) / treeCellLength) + 1
    }
    startingTree = Math.floor(startingTree) 
    if(startingTree < 1){ startingTree = 1}
    ////
    Chat.log("starting Tree = " + startingTree)
    
    restarting = true
}

function bonemealNetherrack(){
    //move hotbar to slot 5
    util.selectHotbar(5)
    //check if holding bonemeal
    heldItem = util.getItemInSelectedHotbar()
    
    //if we don't have bonemeal
    if(heldItem.getItemId() != "minecraft:bone_meal"){
        //move from inventory to hotbar
        util.moveItemToHotbar("minecraft:bone_meal",5)
    }
    
    //we STILL don't have bonemeal
    heldItem = util.getItemInSelectedHotbar()
    if(heldItem.getItemId() != "minecraft:bone_meal"){
        //Craft boneblocks into bonemeal
        util.craftManually([["minecraft:bone_block",1]],7)
        
        //move from inventory to hotbar
        util.moveItemToHotbar("minecraft:bone_meal",5)
    }
    //we do have bonemeal
    heldItem = util.getItemInSelectedHotbar()
    if(heldItem.getItemId() == "minecraft:bone_meal"){
        itemNumber = heldItem.getCount()
        
        //use bonemeal on block pitch = 70
        //keep trying if not used
        attempts = 0
        while(itemNumber === heldItem.getCount()){
            if(util.checkQuit()){break}
            util.simpleMove(
                useKey, util.player.getYaw(), 70, 2
            )
            util.spinTicks(10)
            heldItem = util.getItemInSelectedHotbar()
            
            //give up trying to bonemeal if we just aren't getting it
            attempts = attempts + 1
            if(attempts >= 10){
                break
            }
            ////Chat.log("items: " + itemNumber + "heldItemCount: " + heldItem.getCount())
        }
    }
    
    //check if we used any.
}

function plantFungus(layerNum, rowNum){
    //which fungus should we be using?
    useCrimson = true
    
    if(plantAllCrimson){
        useCrimson = true
    }
    if(plantAllWarped){
        useCrimson = false
    }
    
    //move hotbar to slot 6 
    util.selectHotbar(6)
    //check if holding fungus    
    heldItem = util.getItemInSelectedHotbar()
    
    //assign our desired fungus
    desiredFungus = "minecraft:crimson_fungus"
    if(!useCrimson){desiredFungus = "minecraft:warped_fungus"}
    
    //if we don't have fungus
    if(heldItem.getItemId() != desiredFungus)
    {
        //move from inventory to hotbar
        util.moveItemToHotbar(desiredFungus,6)
    }
    
    //we do have fungus
    heldItem = util.getItemInSelectedHotbar()
    if(heldItem.getItemId() == desiredFungus)
    {
        //we need to check if we double bonemealed
        itemNumber = heldItem.getCount()
        
        //plant fungus on block pitch = 70
        util.simpleMove(
            useKey, util.player.getYaw(), 70, 5
        )
        
        //check if we actually planted a fungus
        util.spinTicks(10)
        heldItem = util.getItemInSelectedHotbar()
        if(itemNumber === heldItem.getCount()){
            //we did not plant the fungus
            //we probably double bonemealed one onto the nylium
            //to activate rb, we need to right click with a stick
            
            //move hotbar to slot 4 
            util.selectHotbar(4)
            //right click fungus with stick
            util.simpleMove(
                useKey, util.player.getYaw(), 70, 5
            )
        }
    }

}

function chopTree(layer, row, tree){

    //figure out next tree destination location
    xDestination = xStartPosition
    yDestination = yStartPosition - ((layer-1) * layerHeight)
    zDestination = zNorthStartPosition
    
    //to account for sliding against the wall
    zOffset = 0.2
    if(layer % 2 == 0){
        zOffset = -0.2
    }
    
    //separate for even/odd rows
    if(row % 2 == 1){//odd row, starting right going left
        xDestination = 
            xStartPosition - (tree * treeCellLength) + 0.63
    }else{//even row, starting left going right
        xDestination = xStartPosition - 
            ((treesPerRow - tree + 1 ) * treeCellLength) - 0.63
    }
    
    if(layer%2 == 1){
        zDestination = 
            zDestination + ((row-1) * rowWidth) + zOffset
    }else{
        zDestination = 
            zDestination + ((rowsPerLayer - row) * rowWidth) + zOffset
    }
    
    //open doors to move into next cell
    if(row % 2 == 1){
        util.simpleMove(useKey,90,0,5)
    }
    else{
        util.simpleMove(useKey,-90,0,5)
    }
    /*
    Chat.log("Aiming for:" + xDestination + "x, " +
        yDestination + "y, " + zDestination + "z")
    Chat.log("currently at for:" + Player.getPlayer().getX() + "x, " +
        Player.getPlayer().getY()  + "y, " +
        Player.getPlayer().getZ()  + "z")
    */
    //try to move to the next tree, but if not, return false
    //to tell tree chop loop to redo next tree
    //Tried a while loop with call to chop last tree but got double recursion
    if(!util.complexMoveToLocation([useKey],
        xDestination, zDestination, yDestination, 0.3)){
        return false
    }
        
    //chop tree
    pYaw = -90
    if(row % 2 == 1){
        pYaw = 90
    }
    
    //remove wart if on bottom two blocks
    util.selectHotbar(7) //select hoe
    util.simpleMove(attackKey,pYaw, 50.5, 8)
    util.simpleMove(attackKey,pYaw, 75, 8)
    //eye and foot level logs
    util.selectHotbar(8) //select Axe
    util.simpleMove(attackKey,pYaw, 50.5, floorCutTicks)
    
    //upper level logs
    util.simpleMove(attackKey,pYaw, -77, upperCutTicks /2)
    //clear wart blocks
    util.selectHotbar(7) //select Hoe
    util.simpleMove(attackKey,pYaw, -77, floorCutTicks /2)
    //upper level logs
    util.selectHotbar(8) //select Axe
    util.simpleMove(attackKey,pYaw, -77, upperCutTicks /2)
    //clear wart blocks
    util.selectHotbar(7) //select Hoe
    util.simpleMove(attackKey,pYaw, -77, floorCutTicks /2)

    
    //add bonemealing and fungus planting.
    bonemealNetherrack()
    plantFungus(layer,row)
    
    return true
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
visual.fullText("stems","Stems: " 
    + util.getTossedItemAmount("minecraft:warped_stem"), 0x44ffdd,0,16)
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

    //chop all the rows
    for(let j = startingRow; j <= rowsPerLayer; j++){
        if(util.checkQuit()){break}
        
        //chop all the trees in each row
        for(let l = startingTree; l <= treesPerRow; l++){
            if(util.checkQuit()){break}
            while(!chopTree(i,j,l)){
                //failure to chop tree, try resetting to previous
                util.simpleMove(backwardKey,
                    Player.getPlayer().getYaw(),
                    Player.getPlayer().getPitch(),
                    40)
                chopTree(i,j,l-1)
            }
            visual.setText("timeLeft", "Remaining time: " 
                + util.remainingMinutes(
                i,j*l,totalLayers,
                rowsPerLayer*treesPerRow,harvestDuration))
        }
        
        //done chopping east-west row, move to next row
        if(j % 2 == 1){
            //open door and move to end of row
            util.simpleMove(useKey,90,0,5)
            util.simpleMove(forwardKey, 90,0,50)
            
            //On a North-South layer
            if(i % 2 == 1){
                //move to start of next of row
                util.simpleMove(forwardKey, 0,0,50)
            }
            //On a South-North layer
            else{
                //move to start of next of row
                util.simpleMove(forwardKey, 180,0,50)
            }
        }
        //done chopping west-east row
        else{ 
            //open door and move to end of row
            util.simpleMove(useKey,-90,0,5)
            //hoe any leftover leaves
            util.selectHotbar(7) //select hoe
            util.complexMove([forwardKey,attackKey],
                -90, 0, 50)
            
            //On a North-South layer
            if(i % 2 == 1){
                //move to start of next of row
                util.complexMove([forwardKey,attackKey],
                    0, 0, 50)
                //toss logs into collector
                //but not on the last row(no chute)
                if(j != rowsPerLayer){util.tossItems()}
            }
            //On a South-North layer
            else{
                //toss logs into collector
                util.tossItems()  
                //move to start of next of row
                util.complexMove([forwardKey,attackKey],
                    180, 0, 50)
            }
            
            //update visual for logged stems
            if(yStartPosition == 34){
                visual.setText("stems", "Stems: " 
                + util.getTossedItemAmount("minecraft:warped_stem"))
            }
            else{
                visual.setText("stems", "Stems: " 
                + util.getTossedItemAmount("minecraft:crimson_stem"))
            }
            
            //Last row needs to get to lodestone                     
            if(j == rowsPerLayer){
                break
            }            
        }
        
        //if restarting, set restart to false and change starting back to defaults
        if(restarting){
            restarting = false
            //startingLayer = 1
            startingRow = 1
            startingTree = 1
        }
    }//end Row Chop
    
    //Move to next layer
    //On a North-South layer
    if(i % 2 == 1){
        //move into chute
        util.simpleMove(forwardKey, 0,0,50)
        //wait for player to fall past ladder
        util.simpleMove("", 0,0,50)
        //align to start of row
        util.simpleMove(forwardKey, 180,0,50)
    }
    //On a South-North layer
    else{        
        //move into chute
        util.simpleMove(forwardKey, 180,0,50)
        util.simpleMove(forwardKey, 90,0,50)
        //wait for player to fall past ladder
        util.simpleMove("", 0,0,50)
        //align to start of row
        util.simpleMove(forwardKey, 0,0,50)
    }
    
    //if restarting, set restart to false and change starting back to defaults
    if(restarting){
        restarting = false
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
