import { create } from "zustand";

class Piece {
    constructor(color,rank, file){
        this.color = color;
        this.rank = rank;
        this.file = file;
        this.hasMoved = false;
    }
}

class Pawn extends Piece {
    constructor(color, rank, file){
        super(color, rank, file)
        this.type = 'pawn'
        this.canEnPassant = false
    }
    promote(){
        return new Queen(this.color, this.rank, this.file)
    }
}

class Knight extends Piece {
    constructor(color, rank, file){
        super(color, rank, file)
        this.type = 'knight'
    }
}

class Bishop extends Piece {
    constructor(color, rank, file){
        super(color, rank, file)
        this.type = 'bishop'
    }
}

class Rook extends Piece {
    constructor(color, rank, file){
        super(color, rank, file)
        this.type = 'rook'
    }
}

class Queen extends Piece {
    constructor(color, rank, file){
        super(color, rank, file)
        this.type = 'queen'
    }
}

class King extends Piece {
    constructor(color, rank, file){
        super(color, rank, file)
        this.canCastleKing = false
        this.canCastleQueen = false
        this.castleKingAvailable = true
        this.castleQueenAvailable = true
        this.type = 'king'
    }
    
    checkCastleStatus(board){
        if(this.hasMoved){this.canCastleKing = false; this.canCastleQueen=false; this.castleKingAvailable = false; this.castleQueenAvailable = false; return}
        if(this.color == 'white'){
            let bishopSpot = board.filter((ele)=>ele.column == 6 && ele.row == 1)[0]
            let knightSpot = board.filter((ele)=>ele.column == 7 && ele.row == 1)[0]
            let rookSpot = board.filter((ele)=>ele.column == 8 && ele.row == 1)[0]

            if(bishopSpot.piece == null && knightSpot.piece == null && rookSpot.piece != null && rookSpot.piece.hasMoved == false){
                this.canCastleKing = true
            } else if (bishopSpot.piece == null && knightSpot.piece == null && (rookSpot.piece==null || rookSpot.piece.hasMoved == true)){
                this.castleKingAvailable = false
                this.canCastleKing = false
            } else {
                this.canCastleKing = false
            }

            let queenSpot = board.filter((ele)=>ele.column == 4 && ele.row == 1)[0]
            bishopSpot = board.filter((ele)=>ele.column == 3 && ele.row == 1)[0]
            knightSpot = board.filter((ele)=>ele.column == 2 && ele.row == 1)[0]
            rookSpot = board.filter((ele)=>ele.column == 1 && ele.row == 1)[0]

            if(bishopSpot.piece == null && knightSpot.piece == null && rookSpot.piece != null && rookSpot.piece.hasMoved == false && queenSpot.piece == null){
                this.canCastleQueen = true
            } else if (bishopSpot.piece == null && knightSpot.piece == null && (rookSpot.piece==null || rookSpot.piece.hasMoved == true)){
                this.castleQueenAvailable = false
                this.canCastleQueen = false
            }  else {
                this.canCastleQueen = false
            }
        }
    }
}

const buildBoard = () => {
    const board = []
    for(let i=1; i<9;i++){
        for(let j=8; j>0; j--){
            if(i==2){
                board.push({row: i, column: j, piece: new Pawn('white', i, j)})
            } else if(i==1){
                if(j==1 || j==8){
                    board.push({row: i, column: j, piece:new Rook('white', i, j)})
                } else if (j==2 || j==7){
                    board.push({row: i, column: j, piece:new Knight('white', i, j)})
                } else if (j==3 || j==6){
                    board.push({row: i, column: j, piece:new Bishop('white', i, j)})
                } else if (j==4){
                    board.push({row: i, column: j, piece:new Queen('white', i, j)})
                } else if (j==5){
                    board.push({row: i, column: j, piece:new King('white', i, j)})
                }
            } else if(i==7){
                board.push({row: i, column: j, piece:new Pawn('black', i, j)})
            } else if(i==8){
                if(j==1 || j==8){
                    board.push({row: i, column: j, piece:new Rook('black', i, j)})
                } else if (j==2 || j==7){
                    board.push({row: i, column: j, piece:new Knight('black', i, j)})
                } else if (j==3 || j==6){
                    board.push({row: i, column: j, piece:new Bishop('black', i, j)})
                } else if (j==4){
                    board.push({row: i, column: j, piece:new Queen('black', i, j)})
                } else if (j==5){
                    board.push({row: i, column: j, piece:new King('black', i, j)})
                }
            }  else {
                board.push({row: i, column: j, piece:null})
            }
        }
    }
    board.sort((a,b)=>{
        return b.row - a.row || a.column - b.column
    })
    
    return board
}

const useStore = create((set)=>({
    turn: 'white',
    setTurn: (color) => set({turn: color}),
    board: buildBoard(),
    setBoard: (board)=> set({board:board}),
    activeSquare: null,
    setActiveSquare: (square) => set({activeSquare: square}),
    clearActiveSquare: () => set({activeSquare: null}),
    hasActiveSquare: false,
    setHasActiveSquare: (bool) => set({hasActiveSquare: bool}),
    
    possibleMoves: [],
    setPossibleMoves: (moves) => set({possibleMoves: moves}),
    clearPossibleMoves: ()=> set({possibleMoves:[]}),
    
    possibleCaptures: [],
    setPossibleCaptures: (captures) => set({possibleCaptures: captures}),
    clearPossibleCaptures: () => set({possibleCaptures:[]}),

    possibleCastles: [],
    setPossibleCastles: (castles) => set({possibleCastles: castles}),
    clearPossibleCastles: () => set({possibleCastles: []}),

    possibleEnPassant: [],
    setPossibleEnPassant: (captures) => set({possibleEnPassant: captures}),
    clearPossibleEnPassant: () => set({possibleEnPassant: []}),

    checks: [],
    setChecks: (checks) => set({checks: checks}),
    clearChecks: () => set({checks:[]}),

    startComputerMove: null,
    endComputerMove: null,
    setStartComputerMove: (move) => set({startComputerMove: move}),
    setEndComputerMove: (move) => set({endComputerMove: move}),
    clearComputerMoves: () => set({startComputerMove: null, endComputerMove: null}),

    checkmates: [],
    setCheckmates: (checkmates) => set({checkmates: checkmates}),
    clearCheckmates: () => set({checkmates: null})
}))

export default useStore