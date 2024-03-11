
const fetchSquare = (row, column, boardData) => {
    return boardData.filter((ele)=>ele.row==row && ele.column==column)[0]
}

const squareIsEmpty = (square) => {
    return square.piece == null
}

const addMove = (row, column, moves, boardData) => {
    let square = fetchSquare(row, column, boardData)
    if(squareIsEmpty(square)){
        return [...moves, square]
    } else {
        return moves
    }
}

export const generatePawnMoves = (target, moves, boardData) => {
    moves = addMove(target.row+1, target.column, moves, boardData)
    if(!target.piece.hasMoved){
        moves = addMove(target.row+2, target.column, moves, boardData)
    }
    return moves
}

export const generateKnightMoves = (target, moves, boardData) => {
    if(target.row+2 <= 8 && target.column + 1 <= 8){
        moves = addMove(target.row+2, target.column+1, moves, boardData)
    }
    if(target.row+2 <= 8 && target.column - 1 > 0){
        moves = addMove(target.row+2, target.column-1, moves, boardData)
    }
    if(target.row-2 >0 && target.column + 1 <= 8){
        moves = addMove(target.row-2, target.column+1, moves, boardData)
    }
    if(target.row-2 >0 && target.column - 1 > 0){
        moves = addMove(target.row-2, target.column-1, moves, boardData)
    }
    if(target.row+1 <= 8 && target.column + 2 <= 8){
        moves = addMove(target.row+1, target.column+2, moves, boardData)
    }
    if(target.row+1 <= 8 && target.column - 2 > 0){
        moves = addMove(target.row+1, target.column-2, moves, boardData)
    }
    if(target.row-1 > 0 && target.column + 2 <= 8){
        moves = addMove(target.row-1, target.column+2, moves, boardData)
    }
    if(target.row-1 > 0 && target.column - 2 > 0){
        moves = addMove(target.row-1, target.column-2, moves, boardData)
    }
    return moves
}

export const generateRookMoves = (target, moves, boardData) => {
    let i = 1
    while(target.row+i <=8){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column, boardData))){
            break;
        }
        moves = addMove(target.row+i, target.column,moves, boardData)
        i++
    }        

    i =-1
    while(target.row+i > 0){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column, boardData))){
            break;
        }
        moves = addMove(target.row+i, target.column,moves, boardData)
        i--
    }  
    
    i =1
    while(target.column+i <= 8){
        if(!squareIsEmpty(fetchSquare(target.row,target.column+i, boardData))){
            break;
        }
        moves = addMove(target.row, target.column+i,moves, boardData)
        i++
    }   

    i =-1
    while(target.column+i > 0){
        if(!squareIsEmpty(fetchSquare(target.row,target.column+i, boardData))){
            break;
        }
        moves = addMove(target.row, target.column+i,moves, boardData)
        i--
    }   

    return moves
}

export const generateBishopMoves = (target, moves, boardData) => {
    let i = 1;
    let j = 1;
    while(target.row+i <=8 && target.column + j <= 8){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j, boardData))){
            break;
        }
        moves = addMove(target.row+i, target.column+j,moves, boardData)
        i++
        j++
    }

    i = -1;
    j = 1;
    while(target.row+i > 0 && target.column + j <= 8){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j, boardData))){
            break;
        }
        moves = addMove(target.row+i, target.column+j,moves, boardData)
        i--
        j++
    }

    i = 1;
    j = -1;
    while(target.row+i <=8 && target.column + j > 0){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j, boardData))){
            break;
        }
        moves = addMove(target.row+i, target.column+j,moves, boardData)
        i++
        j--
    }

    i = -1;
    j = -1;
    while(target.row+i > 0 && target.column + j > 0){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j, boardData))){
            break;
        }
        moves = addMove(target.row+i, target.column+j,moves, boardData)
        i--
        j--
    }
    return moves
}

export const generateQueenMoves = (target, moves, boardData) => {
    moves = generateBishopMoves(target, moves, boardData)
    moves = generateRookMoves(target, moves, boardData)
    return moves
}


const addCapture = (row, column, captures, target, boardData) => {

    let square = fetchSquare(row, column, boardData)
    if(squareIsEmpty(square) || square.piece.type == 'king'){
        return captures
    } else {
        if(target.piece.color != square.piece.color){
            return [...captures, square]
        }
        return captures
    }
}

export const generatePawnCaptures = (target, captures, boardData) => {
    if(target.column+1 <= 8) {
        captures = addCapture(target.row+1, target.column+1, captures, target, boardData)
    }
    if(target.column-1 > 0){
        captures = addCapture(target.row+1, target.column-1, captures, target, boardData)
    }
    return captures
}

