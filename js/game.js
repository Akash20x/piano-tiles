var config = {
    width:400,
    height:600,
    rows:4,
    cols:4,
    speed:5,
    interval:20
  }
  config.height = window.innerHeight-2;
  config.defaultSpeed = config.speed;
  var score = 0;
  var scoreElement;
  var audio;
  var playtime=0;
  var endGameElement;
  var scoreElement;
  var gameLoop;
  var tileRows = [];
  var gameCanvas;
  var gameContext;
  var isGameStarted = false;
  var temp = 0

  const keys = ["A","S","D","F"]
  var numkey;

  document.addEventListener("DOMContentLoaded",function(){
    gameCanvas=document.getElementById("gameCanvas");
    scoreElement = document.getElementById("score");
    endScoreElement = document.getElementById("endscore");
    endGameElement = document.getElementById("gameEnd");
    gameContext=gameCanvas.getContext("2d");
    

    gameCanvas.setAttribute("width",config.width);
    gameCanvas.setAttribute("height",config.height);
    gameContext.lineWidth = 0.5;
    initGame();
  });
  
  function addRow() {
    var black_index = Math.floor(Math.random()*config.cols);
  
    var tile_width = config.width/config.cols;
    var tile_height = config.height/config.rows;
    var y = 200;
    numkey = 'S';
    if(tileRows.length>0){
      var lastRow = tileRows[tileRows.length-1];
      y = lastRow.y + lastRow.height;
      numkey =  keys[Math.floor(Math.random()*keys.length)];
  }

  if(score>10){
    config.speed=6
}
if(score>20) {
  config.speed=7
}
if(score>50){
    config.speed=8
}
if(score>70){
  config.speed=9



    var row = {
      x:0,
      y:y,
      width:config.width,
      height:config.height/config.rows,
      tileWidth:tile_width,
      tileHeight:tile_height,
      color:"#FFFFFF",
      black:{
        index:black_index,
        key: numkey,
        color:"#000000"
      },
      increament:function(){
        if(this.y<=0){
          if(!this.isValid){
            console.log("Game Over");
            stopGameLoop();
            displayWrongTile(this,this.black.index);
            return;
          }
        }
        this.y = this.y - config.speed;
  
      },
      isValid:false
    };
    tileRows.push(row);
  }
  
  
  function displayRow(row) {
    gameContext.fillStyle = row.color;
    gameContext.fillRect(0,row.y,row.width,row.height);
    for(var i=0;i<config.cols;i++){
      gameContext.strokeRect(i*row.tileWidth,
        row.y,
        row.tileWidth,
        row.tileHeight);
  
        if(row.black.index==i){
          gameContext.fillStyle = row.black.color;
          
          gameContext.fillRect(i*row.tileWidth,
            row.y,
            row.tileWidth,
            row.tileHeight);
            gameContext.font = "30px Impact";
            var grd = gameContext.createLinearGradient(0, 200, 150, 70);
            grd.addColorStop(0, "purple");
            grd.addColorStop(1, "white");
            gameContext.fillStyle = grd;  
            gameContext.fillText(row.black.key, i*row.tileWidth+40,  row.y+100);
            
          }
        }
        row.increament();
      }
      function startGameLoop() {
        gameLoop = setInterval(function(){
          displayAllRow();
        },config.interval);
      }
      function displayAllRow() {
        gameContext.clearRect(0,0,config.width,config.height);
        for(var i=0;i<tileRows.length;i++){
          displayRow(tileRows[i]);
        }
      }
  
      function stopGameLoop() {
        clearInterval(gameLoop);
        gameCanvas.removeEventListener("click",handleGameUserInput);
        endGameElement.style.display="block";
      }
  
      function handleGameUserInput(e) {
        if(!isGameStarted){
          isGameStarted = true;
          startGameLoop();
        }

        var tile_width = config.width/config.cols;


        var x = e.clientX - gameCanvas.offsetLeft;
        var y = e.clientY - gameCanvas.offsetTop;


        if(!x){
            var row = tileRows[temp];
            if(e.code===`Key${row.black.key}`){
              audio = document.getElementById("sample");            
            if(!row.isValid){
                row.isValid = true;
                row.black.color="#C5C5C5";
                score++;
                scoreElement.innerHTML = score;
                endScoreElement.innerHTML = score;
                addRow(); 
                audio.currentTime = playtime;
                audio.play();
                audio.addEventListener('timeupdate', function()
                {
                    if (audio.currentTime >= playtime + 0.05)
                        audio.pause();
                }, false);
                playtime += 0.2;
              }
            else{
                stopGameLoop();
                displayWrongTile(row,row.black.index);
              }
            }
            else{
                stopGameLoop();
                displayWrongTile(row,row.black.index);
            }
        }

        else{
        var audio = document.getElementById("sample");
        var clicked_col = Math.ceil(x/tile_width) - 1;
        for(var i=0;i<tileRows.length;i++){
          var row = tileRows[i];
          if (row.y<y && row.y+row.height>y) {
            if(clicked_col===row.black.index){
              if(!row.isValid){
                row.isValid = true;
                row.black.color="#C5C5C5";
                score++;
                scoreElement.innerHTML = score;
                endScoreElement.innerHTML = score;
                addRow(); 
                audio.currentTime = playtime;
                audio.play();
                audio.addEventListener('timeupdate', function()
                {
                    if (audio.currentTime >= playtime + 0.05)
                        audio.pause();
                }, false);
                playtime += 0.2;
              }
              else{
                stopGameLoop();
                displayWrongTile(row,clicked_col);
              }
            }else{
              stopGameLoop();
              displayWrongTile(row,clicked_col);
            }
            break;
          }
        }
    }
    temp = temp + 1
      }
  
      function displayWrongTile(row,col_number) {
        var grd=gameContext.createLinearGradient(0,40,100,10);
        grd.addColorStop(0,"red");
        grd.addColorStop(1,"#EE4B2B")
        gameContext.fillStyle = grd;
        gameContext.fillRect(col_number*row.tileWidth,row.y,row.tileWidth,row.tileHeight);
      }
  
      function initGame() {
        gameContext.clearRect(0,0,config.width,config.height);
        for(var i=0;i<config.rows;i++){
          addRow();
        }
      
        for(var i=0;i<tileRows.length;i++){
          displayRow(tileRows[i]);
        }
        

        
        endGameElement.style.display="none";
        gameCanvas.addEventListener("click",handleGameUserInput);

        document.addEventListener("keydown", handleGameUserInput)
      }
  
  
      function restartGame() {
        tileRows = [];
        score = 0;
        temp=0;
        isGameStarted = false;
        config.speed = config.defaultSpeed;
        scoreElement.innerHTML = score;
        endScoreElement.innerHTML = score;
        endGameElement.style.display="none";
        initGame();  
      }
