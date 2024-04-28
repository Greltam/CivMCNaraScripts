// Walking is a pain, let automation take the pain away!
/*
    Walking script
    Written by Greltam 8/28/2022
    
    Player can adjust script to either walk, run, jump, eat,
    and iceroad(a combination of all) as they need. 
    Have food as your item selected if eating is toggled to true
*/

/*------------------------
    Global Variables Start
------------------------*/
// true
// false
//iceroading. Player needs to sprint, jump, and eat to traverse iceroads.
//will toggle sprinting, jumping, and eating to true regardless of other variables
iceroading = true

//enable sprinting
sprinting = false
//enable jumping
jumping = false
//enable eating
eating = false
//short circuit key to quit crafting early
quitKey = "key.keyboard.s"

/*-----------------------
    Global Variables End
-----------------------*/

/*-------------------
    Functions Start
-------------------*/

function checkQuit(){
    if(KeyBind.getPressedKeys().contains(quitKey)){
        return true
    }
    return false
}
/*-------------------
    Functions End
-------------------*/

/*-------------------
    Program Start
-------------------*/


Chat.log("Forward start")
Chat.log("Press: " + quitKey + " to end script")
while(!checkQuit()){
    if(sprinting || iceroading){
        KeyBind.key("key.keyboard.left.control", true)
    }
    
    KeyBind.key("key.keyboard.w", true)
    
    if(eating || iceroading){
        KeyBind.key("key.mouse.right", true)
    }
    if(jumping || iceroading){
        KeyBind.key("key.keyboard.space", true)
        Client.waitTick(1)
        KeyBind.key("key.keyboard.space", false)
        Client.waitTick(1)
    }
    else{
        Client.waitTick(1)
    }
    
}

//turn off bound keys to exit script
KeyBind.key("key.keyboard.w", false)
KeyBind.key("key.keyboard.left.control", false)
KeyBind.key("key.keyboard.space", false)
KeyBind.key("key.mouse.right", false)

Chat.log("Forward over")

/*-------------------
    Program End
-------------------*/