export const generateBlackPawnCaptures = (target, captures, boardData) => {
    if(target.column+1 <= 8) {
        captures = addCapture(target.row-1, target.column+1, captures, target, boardData)
    }
    if(target.column-1 > 0){
        captures = addCapture(target.row-1, target.column-1, captures, target, boardData)
    }
    return captures
}

export const generateKnightCaptures = (target, captures, boardData) => {
    if(target.row+2 <= 8 && target.column + 1 <= 8){
        captures = addCapture(target.row+2, target.column+1, captures, target, boardData)
    }
    if(target.row+2 <= 8 && target.column - 1 > 0){
        captures = addCapture(target.row+2, target.column-1, captures, target, boardData)
    }
    if(target.row-2 >0 && target.column + 1 <= 8){
        captures = addCapture(target.row-2, target.column+1, captures, target, boardData)
    }
    if(target.row-2 >0 && target.column - 1 > 0){
        captures = addCapture(target.row-2, target.column-1, captures, target, boardData)
    }
    if(target.row+1 <= 8 && target.column + 2 <= 8){
        captures = addCapture(target.row+1, target.column+2, captures, target, boardData)
    }
    if(target.row+1 <= 8 && target.column - 2 > 0){
        captures = addCapture(target.row+1, target.column-2, captures, target, boardData)
    }
    if(target.row-1 > 0 && target.column + 2 <= 8){
        captures = addCapture(target.row-1, target.column+2, captures, target, boardData)
    }
    if(target.row-1 > 0 && target.column - 2 > 0){
        captures = addCapture(target.row-1, target.column-2, captures, target, boardData)
    }
    return captures
}

export const generateRookCaptures = (target, captures, boardData) => {
    let i = 1
    while(target.row+i <=8){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column, boardData))){
            captures = addCapture(target.row+i, target.column, captures, target, boardData)
            break;
        }
        i++
    }        

    i =-1
    while(target.row+i > 0){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column, boardData))){
            captures = addCapture(target.row+i, target.column, captures, target, boardData)
            break;
        }
        i--
    }  
    
    i =1
    while(target.column+i <= 8){
        if(!squareIsEmpty(fetchSquare(target.row,target.column+i, boardData))){
            captures = addCapture(target.row, target.column+i, captures, target, boardData)
            break;
        }
        i++
    }   

    i =-1
    while(target.column+i > 0){
        if(!squareIsEmpty(fetchSquare(target.row,target.column+i, boardData))){
            captures = addCapture(target.row, target.column+i, captures, target, boardData)
            break;
        }
        i--
    }   

    return captures
}

export const generateBishopCaptures = (target, captures, boardData) => {
    let i = 1;
    let j = 1;
    while(target.row+i <=8 && target.column + j <= 8){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j, boardData))){
            captures = addCapture(target.row+i, target.column+j, captures, target, boardData)
            break;
        }
        i++
        j++
    }

    i = -1;
    j = 1;
    while(target.row+i > 0 && target.column + j <= 8){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j, boardData))){
            captures = addCapture(target.row+i, target.column+j, captures, target, boardData)
            break;
        }
        i--
        j++
    }

    i = 1;
    j = -1;
    while(target.row+i <=8 && target.column + j > 0){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j, boardData))){
            captures = addCapture(target.row+i, target.column+j, captures, target, boardData)
            break;
        }
        i++
        j--
    }

    i = -1;
    j = -1;
    while(target.row+i > 0 && target.column + j > 0){
        if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j, boardData))){
            captures = addCapture(target.row+i, target.column+j, captures, target, boardData)
            break;
        }
        i--
        j--
    }
    return captures
}

export const generateQueenCaptures = (target, captures, boardData) => {
    captures = generateBishopCaptures(target, captures, boardData)
    captures = generateRookCaptures(target, captures, boardData)
    return captures
}

export const generateKingCastles = (target, boardData) => {
    let castles = []
    
    if(target.piece.type != 'king'){return castles}

    target.piece.checkCastleStatus(boardData)

    if(!target.piece.canCastleKing && !target.piece.canCastleQueen){return castles}
    if(target.piece.hasMoved){return castles}

    if(target.piece.canCastleKing){
        castles = addMove(1,7,castles,boardData)
    }
    if(target.piece.canCastleQueen){
        castles = addMove(1,3,castles,boardData)
    }
    return castles


}

