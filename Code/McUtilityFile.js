/*
    Utility File for Greltam's JSMacro Scripts on CivMC
*/

/*
    //add this line at the top of a program file to access these functions
    const util = require("./McUtilityFile.js")
    
    //Usage would be as such
    util.setQuitKey("key.keyboard.j")
*/

quitKey = "key.keyboard.j" // key used to stop script
quitFromFalling = false
quitFromFallingYLevel = -64
saveTool = true //used in checkQuit to stop script when tool gets low durability
toolSaveDurability = 10 // Durability of tool to stop using it
replaceToolEnchantments = false //When replacing tool, use exact enchantments
eyeHeight = Player.getPlayer().getEyeHeight()
player = Player.getPlayer()

SINGLE_CHEST = 1
DOUBLE_CHEST = 2

function getQuitKey(){
    return quitKey
}
function setQuitKey(keyString){
    quitKey = keyString
}
function getQuitFromFalling(){
    return quitFromFalling
}
function setQuitFromFalling(boolean){
    if(!checkQuit()){
        quitFromFalling = boolean
    }
}
function getQuitFromFallingYLevel(){
    return quitFromFallingYLevel
}
function setQuitFromFallingYLevel(yLevel){
    quitFromFallingYLevel = yLevel
}
function getSaveTool(){
    return saveTool
}
function setSaveTool(boolean){
    saveTool = boolean
}
function getToolSaveDurability(){
    return saveTool
}
function setToolSaveDurability(dura){
    toolSaveDurability = dura
}

function getEyeHeight(){
    return eyeHeight
}

//If player is using a tool, return durability, 
//otherwise return toolSaveDurability + 1 to prevent checkQuit from stopping script
function getToolDurability(){
    if(player.getMainHand().isDamageable())
        return player.getMainHand().getMaxDamage()
              - player.getMainHand().getDamage()
    else return toolSaveDurability + 1
}

//When tool being used gets damaged to the toolSaveDurability,
//swap a valid replacement tool into current slot.
//returns true if did a valid swap, false if no valid tool found
function swapDamagedTool(){

    KeyBind.key("key.mouse.left", false)
    //get the type of tool being used.
    currentTool = player.getMainHand().getItemId() //current tool id
    
    //open inventory and find same type of tool
    playerInv = Player.openInventory()
    
    //search items for same tool id and check durability
    for(let i = 9; i < 45; i++){
        currentItem = playerInv.getSlot(i)
        
        //Found a tool with same id
        if(currentItem.getItemId() == currentTool){
            currentItemDurability = 
                currentItem.getMaxDamage() - currentItem.getDamage()
                
            //found tool has durability left
            if(currentItemDurability > toolSaveDurability){
                playerInv.swap(i,playerInv.getSelectedHotbarSlotIndex()+36)
                playerInv.close()
                spinTicks(2)
                KeyBind.key("key.mouse.left", true)
                spinTicks(2)
                return true
            }
        }
    }//end for loop
    playerInv.close()
    
    //did not find a replacement tool
    return false
}

//quit if the given key is pressed or if player is using a damaged tool
function checkQuit(){
    //player wants to stop the script
    if(KeyBind.getPressedKeys().contains(quitKey)){
        return true
    }
    if(quitFromFalling){
        if(Player.getPlayer().getY() < quitFromFallingYLevel)
        {
            return true
        }
    }
    //tool is damaged, replace. If no replacements stop the script
    if(saveTool){
        if(getToolDurability() <= toolSaveDurability){
            if(!swapDamagedTool())
                return true
        }
    }
    return false
}

//spend tickNumber ticks in wait, but with ability to cancel wait
function spinTicks(tickNumber){
    for(let i = 0; i < tickNumber; i++){
        if(checkQuit()){
            return
        }
        Client.waitTick(1) 
    } 
}

