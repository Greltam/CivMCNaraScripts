//Zeal Exclave Cocoa Tower Script
/*
    !!! Script starts at 4209, 80, 417 !!!
    Find 1.2 Player Configurables to adjust for script restarts

    Zeal Exclave Cocoa Tower on CivMC @ 4207, 80, 417
    Written by Greltam 5/2/2024

    Tab-outable.
*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: Open trapdoors for each cocoa tower. They should block you
//    from walking forward on the glass panes
//Cocoa is not affected by fortune, so hold anything aside from the stick
//Restarting: Unfortunately don't have restarts set up yet.

//Collector: In front of the entrance to each tower is a trapdoor to
//    enter the collection area
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
//set item list and look vector for tossing items into collector
//util.setTossItemList(["minecraft:potato","minecraft:poisonous_potato"])
//util.setTossLookVector([90,-25])

//alter the default quitkey from j to whatever you want.
util.setQuitKey("key.keyboard.j") //default: util.setQuitKey("key.keyboard.j") 


secondsToClimb = 45
secondsToFall = 36
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*------------------------
   2 Global Variables Start
------------------------*/
farmName = "Zeal Exclave Cocoa Tower"
regrowthTime = 24 * 3600 //hours multiplied by seconds per hour

//Player starts script at this location
xStartPosition = 4209 
zStartPosition = 417
yStartPosition = 80
/*-----------------------
   2 Global Variables End
-----------------------*/

/*------------------------
   2.1 Formatted Strings Start
------------------------*/
greetingsText = Chat.createTextHelperFromJSON(
    util.wrapJSONStringsTogether([
        util.simpleJSONString("Dalgon Exclave", "dark_red"),
        util.simpleJSONString(" Cocoa", "red"),
        util.simpleJSONString(" Tower", "gray"),
        util.simpleJSONString(", booting", "gold")
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
        util.simpleJSONString("Dalgon Exclave", "dark_red"),
        util.simpleJSONString(" Cocoa", "red"),
        util.simpleJSONString(" Tower", "gray"),
        util.simpleJSONString(", shutting down...", "red")
    ])
)
    
/*-----------------------
   2.1 Formatted Strings End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/

function flipTrapdoor(xAngle){
    if(util.checkQuit()){
        return
    }
    util.simpleInteract(xAngle,30)
}

//new harvest type, up harvests 2 columns, down harvests 1 column
function newHarvest(xAngle){
    if(util.checkQuit()){
        return
    }
    util.startUse()
    util.simpleMove("key.keyboard.space",
        xAngle - 47,23,secondsToClimb*20)
    util.endUse()
    
    util.startUse()
    util.simpleMove("",xAngle - 90,23,secondsToFall*20)
    util.endUse()
}
function cornerHarvest(xAngle){
    if(util.checkQuit()){
        return
    }
    util.startUse()
    util.simpleMove("key.keyboard.space",
        xAngle - 45,0,secondsToClimb*20)
    util.endUse()
    
    util.startUse()
    util.simpleMove("",xAngle - 12.5,0,secondsToFall*20)
    util.endUse()
    
    util.startUse()
    util.simpleMove("key.keyboard.space",
        xAngle + 30,0,secondsToClimb*20)
    util.endUse()
    
    util.startUse()
    util.simpleMove("",xAngle + 55,0,secondsToFall*20)
    util.endUse()
}

function middleHarvest(xAngle){
    if(util.checkQuit()){
        return
    }
    util.startUse()
    util.simpleMove("key.keyboard.space",
        xAngle - 12.5,0,secondsToClimb*20)
    util.endUse()
    
    util.startUse()
    util.simpleMove("",xAngle + 30,0,secondsToFall*20)
    util.endUse()
}

function sideHarvest(xAngle){
    if(util.checkQuit()){
        return
    }
    util.simpleMove("key.keyboard.w",xAngle,0,2*20)
    newHarvest(xAngle)
    flipTrapdoor(xAngle)
    
    util.simpleMove("key.keyboard.w",xAngle,0,2*20)
    newHarvest(xAngle)
    flipTrapdoor(xAngle)
    
    util.simpleMove("key.keyboard.w",xAngle,0,2*20)
    newHarvest(xAngle)
    flipTrapdoor(xAngle)
    
    util.simpleMove("key.keyboard.w",xAngle,0,2*20)
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


//Chat.log("REVing up Cocoa Bean Engines")
//Chat.log("Hold \"J\" to exit")

sideHarvest(0)
sideHarvest(-90)
sideHarvest(180)
sideHarvest(90)

//Chat.log("Done Cocoa Beaning")


//Reset keybinds to prevent phantom key holds.
util.resetKeys()

Chat.log(finishedText)
util.logScriptEnd(farmName, regrowthTime)

/*-------------------
   4 Program End
-------------------*/

