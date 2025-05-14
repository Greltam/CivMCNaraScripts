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
text = event.text.getStringStripFormatting()
textArray = text.split(" ")

for(let i = 0; i < textArray.length; i++){
    if(textArray[i] == disconnectPhrase){
        Chat.log("DisconnectPhrase")
        
        isRealSnitchEvent = false
        iPositionOfCoords = i+1
        
        //look for a [ in the next 2 spots
        if(textArray.length >= i+3)
        {
            if(textArray[i+1].startsWith("[")){
                Chat.log(textArray[i+1])
                Chat.log("OneSplit")
                isRealSnitchEvent = true
                iPositionOfCoords = i+1
            }
            if(textArray[i+2].startsWith("[")){
                Chat.log(textArray[i+2])
                Chat.log("TwoSplit")
                isRealSnitchEvent = true
                iPositionOfCoords = i+2
            }            
        }
        
        if(isRealSnitchEvent){
        /*
            *Old: Jukes and Noteblocks have different outputs
            find snitch coords
            //next i+1 should be [world or [world_nether
            //then i+2 = x
            //then i+3 = y
            //then i+4 = z]
        */
            xTextSplit = textArray[iPositionOfCoords].split("[")
            snitchX = Number(xTextSplit[1])
            //snitchX = Number(textArray[iPositionOfCoords])
            //Chat.log("sX " + snitchX)
            
            snitchY = Number(textArray[iPositionOfCoords + 1])
            //Chat.log("sY " + snitchY)
            
            zTextSplit = textArray[iPositionOfCoords + 2].split("]")
            snitchZ = Number(zTextSplit[0])
            //Chat.log("sZ " + snitchZ)
            
            deltaX = snitchX - Player.getPlayer().getX()
            deltaY = snitchY - Player.getPlayer().getY()
            deltaZ = snitchZ - Player.getPlayer().getZ()
            
            //clean up with Math.abs()?
            //Player is within snitch, fire kill snitch
            if(deltaX >= -13 && deltaX <= 13 &&
                deltaY >= -13 && deltaY <= 13 &&
                deltaZ >= -13 && deltaZ <= 13)
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