//Activate a single key/mouse while looking at x,y for ticks length
function simpleMove(keyString, xAngle, yAngle, ticks){
    if(checkQuit()){
        return
    }
    player.lookAt(xAngle,yAngle)
    spinTicks(5)
    KeyBind.key(keyString, true)
    spinTicks(ticks)
    KeyBind.key(keyString, false)
}

//Activate a multiple keys/mouse buttons while looking at x,y for ticks length
//Javascript array is created via [,] e.g. ["key.keyboard.w","key.keyboard.d"]
function complexMove(keyArray, xAngle, yAngle, ticks){
    if(checkQuit()){
        return
    }
    Player.getPlayer().lookAt(xAngle,yAngle)
    spinTicks(5)
    
    //bind all keyArrays
    for(let i = 0; i < keyArray.length; i++){
        KeyBind.key(keyArray[i], true)
    }
    
    spinTicks(ticks)
    
    //unbind all keyArrays
    for(let i = 0; i < keyArray.length; i++){
        KeyBind.key(keyArray[i], false)
    }
}

//testing new movement function to get around unfair advantage
//from moveToLocation alternating between 180 & -180
function WASDToLocation(keyArray, xPos, zPos, tolerance){
    //aim for middle of block
    xPos = xPos + 0.5
    zPos = zPos + 0.5

    //define variables for main loop.
    wKey = false
    aKey = false
    sKey = false
    dKey = false
    //Cutoff for key activation when multiplying key and destination vectors 
    normalTolerance = 0.5
    
    //Normalized Vector direction for each movement key
    yaw = util.player.getYaw() + 180 //idk why + 180 but makes it work
    wRadians = (yaw * (Math.PI/180)) 
    wVector = [Math.sin(wRadians), Math.cos(wRadians)]
    dRadians = ((yaw + 90) * (Math.PI/180))
    dVector = [Math.sin(dRadians), Math.cos(dRadians)]
    sRadians = ((yaw + 180) * (Math.PI/180))
    sVector = [Math.sin(sRadians), Math.cos(sRadians)]
    aRadians = ((yaw + 270) * (Math.PI/180))
    aVector = [Math.sin(aRadians), Math.cos(aRadians)]
    
    //Normalized Vector for final destination
    //No idea why I have to flip playerZ and zPos
    destVector = [xPos - player.getX(), player.getZ() - zPos]
    destDivisor = Math.sqrt(
        (destVector[0] * destVector[0]) + (destVector[1] * destVector[1]))
    destNormal = [destVector[0] /destDivisor, destVector[1] /destDivisor]
    
    
    //bind all keyArrays
    for(let i = 0; i < keyArray.length; i++){
        KeyBind.key(keyArray[i], true)
    }
    
    while(Math.abs(Math.abs(player.getX()) - Math.abs(xPos)) > tolerance
        || Math.abs(Math.abs(player.getZ()) -  Math.abs(zPos)) > tolerance)
    {
        if(checkQuit()){
            break
        }
        //Recalculate Normalized Vector direction for each movement key
        yaw = util.player.getYaw() + 180
        wRadians = (yaw * (Math.PI/180))
        wVector[0] = Math.sin(wRadians)
        wVector[1] = Math.cos(wRadians)
        dRadians = ((yaw + 90) * (Math.PI/180))
        dVector[0] = Math.sin(dRadians)
        dVector[1] = Math.cos(dRadians)
        sRadians = ((yaw + 180) * (Math.PI/180))
        sVector[0] = Math.sin(sRadians)
        sVector[1] = Math.cos(sRadians)
        aRadians = ((yaw + 270) * (Math.PI/180))
        aVector[0] = Math.sin(aRadians)
        aVector[1] = Math.cos(aRadians)
        
        //Recalculate Normalized Vector for final destination
        destVector[0] = xPos - player.getX()
        destVector[1] = player.getZ() - zPos 
        destDivisor = Math.sqrt(
            (destVector[0] * destVector[0]) + (destVector[1] * destVector[1]))
        destNormal[0] = destVector[0] / destDivisor
        destNormal[1] = destVector[1] / destDivisor
        
        //Check if the magnitude of WASD vector lines up with Dest vector
        //and activate key
        if(wVector[0] * destNormal[0] > normalTolerance 
            || wVector[1] * destNormal[1] > normalTolerance){
            wKey = true
        }
        
        if(dVector[0] * destNormal[0] > normalTolerance 
            || dVector[1] * destNormal[1] > normalTolerance){
            dKey = true
        }
        
        if(sVector[0] * destNormal[0] > normalTolerance 
            || sVector[1] * destNormal[1] > normalTolerance){
            sKey = true
        }
        
        if(aVector[0] * destNormal[0] > normalTolerance
            || aVector[1] * destNormal[1] > normalTolerance){
            aKey = true
        }
        
        //Bind keys
        if(wKey){ KeyBind.key("key.keyboard.w", true)}
        else{ KeyBind.key("key.keyboard.w", false)}
        if(aKey){ KeyBind.key("key.keyboard.a", true)}
        else{ KeyBind.key("key.keyboard.a", false)}
        if(sKey){ KeyBind.key("key.keyboard.s", true)}
        else{ KeyBind.key("key.keyboard.s", false)}
        if(dKey){ KeyBind.key("key.keyboard.d", true)}
        else{ KeyBind.key("key.keyboard.d", false)}
        //Chat.log("Normal x:" + destNormal[0] + " Normal z:" + destNormal[1])
        //Chat.log("W:" + wKey + " A:" + aKey + " S:" + sKey + " D:" + dKey)
        //reset keys for next tick
        wKey = false
        aKey = false
        sKey = false
        dKey = false
            
        spinTicks(1)
    }   
    
    
    //unbind all keyArrays
    for(let i = 0; i < keyArray.length; i++){
        KeyBind.key(keyArray[i], false)
    }
    KeyBind.key("key.keyboard.w", false)
    KeyBind.key("key.keyboard.a", false)
    KeyBind.key("key.keyboard.s", false)
    KeyBind.key("key.keyboard.d", false)
    return true
}
//Walk character towards x,z, stopping within tolerance limit
//If we get stuck, return false if we make it to dest we return true
function complexMoveToLocation(keyArray, xPos, zPos, yPos, tolerance){
    if(checkQuit()){
        return true
    }
    xPos = xPos + 0.5
    zPos = zPos + 0.5
    player.lookAt(xPos,yPos,zPos)
    spinTicks(5)
    keyString = "key.keyboard.w"
    
    //bind all keyArrays and move forward "w"
    KeyBind.key(keyString, true)
    for(let i = 0; i < keyArray.length; i++){
        KeyBind.key(keyArray[i], true)
    }
    lastX = player.getX()
    lastZ = player.getZ()
    while(Math.abs(Math.abs(player.getX()) - Math.abs(xPos)) > tolerance
        || Math.abs(Math.abs(player.getZ()) -  Math.abs(zPos)) > tolerance)
    {
        if(checkQuit()){
            return true
        }
            
            player.lookAt(xPos,yPos,zPos)
            if(player.getYaw() > 178 || player.getYaw() < -178){
                player.lookAt(180, player.getPitch())
            }
        spinTicks(1)
        if(player.getX() === lastX && player.getZ() === lastZ){
            return false
        }
        lastX = player.getX()
        lastZ = player.getZ()
    }

    //unbind all keyArrays and move forward "w"
    KeyBind.key(keyString, false)
    for(let i = 0; i < keyArray.length; i++){
        KeyBind.key(keyArray[i], false)
    }
    return true
}

