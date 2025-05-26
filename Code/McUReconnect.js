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

/*-------------------
   3 Functions Start
-------------------*/


/*-------------------
   3 Functions End
-------------------*/

function restartFarmScripts(){
    if(GlobalVars.getBoolean("delayZealOak")){
        JsMacros.runScript("McOakHiTechChop.js")
    }
    if(GlobalVars.getBoolean("delayetherStem")){
        JsMacros.runScript("McNetherStemTower.js")
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
        while(!(hours >= 3 && hours <= 4)){
            //every half hour see if we are between 3am and 4am
            Client.waitTick(1800 * 20)
            
            //refresh current datetime
            date = new Date()
            hours = date.getHours()
        }
        //it is after server reset time so we reconnect
    }
    else{
        //try to connect every 20 seconds
        Client.waitTick(20 * 20)
    }
    
    //If a disconnect has occured due to a KillSnitchEngage snitch msg
    if(GlobalVars.getBoolean("killsnitch")){
        //reset killswitch so reconnection will occur
        //next time player manually joins
        GlobalVars.putBoolean("killsnitch",false)
        Client.waitTick(20)
        break
    }
    
    //check to see if we are loaded in already
    //meant to prevent having multiple scripts spam connecting
    if(!World.isWorldLoaded()){
        Client.connect("play.civmc.net")
    }
    else{
        hasReconnected = true
        restartFarmScripts()
    }
}

Chat.log("We have reconnected!")

/*-------------------
   4 Program End
-------------------*/
