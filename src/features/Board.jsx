import { useEffect, useState } from "react"
import Square from "../components/Square"
import './Board.css'
import Fen from "../scripts/fen"
import { generateBishopMoves, generateKnightMoves, generatePawnMoves, generateRookMoves, generateQueenMoves } from "../scripts/moves"
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

    const [gameData, setGameData] = useState({
        turn: 'white',
        moves: 0,
        halfMoveClock: 0
    })
    const fen = new Fen()

    const fetchSquare = (row, column) => {
        return boardData.filter((ele)=>ele.row==row && ele.column==column)[0]
    }

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
        setPreviousComputerSquare(start_square)
        setNewComputerSquare(end_square)
        setWhiteCheck(checkForCheck(newBoard))
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
            halfMoveClock: gameData.halfMoveClock+1
        })
        computerTurn()        
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
            setNewComputerSquare(null)
            setPreviousComputerSquare(null)
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
                possibleCaptures={possibleCaptures}
                capturePiece={capturePiece}
                previousComputerSquare={previousComputerSquare}
                newComputerSquare={newComputerSquare}
                whiteCheck={whiteCheck}
            />)
        })

    return <>
        <div className="board">
            {renderedBoard}
        </div>
    </>
}

export default Board