//Walk character towards x,z, stopping within tolerance limit
function moveToLocation(xPos, zPos, yPos, tolerance){
    complexMoveToLocation([],xPos,zPos,yPos,tolerance)
}
/*    if(checkQuit()){
        return
    }
    xPos = xPos + 0.5
    zPos = zPos + 0.5
    Player.getPlayer().lookAt(xPos,yPos,zPos)
    spinTicks(5)
    keyString = "key.keyboard.w"
    
    KeyBind.key(keyString, true)
    //update player looking infrequently 
    updateLookCounter = 0
    updateLookFrequency = 10
    
    while(Math.abs(Math.abs(Player.getPlayer().getX()) - Math.abs(xPos)) > tolerance
        || Math.abs(Math.abs(Player.getPlayer().getZ()) -  Math.abs(zPos)) > tolerance)
    {
        if(checkQuit()){
            return
        }
        
        //updateLookCounter = updateLookCounter + 1
        //if(updateLookCounter >= updateLookFrequency){
            Player.getPlayer().lookAt(xPos,yPos,zPos)
            if(Player.getPlayer().getYaw() > 178
                || Player.getPlayer().getYaw() < -178){
                Player.getPlayer().lookAt(180, Player.getPlayer().getPitch())
            }
            updateLookCounter = 0
        //}
        
        spinTicks(1)
    }
    KeyBind.key(keyString, false)
}
*/ 
//end moveToLocation old code that was moved to complexMoveToLocation

