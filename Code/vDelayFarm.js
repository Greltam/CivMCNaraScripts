/*

    Player must have McUReconnect turned on correctly. 
    Consult McUReconnect for directions

    Directions: 
        Check the directions for the farm you are going to run.
        Fulfill all prerequirements
        Get into the farm's starting position
        Run this vDelayFarm script    

*/
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
delayStartHour = 3 // default: 3
logDiscord = true // default: "true"

delayStartHour = config.getValue("delayStartHour", delayStartHour)
logDiscord = config.getBool("logDiscord", logDiscord)
/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*-------------------
   3 Functions Start
-------------------*/

function insideOf(x1,z1,x2,z2,x,z){

    if(x >= x1 &&
       x <= x2 &&
       z >= z1 &&
       z <= z2){
       
       return true
    }

    return false
}

function locateFarm(x,z){
    
    //Coords for Oak farm
    if(insideOf(2863,5114,2959,5203,x,z)){
        return "McOakHiTechChop.js"
    }
    
    //Coords for Carrot farm
    if(insideOf(2974,5105,3007,5138,x,z)){
        return "McCarrotTower.js"
    }
    
    //Coords for Wheat farm
    if(insideOf(3021,5105,3055,5139,x,z)){
        return "McWheatTower.js"
    }
    
    //Coords for McBeachaEastMelonTower farm
    if(insideOf(3994,7337,4021,7380,x,z)){
        return "McBeachaEastMelonTower.js"
    }
    
    //Coords for Potato Tower farm
    if(insideOf(3994,7386,4024,7415,x,z)){
        return "McPotatoTower.js"
    }
    
    //Coords for Sweet berry farm
    if(insideOf(3949,7426,3984,7457,x,z)){
        return "McSweetBerry.js"
    }
    
    //Coords for Zeal Melon farm
    if(insideOf(3952,7372,3988,7390,x,z)){
        return "McZealWestMelonTower.js"
    }
    
    //Coords for Cocoa Tower farm
    if(insideOf(4208,417,4223,479,x,z)){
        return "McCocoaTower.js"
    }
    
    //Coords for Netherwart Tower farm
    if(insideOf(2270,8095,2290,8145,x,z)){
        return "McNetherwart.js"
    }
    //Coords for Twisting Vines Tower farm
    if(insideOf(2290,8095,2340,8145,x,z)){
        return "McTwistingVines.js"
    }
    //Coords for Nether Stem Tower farm
    if(insideOf(2200,8095,2267,8145,x,z)){
        return "McNetherStemTower.js"
    }
    
    
    //couldn't find a farm
    return "null"
}
/*-------------------
   3 Functions End
-------------------*/

farmName = locateFarm(Player.getPlayer().getX(),
                      Player.getPlayer().getZ())
                      
GlobalVars.putInt("delayStartHour",delayStartHour)
GlobalVars.putBoolean("delayFarm", true)

Chat.log("Delayed start for: " + farmName)
Chat.log("Reconnecting at: " + delayStartHour)

date = new Date()
hours = date.getHours()
waitHours = 0
if(delayStartHour >= hours){
    waitHours = delayStartHour - hours
}
else{
    waitHours = 24 - hours + delayStartHour
}
if(logDiscord){
    Chat.say("/g ZealFarm Delaying start of " + farmName
        + " in " + waitHours + " hours.")
}
util.spinTicks(10)
Chat.say("/logout")
