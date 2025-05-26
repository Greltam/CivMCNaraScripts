// Nether Stem Tower Script
/*
#    !!! Script starts at 2264, 8097, 34 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Nether Stem Chopper on CivMC @ 2265, 8143, 7-40
    Written by Greltam 1/12/2025
    
  Nether Stems: Crimson and Warped are very valuable. Their
  cultivation is difficult, needing to control wart block growth
  to expedite stem harvesting. A Tower with full saturation of 
  growth spaces for wart blocks has been built. 
  
  Players will chop 1 layer at a time, back and forth from starting
  north and south positions. Each layer requires 16 rows be chopped
  with 20 stems per row. Each tree will be: moved through plate-door
  to tree, chop angled down between next(50.5*) plate/netherrack. Then
  aim to the top(-77), switch to hoe to clear any wart blocks. Replant
  as going, switch to bonemeal, bonemeal netherrack, place fungus.
  Repeat until next row, turn around an clear next row. Toss stems to
  Collector, then start next row.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/
//!!!IMPORTANT!!!
//Clear any stray wart blocks present in front of all doors
//on each row of each layer. (East side only)
//!!!IMPORTANT!!!

//Player must place axe in the rightmost hotbar(9)
//Player must place hoe in the next rightmost hotbar(8)
//Hoe should be high durability
//Player must place fungus in next rightmost hotbar(7)
//Player must place bonemeal in next rightmost hotbar(6)
//Player must place sticks in the next rightmost hotbar(5)

//Inventory will be filled with:
//10 stacks of warped fungus
//10 stacks of crimson fungus
//2 stacks of bone blocks
//2 stacks of bonemeal
//2 e(4/5)u3 diamond axes
//1 e5u3 diamond hoe

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
//set either to true to plant entire farm as one stem type
plantAllCrimson = false //default: plantAllCrimson = false
plantAllWarped = true //default: plantAllWarped = false


//set item list and look vector for tossing items into collector
util.setTossItemList(["minecraft:crimson_stem",
    "minecraft:nether_wart_block",
    "minecraft:warped_stem",
    "minecraft:warped_wart_block",
    "minecraft:shroomlight"])
util.setTossLookVector([-140,0])

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
totalLayers = 4 //default: totalLayers = 4
treesPerRow = 20 //default: treesPerRow = 20
rowsPerLayer = 16 //default: rowsPerLayer = 16
layerHeight = 9 //default: layerHeight = 9

rowWidth = 3 //default: rowWidth = 3
treeCellLength = 3 //default: treeBridgeLength = 3

/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "GSEZNether Stem Tower"
regrowthTime = 24 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
//Top of the Tower, North side
xStartPosition = 2265 
zStartPosition = 8097
yStartPosition = 34

//west side of the stem farm
xRowEndPosition = 2202
zNorthStartPosition = 8098
zSouthStartPosition = 8144.5 //the .5 is to account for player centering

//Time for stem chopping
floorCutTicks = 30
upperCutTicks = 50

nextCellMoveTicks = 30
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
        while(itemNumber === heldItem.getCount()){
            if(util.checkQuit()){break}
            util.simpleMove(
                "key.mouse.right", util.player.getYaw(), 70, 2
            )
            util.spinTicks(10)
            heldItem = util.getItemInSelectedHotbar()
            ////Chat.log("items: " + itemNumber + "heldItemCount: " + heldItem.getCount())
        }
    }
    
    //check if we used any.
}

function plantFungus(layerNum, rowNum){
    //which fungus should we be using?
    useCrimson = true
    if(    (layerNum % 2 == 1 && rowNum <= 8) // North-South layer
        || (layerNum % 2 == 0 && rowNum >= 9) // South-North layer
      )
    {
        useCrimson = false
    }
    
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
            "key.mouse.right", util.player.getYaw(), 70, 5
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
                "key.mouse.right", util.player.getYaw(), 70, 5
            )
        }
    }

}

function chopTree(layer, row, tree){
 
    //!!! Need to add error correction for movement to next cell here

    
    //Move from start or tree to next cell
    //East side row start, move west
    if(row % 2 == 1){
        util.simpleMove("key.mouse.right",90,0,5)
        util.simpleMove("key.keyboard.w",90,0,nextCellMoveTicks)
    }
    //Weast side row start, move east
    else{
        util.simpleMove("key.mouse.right",-90,0,5)
        util.simpleMove("key.keyboard.w",-90,0,nextCellMoveTicks)
    }
        
    //chop tree
    pYaw = -90
    if(row % 2 == 1){
        pYaw = 90
    }
    
    //remove wart if on bottom two blocks
    util.selectHotbar(7) //select hoe
    util.simpleMove("key.mouse.left",pYaw, 50.5, 8)
    util.simpleMove("key.mouse.left",pYaw, 75, 8)
    //eye and foot level logs
    util.selectHotbar(8) //select Axe
    util.simpleMove("key.mouse.left",pYaw, 50.5, floorCutTicks)
    
    //upper level logs
    util.simpleMove("key.mouse.left",pYaw, -77, upperCutTicks /2)
    //clear wart blocks
    util.selectHotbar(7) //select Hoe
    util.simpleMove("key.mouse.left",pYaw, -77, floorCutTicks /2)
    //upper level logs
    util.selectHotbar(8) //select Axe
    util.simpleMove("key.mouse.left",pYaw, -77, upperCutTicks /2)
    //clear wart blocks
    util.selectHotbar(7) //select Hoe
    util.simpleMove("key.mouse.left",pYaw, -77, floorCutTicks /2)

    
    //add bonemealing and fungus planting.
    bonemealNetherrack()
    plantFungus(layer,row)
    
    return true
}
/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/
Chat.log(greetingsText)
Chat.log(quitText)
util.logScriptStart(farmName)

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
            //Needs error correction for mischopped cells
            /*    util.simpleMove("key.keyboard.s",
                    Player.getPlayer().getYaw(),
                    Player.getPlayer().getPitch(),
                    40)
                chopTree(i,j,l-1)
            }
            */
            }
        }
        
        //done chopping east-west row, move to next row
        if(j % 2 == 1){
            //open door and move to end of row
            util.simpleMove("key.mouse.right",90,0,5)
            util.simpleMove("key.keyboard.w", 90,0,50)
            
            //On a North-South layer
            if(i % 2 == 1){
                //move to start of next of row
                util.simpleMove("key.keyboard.w", 0,0,50)
            }
            //On a South-North layer
            else{
                //move to start of next of row
                util.simpleMove("key.keyboard.w", 180,0,50)
            }
        }
        //done chopping west-east row
        else{ 
            //open door and move to end of row
            util.simpleMove("key.mouse.right",-90,0,5)
            util.simpleMove("key.keyboard.w", -90,0,50)
            
            //On a North-South layer
            if(i % 2 == 1){
                //move to start of next of row
                util.simpleMove("key.keyboard.w", 0,0,50)
                //toss logs into collector
                //but not on the last row(no chute)
                if(j != rowsPerLayer){util.tossItems()}
            }
            //On a South-North layer
            else{
                //toss logs into collector
                util.tossItems()  
                //move to start of next of row
                util.simpleMove("key.keyboard.w", 180,0,50)
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
        util.simpleMove("key.keyboard.w", 0,0,50)
        //wait for player to fall past ladder
        util.simpleMove("", 0,0,50)
        //align to start of row
        util.simpleMove("key.keyboard.w", 180,0,50)
    }
    //On a South-North layer
    else{        
        //move into chute
        util.simpleMove("key.keyboard.w", 180,0,50)
        util.simpleMove("key.keyboard.w", 90,0,50)
        //wait for player to fall past ladder
        util.simpleMove("", 0,0,50)
        //align to start of row
        util.simpleMove("key.keyboard.w", 0,0,50)
    }
    
    //if restarting, set restart to false and change starting back to defaults
    if(restarting){
        restarting = false
        startingRow = 1
        startingTree = 1
    }
}

//Reset keybinds to prevent phantom key holds.
util.resetKeys()

Chat.log(finishedText)
util.logScriptEnd(farmName, regrowthTime)

//if we restarted script over night logout because we are
//probably still asleep.
if(GlobalVars.getBoolean("delayFarm")){

    GlobalVars.putBoolean("delayFarm",false)
    GlobalVars.putBoolean("delayNetherStem",false)
    
    GlobalVars.putBoolean("killsnitch", true)
    Chat.say("/logout")
    Client.waitTick(400)
    Client.disconnect() 
}

/*-------------------
   4 Program End
-------------------*/