//single interact call while looking at x,y
function simpleInteract(xLook, yLook){
    if(checkQuit()){
        return
    }
    Player.getPlayer().lookAt(xLook, yLook)
    spinTicks(10)
    Player.getPlayer().interact()
    spinTicks(10)
}

//look at x,y for ticks length
function simpleLook(xLook, yLook, ticks){
    if(checkQuit()){
        return
    }
    Player.getPlayer().lookAt(xLook, yLook)
    spinTicks(ticks)
}

//pan view angle from start x,y to end x,y over ticks length
function panLook(xStart, yStart, xEnd, yEnd, ticks){
    xDif = xEnd - xStart
    yDif = yEnd - yStart
    
    for(let i = 0; i < ticks; i++){
        if(checkQuit()){
            return
        }
        me.lookAt(xStart + (xDif *(i/ticks)), yStart + (yDif *(i/ticks)))
        spinTicks(1)
    } 
}

//activate mouse left
function startAttack(){
    if(checkQuit()){
        return
    }
    KeyBind.key("key.mouse.left", true)
}

//deactivate mouse left
function endAttack(){
    KeyBind.key("key.mouse.left", false)
    if(checkQuit()){
        return
    }
}
//deactivate mouse left
function stopAttack(){
    KeyBind.key("key.mouse.left", false)
    if(checkQuit()){
        return
    }
}

//activate mouse right
function startUse(){
    if(checkQuit()){
        return
    }
    KeyBind.key("key.mouse.right", true)
}

//deactivate mouse right
function endUse(){
    KeyBind.key("key.mouse.right", false)
    if(checkQuit()){
        return
    }
}

//deactivate mouse right
function stopUse(){
    KeyBind.key("key.mouse.right", false)
    if(checkQuit()){
        return
    }
}

//interact with chest at x,y, dumping items from slotstart for numslots
//refer to https://wiki.vg/Inventory for getting correct slot numbering
function chestItems(xLook, yLook, slotStart, numSlots){
    if(checkQuit()){
        return
    }
    
    //Look at chest and interact
    Player.getPlayer().lookAt(xLook,yLook)
    spinTicks(15)
    Player.getPlayer().interact()
    spinTicks(15)
    
    //get chest object
    chestInv = Player.openInventory()
    
    //dump items into chest from slotStart for numSlots 
    for(let i = slotStart; i < (slotStart + numSlots); i++){
        if(checkQuit()){
            break
        }
        chestInv.quick(i)
        spinTicks(6)
    }
    
    //close the chest object
    chestInv.close()
    if(checkQuit()){
        return
    }
    spinTicks(20)
}

