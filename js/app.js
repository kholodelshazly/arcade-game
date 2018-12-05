// Global variables
var charactersNameList = ['char-horn-girl', 'char-cat-girl', 'char-princess-girl'];
var canvasGlobal;
var fromcoin=false;
var TIMER_MAX = 15;
var timer = TIMER_MAX;
var isGameOver = false;
var winGame = false;
var score = 0;
var MAX_score =100;
var lives = 3;
var timerOn = false;
var timerco = 0;
var currentPlayerSprite;
var selectingPlayer = true;

//  <!--TO DO select player-->
function onSelectPlayer(index){
    currentPlayerSprite = 'images/' + charactersNameList[index] + '.png';
    selectingPlayer = false;
    onReset();
}

// <!--TO DO reset-->
function onReset(){
    timerco = 0;
    timer = TIMER_MAX;
    timerOn = false;
    if(selectingPlayer){
        player = null;
    } else  {
        player = new Player(2*T_WIDTH , 5*T_HEIGHT);
    }
    
    allEnemies = [];
    for(var i = 0; i < 3; i++){
        allEnemies.push(new Enemy(Math.random()*(CANVAS_WIDTH - T_WIDTH), (i+1)*T_HEIGHT));
    }
    
    allBoosters=[];
    for(var j = 0; j < 3; j++){
        allBoosters.push(new Booster(Math.random()*(CANVAS_WIDTH - T_WIDTH), (j+1)*T_HEIGHT));
    }
}
// Booster constructor function
var Booster = function(x, y) {
	this.sprite = 'images/gem-orange.png';
	this.x = x;
    this.y = y;
    this.width = 101;
};

Booster.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Booster.prototype.update = function() {
    // check collision
    
    if(player !== null){
        if(this.x + this.width >= player.x + player.marginLeft && this.x <= player.x + player.width - player.marginRight && this.y === player.y){
            this.x=505;
            this.y=606;
            fromcoin=true;
            player.win();
            
        }
    }
};

// Player constructor function
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.marginLeft = 17;
    this.marginRight = 17;
    this.width = 67;
    this.sprite = currentPlayerSprite;
};
// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// the player is lose life when collision
Player.prototype.lose = function(){
    lives--;
    if(lives > 0){
        onReset();
    } else {
        isGameOver = true;
        winGame = false;
        timerOn = false;
    }
};
// player win the game
Player.prototype.win = function(){
    score=score+10;
    if(score === MAX_score){
        isGameOver = true;
        winGame = true;
        timerOn = false;
    } else if (!fromcoin){
        onReset();
    }
    else{
        fromcoin=false;
    }
};

// Handle Player Input (left,right,up,down)
Player.prototype.handleInput = function(direction) {
    timerOn = true;
    switch(direction){
        case 'left':
            if(this.x > 0){
                this.x -= T_WIDTH;
            }
            break;
        case 'right':
            if(this.x < CANVAS_WIDTH - T_WIDTH){
                this.x += T_WIDTH;
            }
            break;
        case 'up':
            if(this.y > 0){
                this.y -= T_HEIGHT;
                if(this.y === 0){
                    this.win();
                }
            }
            break;
        case 'down':
            if(this.y < CANVAS_HEIGHT - T_HEIGHT_LAST){
                this.y += T_HEIGHT;
            }
            break;
    }
};

// Enemies function
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 101;
    this.hspeed = this.getRandomHspeed();
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.hspeed;
    if(this.x > CANVAS_WIDTH){
        this.reset();
    }
    
    // check collision with player
    if(player !== null){
        if(this.x + this.width >= player.x + player.marginLeft && this.x <= player.x + player.width - player.marginRight && this.y === player.y){
            player.lose();
        }
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// show enemy random on the canvas
Enemy.prototype.getRandomHspeed = function(){
    var minSpeed, maxSpeed;
    minSpeed = 2 + score/10;
    maxSpeed = minSpeed + 3;
    return minSpeed + Math.random()*(maxSpeed - minSpeed);
};

// reset enemy at starting position
// set hspeed, x, and y
Enemy.prototype.reset = function() {
    this.x = - T_WIDTH;
    var yIndex = 1 + Math.floor( Math.random()*3 );
    this.y = T_HEIGHT * yIndex;
    this.hspeed = this.getRandomHspeed();
};


// declaring objects
var allEnemies = [];
var allBoosters=[];
var player;

// This listens for mouse presses to select your player
document.addEventListener('click', function(e){
    if(selectingPlayer){
        var rect = canvasGlobal.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;
        if(my >= 5 * T_HEIGHT){
            if(mx >= T_WIDTH && mx < CANVAS_WIDTH-T_WIDTH){
                onSelectPlayer(Math.floor(mx/T_WIDTH-1));
            }
        }
    }
    // if game over
    if(isGameOver){
        location.reload();
    }
});
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // move the player after select it
    if(player !== null){
        if(!isGameOver && e.keyCode >= 37 && e.keyCode <= 40){
            player.handleInput(allowedKeys[e.keyCode]);
        }
    }
});
