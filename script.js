const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext("2d")
const scoreBox = document.getElementById('score_box')
const canvasSize = 500
const arenaSize = 25
const pixelSize = canvasSize / arenaSize
const fps = 15
const fruitRandomPar = 4
const DeathWhenTouchBorder = false
const colorPallet = {
    'snake': 'brown',
    'food': 'orange'
}

let score = 0

var direction = 'a'
var pressed
var snakeBody = []
var fruitCoords = []


{ // Set the canvas size
    canvas.style.height = canvasSize + 'px'
    canvas.style.width = canvasSize + 'px'
    canvas.width = canvasSize
    canvas.height = canvasSize
}

document.onkeydown = (c)=>{
    let k = c.key
    if(k == "ArrowLeft" && direction != 'ArrowRight'){
        pressed = k
    } else if(k == "ArrowRight" && direction != 'ArrowLeft'){
        pressed = k
    } else if(k == "ArrowUp" && direction != 'ArrowDown'){
        pressed = k
    } else if(k == "ArrowDown" && direction != 'ArrowUp'){
        pressed = k
    }
}

const addPoint = ()=>{
    snakeBody.push({
        x: -1,
        y: -2
    })
    score++
    scoreBox.innerHTML = "Score: " + score
}

const detectFruitColision = ()=>{
    let position = snakeBody[0]
    for(c=0; c < fruitCoords.length; c++){
        if(position.x == fruitCoords[c].x && position.y == fruitCoords[c].y){
            fruitCoords.splice(c, 1)
            addPoint()
        }
    }
}

const detectWallColision = ()=>{
    let position = snakeBody[0]
    if(DeathWhenTouchBorder == false){
        if(position.x < 0) {
            snakeBody[0].x = arenaSize-1
        } else if(position.x > arenaSize-1){
            snakeBody[0].x = 0
        } else if(position.y < 0){
            snakeBody[0].y = arenaSize-1
        } else if(position.y > arenaSize-1){
            snakeBody[0].y = 0
        } 
    } else if(position.x < 0 || position.x > arenaSize-1 || position.y < 0 || position.y > arenaSize-1){
        resetGame()
    }
    
}

const createFruit = ()=>{
    let create = false
    let p = Math.random() * 100
    if(p < fruitRandomPar && direction != 'a' && fruitCoords.length < 5){
        fruitCoords.push({
            x: Math.floor(Math.random()*(arenaSize) ),
            y: Math.floor(Math.random()*(arenaSize) )
        })
    }
    
}

const detectBoddyColision = () => {
    let position = snakeBody[0]
    for(c = 1; c < snakeBody.length - 1; c++ ) {
        if(position.x == snakeBody[c].x && position.y == snakeBody[c].y) {
            resetGame()
        }
    }
}

const resetGame = ()=>{
    fruitCoords = []
    snakeBody = [
        {
            x: 9,
            y: 10,
        },
        {
            x: 8,
            y: 10
        },
        {
            x: 7,
            y: 10,
        },
        {
            x: 6,
            y: 10,
        },
        {
            x: 5,
            y: 10,
        }
    ]
}
resetGame()

const process = ()=>{ // Process game state
    for(c = snakeBody.length -1  ; c > 0; c-- ){
        snakeBody[c].x = snakeBody[c-1].x
        snakeBody[c].y = snakeBody[c-1].y
    }
    if(direction == 'ArrowLeft') {
        snakeBody[0].x = snakeBody[0].x - 1
    } else if(direction == 'ArrowRight'){
        snakeBody[0].x = snakeBody[0].x + 1
    } else if(direction == 'ArrowUp'){
        snakeBody[0].y = snakeBody[0].y - 1
    } else if(direction == 'ArrowDown'){
        snakeBody[0].y = snakeBody[0].y + 1
    }

    direction = pressed
    
    detectWallColision()
    detectFruitColision()
    detectBoddyColision()
    createFruit()
}

const draw = ()=>{ // Draw game state in canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const drawPixel = (x, y, type)=>{
        ctx.beginPath()
        ctx.fillStyle = colorPallet[type]
        ctx.moveTo(x * pixelSize, y * pixelSize)
        ctx.lineTo(x * pixelSize + pixelSize, y * pixelSize)
        ctx.lineTo(x * pixelSize + pixelSize , y * pixelSize + pixelSize)
        ctx.lineTo(x * pixelSize, y * pixelSize + pixelSize)
        ctx.lineTo(x * pixelSize, y * pixelSize)
        ctx.fill()
    }

    for(c=0; c < snakeBody.length; c++){
        let body = snakeBody[c]
        drawPixel(body.x, body.y, 'snake')
    }

    for(c=0; c < fruitCoords.length; c++){
        let fruit = fruitCoords[c]
        drawPixel(fruit.x, fruit.y, 'food')
    }
}

setInterval(() => {
    process()
    draw()
}, 1000/fps)