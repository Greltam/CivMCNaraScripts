/*------------------------
   0 Title Start
------------------------*/
/*
    Name: Zeal Bulk Enchanting Script on CivMC
    Location: CivMC @ 3084, 5139, 84
    Author: Greltam
    Date: 9/19/2025
    
    Description: A service to bulk enchant items
    
    Directions:
        Enter GSEZ Main Building
        Enter Diamond Tool Factory Room @ 3100, 5148, 84
        Stand next to Enchanting Table @ 3840.500, 5139.300, 84
        Activate Script
*/
/*------------------------
   0 Title End
------------------------*/

/*------------------------
   0.1 Player Requirements Start
------------------------*/
/*
    Pre-Start actions: 
        Fill Left DC with items to enchant
        Fill Left Barrel with Emeralds
        Fill Right Barrel with Lapis
        
    Stand at 3840.500, 5139.300, 84
        centered right next to enchanting table

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

/*------------------------
   2 Global Variables Start
------------------------*/
//amount of emeralds to consume per enchant
emeraldsToUse = 16

//which level to enchant on the enchanting table
enchantingLevel = 3
desiredLevel = 30
if(enchantingLevel == 1){
    desiredLevel = 10
}
if(enchantingLevel == 2){
    desiredLevel = 21
}

//starting slot for items to enchant
enchantingSlotStart = 30

continueCrafting = true
forEnchantingChest = 1
enchantingSlot = 0
emeraldSlot = 0
lapisSlot = 0
/*-----------------------
   2 Global Variables End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/
function getItemsForEnchanting(){
    if(util.checkQuit()){
        return false
    }
    
    //move hotbar to slot 8
    util.selectHotbar(8)
    //get chest items for enchanting
    if(forEnchantingChest == 1){
        util.chestItems(90,60,enchantingSlot,8)
        enchantingSlot = enchantingSlot + 8
        if(enchantingSlot >= 54){
            enchantingSlot = 0
            forEnchantingChest = 2
        }
    }
    /*
    else if(forEnchantingChest == 2){
        util.chestItems(145,30,enchantingSlot,8)
        enchantingSlot = enchantingSlot + 8
        if(enchantingSlot >= 54){
            enchantingSlot = 0
            forEnchantingChest = 3
        }
    }
    */
    else{
        return false
    }
    
    return true
}

function getEmeralds(){
    if(util.checkQuit()){
        return false
    }

    //pick up 2 stacks of emeralds for 8 items
    util.chestItems(122,48,emeraldSlot,2)
    emeraldSlot = emeraldSlot + 2
    if(emeraldSlot >= 26){
        return false
    }
    return true
}

function getLapis(){
    if(util.checkQuit()){
        return false
    }

    //pick up 1 stack of lapis
    util.selectHotbar(8)
    util.chestItems(-122,48,lapisSlot,1)
    lapisSlot = lapisSlot + 1
    if(lapisSlot >= 26){
        return false
    }
    return true
}

function gainXP(){
    if(util.checkQuit()){
        return false
    }
    //move hotbar to slot 0
    util.selectHotbar(0)
    //check if holding emeralds
    heldItem = util.getItemInSelectedHotbar()
    
    //if we don't have emeralds
    if(heldItem.getItemId() != "minecraft:emerald"){
        //move from inventory to hotbar
        util.moveItemToHotbar("minecraft:emerald",0)
    }
    
    //we STILL don't have emeralds
    heldItem = util.getItemInSelectedHotbar()
    if(heldItem.getItemId() != "minecraft:emerald"){
        return false
    }
    
    //we do have emeralds
    heldItem = util.getItemInSelectedHotbar()
    if(heldItem.getItemId() == "minecraft:emerald"){
        //starting amount of emeralds
        itemNumber = heldItem.getCount()
        
        //try to quick use xp, but not use over desired amount
        util.smoothLookAt(-180,0)
        for(k = 0; k < emeraldsToUse - 2; k++){
            if(Player.getPlayer().getXPLevel() >= desiredLevel){
                return true
            }
            util.key(useKey,true)
            util.spinTicks(2)
            util.key(useKey,false)
            util.spinTicks(2)
        }
        
        attempts = 0
        //use an emerald and check if we've used the correct amount
        while(itemNumber < heldItem.getCount() + emeraldsToUse){
            if(util.checkQuit()){break}
            if(Player.getPlayer().getXPLevel() >= desiredLevel){
                return true
            }
            util.simpleMove(useKey, -180, 0, 2)
            util.spinTicks(8)
            heldItem = util.getItemInSelectedHotbar()
            
            //give up trying to emerald if we just aren't getting it
            attempts = attempts + 1
            if(attempts >= emeraldsToUse * 3){
                return false
            }
        }
    }
    return true
}

function enchantItem(slotToEnchant){
    if(util.checkQuit()){
        return false
    }
    //move lapis to hotbar so we can open enchanting table
    //move hotbar to slot 0
    util.selectHotbar(0)
    util.moveItemToHotbar("minecraft:lapis_lazuli",0)
    util.spinTicks(10)
    
    util.smoothLookAt(180,50)
    Player.getPlayer().interact()
    util.spinTicks(15)

    //check if player is using an Enchanting Table
    inventory = Player.openInventory()
    Chat.log("Inventory Type: " + inventory.getType())
    if(inventory.getType() != "Enchanting Table"){
        return false
    }
    
    //Move item to enchanting table
    inventory.quick(slotToEnchant)
    util.spinTicks(10)
    
    //Move lapis to enchanting table
    inventory.quick(29)
    util.spinTicks(10)
    
    //enchant enchantingLevel
    inventory.doEnchant(enchantingLevel-1)
    util.spinTicks(10)
    
    inventory.close()
    return true
}

function dumpEnchantedItems(){
    if(util.checkQuit()){
        return false
    }
    //move hotbar to slot 8
    util.selectHotbar(8)
    //chest items from hotbar into double chest
    util.chestAllItems(-90,60, util.DOUBLE_CHEST, true)
    //util.chestItems(-90,60,54,36)
    return true
}

function dumpLapis(){
    if(util.checkQuit()){
        return false
    }
    //chest golden nuggets
    //move hotbar to slot 8
    util.selectHotbar(8)
    util.chestSpecificItems(-122,48,
        "minecraft:lapis_lazuli", true)
    return true
}


/*-------------------
   3 Functions End
-------------------*/

/*-------------------
   4 Program Start
-------------------*/

Chat.log("Zeal Bulk Enchanting Services Initializing.")
//Chat.log("(Must have green recipe book open)")
Chat.log("Press: " + util.getQuitKey() + " to end script")
//for each 7 sets of 8 items in the toEnchant chest
for(i = 0; i < 7; i++){
    Chat.log("i = " + i)
    if(util.checkQuit()){
        break
    }
    if(!getItemsForEnchanting()){
        break
    }
    if(!getEmeralds()){
        break
    }
    if(!getLapis()){
        break
    }
    //Enchant the 8 items picked up
    for(j = 0; j < 8; j++){
        if(!gainXP()){
            break
        }
        if(!enchantItem(enchantingSlotStart + j)){
            break
        }
    }
    
    if(!dumpLapis()){
        break
    }
    if(!dumpEnchantedItems()){
        break
    }
}
Chat.log("Try our ZealCo 1.50i porkchops on the way out.")

/*-------------------
   4 Program End
-------------------*/
