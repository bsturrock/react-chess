
import './Square.css'
import useStore from '../scripts/store'
import { generateBishopMoves, generatePawnMoves,generateKingMoves, generateKnightMoves, generateRookMoves, generateQueenMoves } from '../scripts/newMoves'
import { generateBishopCaptures, generatePawnCaptures,generateQueenCaptures, generateKnightCaptures, generateRookCaptures, generateKingCaptures } from '../scripts/newMoves'
import { generateKingCastles } from '../scripts/newMoves'

const NewSquare = ({data}) => {
    const {piece} = data
    const activeSquare = useStore((store)=>store.activeSquare)
    const setActiveSquare = useStore((store)=>store.setActiveSquare)
    const clearActiveSquare = useStore((store)=>store.clearActiveSquare)
    const setHasActiveSquare = useStore((store)=>store.setHasActiveSquare)
    
    const board = useStore((store)=>store.board)
    const setBoard = useStore((store)=>store.setBoard)

    const possibleMoves = useStore((store)=>store.possibleMoves)
    const clearPossibleMoves = useStore((store)=>store.clearPossibleMoves)
    const setPossibleMoves = useStore((store)=>store.setPossibleMoves)

    const possibleCaptures = useStore((store)=>store.possibleCaptures)
    const setPossibleCaptures = useStore((store)=>store.setPossibleCaptures)
    const clearPossibleCaptures = useStore((store)=>store.clearPossibleCaptures)

    const possibleCastles = useStore((store)=>store.possibleCastles)
    const setPossibleCastles = useStore((store)=>store.setPossibleCastles)
    const clearPossibleCastles = useStore((store)=>store.clearPossibleCastles)

    const isMove = possibleMoves.includes(data)
    const isCapture = possibleCaptures.includes(data)
    const isCastle = possibleCastles.includes(data)

    const colorClass = (data.row+data.column)%2==0?' dark':' light'
    const pieceClass = piece==null ? '' : ' ' + piece.color + ' ' + piece.type
    const hoverableClass = piece==null || piece.color == 'black' ? '' : ' hoverable'
    const activeClass = activeSquare == data ? ' active' : ''
    const moveClass = isMove ? ' move' : ''
    const captureClass = isCapture ? ' capture' : ''
    const castleClass = isCastle ? ' castle' : ''


    const generatePossibleMoves = (target) => {
        let moves = []
        if(target.piece==null){setPossibleMoves(moves)}

        if(target.piece.type == 'pawn'){
            moves = generatePawnMoves(target, moves, board)
        } else if(target.piece.type == 'knight'){
            moves = generateKnightMoves(target, moves, board)
        } else if(target.piece.type == 'bishop'){
            moves = generateBishopMoves(target, moves, board)
        } else if(target.piece.type == 'rook'){
            moves = generateRookMoves(target, moves, board)
        } else if(target.piece.type == 'queen'){
            moves = generateQueenMoves(target, moves, board)
        } else if(target.piece.type == 'king'){
            moves = generateKingMoves(target, moves, board)
        }
        
        setPossibleMoves(moves)
    }

    const generatePossibleCaptures = (target) => {
        let captures = []
        if(target.piece==null){setPossibleCaptures([]);return}
        if(target.piece.type == 'pawn'){
            captures = generatePawnCaptures(target, captures, board)
        } else if(target.piece.type == 'knight'){
            captures = generateKnightCaptures(target, captures, board)
        } else if(target.piece.type == 'bishop'){
            captures = generateBishopCaptures(target, captures, board)
        } else if(target.piece.type == 'rook'){
            captures = generateRookCaptures(target, captures, board)
        } else if(target.piece.type == 'queen'){
            captures = generateQueenCaptures(target, captures, board)
        } else if(target.piece.type == 'king'){
            captures = generateKingCaptures(target, captures, board)
        }
        
        setPossibleCaptures(captures)
    }

    const generatePossibleCastles = (target) => {

        if(target.piece==null){clearPossibleCastles(); return}

        const castles = generateKingCastles(target, board)
        setPossibleCastles(castles)
    }

    const clearSquareAndMoves = () => {
        clearActiveSquare();
        setHasActiveSquare(false);
        clearPossibleMoves();
        clearPossibleCaptures();
        clearPossibleCastles();
    }

    const selectPiece = () => {
        setActiveSquare(data)
        setHasActiveSquare(true)
        generatePossibleMoves(data)
        generatePossibleCaptures(data)
        generatePossibleCastles(data)
    }

    const buildPotentialBoard = (startSquare, endSquare) => {
        let tempBoard = [...board].filter((ele)=>ele!=startSquare && ele!=endSquare)
        let tempStart = {...startSquare}
        let tempEnd = {...endSquare}

        tempEnd.piece = tempStart.piece;
        tempStart.piece = null
        tempEnd.piece.hasMoved = true

        if(tempEnd.piece.type == 'pawn' && tempEnd.piece.color == 'white' && tempEnd.row == 8){
            tempEnd.piece = tempEnd.piece.promote()
        }

        return [...tempBoard, tempStart, tempEnd].sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })
    }

    const buildPotentialBoardAfterCastle = (startSquare, endSquare, direction) => {
        let rookStart = direction == 'king' ? [...board].filter((ele)=>ele.row==1 && ele.column == 8)[0] : [...board].filter((ele)=>ele.row==1 && ele.column == 1)[0]
        let rookEnd = direction == 'king' ? [...board].filter((ele)=>ele.row==1 && ele.column == 6)[0] : [...board].filter((ele)=>ele.row==1 && ele.column == 4)[0]
        let tempBoard = [...board].filter((ele)=>ele!=startSquare && ele!=endSquare && ele!=rookStart && ele!=rookEnd)
        let tempStart = {...startSquare}
        let tempEnd = {...endSquare}

        tempEnd.piece = tempStart.piece;
        tempStart.piece = null
        tempEnd.piece.hasMoved = true
        rookEnd.piece = rookStart.piece;
        rookStart.piece = null

        return [...tempBoard, tempStart, tempEnd, rookEnd, rookStart].sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })
    }

    const movePiece = (startSquare, endSquare) => {

        const newBoard = buildPotentialBoard(startSquare, endSquare)

        //If won't be in check
        setBoard(newBoard)
        clearSquareAndMoves()
        
    }

    const capturePiece = (startSquare, endSquare) => {
        const newBoard = buildPotentialBoard(startSquare, endSquare)

        //If won't be in check
        setBoard(newBoard)
        clearSquareAndMoves()
    }

    const castlePiece = (startSquare, endSquare) => {
        let direction = endSquare.column == 7 ? 'king' : 'queen'
        const newBoard = buildPotentialBoardAfterCastle(startSquare,endSquare,direction)
        //If won't be in check
        setBoard(newBoard)
        clearSquareAndMoves()
    }

    const handleClick = () => {

        if(isMove){
            movePiece(activeSquare, data)
        } else if(isCapture){
            capturePiece(activeSquare, data)
        } else if(isCastle){
            castlePiece(activeSquare, data)
        }else {
            if(piece==null){return}
            if(piece.color=='black'){clearSquareAndMoves(); return}
            if(activeSquare==data){clearSquareAndMoves(); return}

            selectPiece();
        }


    }

    

    return (
        <div onClick={handleClick} className={`square${colorClass}${pieceClass}${hoverableClass}${activeClass}${moveClass}${captureClass}${castleClass}`}></div>
    )
}
export default NewSquare