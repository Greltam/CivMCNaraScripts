// Kill Snitch Engage Script
/*
    Written by Greltam 3/12/2025
    
    It is required when afking on CivMC that the player can
    automatically be disconnected from the server when an Opp
    is located in the vicinity. 
    
    Here we are listening for a message from a snitch that has the
    Operand KILLSNITCHENGAGE. In order to streamline this use we
    need to check if the player is inside of the coordinates from
    the killswitch snitch. 
    
    Interactions: There is a Reconnect script that we need to
    somehow pass information that the disconnect has occured from
    this killsnitch script. 

*/
/*------------------------
   0.1 Player Requirements to Start
------------------------*/

//Directions: In the JSMacros GUI, go to the Events tab at the top
//    Create a new Macro with RecvMessage as the event with this as
//    the script and enable.

//To use: Create a Snitch with the name KILLSNITCHENGAGE at your
//        afk spot. You can also edit disconnectPhrase in 1.2 Player
//        Configurables for your own snitch naming method
/*-----------------------
   0.1 Player Requirements to Start End
-----------------------*/
/*------------------------
   1.2 Player Configurables Start
------------------------*/

//snitch name to activate disconnect
disconnectPhrase = "KILLSNITCHENGAGE"   //default: "KILLSNITCHENGAGE" 

/*-----------------------
   1.2 Player Configurables End
-----------------------*/

/*-------------------
   4 Program Start
-------------------*/
text = event.text.getString()
textArray = text.split(" ")

for(let i = 0; i < textArray.length; i++){
    if(textArray[i] == disconnectPhrase){
        //most likely for a snitch
        if(textArray.length >= i+4){
        /*
            find snitch coords
            //next i+1 should be [world or [world_nether
            //then i+2 = x
            //then i+3 = y
            //then i+4 = z]
        */
            snitchX = Number(textArray[i+2])
            snitchY = Number(textArray[i+3])
            zTextSplit = textArray[i+4].split("]")
            snitchZ = Number(zTextSplit[0])
            
            deltaX = snitchX - Player.getPlayer().getX()
            deltaY = snitchY - Player.getPlayer().getY()
            deltaZ = snitchZ - Player.getPlayer().getZ()
            
            //clean up with Math.abs()?
            //Player is within snitch, fire kill snitch
            if(deltaX >= -11 && deltaX <= 11 &&
                deltaY >= -11 && deltaY <= 11 &&
                deltaZ >= -11 && deltaZ <= 11)
            {
                Chat.log("KILLSNITCHENGAGED")
                GlobalVars.putBoolean("killsnitch", true)
                Chat.say("/logout")
                Client.waitTick(400)
                Client.disconnect() 
            }
        }
    }
}
/*-------------------
   4 Program End
-------------------*/
