

class Fen{
    constructor(){
        this.position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        this.moves = 0
    }

    calculatePosition(boardData, turn){
        this.moves++
        let boardDataCopy = [...boardData].reverse()
        let mystr = ''
        let rank = 8
        let file = 1
        let whiteKing = boardDataCopy.filter((ele)=>ele.piece!= null && ele.piece.type == 'king' && ele.piece.color == 'white')[0]
        let blackKing = boardDataCopy.filter((ele)=>ele.piece!= null && ele.piece.type == 'king' && ele.piece.color == 'black')[0]
        whiteKing.piece.checkCastleStatus(boardData)
        blackKing.piece.checkCastleStatus(boardData)

        for(rank= 8;rank>0;rank--){
            let counter = 0
            for(file= 1;file<10;file++){
                let square = boardDataCopy.filter((ele)=>ele.column==file && ele.row == rank)
                if(square.length != 0){
                    square = square[0]
                }
                if(file == 9){
                    if(counter > 0){
                        mystr += counter
                        counter = 0
                    }
                    mystr += '/'
                } else if(square.piece == null){
                    counter++
                } else {
                    if(counter > 0){
                        mystr+=counter
                        counter = 0
                    }
                    if(square.piece.color == 'black'){
                        if(square.piece.type == 'pawn'){
                            mystr += 'p'
                        } else if(square.piece.type == 'knight'){
                            mystr += 'n'
                        } else if(square.piece.type == 'bishop'){
                            mystr += 'b'
                        } else if(square.piece.type == 'rook'){
                            mystr += 'r'
                        } else if(square.piece.type == 'queen'){
                            mystr += 'q'
                        } else if(square.piece.type == 'king'){
                            mystr += 'k'
                        }
                    } else if(square.piece.color == 'white'){
                        if(square.piece.type == 'pawn'){
                            mystr += 'P'
                        } else if(square.piece.type == 'knight'){
                            mystr += 'N'
                        } else if(square.piece.type == 'bishop'){
                            mystr += 'B'
                        } else if(square.piece.type == 'rook'){
                            mystr += 'R'
                        } else if(square.piece.type == 'queen'){
                            mystr += 'Q'
                        } else if(square.piece.type == 'king'){
                            mystr += 'K'
                        }
                    }
                }
            }
        }

        mystr = mystr.slice(0,mystr.length-1)

        if(turn == 'white'){
            mystr += ' w'
        } else {
            mystr += ' b'
        }

        //castling
        let castleString = ' '
        if(whiteKing.piece.castleKingAvailable){
            castleString+= 'K'
        }
        if(whiteKing.piece.castleQueenAvailable){
            castleString+= 'Q'
        }
        if(blackKing.piece.castleKingAvailable){
            castleString+= 'k'
        }
        if(blackKing.piece.castleQueenAvailable){
            castleString+= 'q'
        }

        if(castleString == ' '){
            castleString = ' -'
        }

        mystr += castleString

        //en passant
        mystr += ' -'

        mystr += ' ' + this.moves

        mystr += ' ' + this.moves

        this.position = mystr




    }

}


export default Fen