export const generateKingMoves = (target, moves, boardData) => {
    if(target.row+1 <= 8 && target.column+1 <= 8){
        moves = addMove(target.row+1,target.column+1,moves,boardData)
    }
    if(target.row-1 > 0 && target.column+1 <= 8){
        moves = addMove(target.row-1,target.column+1,moves,boardData)
    }
    if(target.row+1 <= 8 && target.column-1 > 0){
        moves = addMove(target.row+1,target.column-1,moves,boardData)
    }
    if(target.row-1 > 0 && target.column-1 > 0){
        moves = addMove(target.row-1,target.column-1,moves,boardData)
    }
    if(target.row+1 <= 8){
        moves = addMove(target.row+1,target.column,moves,boardData)
    }
    if(target.row-1 > 0 ){
        moves = addMove(target.row-1,target.column,moves,boardData)
    }
    if(target.column-1 > 0 ){
        moves = addMove(target.row,target.column-1,moves,boardData)
    }
    if(target.column+1 <= 8){
        moves = addMove(target.row,target.column+1,moves,boardData)
    }
    return moves
}

export const generateKingCaptures = (target, captures, boardData) => {
    if(target.row+1 <= 8 && target.column+1 <= 8){
        captures = addCapture(target.row+1, target.column+1, captures, target, boardData)
    }
    if(target.row-1 > 0 && target.column+1 <= 8){
        captures = addCapture(target.row-1,target.column+1,captures, target, boardData)
    }
    if(target.row+1 <= 8 && target.column-1 > 0){
        captures = addCapture(target.row+1,target.column-1,captures, target, boardData)
    }
    if(target.row-1 > 0 && target.column-1 > 0){
        captures = addCapture(target.row-1,target.column-1,captures, target, boardData)
    }
    if(target.row+1 <= 8){
        captures = addCapture(target.row+1,target.column,captures,target, boardData)
    }
    if(target.row-1 > 0 ){
        captures = addCapture(target.row-1,target.column,captures,target, boardData)
    }
    if(target.column-1 > 0 ){
        captures = addCapture(target.row,target.column-1,captures,target, boardData)
    }
    if(target.column+1 <= 8){
        captures = addCapture(target.row,target.column+1,captures,target, boardData)
    }

    return captures
}

export const checkForCheck = (boardData, color) => {
    if(color == 'white'){
        let whiteKing = boardData.filter((ele)=>{
            if(ele.piece == null){
                return false
            } else {
                return ele.piece.type=='king' && ele.piece.color=='white'
            }
            
        })[0]

    
        let blackBishops = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='bishop' && ele.piece.color=='black'}})
        let blackKnights = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='knight' && ele.piece.color=='black'}})
        let blackPawns = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='pawn' && ele.piece.color=='black'}})
        let blackRooks = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='rook' && ele.piece.color=='black'}})
        let blackQueen = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='queen' && ele.piece.color=='black'}})
        let blackPieces = [...blackBishops, ...blackKnights, ...blackPawns, ...blackQueen, ...blackRooks]
    
        let captures = []
        for(let piece of blackPieces){
            if(piece.piece.type == 'bishop'){
                captures = generateBishopCaptures(piece,captures,boardData)
            } else if(piece.piece.type == 'knight'){
                captures = generateKnightCaptures(piece,captures,boardData)
            } else if(piece.piece.type == 'rook'){
                captures = generateRookCaptures(piece,captures,boardData)
            } else if(piece.piece.type == 'pawn'){
                captures = generateBlackPawnCaptures(piece,captures,boardData)
            } else if(piece.piece.type == 'queen'){
                captures = generateQueenCaptures(piece,captures,boardData)
            }
        }

        return captures.includes(whiteKing)
    
    } else {
        let blackKing = boardData.filter((ele)=>{
            if(ele.piece == null){
                return false
            } else {
                return ele.piece.type=='king' && ele.piece.color=='black'
            }
            
        })[0]
    
        let blackBishops = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='bishop' && ele.piece.color=='white'}})
        let blackKnights = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='knight' && ele.piece.color=='white'}})
        let blackPawns = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='pawn' && ele.piece.color=='white'}})
        let blackRooks = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='rook' && ele.piece.color=='white'}})
        let blackQueen = boardData.filter((ele)=>{ if(ele.piece == null){return false} else { return ele.piece.type=='queen' && ele.piece.color=='white'}})
        let blackPieces = [...blackBishops, ...blackKnights, ...blackPawns, ...blackQueen, ...blackRooks]
    
        let captures = []
        for(let piece of blackPieces){
            if(piece.piece.type == 'bishop'){
                captures = generateBishopCaptures(piece,captures,boardData)
            } else if(piece.piece.type == 'knight'){
                captures = generateKnightCaptures(piece,captures,boardData)
            } else if(piece.piece.type == 'rook'){
                captures = generateRookCaptures(piece,captures,boardData)
            } else if(piece.piece.type == 'pawn'){
                captures = generatePawnCaptures(piece,captures,boardData)
            } else if(piece.piece.type == 'queen'){
                captures = generateQueenCaptures(piece,captures,boardData)
            }
        }
        return captures.includes(blackKing)
    
    }

}