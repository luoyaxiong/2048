var board = [];
var score ;
var hasComflicted = [];
var startx;
var starty;
var endx;
var endy;

$(document).ready(function(){
    newgame();
});

function newgame(){
     // 各设备版面的自己适应
     perpareForMobile();
     //初始化棋盘格
     init();
     //在随机两个格子生成数字
     generateOneNumber();
     generateOneNumber();
}

function perpareForMobile(){
    if(documentWidth > 500){
        gridContainterWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }
    $("#grid-container").css('width', gridContainterWidth - 2 * cellSpace);
    $("#grid-container").css('height', gridContainterWidth - 2 * cellSpace);
    $("#grid-container").css('padding', cellSpace);
    $("#grid-container").css('border-radius', 0.02 * gridContainterWidth);

    $(".grid-cell").css('width', cellSideLength);
    $(".grid-cell").css('height', cellSideLength);
    $(".grid-cell").css('border-radius', 0.02 * cellSideLength);
};

function init(){
    for (var i = 0; i < 4; i++) 
        for(var j = 0; j < 4; j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    
    for (var i = 0; i < 4; i++) {
        board[i] = [];
        hasComflicted[i] = [];
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasComflicted[i][j] = false;
        }
    }
    
    updateBoardView();

    score = 0;

};

function updateBoardView(){

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
            }
            else{
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i,j));
                theNumberCell.css('left', getPosLeft(i,j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
                // theNumberCell.text(getNumberName(board[i][j]));
            }
            hasComflicted[i][j] = false;
        }
    
    $(".number-cell").css('line-height', cellSideLength+'px');
    $(".number-cell").css('font-size', 0.2*cellSideLength+'px');
    
    
};


function generateOneNumber(){

    if( nospace( board ) )
        return false;

    //随机一个位置
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

    var times = 0;
    while( times<50 ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );
    }

    if(times>=50){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0; j < 4 ; j ++ ){
                if(board[i][j]==0){
                   randx = i;
                   randy = j;
                   break; 
                }          
            }

    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
};

$(document).keydown(function( event ){

    switch( event.keyCode ){
        case 37: //left
            event.preventDefault(); 
            if( moveLeft() ){
                setTimeout('generateOneNumber()',210);
                setTimeout('isgameover()',300);
            }
            break;
        case 38: //up
            event.preventDefault();
            if( moveUp() ){
                setTimeout('generateOneNumber()',210);
                setTimeout('isgameover()',300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if( moveRight() ){
                setTimeout('generateOneNumber()',210);
                setTimeout('isgameover()',300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if( moveDown() ){
                setTimeout('generateOneNumber()',210);
                setTimeout('isgameover()',300);
            }
            break;
        default: //default
            break;
    }
});

document.addEventListener("touchstart", function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});


document.addEventListener("touchmove", function(event){
    event.preventDefault(); 
});

document.addEventListener("touchend", function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth){
        return;
    }
    //x
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax>0){
            //move right
            if( moveRight() ){
                setTimeout('generateOneNumber()',210);
                setTimeout('isgameover()',300);
            }
        }
        else{
           // move left 
           if( moveLeft() ){
            setTimeout('generateOneNumber()',210);
            setTimeout('isgameover()',300);
            }
        };
    }
    else{
        // y的正半轴是向下的 原点可以认为在左上角
        if(deltay<0){
            //move up
            if( moveUp() ){
                setTimeout('generateOneNumber()',210);
                setTimeout('isgameover()',300);
            }
        }
        else{
           // move down
           if( moveDown() ){
            setTimeout('generateOneNumber()',210);
            setTimeout('isgameover()',300); 
           }
        }
    };
});

function isgameover(){
    if(nospace(board)&&nomove(board)){
        gameover();
    }
};

function gameover(){
    alert('Game Over')

}

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1; j < 4 ; j ++ ){
            if(board[i][j]!=0){
                for( var k =0; k<j ; k++){
                    if(board[i][k] ==0 && noBlockHorizontal( i, k, j, board)){
                        //move
                        showNumberAnimation( i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k]== board[i][j] && noBlockHorizontal( i, k, j, board) && !hasComflicted[i][k]){
                        //move and sum
                        showNumberAnimation( i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        
                        score += board[i][k];
                        updateScore(score);
                        
                        hasComflicted[i][k] = true;
                        
                        continue;
                }
            }

            
        }
    }

    setTimeout('updateBoardView()',200);


   
    return true;
};

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0; j < 3 ; j ++ ){
            if(board[i][j]!=0){
                for( var k =j+1; k<4 ; k++){
                    if(board[i][k] ==0 && noBlockHorizontal( i, j, k, board)){
                        //move
                        showNumberAnimation( i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k]== board[i][j] && noBlockHorizontal( i, j, k, board) && !hasComflicted[i][k]){
                        //move and sum
                        showNumberAnimation( i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);
                        
                        hasComflicted[i][k] = true;
                        
                        continue;
                }
            }

            
        }
    }

    setTimeout('updateBoardView()',200);


   
    return true;
};

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }

    for( var i = 1 ; i < 4 ; i ++ )
        for( var j = 0; j < 4 ; j ++ ){
            if(board[i][j]!=0){
                for( var k =0; k<i ; k++){
                    if(board[k][j] ==0 && noBlockVertical( j, k, i, board)){
                        //move
                        showNumberAnimation( i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j]== board[i][j] && noBlockVertical( j, k, i, board) && !hasComflicted[k][j] ){
                        //move and sum
                        showNumberAnimation( i, j, k, j);
                        
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(score);
                        
                        hasComflicted[k][j] = true;
                        continue;
                }
            }

            
        }
    }

    setTimeout('updateBoardView()',200);


   
    return true;
};

function moveDown(){
    if(!canMoveUp(board)){
        return false;
    }

    for( var i = 0 ; i < 3 ; i ++ )
        for( var j = 0; j < 4 ; j ++ ){
            if(board[i][j]!=0){
                for( var k = i+1 ; k<4 ; k++){
                    if(board[k][j] ==0 && noBlockVertical( j, i, k, board)){
                        //move
                        showNumberAnimation( i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j]== board[i][j] && noBlockVertical( j, i, k, board) && !hasComflicted[k][j]){
                        //move and sum
                        showNumberAnimation( i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(score);
                      
                        hasComflicted[k][j] = true;
                        
                        continue;
                }
            }

            
        }
    }

    setTimeout('updateBoardView()',200);


   
    return true;
};


