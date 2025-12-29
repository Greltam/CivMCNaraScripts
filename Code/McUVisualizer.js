/*
    Visualizer File for Greltam's JSMacro Scripts on CivMC
    Written on 8/28/2025 by Greltam
*/

/*
    //add this line at the top of a program file to access these functions
    const visual = require("./McUVisualizer.js")
    
*/

    textList = []
    defaultColor = 0xffffff
    defaultShadow = true

function addText(keyName, text){
//Add a new Draw2D surface with text

    try{
        textBox = Hud.createDraw2D()
        textBox.register()
        textBox.addText(text, 0,0, defaultColor, defaultShadow)
        
        textList.push([keyName, textBox])
    }catch(error){
        Chat.log("Could not add text for " + keyName)
    }
}

function setText(keyName, replaceText){
//change the text of a text item
    try{
        //iterate over draw list
        for(let i = 0; i < textList.length; i++){
            
            //found a key name
            if(textList[i][0] == keyName){
            
                //move from list
                text = textList[i][1].getTexts().get(0)
                text.setText(replaceText)
                return
            }
        }
    }catch(error){
        Chat.log("Could not set text for " + keyName)
    }
}

function colorText(keyName, color){
//change the color of a text item

    try{
        //iterate over draw list
        for(let i = 0; i < textList.length; i++){
            
            //found a key name
            if(textList[i][0] == keyName){
            
                //move from list
                text = textList[i][1].getTexts().get(0)
                text.setColor(color)
                return
            }
        }
    }catch(error){
        Chat.log("Could not change color for " + keyName)
    }
}

function moveText(keyName, x, y){
//move the x,y coordinates of a text item

    try{
        //iterate over draw list
        for(let i = 0; i < textList.length; i++){
            
            //found a key name
            if(textList[i][0] == keyName){
            
                //move from list
                text = textList[i][1].getTexts().get(0)
                text.setX(x)
                text.setY(y)
                return
            }
        }
    }catch(error){
        Chat.log("Could not move position for " + keyName)
    }
}

function fullText(keyName, text, color, x, y){

    try{
        textBox = Hud.createDraw2D()
        textBox.register()
        textBox.addText(text, x, y, color, defaultShadow)
        
        textList.push([keyName, textBox])
    }catch(error){
        Chat.log("Could not create " + keyName)
    }
}

function remove(keyName){
//removes a Draw2D surface using key

    try{
        //iterate over text list
        for(let i = 0; i < textList.length; i++){
            
            //found a key name
            if(textList[i][0] == keyName){
            
                //remove from list
                textList[i][1].unregister()
                textList.splice(i,1)
                return
            }
        }
    }catch(error){
        Chat.log("Could not remove " + keyName)
    }
    
    //iterate over rect list
    //iterate over texture list
}

function clear(){
//remove every Draw2D from drawlist
    Hud.clearDraw2Ds()
    /*
    //iterate over text list
    for(let i = 0; i < textList.length; i++){
    
        //remove from list
        textList[i][1].unregister()
        textList.splice(i,1)        
    }
    */
    
    //iterate over rect list
    //iterate over texture list
}

//You can alias this files functions with a different name while exporting
//We don't do this because we are not pepega.
module.exports = {
//exporting variables 
    addText : addText,
    setText : setText,
    colorText : colorText,
    moveText : moveText,
    fullText : fullText,
    remove  : remove,
    clear   : clear
}
/*
drawing = Hud.createDraw2D()
drawing1 = Hud.createDraw2D()
drawing.register()
drawing1.register()
//drawing.init()
drawing.addText("Stuff", 0,0,0xffffff,true)
drawing1.addText("Stuff", 300,20,0xffffff,true)
//drawing.setVisible(true)
Client.waitTick(40)
drawing.unregister()
drawing1.unregister()
*/
