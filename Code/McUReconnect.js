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
delayStartHour = 3 // default: 3

delayStartHour = config.getValue("delayStartHour", delayStartHour)

/*-----------------------
   1.2 Player Configurables End
-----------------------*/
/*-------------------
   3 Functions Start
-------------------*/


/*-------------------
   3 Functions End
-------------------*/

function getScriptFile(directory, fileToSearch){

    filesList = FS.list(directory)
    
    Chat.log("Directory = " + directory)
    
    //check for file in current directory
    for(i = 0; i < filesList.length; i++){
        if(filesList[i] == fileToSearch){
            rawPath = FS.toRawPath(directory + filesList[i])
            path = rawPath.toString()
            subPath = path.split("\\Macros\\")
            return subPath[1]
        }
    }
    
    //didn't find the file, check current directory
    //for subdirectories and querry if they have the file
    for(i = 0; i < filesList.length; i++){
        fileLocation = directory + filesList[i]
        if(FS.isDir(fileLocation)){
        
            //check the directory for farm script
            return getScriptFile(fileLocation, fileToSearch)
        }
    }
    
    return "notFound"
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
    //if we've delayed the start a farm 
    //or were in the middle of one that was interrupted
    if(GlobalVars.getBoolean("delayFarm") ||
        GlobalVars.getBoolean("farmRunning"))
    {
        //Do location based farm restarts
        farmName = locateFarm(Player.getPlayer().getX(),
                              Player.getPlayer().getZ())
        if(farmName == "null"){
            return
        }
        else{
            farmFile = getScriptFile("", farmName)
            JsMacros.runScript(farmFile)
        }
    }
}

/*-------------------
   4 Program Start
-------------------*/
hasReconnected = false

while(!hasReconnected){
    
    if(GlobalVars.getBoolean("delayFarm")){
        
        date = new Date()
        hours = date.getHours()
        
        while(hours != delayStartHour){
            //every 10 minutes see if we are at the starting hour
            Client.waitTick(600 * 20)
            
            //refresh current datetime
            date = new Date()
            hours = date.getHours()
        }
        //it is at the delayed starting hour so reconnect
    }
    
    //try to connect every 20 seconds
    Client.waitTick(20 * 20)
    
    //If a disconnect has occured due to a KillSnitchEngage snitch msg
    if(GlobalVars.getBoolean("killsnitch")){
    
        //reset killswitch so reconnection will occur
        //next time player manually joins
        GlobalVars.putBoolean("killsnitch",false)
        Client.waitTick(20)
        
        //Don't reconnect further down
        break
    }
    
    //check to see if we are loaded in already
    //meant to prevent having multiple scripts spam connecting
    if(!World.isWorldLoaded()){
        //Client.connect("mini.civmc.net")
        Client.connect("play.civmc.net")
    }
    else{
        //We have connected to a world
        hasReconnected = true
        restartFarmScripts()
    }
}

Chat.log("We have reconnected!")

/*-------------------
   4 Program End
-------------------*/
