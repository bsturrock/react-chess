import { useEffect, useState } from "react"
import Square from "../components/Square"
import './Board.css'
import Fen from "../scripts/fen"
const Board = () => {

    const [boardData, setBoardData] = useState([])
    const [selectedSquare, setSelectedSquare] = useState(null)
    const [possibleMoves, setPossibleMoves] = useState([])
    const [gameData, setGameData] = useState({
        turn: 'white',
        moves: 0,
        halfMoveClock: 0
    })
    const fen = new Fen()


    const fetchComputerMove = async () => {
        fen.calculatePosition(boardData, gameData)

        console.log(fen.position)

        let res = await fetch('https://stockfish.online/api/stockfish.php?fen=' + fen.position + '&depth=2&mode=bestmove')
        let res_json = await res.json()
        console.log(res_json)
        return res_json
    }

    const makeComputerMove = (move) => {

        // let newHalfMoveClock = gameData.halfMoveClock
        // if(selectedSquare.piece.type != 'pawn'){
        //     newHalfMoveClock++
        // }

        let start_square = fetchSquare(move.start.row, move.start.column)
        let end_square = fetchSquare(move.end.row, move.end.column)
        let tempBoard = boardData.filter((ele)=> ele!= start_square && ele!=end_square)
        end_square.piece = start_square.piece
        start_square.piece = null
        let newBoard = [...tempBoard, start_square, end_square]
        newBoard.sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })
        setBoardData(newBoard)
        setGameData({
            moves: gameData.moves+1,
            turn: 'white',
            //need changes here
            halfMoveClock: gameData.halfMoveClock+1
        })        



    }

    const computerTurn = () => {
        setTimeout( async ()=>{
            let move = await fetchComputerMove()
            move = parseNotationOfMove(move)
            makeComputerMove(move)

        },1000)
    }

    const parseNotationOfMove = (move) => {
        
        const columnMap = {
            'a' : 1,
            'b' : 2,
            'c' : 3,
            'd' : 4,
            'e' : 5,
            'f' : 6,
            'g' : 7,
            'h' : 8
        }
        move = move.data

        move = move.split(' ')[1]
        let start = move.substring(0,2)
        let end = move.substring(2)
        return({
            start: {
                column: columnMap[start.substring(0,1)],
                row: start.substring(1,2)
            },
            end: {
                column: columnMap[end.substring(0,1)],
                row: end.substring(1,2)
            }
        })
    }

    //maybe we don't even useEffect his, just call calculate when we make the call to stockfish
    // useEffect(()=>{
    //     fen.calculatePosition(boardData, gameData)
    //     console.log(fen.position)
    // },[boardData])


    const selectSquare = (target) => {
        if(target == selectedSquare){
            setSelectedSquare(null)
            generatePossibleMoves(null)
        } else {
            setSelectedSquare(target)
            generatePossibleMoves(target)
        }
        
    }

    const squareIsEmpty = (square) => {
        return square.piece == null
    }

    const fetchSquare = (row, column) => {
        return boardData.filter((ele)=>ele.row==row && ele.column==column)[0]
    }

    const addMove = (row, column, moves) => {
        let square = fetchSquare(row, column)
        if(squareIsEmpty(square)){
            return [...moves, square]
        } else {
            return moves
        }
    }
    
    const generatePawnMoves = (target, moves) => {
        moves = addMove(target.row+1, target.column, moves)
        if(target.row == 2){
            moves = addMove(target.row+2, target.column, moves)
        }
        return moves
    }
    
    const generateKnightMoves = (target, moves) => {
        if(target.row+2 <= 8 && target.column + 1 <= 8){
            moves = addMove(target.row+2, target.column+1, moves)
        }
        if(target.row+2 <= 8 && target.column - 1 > 0){
            moves = addMove(target.row+2, target.column-1, moves)
        }
        if(target.row-2 >0 && target.column + 1 <= 8){
            moves = addMove(target.row-2, target.column+1, moves)
        }
        if(target.row-2 >0 && target.column - 1 > 0){
            moves = addMove(target.row-2, target.column-1, moves)
        }
        if(target.row+1 <= 8 && target.column + 2 <= 8){
            moves = addMove(target.row+1, target.column+2, moves)
        }
        if(target.row+1 <= 8 && target.column - 2 > 0){
            moves = addMove(target.row+1, target.column-2, moves)
        }
        if(target.row-1 > 0 && target.column + 2 <= 8){
            moves = addMove(target.row-1, target.column+2, moves)
        }
        if(target.row-1 > 0 && target.column - 2 > 0){
            moves = addMove(target.row-1, target.column-2, moves)
        }
        return moves
    }
    
    const generateRookMoves = (target, moves) => {
        let i = 1
        while(target.row+i <=8){
            if(!squareIsEmpty(fetchSquare(target.row+i,target.column))){
                break;
            }
            moves = addMove(target.row+i, target.column,moves)
            i++
        }        
    
        i =-1
        while(target.row+i > 0){
            if(!squareIsEmpty(fetchSquare(target.row+i,target.column))){
                break;
            }
            moves = addMove(target.row+i, target.column,moves)
            i--
        }  
        
        i =1
        while(target.column+i <= 8){
            if(!squareIsEmpty(fetchSquare(target.row,target.column+i))){
                break;
            }
            moves = addMove(target.row, target.column+i,moves)
            i++
        }   
    
        i =-1
        while(target.column+i > 0){
            if(!squareIsEmpty(fetchSquare(target.row,target.column+i))){
                break;
            }
            moves = addMove(target.row, target.column+i,moves)
            i--
        }   
    
        return moves
    }
    
    const generateBishopMoves = (target, moves) => {
        let i = 1;
        let j = 1;
        while(target.row+i <=8 && target.column + j <= 8){
            if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j))){
                break;
            }
            moves = addMove(target.row+i, target.column+j,moves)
            i++
            j++
        }
    
        i = -1;
        j = 1;
        while(target.row+i > 0 && target.column + j <= 8){
            if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j))){
                break;
            }
            moves = addMove(target.row+i, target.column+j,moves)
            i--
            j++
        }
    
        i = 1;
        j = -1;
        while(target.row+i <=8 && target.column + j > 0){
            if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j))){
                break;
            }
            moves = addMove(target.row+i, target.column+j,moves)
            i++
            j--
        }
    
        i = -1;
        j = -1;
        while(target.row+i > 0 && target.column + j > 0){
            if(!squareIsEmpty(fetchSquare(target.row+i,target.column+j))){
                break;
            }
            moves = addMove(target.row+i, target.column+j,moves)
            i--
            j--
        }
        return moves
    }
    
    const generateQueenMoves = (target, moves) => {
        moves = generateBishopMoves(target, moves)
        moves = generateRookMoves(target, moves)
        return moves
    }
    
    const generatePossibleMoves = (target) => {
        console.log(target)
        let moves = []
        if(target==null){
            setPossibleMoves([])
            return
        }
        if(target.piece.type == 'pawn'){
            moves = generatePawnMoves(target, moves)
        } else if(target.piece.type == 'knight'){
            moves = generateKnightMoves(target, moves)
        } else if(target.piece.type == 'bishop'){
            moves = generateBishopMoves(target, moves)
        } else if(target.piece.type == 'rook'){
            moves = generateRookMoves(target, moves)
        } else if(target.piece.type == 'queen'){
            moves = generateQueenMoves(target, moves)
        }
        
        setPossibleMoves(moves)
    }

    const movePiece = (target) => {
        
        if(target.piece!=null){
            selectSquare(target)
            return
        }

        if(possibleMoves.includes(target)){

            let newHalfMoveClock = gameData.halfMoveClock
            if(selectedSquare.piece.type != 'pawn'){
                newHalfMoveClock++
            }

            let tempBoard = boardData.filter((ele)=> ele!= selectedSquare && ele!=target)
            target.piece = selectedSquare.piece
            selectedSquare.piece = null
            let newBoard = [...tempBoard, target, selectedSquare]
            newBoard.sort((a,b)=>{
                return b.row - a.row || a.column - b.column
            })
            setBoardData(newBoard)
            selectSquare(null)
            setGameData({
                moves: gameData.moves+1,
                turn: 'black',
                //need changes here
                halfMoveClock: newHalfMoveClock
            })
            computerTurn()
        }
        

    }

    const buildBoard = () => {
        const board = []
        for(let i=1; i<9;i++){
            for(let j=8; j>0; j--){
                if(i==2){
                    board.push({row: i, column: j, piece:{color:'white',type:'pawn'}})
                } else if(i==1){
                    if(j==1 || j==8){
                        board.push({row: i, column: j, piece:{color:'white',type:'rook'}})
                    } else if (j==2 || j==7){
                        board.push({row: i, column: j, piece:{color:'white',type:'knight'}})
                    } else if (j==3 || j==6){
                        board.push({row: i, column: j, piece:{color:'white',type:'bishop'}})
                    } else if (j==4){
                        board.push({row: i, column: j, piece:{color:'white',type:'queen'}})
                    } else if (j==5){
                        board.push({row: i, column: j, piece:{color:'white',type:'king'}})
                    }
                } else if(i==7){
                    board.push({row: i, column: j, piece:{color:'black',type:'pawn'}})
                } else if(i==8){
                    if(j==1 || j==8){
                        board.push({row: i, column: j, piece:{color:'black',type:'rook'}})
                    } else if (j==2 || j==7){
                        board.push({row: i, column: j, piece:{color:'black',type:'knight'}})
                    } else if (j==3 || j==6){
                        board.push({row: i, column: j, piece:{color:'black',type:'bishop'}})
                    } else if (j==4){
                        board.push({row: i, column: j, piece:{color:'black',type:'queen'}})
                    } else if (j==5){
                        board.push({row: i, column: j, piece:{color:'black',type:'king'}})
                    }
                }  else {
                    board.push({row: i, column: j, piece:null})
                }
            }
        }
        board.sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })
        setBoardData(board)
    }

    useEffect(()=>{
        buildBoard()
    },[])

    const renderedBoard = boardData.map((ele, index)=>{        
        return (
            <Square 
                gameData={gameData}
                key={index} 
                data={ele}
                selectedSquare={selectedSquare}
                selectSquare={selectSquare}
                movePiece={movePiece}
                possibleMoves={possibleMoves}
                generatePossibleMoves={generatePossibleMoves}
            />)
        })

    return <>
        <div className="board">
            {renderedBoard}
        </div>
    </>
}

export default Board