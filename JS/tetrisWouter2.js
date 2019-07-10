//***************************************************************
//Naam:			JavaSCrip[t File Tetris (tetrisWouter2.js)
//Datum:		29-6-2019
//Omschrijving:	Javascript file voor het spelletje
//
//***************************************************************

//Bepaal de constanten
    const dTimeInterval = 0.5;
    const cvs = document.getElementById("tetris");
    const ctx = cvs.getContext("2d");
    const scoreElement = document.getElementById("score");
    const levelElement = document.getElementById("level");

    const ROW = 20;
    const COL = COLUMN = 10;
    const SQ = squareSize = 20;
    const VACANT = "WHITE"; // color of an empty square
    const PIECES = [
        [Z, "red"],
        [S, "green"],
        [T, "yellow"],
        [O, "blue"],
        [L, "purple"],
        [I, "cyan"],
        [J, "orange"]
    ];

//Bepaal de publieke variabelen
    var dTime;
    var dTimeLimit;
    var board = [];
    var dScoreT;
    var iLevel=1;
    var tetronActiveTetromino;
    var sMove;
    var bSpeel;
    var bGameOver;
    var dScoreOud;

// Speciale functies
    // functie om canvas continu te herladen
    var vGame = setInterval(GamePlay, 1000 / iLevel);

    //Bepaal de on load criteria
    document.addEventListener("keydown", CheckAction);

function LaadSpel() {
//***************************************************************
//Naam:			LaadSpel
//Datum:		29-6-2019
//Omschrijving:	Hier worden de constanten gedefinieerd voor het spel
//              als de scherm geladen wordt (onload)  
//
//***************************************************************

    bSpeel = false;
    bGameOver = false;
    iLevel = 1;
    dScoreOud = 0;
}