//interact with chest at x,y, dumping all items from enum(check above) Chest type,
//and whether to dump into chest from player or dump into player from chest 
//refer to https://wiki.vg/Inventory for getting correct slot numbering
function chestAllItems(xLook, yLook, chestType, toChest){
    if(checkQuit()){
        return
    }
    
    //Look at chest and interact
    Player.getPlayer().lookAt(xLook,yLook)
    spinTicks(15)
    Player.getPlayer().interact()
    spinTicks(15)
    
    //get chest object
    chestInv = Player.openInventory()
    
    //Would be good to handle chest slots in a failsafe manor
    //Chat.log("Chest type is: " + chestInv.getType())
    //Chat.log("Total Slots is: " + chestInv.getTotalSlots())
    if(chestInv.getTotalSlots() == 90){
        chestType = DOUBLE_CHEST
    }
    if(chestInv.getTotalSlots() == 63){
        chestType = SINGLE_CHEST
    }
    //
    
    slotStart = 0
    numSlots = 36
    
    //set slots to dump items into chest from player
    if(toChest){
        if(chestType == SINGLE_CHEST){
            slotStart = 27
        }else if(chestType == DOUBLE_CHEST){
            slotStart = 54
        }
    }
    //set slots to dump items into player from chest
    else{
        if(chestType == SINGLE_CHEST){
            slotStart = 0
            numSlots = 27
        }else if(chestType == DOUBLE_CHEST){
            slotStart = 0
            numSlots = 54
        }
    }
    
    //do the work of emptying inventory
    for(let i = slotStart; i < (slotStart + numSlots); i++){
        if(checkQuit()){
            break
        }
        if(!chestInv.getSlot(i).isEmpty()){
            chestInv.quick(i)
            spinTicks(6)
        }
    }
    
    //close the chest object
    chestInv.close()
    if(checkQuit()){
        return
    }
    spinTicks(20)
}

//toss out items from slotStart for numslots while looking at x,y
//refer to https://wiki.vg/Inventory for getting correct slot numbering
function tossItems(xLook, yLook, slotStart, numSlots){
    if(checkQuit()){
        return
    }
    
    Player.getPlayer().lookAt(xLook, yLook)
    inv = Player.openInventory()
    spinTicks(10)
    
    for(i = slotStart; i < (slotStart + numSlots); i++)  
    {   
        if(checkQuit()){
            return
        }
        inv.click(i)
        spinTicks(10)
        inv.click(-999)
        spinTicks(10)
    }
}
//toss out items from slotStart for numslots while looking at x,y
//refer to https://wiki.vg/Inventory for getting correct slot numbering
function tossAllSpecificItems(itemArray, xLook, yLook){
    if(checkQuit()){
        return
    }
    
    Player.getPlayer().lookAt(xLook, yLook)
    inv = Player.openInventory()
    spinTicks(10)
    
    for(i = 0; i < inv.getTotalSlots(); i++)  
    {   
        if(checkQuit()){
            inv.close()
            return
        }
        currentItem = inv.getSlot(i)
        
        //iterate through item array item types and check for match on current item
        for(let j = 0; j < itemArray.length; j++){
            if(itemArray[j] == currentItem.getItemId()){
                inv.click(i)
                spinTicks(10)
                inv.click(-999)
                spinTicks(10)
                break
            }
        }
    }
}
//set selected hotbar to slotNumber
//refer to https://wiki.vg/Inventory for getting correct slot numbering
function selectHotbar(slotNumber){

    playerInv = Player.openInventory()
    playerInv.setSelectedHotbarSlotIndex(slotNumber)
    playerInv.close()
    spinTicks(5)
}

function nextHotbar(){
    playerInv = Player.openInventory()
    hotbarNumber = playerInv.getSelectedHotbarSlotIndex()
    hotbarNumber += 1
    if(hotbarNumber >= 9){
        hotbarNumber = 0
    }
    playerInv.setSelectedHotbarSlotIndex(hotbarNumber)
    playerInv.close()
}

//Looks through the inventory to check for a certain itemID existing
function inventoryContains(itemID){
    inventory = Player.openInventory()
    for(let i = 0; i < inventory.getTotalSlots(); i++){
        if(!inventory.getSlot(i).isEmpty()){
            if(inventory.getSlot(i).getItemID() === itemID){
                return true
            }
        }
    }
    return false
}

