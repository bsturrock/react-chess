import { useEffect, useState } from "react"
import Square from "../components/Square"
import './Board.css'
import Fen from "../scripts/fen"
import { generateBishopMoves, generateKnightMoves, generatePawnMoves, generateRookMoves, generateQueenMoves, generateKingMoves } from "../scripts/moves"
import { generateBishopCaptures, generateKnightCaptures, generatePawnCaptures, generateQueenCaptures, generateRookCaptures } from "../scripts/moves"
import { checkForCheck } from "../scripts/moves"
const Board = () => {

    const [boardData, setBoardData] = useState([])
    const [selectedSquare, setSelectedSquare] = useState(null)
    const [possibleMoves, setPossibleMoves] = useState([])
    const [possibleCaptures, setPossibleCaptures] = useState([])
    const [previousComputerSquare, setPreviousComputerSquare] = useState(null)
    const [newComputerSquare, setNewComputerSquare] = useState(null)
    const [whiteCheck, setWhiteCheck] = useState(false)
    const [blackCheck, setBlackCheck] = useState(false)

    const [gameData, setGameData] = useState({
        turn: 'white',
        moves: 0,
        halfMoveClock: 0,
        whiteCanCastle: true,
        blackCanCastle: true,
    })

    const fen = new Fen()

    const fetchSquare = (row, column) => {
        return boardData.filter((ele)=>ele.row==row && ele.column==column)[0]
    }

    const fetchComputerMove = async (newBoard) => {
        fen.calculatePosition(newBoard, gameData)
        let res = await fetch('https://stockfish.online/api/stockfish.php?fen=' + fen.position + '&depth=2&mode=bestmove')
        let res_json = await res.json()
        return res_json
    }

    const makeComputerMove = (move, newGameData) => {
        // let newHalfMoveClock = gameData.halfMoveClock
        // if(selectedSquare.piece.type != 'pawn'){
        //     newHalfMoveClock++
        // }
        let castling = false
        let start_square = fetchSquare(move.start.row, move.start.column)
        let end_square = fetchSquare(move.end.row, move.end.column)
        let oldRookSpace = fetchSquare(8,8)
        let newRookSpace = fetchSquare(8,6)

        let tempBoard = []

        console.log(newGameData.blackCanCastle, start_square.piece, end_square.row, end_square.column)


        if(newGameData.blackCanCastle && start_square.piece.type == 'king' && end_square.row == 8 && end_square.column == 7){
            console.log('BLACK IS CASTLING')
            castling = true
            tempBoard = boardData.filter((ele)=> ele!= start_square && ele!=end_square && ele!=oldRookSpace && ele!=newRookSpace)
        } else {
            tempBoard = boardData.filter((ele)=> ele!= start_square && ele!=end_square)
        }
 
        end_square.piece = start_square.piece
        start_square.piece = null
        let newBoard = []

        if(castling){
            newRookSpace.piece = oldRookSpace.piece
            oldRookSpace.piece = null
            newBoard = [...tempBoard, start_square, end_square, oldRookSpace, newRookSpace]
        } else {
            newBoard = [...tempBoard, start_square, end_square]
        }

        newBoard.sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })



        setBoardData(newBoard)
        setPreviousComputerSquare(start_square)
        setNewComputerSquare(end_square)
        setWhiteCheck(checkForCheck(newBoard, 'white'))
        setBlackCheck(checkForCheck(newBoard, 'black'))
        setGameData({
            moves: newGameData.moves+1,
            turn: 'white',
            //need changes here
            halfMoveClock: newGameData.halfMoveClock+1,
            whiteCanCastle: newGameData.whiteCanCastle,
            blackCanCastle: !castling
        })       
    }

    const computerTurn = (newGameData, newBoard) => {
        setTimeout( async ()=>{
            let move = await fetchComputerMove(newBoard)
            move = parseNotationOfMove(move)
            makeComputerMove(move, newGameData)
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

    const selectSquare = (target) => {
        if(target == selectedSquare){
            setSelectedSquare(null)
            generatePossibleMoves(null)
            generatePossibleCaptures(null)
        } else {
            setSelectedSquare(target)
            generatePossibleMoves(target)
            generatePossibleCaptures(target)
        }
        
    }
    
    const generatePossibleMoves = (target) => {
        let moves = []
        if(target==null){
            setPossibleMoves([])
            return
        }
        if(target.piece.type == 'pawn'){
            moves = generatePawnMoves(target, moves, boardData)
        } else if(target.piece.type == 'knight'){
            moves = generateKnightMoves(target, moves, boardData)
        } else if(target.piece.type == 'bishop'){
            moves = generateBishopMoves(target, moves, boardData)
        } else if(target.piece.type == 'rook'){
            moves = generateRookMoves(target, moves, boardData)
        } else if(target.piece.type == 'queen'){
            moves = generateQueenMoves(target, moves, boardData)
        } else if(target.piece.type == 'king'){
            moves = generateKingMoves(target, moves, boardData, gameData)
        }
        
        setPossibleMoves(moves)
    }

    const generatePossibleCaptures = (target) => {
        let captures = []
        if(target==null){
            setPossibleCaptures([])
            return
        }
        if(target.piece.type == 'pawn'){
            captures = generatePawnCaptures(target, captures, boardData)
        } else if(target.piece.type == 'knight'){
            captures = generateKnightCaptures(target, captures, boardData)
        } else if(target.piece.type == 'bishop'){
            captures = generateBishopCaptures(target, captures, boardData)
        } else if(target.piece.type == 'rook'){
            captures = generateRookCaptures(target, captures, boardData)
        } else if(target.piece.type == 'queen'){
            captures = generateQueenCaptures(target, captures, boardData)
        }
        
        setPossibleCaptures(captures)
    }

    const capturePiece = (target) => {

        let newHalfMoveClock = gameData.halfMoveClock
        if(selectedSquare.piece.type != 'pawn'){
            newHalfMoveClock++
        }

        //create copies of boardData
        let boardDataCopy = [...boardData]
        let targetCopy = boardDataCopy.filter((ele)=>ele==target)[0]
        let selectedSquareCopy = boardData.filter((ele)=>ele==selectedSquare)[0]
        let tempBoard = boardDataCopy.filter((ele)=> ele!= selectedSquareCopy && ele!=targetCopy)

        //exchange pieces between squares
        let enemyPiece = targetCopy.piece
        targetCopy.piece = selectedSquareCopy.piece
        selectedSquareCopy.piece = null

        //create prelimanary newBoard
        let newBoard = [...tempBoard, targetCopy, selectedSquareCopy]
        newBoard.sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })

        //see if new board contains a check for white
        let isWhiteInCheck = checkForCheck(newBoard, 'white')

        //undo these moves if it would put white in check
        if(isWhiteInCheck){
            selectedSquareCopy.piece = targetCopy.piece
            targetCopy.piece = enemyPiece
            return
        }

        //otherwise set new board data
        setBoardData(newBoard)
        selectSquare(null)
        setNewComputerSquare(null)
        setPreviousComputerSquare(null)

        //check for checks in newBoard
        setBlackCheck(checkForCheck(newBoard, 'black'))
        setWhiteCheck(isWhiteInCheck)

        //start computer turn
        computerTurn({
            moves: gameData.moves+1,
            turn: 'black',
            //need changes here
            halfMoveClock: newHalfMoveClock,
            whiteCanCastle: gameData.whiteCanCastle,
            blackCanCastle: gameData.blackCanCastle
        }, newBoard)   
    }

    const movePiece = (target) => {
        
        //
        if(target.piece!=null){
            selectSquare(target)
            return
        }

        if(possibleMoves.includes(target)){

            let castling = false

            let newHalfMoveClock = gameData.halfMoveClock
            if(selectedSquare.piece.type != 'pawn'){
                newHalfMoveClock++
            }

            //create copies of boardData
            let boardDataCopy = [...boardData]
            let targetCopy = boardDataCopy.filter((ele)=>ele==target)[0]
            let selectedSquareCopy = boardDataCopy.filter((ele)=>ele==selectedSquare)[0]
            let oldRookSpace = boardDataCopy.filter((ele)=>ele.row == 1 && ele.column == 8)[0]
            let newRookSpace = boardDataCopy.filter((ele)=>ele.row == 1 && ele.column == 6)[0]
            let tempBoard = boardDataCopy.filter((ele)=> ele!= selectedSquareCopy && ele!=targetCopy && ele!=oldRookSpace && ele!=newRookSpace)

            //castling
            if(selectedSquareCopy.piece.type=='king' && targetCopy.column == 7){
                castling = true
            }

            //exchange pieces between squares
            targetCopy.piece = selectedSquareCopy.piece
            selectedSquareCopy.piece = null

            if(castling){
                newRookSpace.piece = oldRookSpace.piece
                oldRookSpace.piece = null
            }

            //create prelimanary newBoard
            let newBoard = []
            if(selectedSquareCopy==newRookSpace || targetCopy==newRookSpace){
                newBoard = [...tempBoard, targetCopy, selectedSquareCopy, oldRookSpace]
            } else if(selectedSquareCopy == oldRookSpace || targetCopy == oldRookSpace){
                newBoard = [...tempBoard, targetCopy, selectedSquareCopy, newRookSpace]
            } else {
                newBoard = [...tempBoard, targetCopy, selectedSquareCopy, oldRookSpace, newRookSpace]
            }

            newBoard.sort((a,b)=>{
                return b.row - a.row || a.column - b.column
            })


            //see if new board contains a check for white
            let isWhiteInCheck = checkForCheck(newBoard, 'white')

            //undo these moves if it would put white in check
            if(isWhiteInCheck){
                selectedSquareCopy.piece = targetCopy.piece
                targetCopy.piece = null
                if(castling){
                    oldRookSpace.piece = {type: 'rook', color: 'white'}
                    newRookSpace.piece = null
                }
                return
            }

            //otherwise set new board data
            setBoardData(newBoard)
            selectSquare(null)
            setNewComputerSquare(null)
            setPreviousComputerSquare(null)

            //check for checks in newBoard
            setBlackCheck(checkForCheck(newBoard, 'black'))
            setWhiteCheck(isWhiteInCheck)

            //update gameData

            let newCastling = true
            if(castling){
                newCastling = false
            }

            //start computer turn with updated gameData
            computerTurn({
                moves: gameData.moves+1,
                turn: 'black',
                halfMoveClock: newHalfMoveClock,
                whiteCanCastle: newCastling,
                blackCanCastle: gameData.blackCanCastle
            }, newBoard)
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
                possibleCaptures={possibleCaptures}
                capturePiece={capturePiece}
                previousComputerSquare={previousComputerSquare}
                newComputerSquare={newComputerSquare}
                whiteCheck={whiteCheck}
                blackCheck={blackCheck}
            />)
        })

    return <>
        <div className="board">
            {renderedBoard}
        </div>
    </>
}

export default Board