// Reconnection Script
/*
    Written by Greltam 3/12/2025
    
    Reconnecting to the server is most useful for afking while
    over a server reset. We must also be aware of purposeful
    disconnections like from the KillSnitchEngage to prevent
    opps killing us while afk.

*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: In the JSMacros GUI, go to the Events tab at the top
//    Create a new Macro with Disconnect as the event with this as
//    the script and enable.

/*-----------------------
   0.1 Player Requirements to Start End
-----------------------*/

/*------------------------
   1.1 Import Files Start
------------------------*/
const config = require("./McUConfigFile.js")
config.initialize()

/*-----------------------
   1.1 Import Files End
-----------------------*/

/*------------------------
   1.2 Player Configurables Start
------------------------*/
//player control initialization
delayStartHour = 3 // default: "key.keyboard.j"
delayStartHour = config.getValue("delayStartHour", delayStartHour)

serverName = "play.civmc.net"
//serverName = "mini.civmc.net"

hasReconnected = false

/*-----------------------
   1.2 Player Configurables End
-----------------------*/
/*-------------------
   3 Functions Start
-------------------*/


/*-------------------
   3 Functions End
-------------------*/
function getDirectory(){

    rawPath = FS.toRawPath("McUReconnect.js")
    path = rawPath.toString()
    
    subPath = path.split("\\Macros\\")
    //subPath[0] should be all the .../.minecraft/config/jsmacros
    //subPath[1] should be the subdirectory(s)/"vDaisyTwistingWart.js"
    
    subSplit = subPath[1].split("McUReconnect.js")
    return subSplit[0]
}

function playerAt(x,z,y){
    playerX = Math.floor(Player.getPlayer().getX())
    playerY = Math.floor(Player.getPlayer().getY())
    playerZ = Math.floor(Player.getPlayer().getZ())
    
    if(playerX == x && playerY == y && playerZ == z){
        return true
    }
    return false
}

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
    //Daisy chained farm scripts first
    if(GlobalVars.getBoolean("daisyGNC") || playerAt(2293, 8099, 2)){
        GlobalVars.putBoolean("daisyGNC",false)
        return "vDaisyTwistingWart.js"
    }
    
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

function restartFarmScripts(){
    Chat.log("Attempting to restart farming")
    //if we've delayed the start a farm 
    //or were in the middle of one that was interrupted
    if(GlobalVars.getBoolean("delayFarm") ||
        GlobalVars.getBoolean("farmRunning"))
    {
        //Do location based farm restarts
        farmName = locateFarm(Player.getPlayer().getX(),
                              Player.getPlayer().getZ())

    if(farmName == "null"){
            Chat.log("No Farm found")
            return
        }
        else{
            Chat.log(farmName + " found, restarting...")
            JsMacros.runScript(getDirectory() + farmName)
        }
    }
}

/*-------------------
   4 Program Start
-------------------*/

Chat.log("We've been Disconnected")
while(!hasReconnected){
    
    if(GlobalVars.getBoolean("delayFarm")){
        Chat.log("Delayed Farming for: " + delayStartHour)
        
        date = new Date()
        hours = date.getHours()
        
        while(hours != delayStartHour){
            //every 10 minutes see if we are at the starting hour
            Client.waitTick(600 * 20)
            
            //refresh current datetime
            date = new Date()
            hours = date.getHours()
        }
        Chat.log("Delay ended")
        //it is at the delayed starting hour so reconnect
    }
        
    //If a disconnect has occured due to a KillSnitchEngage snitch msg
    if(GlobalVars.getBoolean("killsnitch")){
    
        //reset killswitch so future reconnections will occur
        //next time player manually joins
        GlobalVars.putBoolean("killsnitch",false)
        Client.waitTick(20)
        Chat.log("Kill snitched")
        
        //Don't reconnect further down
        break
    }
    
    //Check every 20 seconds for a server ping
    do{
        Chat.log("Waiting to ping...")
        Time.sleep(20 * 1000)
    }while(!Client.ping(serverName).isOnline())    
    Chat.log(serverName + " pinged online.")

    //Try to reconnect to the server
    while(!World.isWorldLoaded()){
        Chat.log("Attempting to reconnect to " + serverName)
        Client.connect(serverName)
        Time.sleep(20 * 1000)
    }    
    Chat.log(serverName + " world loaded.")
    
    //We have connected to a world, restart farms and break out
    hasReconnected = true
    restartFarmScripts()
}

Chat.log("We have reconnected!")

/*-------------------
   4 Program End
-------------------*/
