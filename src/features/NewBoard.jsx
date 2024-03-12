import NewSquare from "../components/NewSquare"
import useStore from "../scripts/store"
import './Board.css'
import { useEffect } from "react"
import Fen from "../scripts/fen"
const NewBoard = () => {

    const board = useStore((store)=>store.board)
    const renderedSquares = board.map((ele, index)=><NewSquare key={index} data={ele}/>)
    const turn = useStore((store)=>store.turn)
    const setBoard = useStore((store)=>store.setBoard)
    const setTurn = useStore((store)=>store.setTurn)

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

        const [x, move1, y, move2] = move.split(' ')
        const moves = [move1]

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
        console.log(res_json)
        let move = parseNotationOfMove(res_json)
        console.log(move)
        return move
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
        const {start, end} = move
        let newBoard
        if(start.row == 8 && start.column == 5 && end.row == 8 && end.column == 7){
            newBoard = buildPotentialBoardAfterCastle(start, end)
        } else if(start.row == 8 && start.column == 5 && end.row == 8 && end.column == 3) {
            newBoard = buildPotentialBoardAfterCastle(start, end)
        } else {
            newBoard = buildPotentialBoard(start, end)
        }

                //If won't be in check
        setBoard(newBoard)
        setTurn('white')

    }

    useEffect(()=>{

        if(turn=='black'){
            fen.calculatePosition(board, turn)
            console.log(fen.position)
            setTimeout(async () => {
                let move = await fetchComputerMove()
                makeComputerMove(move)
            },1000)
            
        }
    }, [turn])

    return <>
        <div className="board">
            {renderedSquares}
        </div>
    </>

}

export default NewBoard 