function StartSpel() {
    //***************************************************************
    //Naam:			LaadSpel
    //Datum:		29-6-2019
    //Omschrijving:	Hier worden de constanten gedefinieerd voor het spel
    //              als de scherm geladen wordt (onload)  
    //
    //***************************************************************

    // Geef aan dat het spel wordt gespeeld
    bSpeel = true;

    //Maak het bord aan
    for (r = 0; r < ROW; r++) {
        board[r] = [];
        for (c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }

    //Bepaal de eerste tetromino
    AddNewTetromino();

    //Wijzig de score eenheden
    dScoreT = 0;
    iLevel = 1;
    dScoreOud = 0;

    //Teken board
    DrawTetrisBoard();

    //Update nu de score in de DOM
    scoreElement.innerHTML = dScoreT;
    levelElement.innerHTML = iLevel;
}



function GamePlay() {
//***************************************************************
//Naam:			GamePlay
//Datum:		29-6-2019
//Omschrijving:	Hier wordt een spel uitgevoerd, als  
//
//***************************************************************

    // Indien spel gestart is speel ronde
    if (bSpeel) {
        //Speel een speelronde
        SpeelRonde();

        tTijd = Date.now().toLocaleString();
       // console.log(tTijd);

    }

    if (bGameOver) {
        alert("GameOver");
        bSpeel = false;
        bGameOver = false;

    }


}

function SpeelRonde() {
//***************************************************************
//Naam:			SpeelRonde
//Datum:		5-7-2019
//Omschrijving:	Ronde van het normale spel  
//
//***************************************************************
    var bColl;

    //Laat de tetromino naar beneden gaan
    MoveTetromino("Down");
 
    //Check voor een botsing
    bColl = CheckCollision();

    //INdien er een botsing is ga na of er sprake is van een game over of dat er 
    if (bColl) {
        //Voeg nieuwe tetromino toe
        AddNewTetromino();
        //Check of er Game over is anders wordt gekeken of er een rij verwijderd wordt en een nieuwe tetromino
        bGameOver = CheckGameOver();
        if (!bGameOver) {
            //Check of rij verwijderd moet worden
            CheckRemoveRij();
        }
    }
}

function DrawTetrisBoard() {
    //***************************************************************
    //Naam:			DrawTetrisBoard
    //Datum:		23-6-2019
    //Omschrijving:	Met deze module wordt het bord getekend 
    //
    //***************************************************************

    //Loop door de rijen van het bord
    for (r = 0; r < ROW; r++) {
        //Loop door de kolommen van het bord 
        for (c = 0; c < COL; c++) {
            //Teken ieder vakje in het bord
            drawSquare(c, r, board[r][c]);
        }
    }
}

function drawSquare(x, y, color) {
    //***************************************************************
    //Naam:			drawSquare
    //Datum:		23-6-2019
    //Omschrijving:	Met deze module wordt een vakje getekend ter grootte 
    //              SQ bij SQ op positie X,y van het bord
    //
    //***************************************************************

    //Teken binnenkant vakje
    // Bepaal de kleur
    ctx.fillStyle = color;
    //Bepaal positie en grootte van het getekende vierkantje
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    //Teken de randen van de vierkant
    // Bepaal de kleur
    ctx.strokeStyle = "BLACK";
    //Bepaal positie en grootte van het getekende vierkantje
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function CheckAction() {
    //***************************************************************
    //Naam:			CheckAction
    //Datum:		23-6-2019
    //Omschrijving:	Met deze module wordt gekeken of een knop wordt ingedrukt
    //              teruggeven wordt beneden, links, rechts of draai of NVT
    //
    //***************************************************************

    if (event.keyCode == 37) {
        MoveTetromino("Left");
    } else if (event.keyCode == 38) {
        MoveTetromino("Turn");
    } else if (event.keyCode == 39) {
        MoveTetromino("Right");
    } else if (event.keyCode == 40) {
        MoveTetromino("Down");
    } else {
        sMove = "NVT";
    }
}

function MoveTetromino(sMoveInput) {
    //***************************************************************
    //Naam:			MoveTetromino
    //Datum:		23-6-2019
    //Omschrijving:	Met deze functie wordt de tetromino gewijzigd dit
    //              Dit betekent dat de tetromino anders op het bord 
    //              getoond wordt
    //
    //***************************************************************

    //Verwijder huidige tetromino op Board (stel alle kleuren in op vacant)
    removeTetroboard();

    var bMove;

    //Bepaal nu nieuwe locatie tetromino
    if (sMoveInput == "Down") {
        bMove = GetPosDown();
        if (bMove) { tetronActiveTetromino.y++; }
    }
    else if (sMoveInput == "Left") {
        bMove=GetPosLinks();
        if (bMove) {tetronActiveTetromino.x--;}
    }
    else if (sMoveInput == "Right") {
        bMove = GetPosRechts();
        if (bMove) {tetronActiveTetromino.x++;}
    }
    else if (sMoveInput == "Turn") {
        if ((tetronActiveTetromino.tetrominoN+2) > tetronActiveTetromino.tetromino.length) {
            tetronActiveTetromino.tetrominoN = 0;
        }
        else { tetronActiveTetromino.tetrominoN++; }

        // Wijzig nu de tetroArray
        tetronActiveTetromino.tetroArray = tetronActiveTetromino.tetromino[tetronActiveTetromino.tetrominoN];

        //Corrigeer nu de positie
        CheckPositieDraai();
    }

    //Teken nu de nieuwe tetromino op het bord (teken nu de kleuren op het bord)
    addTetroboard();

    //Teken het bord opnieuw
    DrawTetrisBoard();
}

function CheckCollision() {
    //***************************************************************
    //Naam:			CheckCollision
    //Datum:		23-6-2019
    //Omschrijving:	Met deze module wordt gecontroleerd of de tetromino
    //              teruggeven wordt beneden, links, rechts of draai of NVT
    //
    //***************************************************************
    removeTetroboard();

    var bMove = GetPosDown();

    addTetroboard();

    if (bMove) {
        return false;
    }
    else {
        return true;
    }
}
function CheckGameOver() {
    //***************************************************************
    //Naam:			CheckGameOver
    //Datum:		23-6-2019
    //Omschrijving:	Met deze module wordt gecontroleerd of er game over is
    //
    //***************************************************************


    if ((board[0][5] != VACANT || board[0][6] != VACANT) && (board[1][5] != VACANT || board[1][6] != VACANT) ) {
        return true;
    }
    else { return false;}
    
}
function CheckRemoveRij() {
    //***************************************************************
    //Naam:			CheckRemoveRij
    //Datum:		23-6-2019
    //Omschrijving:	Met deze module wordt gekeken of een rij verwijderd
    //              moet worden en verwijderd dan de rij
    //
    //***************************************************************

    var iVacant;
    var dScore = 0;
    var iRij = 0;

    for (r = ROW-1; r > 0; r--) {
        
        //Stel de vacant telling in op 0 
        iVacant = 0;
        for (c = 0; c < COL; c++) {
            if (board[r][c] == VACANT) {
                iVacant++;
            }
        }

        // ALs er geen VACANT sellen waren is de rij vol en moet de rij verwijderd worden
        if (iVacant == 0) {
            //Vervang de plekken op de rij door de plekken op de rij erboven
            for (q = r; q > 1; q--) {
                for (c = 0; c < COL; c++) {
                    board[q][c] = board[q - 1][c];
                }            
            }
            // Vervang de laatste rijd met een lege rij
            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            // Verhoog r    
            r++;
            // Verhoog de verwijderde rijen
            iRij++;
        }
    }
    //Bepaal de score
    switch (iRij) {
        case 1:
            // code block
            dScore = 100;
            break;
        case 2:
            // code block
            dScore = 200;
            break;
        case 3:
            // code block
            dScore = 400;
            break;
        case 4:
            // code block
            dScore = 800;
            break;
        default:
            // code block
            dScore = 0;
    }
    dScoreT = dScoreT + dScore;

    //Update nu de score in de DOM
    scoreElement.innerHTML = dScoreT;

    //Check nu of er een hogere level is
    if ((dScoreT - dScoreOud) > 1000) {
        iLevel++;
        dScoreOud = dScoreT;
        vGame = setInterval(GamePlay, 1000 / (1 + 0.5 * iLevel));
        levelElement.innerHTML = iLevel;
    }
}

function AddNewTetromino() {
    //***************************************************************
    //Naam:			CheckRemoveRij
    //Datum:		23-6-2019
    //Omschrijving:	Met deze module wordt gekeken of een rij verwijderd
    //              moet worden en verwijderd dan de rij
    //
    //***************************************************************


    //maak willekeurig getal aan
    var r = Math.floor(Math.random() * PIECES.length)

    //Selecteer nieuw stuk
    tetronActiveTetromino = new Piece(PIECES[r][0], PIECES[r][1])

    //Voeg stuk toe aan board
    addTetroboard();

}



function Piece(tetromino, color) {
    //***************************************************************
    //Naam:			Piece
    //Datum:		23-6-2019
    //Omschrijving:	De constructor voor het maken van de termino deze bevat
    //              tetromino= het blok 
    //              color= kleur
    //              tetrominoN= nummer van rotatie
    //              tetroArray= de array
    //              x= x positie bord
    //              y= y positie bord
    //
    //***************************************************************
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; // we start from the first pattern
    this.tetroArray = this.tetromino[this.tetrominoN];
    // we need to control the pieces
    this.x = 3;
    this.y = -2;
}

function addTetroboard() {
    //***************************************************************
    //Naam:			addTetroboard
    //Datum:		23-6-2019
    //Omschrijving:	De tetromino wordt toegevoegd aan het bord
    //
    //***************************************************************

    for (r = 0; r < tetronActiveTetromino.tetroArray.length; r++) {
        for (c = 0; c < tetronActiveTetromino.tetroArray[r].length; c++) {
            // we draw only occupied squares
            if (tetronActiveTetromino.tetroArray[r][c] == 1) {
                // Check nu of de rij op de juiste plek staat
                if ((tetronActiveTetromino.y + r) >= 0) {
                    board[tetronActiveTetromino.y + r][tetronActiveTetromino.x + c] = tetronActiveTetromino.color;
                }
            }
        }
    }
}

function removeTetroboard() {
    //***************************************************************
    //Naam:			addTetroboard
    //Datum:		23-6-2019
    //Omschrijving:	De tetromino wordt toegevoegd aan het bord
    //
    //***************************************************************

    for (r = 0; r < tetronActiveTetromino.tetroArray.length; r++) {
        for (c = 0; c < tetronActiveTetromino.tetroArray[r].length; c++) {
            // we draw only occupied squares
            if (tetronActiveTetromino.tetroArray[r][c] == 1) {
                // Check nu of de rij op de juiste plek staat
                if ((tetronActiveTetromino.y + r) >= 0) {
                    board[tetronActiveTetromino.y + r][tetronActiveTetromino.x + c] = VACANT;
                }
            }
        }
    }
}

function GetPosLinks() {
//***************************************************************
//Naam:			GetPosLinks
//Datum:		3-7-2019
//Omschrijving:	De linker positie van de tetromino wordt bepaald
//
//***************************************************************

    //Bepaal de lengte van de array
    var bWaarde = true;

    for (r = 0; r < tetronActiveTetromino.tetroArray.length; r++) {
        for (c = 0; c < tetronActiveTetromino.tetroArray[r].length; c++) {
            // we draw only occupied squares
            if (tetronActiveTetromino.tetroArray[r][c] == 1) {
                // Check nu of de rij op de juiste plek staat
                if ((tetronActiveTetromino.y + r) >= 0) {
                    // Check nu of de kolom links zit
                    if ((tetronActiveTetromino.x + c) <= 0) {
                        bWaarde = false;
                    }
                    else if (board[tetronActiveTetromino.y + r][tetronActiveTetromino.x + c-1] !=VACANT) {
                        bWaarde = false;
                    }
                }
            }
        }
    }

    // Geef de waarde terug
    return bWaarde;
}

function GetPosRechts() {
    //***************************************************************
    //Naam:			GetPosRechts
    //Datum:		3-7-2019
    //Omschrijving:	De rechter positie van de tetromino wordt bepaald
    //
    //***************************************************************

    //Bepaal de lengte van de array
    var bWaarde = true;

    for (r = 0; r < tetronActiveTetromino.tetroArray.length; r++) {
        for (c = 0; c < tetronActiveTetromino.tetroArray[r].length; c++) {
            // we draw only occupied squares
            if (tetronActiveTetromino.tetroArray[r][c] == 1) {
                // Check nu of de rij op de juiste plek staat
                if ((tetronActiveTetromino.y + r) >= 0) {
                    // Check nu of de kolom links zit
                    if ((tetronActiveTetromino.x + c) >= COL) {
                        bWaarde = false;
                    }
                    else if (board[tetronActiveTetromino.y + r][tetronActiveTetromino.x + c + 1] != VACANT) {
                        bWaarde = false;
                    }
                }
            }
        }
    }

    // Geef de waarde terug
    return bWaarde;
}

function GetPosDown() {
    //***************************************************************
    //Naam:			GetPosDown
    //Datum:		3-7-2019
    //Omschrijving:	De beneden positie van de tetromino wordt bepaald
    //
    //***************************************************************

    //Bepaal de lengte van de array
    var bWaarde = true;

    for (r = 0; r < tetronActiveTetromino.tetroArray.length; r++) {
        for (c = 0; c < tetronActiveTetromino.tetroArray[r].length; c++) {
            // we draw only occupied squares
            if (tetronActiveTetromino.tetroArray[r][c] == 1) {
                // Check nu of de rij op de juiste plek staat
                if ((tetronActiveTetromino.y + r) >= 0) {
                    // Check nu of de kolom links zit
                    if ((tetronActiveTetromino.y + r) >= ROW-1) {
                        bWaarde = false;
                    }
                    else if (board[tetronActiveTetromino.y + r+1][tetronActiveTetromino.x + c] != VACANT) {
                        bWaarde = false;
                    }
                }
            }
        }
    }

    // Geef de waarde terug
    return bWaarde;
}

function CheckPositieDraai() {
//***************************************************************
//Naam:			CheckPositieDraai
//Datum:		3-7-2019
//Omschrijving:	Check of de posities gewisseld moeten worden
//
//***************************************************************

    console.log("Draai");

    var bMove = GetPosRechts();

    //Check of de tile naar links moet
    if (!bMove) {
        console.log("Fout");
        do {
            tetronActiveTetromino.x--;
            bMove = GetPosRechts();
   
        } while (!bMove)

        tetronActiveTetromino.x++;
    }

    bMove = GetPosLinks();
    console.log(bMove);

    //Check of de tile naar rechts moet
    if (!bMove) {
        console.log("Fout Links");
        do {
            tetronActiveTetromino.x++;
            bMove = GetPosLinks();

        } while (!bMove)

        tetronActiveTetromino.x--;
    }



}