//helper function to get index of desired recipeName, if possible.
//players green recipe book must be open to work
function getRecipeIndex(recipeName){
    inv = Player.openInventory()
    numberOfRecipes = inv.getCraftableRecipes().size()
    if(inv.getCraftableRecipes().isEmpty()){
        return -1
    }
    for(let i = 0; i < numberOfRecipes; i++){
        if(inv.getCraftableRecipes().get(i).getId() == recipeName)
        {
            return i
        }
    }
    return -1
}

//If finding recipeName in recipe book, craft full stack once,
//    or all if craftAll is true
//players green recipe book must be open to work
function craftRecipe(recipeName, craftAll){
    do{
        recipeIndex = getRecipeIndex(recipeName)
        if(recipeIndex == -1){
            break
        }
        Player.openInventory().getCraftableRecipes().get(recipeIndex).craft(true)
        spinTicks(5)
        Player.openInventory().quick(0)
        spinTicks(5)
    }while(craftAll)
}

//turn some text into JSON text with included color
function simpleJSONString(text, color){
    return "{\"text\":\"" + text + "\",\"color\":\"" + color + "\"}"
}

//combine multiple JSON text strings together
//Would probably be wise to use a StringBuilder
function wrapJSONStringsTogether(JSONStringArray){
    completeJSONString = "["
    for(let i = 0; i < JSONStringArray.length; i++){
        completeJSONString = completeJSONString + JSONStringArray[i]
        if(i != (JSONStringArray.length - 1)){
            completeJSONString = completeJSONString + ","
        }
    }
    completeJSONString = completeJSONString + "]"
    return completeJSONString
}


//You can alias this files functions with a different name while exporting
//We don't do this because we are not pepega.
module.exports = {
//exporting variables
    SINGLE_CHEST: SINGLE_CHEST,
    DOUBLE_CHEST: DOUBLE_CHEST,
    player: player,
    quitKey: quitKey,
    quitFromFalling : quitFromFalling,
    quitFromFallingYLevel : quitFromFallingYLevel,
    getQuitKey : getQuitKey,
    setQuitKey : setQuitKey,
    saveTool: saveTool,
    toolSaveDurability: toolSaveDurability,
    replaceToolEnchantments: replaceToolEnchantments,
    eyeHeight : eyeHeight,
//exporting functions
    getSaveTool : getSaveTool,
    setSaveTool: setSaveTool,
    getQuitFromFalling : getQuitFromFalling,
    setQuitFromFalling : setQuitFromFalling,
    getQuitFromFallingYLevel : getQuitFromFallingYLevel,
    setQuitFromFallingYLevel : setQuitFromFallingYLevel,
    getEyeHeight : getEyeHeight,
    getToolSaveDurability : getToolSaveDurability,
    setToolSaveDurability : setToolSaveDurability,
    getToolDurability: getToolDurability,
    swapDamagedTool : swapDamagedTool,
    checkQuit: checkQuit,
    spinTicks: spinTicks,
    simpleMove: simpleMove,
    complexMove: complexMove,
    WASDToLocation : WASDToLocation,
    complexMoveToLocation : complexMoveToLocation,
    moveToLocation : moveToLocation,
    simpleInteract: simpleInteract,
    simpleLook: simpleLook,
    panLook: panLook,
    startAttack: startAttack,
    endAttack: endAttack,
    stopAttack: stopAttack,
    startUse: startUse,
    endUse: endUse,
    stopUse: stopUse,
    chestItems: chestItems,
    chestAllItems: chestAllItems,
    tossItems: tossItems,
    tossAllSpecificItems : tossAllSpecificItems,
    selectHotbar: selectHotbar,
    nextHotbar: nextHotbar,
    inventoryContains: inventoryContains,
    getRecipeIndex : getRecipeIndex,
    craftRecipe: craftRecipe,
    simpleJSONString : simpleJSONString,
    wrapJSONStringsTogether : wrapJSONStringsTogether
}
