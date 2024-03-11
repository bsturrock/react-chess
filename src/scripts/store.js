import { create } from "zustand";

class Piece {
    constructor(color,rank, file){
        this.color = color;
        this.rank = rank;
        this.file = file;
    }
}

class Pawn extends Piece {
    constructor(color, rank, file){
        super(color, rank, file)
        this.hasMoved = false
        this.type = 'pawn'
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
        this.hasMoved = false
        this.canCastle = true
        this.type = 'king'
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
    clearPossibleCaptures: ()=> set({possibleCaptures:[]})
}))

export default useStore