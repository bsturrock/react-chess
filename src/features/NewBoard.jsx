import NewSquare from "../components/NewSquare"
import useStore from "../scripts/store"
import { useState } from "react"
import './Board.css'
import { useEffect } from "react"
import Fen from "../scripts/fen"
import { generateBishopCaptures, generatePawnCaptures,generateQueenCaptures, generateKnightCaptures, generateRookCaptures, generateBlackPawnCaptures, generateKingMoves, generateKingCaptures, generatePawnMoves, generateBishopMoves, generateKnightMoves, generateQueenMoves, generateRookMoves } from '../scripts/newMoves'
import { buildBoard } from "../scripts/store"

const NewBoard = () => {

    const board = useStore((store)=>store.board)
    const renderedSquares = board.map((ele, index)=><NewSquare key={index} data={ele}/>)
    const turn = useStore((store)=>store.turn)
    const setBoard = useStore((store)=>store.setBoard)
    const setTurn = useStore((store)=>store.setTurn)
    const setChecks = useStore((store)=>store.setChecks)
    const setStartComputerMove = useStore((store)=>store.setStartComputerMove)
    const setEndComputerMove = useStore((store)=>store.setEndComputerMove)
    const setActiveSquare = useStore((store)=>store.setActiveSquare)
    const setHasActiveSquare = useStore((store)=>store.setHasActiveSquare)
    const setCheckmates = useStore((store)=> store.setCheckmates)
    const setPossibleMoves = useStore((store)=>store.setPossibleMoves)
    const clearPossibleMoves = useStore((store)=>store.clearPossibleMoves)
    const setPossibleCaptures = useStore((store)=>store.setPossibleCaptures)
    const clearPossibleCaptures = useStore((store)=>store.clearPossibleCaptures)
    const checkmates = useStore((store)=>store.checkmates)
    const [gameOver, setGameOver] = useState(false)
    
    const fen = new Fen()
    
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

        let moves = move.split(' ')
        moves = [moves[1]]


        const parsedMoves = moves.map((ele)=>{
            let start = ele.substring(0,2)
            let end = ele.substring(2)
            return {
                start: {
                    column: columnMap[start.substring(0,1)],
                    row: start.substring(1,2)
                },
                end: {
                    column: columnMap[end.substring(0,1)],
                    row: end.substring(1,2)
                }
            }
        })

        return(parsedMoves[Math.floor(Math.random()*parsedMoves.length)])
    }

    const fetchComputerMove = async () => {
        let res = await fetch('https://stockfish.online/api/stockfish.php?fen=' + fen.position + '&depth=1&mode=bestmove')
        let res_json = await res.json()

        if(res_json.data == 'Game over in position.'){
            return 'black checkmate'
        }
        let move = parseNotationOfMove(res_json)
        return move
    }

    const getRecommendedMove = async () => {
        if(turn!='white'){
            return
        }
        fen.calculatePosition(board,turn)
        let res = await fetch('https://stockfish.online/api/stockfish.php?fen=' + fen.position + '&depth=4&mode=bestmove')
        let res_json = await res.json()
        let move = parseNotationOfMove(res_json)
        const {start, end} = move  
        const startSquare = board.filter((ele)=>ele.row == start.row && ele.column == start.column)[0]
        const endSquare = board.filter((ele)=>ele.row == end.row && ele.column == end.column)[0]
        
        setActiveSquare(startSquare)
        setHasActiveSquare(true)
        
        if(endSquare.piece==null){
            setPossibleMoves([endSquare])
            clearPossibleCaptures()
        } else {
            setPossibleCaptures([endSquare])
            clearPossibleMoves()
        }
        
    }

    const checkForCheck = (newBoard) => {

        let whiteCaptures = []
        let whiteSquares = newBoard.filter((ele)=>ele.piece!=null && ele.piece.color == 'white');
        
        for(let square of whiteSquares){
            if(square.piece == null){continue}
            if(square.piece.type == 'pawn'){
                whiteCaptures = generatePawnCaptures(square, whiteCaptures, newBoard, true)
            } else if (square.piece.type == 'bishop'){
                whiteCaptures = generateBishopCaptures(square, whiteCaptures, newBoard, true)
            } else if (square.piece.type == 'knight'){
                whiteCaptures = generateKnightCaptures(square, whiteCaptures, newBoard, true)
            } else if (square.piece.type == 'rook'){
                whiteCaptures = generateRookCaptures(square, whiteCaptures, newBoard, true)
            } else if (square.piece.type == 'queen'){
                whiteCaptures = generateQueenCaptures(square, whiteCaptures, newBoard, true)
            } else if(square.piece.type == 'king'){
                whiteCaptures = generateKingCaptures(square, whiteCaptures,newBoard, true)
            }
        }

        let blackCaptures = []
        let blackSquares = newBoard.filter((ele)=>ele.piece!=null && ele.piece.color == 'black');
        
        for(let square of blackSquares){
            if(square.piece == null){continue}
            if(square.piece.type == 'pawn'){
                blackCaptures = generateBlackPawnCaptures(square, blackCaptures, newBoard, true)
            } else if (square.piece.type == 'bishop'){
                blackCaptures = generateBishopCaptures(square, blackCaptures, newBoard, true)
            } else if (square.piece.type == 'knight'){
                blackCaptures = generateKnightCaptures(square, blackCaptures, newBoard, true)
            } else if (square.piece.type == 'rook'){
                blackCaptures = generateRookCaptures(square, blackCaptures, newBoard, true)
            } else if (square.piece.type == 'queen'){
                blackCaptures = generateQueenCaptures(square, blackCaptures, newBoard, true)
            } else if (square.piece.type == 'king'){
                blackCaptures = generateKingCaptures(square, blackCaptures, newBoard, true)
            }
        }

        return {
            whiteInCheck: blackCaptures.length > 0,
            blackInCheck: whiteCaptures.length > 0,
            allchecks: [...whiteCaptures, ...blackCaptures]
        }

    }

    const checkForCheckmate = (newBoard) => {
        console.log('starting checkmate check.')
        let kingMoves = []
        let whiteKing = newBoard.filter((ele)=>ele.piece!=null && ele.piece.color == 'white' && ele.piece.type == 'king')[0];

        kingMoves = generateKingMoves(whiteKing,kingMoves,newBoard)
        kingMoves = generateKingCaptures(whiteKing,kingMoves,newBoard)

        for(let move of kingMoves){
            let testBoard = buildPotentialBoard(whiteKing, move)
            let {whiteInCheck} = checkForCheck(testBoard)
            if(!whiteInCheck){
                return []
            }
        }
        console.log('completed king moves check')

        let whiteCaptures = []
        let whiteSquares = newBoard.filter((ele)=>ele.piece!=null && ele.piece.color == 'white')
        for(let square of whiteSquares){
            if(square.piece == null){continue}
            if(square.piece.type == 'pawn'){
                whiteCaptures = generatePawnCaptures(square, whiteCaptures, newBoard, true)
                whiteCaptures = generatePawnMoves(square,whiteCaptures,newBoard)
            } else if (square.piece.type == 'bishop'){
                whiteCaptures = generateBishopCaptures(square, whiteCaptures, newBoard, true)
                whiteCaptures = generateBishopMoves(square,whiteCaptures,newBoard)
            } else if (square.piece.type == 'knight'){
                whiteCaptures = generateKnightCaptures(square, whiteCaptures, newBoard, true)
                whiteCaptures = generateKnightMoves(square,whiteCaptures,newBoard)
            } else if (square.piece.type == 'rook'){
                whiteCaptures = generateRookCaptures(square, whiteCaptures, newBoard, true)
                whiteCaptures = generateRookMoves(square,whiteCaptures,newBoard)
            } else if (square.piece.type == 'queen'){
                whiteCaptures = generateQueenCaptures(square, whiteCaptures, newBoard, true)
                whiteCaptures = generateQueenMoves(square,whiteCaptures,newBoard)
            }

            for(let move of whiteCaptures){
                let testBoard = buildPotentialBoard(square, move)
                let {whiteInCheck} = checkForCheck(testBoard)
                if(!whiteInCheck){
                    return []
                }
            }
            whiteCaptures = []
        }
        return [whiteKing]
    }

    const buildPotentialBoardAfterCastle = (start, end) => {
        const {row:startRow, column:startCol} = start
        const {row:endRow, column:endCol} = end
        let startSquare = [...board].filter((ele)=>ele.row == startRow && ele.column == startCol)[0]
        let endSquare = [...board].filter((ele)=>ele.row == endRow && ele.column == endCol)[0]

        let rookStart = endSquare.column == 7 ? [...board].filter((ele)=>ele.row==8 && ele.column == 8)[0] : [...board].filter((ele)=>ele.row==8 && ele.column == 1)[0]
        let rookEnd = endSquare.column == 7 ? [...board].filter((ele)=>ele.row==8 && ele.column == 6)[0] : [...board].filter((ele)=>ele.row==8 && ele.column == 4)[0]
        let tempBoard = [...board].filter((ele)=>ele!=startSquare && ele!=endSquare && ele!=rookStart && ele!=rookEnd)
        let tempStart = {...startSquare}
        let tempEnd = {...endSquare}

        tempEnd.piece = tempStart.piece;
        tempStart.piece = null
        tempEnd.piece.hasMoved = true
        
        rookEnd.piece = rookStart.piece;
        rookStart.piece = null

        const newBoard = [...tempBoard, tempStart, tempEnd, rookEnd, rookStart].sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })

        tempEnd.piece.checkCastleStatus(newBoard)


        return newBoard
    }

    const buildPotentialBoard = (start, end) => {
        const {row:startRow, column:startCol} = start
        const {row:endRow, column:endCol} = end

        let startSquare = [...board].filter((ele)=>ele.row == startRow && ele.column == startCol)[0]
        let endSquare = [...board].filter((ele)=>ele.row == endRow && ele.column == endCol)[0]

        let tempBoard = [...board].filter((ele)=>ele!=startSquare && ele!=endSquare)
        let tempStart = {...startSquare}
        let tempEnd = {...endSquare} 

        tempEnd.piece = tempStart.piece;
        tempStart.piece = null

        if(tempEnd.piece.type == 'pawn' && tempEnd.piece.color == 'white' && tempEnd.row == 4 && tempEnd.piece.hasMoved == false){
            tempEnd.piece.canEnPassant = true
        }

        tempEnd.piece.hasMoved = true

        if(tempEnd.piece.type == 'pawn' && tempEnd.piece.color == 'color' && tempEnd.row == 1){
            tempEnd.piece = tempEnd.piece.promote()
        }

        return [...tempBoard, tempStart, tempEnd].sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })
    }

    const makeComputerMove = (move) => {

        if(move == 'black checkmate'){
            let blackKing = board.filter((ele)=>ele.piece!= null && ele.piece.type == 'king' && ele.piece.color == 'black')[0]
            setCheckmates([blackKing])
            return
        }

        const {start, end} = move
        let newBoard
        let startSquare = board.filter((ele)=>ele.row == start.row && ele.column == start.column)[0]
        if(start.row == 8 && start.column == 5 && end.row == 8 && end.column == 7 && startSquare.piece.type == 'king' && startSquare.piece.color == 'black'){
            newBoard = buildPotentialBoardAfterCastle(start, end)
        } else if(start.row == 8 && start.column == 5 && end.row == 8 && end.column == 3 && startSquare.piece.type == 'king' && startSquare.piece.color == 'black') {
            newBoard = buildPotentialBoardAfterCastle(start, end)
        } else {
            newBoard = buildPotentialBoard(start, end)
        }

        setBoard(newBoard)
        setTurn('white')

        const {row:startRow, column:startCol} = start
        const {row:endRow, column:endCol} = end

        let xStartSquare = [...newBoard].filter((ele)=>ele.row == startRow && ele.column == startCol)[0]
        let xEndSquare = [...newBoard].filter((ele)=>ele.row == endRow && ele.column == endCol)[0]

        setStartComputerMove(xStartSquare)
        setEndComputerMove(xEndSquare)

    }

    useEffect(()=>{

        if(turn=='black'){
            fen.calculatePosition(board, turn)
            setTimeout(async () => {
                let move = await fetchComputerMove()
                makeComputerMove(move)
            },1000)
        }

    }, [turn])

    useEffect(()=>{
        if(turn == 'white'){
            let {allchecks} = checkForCheck(board)
            setChecks(allchecks)
            if(allchecks.length > 0){
                let checkmates = checkForCheckmate(board)
                setCheckmates(checkmates)
            } else {
                setCheckmates([])
            }
        }
    },[board])

    useEffect(()=>{
        if(checkmates.length > 0){
            setGameOver(true)
        }
    },[checkmates])

    const restartGame = () => {
        setGameOver(false);
        let newBoard = buildBoard()
        setBoard(newBoard)
        setTurn('white')
        clearPossibleCaptures()
        clearPossibleMoves()

    }

    return <>
        <div className="board">
            {renderedSquares}
        </div>
        <div onClick={getRecommendedMove} className="recommendedMove">Recommend a Move</div>
{gameOver && <div className="gameOver">
            <h1>Game Over!</h1>
            <h2>Play Again?</h2>
            <div className="buttons">
                <div onClick={restartGame} className="button">Yes</div>
                <div className="button">No</div>
            </div>
        </div>
        }

    </>

}

export default NewBoard 
