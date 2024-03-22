
import './Square.css'
import useStore from '../scripts/store'
import { generateBishopMoves, generatePawnMoves,generateKingMoves, generateKnightMoves, generateRookMoves, generateQueenMoves, generateBlackPawnMoves } from '../scripts/newMoves'
import { generateBishopCaptures, generatePawnCaptures,generateQueenCaptures, generateKnightCaptures, generateRookCaptures, generateKingCaptures } from '../scripts/newMoves'
import { generateKingCastles } from '../scripts/newMoves'
import { generateEnPassantCaptures } from '../scripts/newMoves'
import { generateBlackPawnCaptures } from '../scripts/newMoves'

const NewSquare = ({data}) => {
    const {piece} = data
    const activeSquare = useStore((store)=>store.activeSquare)
    const setActiveSquare = useStore((store)=>store.setActiveSquare)
    const clearActiveSquare = useStore((store)=>store.clearActiveSquare)
    const setHasActiveSquare = useStore((store)=>store.setHasActiveSquare)
    
    const board = useStore((store)=>store.board)
    const setBoard = useStore((store)=>store.setBoard)

    const turn = useStore((store)=>store.turn)
    const setTurn = useStore((store)=>store.setTurn)

    const possibleMoves = useStore((store)=>store.possibleMoves)
    const clearPossibleMoves = useStore((store)=>store.clearPossibleMoves)
    const setPossibleMoves = useStore((store)=>store.setPossibleMoves)

    const possibleCaptures = useStore((store)=>store.possibleCaptures)
    const setPossibleCaptures = useStore((store)=>store.setPossibleCaptures)
    const clearPossibleCaptures = useStore((store)=>store.clearPossibleCaptures)

    const possibleCastles = useStore((store)=>store.possibleCastles)
    const setPossibleCastles = useStore((store)=>store.setPossibleCastles)
    const clearPossibleCastles = useStore((store)=>store.clearPossibleCastles)

    const possibleEnPassant = useStore((store)=>store.possibleEnPassant)
    const setPossibleEnPassant = useStore((store)=>store.setPossibleEnPassant)
    const clearPossibleEnPassant = useStore((store)=>store.clearPossibleEnPassant)

    const checks = useStore((store)=>store.checks)
    const setChecks = useStore((store)=>store.setChecks)
    
    const checkmates = useStore((store)=>store.checkmates)
    const setCheckmates = useStore((store)=>store.setCheckmates)

    const clearComputerMoves = useStore((store)=>store.clearComputerMoves)
    const startComputerMove = useStore((store)=>store.startComputerMove)
    const endComputerMove = useStore((store)=>store.endComputerMove)

    const isMove = possibleMoves.includes(data)
    const isCapture = possibleCaptures.includes(data)
    const isCastle = possibleCastles.includes(data)
    const isEnPassant = possibleEnPassant.includes(data)
    const isCheck = checks.includes(data)
    const isStartComputerMove = startComputerMove == data
    const isEndComputerMove = endComputerMove == data
    const isCheckmate = checkmates.includes(data)

    const colorClass = (data.row+data.column)%2==0?' dark':' light'
    const pieceClass = piece==null ? '' : ' ' + piece.color + ' ' + piece.type
    const hoverableClass = piece==null || piece.color == 'black' ? '' : ' hoverable'
    const activeClass = activeSquare == data ? ' active' : ''
    const moveClass = isMove ? ' move' : ''
    const captureClass = isCapture ? ' capture' : ''
    const castleClass = isCastle ? ' castle' : ''
    const enPassantClass = isEnPassant ? ' capture' : ''
    const checkClass = isCheck ? ' check' : ''
    const checkmateClass = isCheckmate ? 'mate' : ''
    const computerMoveClass = isStartComputerMove ? ' prevComp' : isEndComputerMove ? ' newComp' : ''

    const checkForCheckmate = (newBoard) => {

        let kingMoves = []
        let blackKing = newBoard.filter((ele)=>ele.piece!=null && ele.piece.color == 'black' && ele.piece.type == 'king')[0];

        kingMoves = generateKingMoves(blackKing,kingMoves,newBoard)
        kingMoves = generateKingCaptures(blackKing,kingMoves,newBoard)

        for(let move of kingMoves){
            let testBoard = buildPotentialBoard(blackKing, move)
            let {blackInCheck} = checkForCheck(testBoard)
            if(!blackInCheck){
                return []
            }
        }

        let blackCaptures = []
        let blackSquares = newBoard.filter((ele)=>ele.piece!=null && ele.piece.color == 'black')
        for(let square of blackSquares){
            if(square.piece == null){continue}
            if(square.piece.type == 'pawn'){
                blackCaptures = generateBlackPawnCaptures(square, blackCaptures, newBoard, true)
                blackCaptures = generateBlackPawnMoves(square,blackCaptures,newBoard)
            } else if (square.piece.type == 'bishop'){
                blackCaptures = generateBishopCaptures(square, blackCaptures, newBoard, true)
                blackCaptures = generateBishopMoves(square,blackCaptures,newBoard)
            } else if (square.piece.type == 'knight'){
                blackCaptures = generateKnightCaptures(square, blackCaptures, newBoard, true)
                blackCaptures = generateKnightMoves(square,blackCaptures,newBoard)
            } else if (square.piece.type == 'rook'){
                blackCaptures = generateRookCaptures(square, blackCaptures, newBoard, true)
                blackCaptures = generateRookMoves(square,blackCaptures,newBoard)
            } else if (square.piece.type == 'queen'){
                blackCaptures = generateQueenCaptures(square, blackCaptures, newBoard, true)
                blackCaptures = generateQueenMoves(square,blackCaptures,newBoard)
            }

            for(let move of blackCaptures){
                let testBoard = buildPotentialBoard(square, move)
                let {blackInCheck} = checkForCheck(testBoard)
                if(!blackInCheck){
                    return []
                }
            }
            blackCaptures = []
        }
        return [blackKing]
    }

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

        moves = moves.map((move)=>{
            let newBoard = buildPotentialBoard(target, move)
            let {whiteInCheck} = checkForCheck(newBoard)
            if(!whiteInCheck){
                return move
            } else {
                return null
            }
        })

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

        captures = captures.map((move)=>{
            let newBoard = buildPotentialBoard(target, move)
            let {whiteInCheck} = checkForCheck(newBoard)
            if(!whiteInCheck){
                return move
            }
        })
        setPossibleCaptures(captures)
    }

    const generatePossibleCastles = (target) => {

        if(target.piece==null){clearPossibleCastles(); return}
        let castles = generateKingCastles(target, board)

        castles = castles.map((move)=>{
            let newBoard = buildPotentialBoard(target, move)
            let {whiteInCheck} = checkForCheck(newBoard)
            if(!whiteInCheck){
                return move
            }
        })

        setPossibleCastles(castles)
    }

    const generatePossibleEnPassant = (target) => {
        if(target.piece == null){clearPossibleEnPassant(); return}
        let captures = generateEnPassantCaptures(target, board)
        captures = captures.map((move)=>{
            let newBoard = buildPotentialBoard(target, move)
            let {whiteInCheck} = checkForCheck(newBoard)
            if(!whiteInCheck){
                return move
            }
        })
        setPossibleEnPassant(captures)
    }

    const clearSquareAndMoves = () => {
        clearActiveSquare();
        setHasActiveSquare(false);
        clearPossibleMoves();
        clearPossibleCaptures();
        clearPossibleCastles();
        clearPossibleEnPassant();

    }

    const selectPiece = () => {
        setActiveSquare(data)
        setHasActiveSquare(true)
        generatePossibleMoves(data)
        generatePossibleCaptures(data)
        generatePossibleCastles(data)
        generatePossibleEnPassant(data)
    }

    const buildPotentialBoard = (startSquare, endSquare) => {
        
        let tempBoard = [...board].filter((ele)=>ele!=startSquare && ele!=endSquare)
        let tempStart = {...startSquare}
        let tempEnd = {...endSquare}


        tempEnd.piece = tempStart.piece;
        tempStart.piece = null


        if(tempEnd.piece.type == 'pawn' && tempEnd.piece.color == 'black' && tempEnd.row == 5 && tempEnd.piece.hasMoved == false){
            tempEnd.piece.canEnPassant = true
        }

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
        rookEnd.piece = rookStart.piece;
        rookStart.piece = null

        return [...tempBoard, tempStart, tempEnd, rookEnd, rookStart].sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })
    }

    const buildPotentialBoardAfterEnPassant = (startSquare, endSquare) => {
        let pawnLocation = [...board].filter((ele)=>ele.row == endSquare.row - 1 && ele.column == endSquare.column)[0]
        let tempBoard = [...board].filter((ele)=>ele!=startSquare && ele!=endSquare && ele!=pawnLocation)
        let tempStart = {...startSquare}
        let tempEnd = {...endSquare}
        tempEnd.piece = tempStart.piece;
        tempStart.piece = null
        pawnLocation.piece = null
        return [...tempBoard, tempStart, tempEnd, pawnLocation].sort((a,b)=>{
            return b.row - a.row || a.column - b.column
        })
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
            } else if (square.piece.type == 'king'){
                whiteCaptures = generateKingCaptures(square, whiteCaptures, newBoard, true)
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

    const movePiece = (startSquare, endSquare) => {

        const newBoard = buildPotentialBoard(startSquare, endSquare)

        let {whiteInCheck, blackInCheck, allchecks} = checkForCheck(newBoard)
        
        if(whiteInCheck){
            return
        }

        if(blackInCheck){
            let checkmates = checkForCheckmate(newBoard)
            setCheckmates(checkmates)
        }

        //If won't be in check

        let movedPiece = newBoard.filter((ele)=>ele.row==endSquare.row && ele.column == endSquare.column)[0]
        movedPiece.piece.hasMoved = true

        setBoard(newBoard)
        setChecks(allchecks)
        clearSquareAndMoves()
        clearComputerMoves();
        setTurn('black')
    }

    const capturePiece = (startSquare, endSquare) => {
        const newBoard = buildPotentialBoard(startSquare, endSquare)

        let {whiteInCheck, blackInCheck, allchecks} = checkForCheck(newBoard)
        
        if(whiteInCheck){
            return
        }

        if(blackInCheck){
            let checkmates = checkForCheckmate(newBoard)
            setCheckmates(checkmates)
        }

        let movedPiece = newBoard.filter((ele)=>ele.row==endSquare.row && ele.column == endSquare.column)[0]
        movedPiece.piece.hasMoved = true
        //If won't be in check
        setBoard(newBoard)
        setChecks(allchecks)
        clearSquareAndMoves()
        clearComputerMoves();
        setTurn('black')
    }

    const castlePiece = (startSquare, endSquare) => {
        let direction = endSquare.column == 7 ? 'king' : 'queen'
        const newBoard = buildPotentialBoardAfterCastle(startSquare,endSquare,direction)
        //If won't be in check
        let {whiteInCheck, blackInCheck, allchecks} = checkForCheck(newBoard)
        
        if(whiteInCheck){
            return
        }

        if(blackInCheck){
            let checkmates = checkForCheckmate(newBoard)
            setCheckmates(checkmates)
        }

        let movedPiece = newBoard.filter((ele)=>ele.row==endSquare.row && ele.column == endSquare.column)[0]
        movedPiece.piece.hasMoved = true

        setBoard(newBoard)
        setChecks(allchecks)
        clearSquareAndMoves()
        clearComputerMoves();
        setTurn('black')
    }

    const enPassantPiece = (startSquare, endSquare) => {
        const newBoard = buildPotentialBoardAfterEnPassant(startSquare, endSquare)
        let {whiteInCheck, blackInCheck, allchecks} = checkForCheck(newBoard)
        
        if(whiteInCheck){
            return
        }

        if(blackInCheck){
            let checkmates = checkForCheckmate(newBoard)
            setCheckmates(checkmates)
        }

        let movedPiece = newBoard.filter((ele)=>ele.row==endSquare.row && ele.column == endSquare.column)[0]
        movedPiece.piece.hasMoved = true
        
        setBoard(newBoard)
        setChecks(allchecks)
        clearSquareAndMoves()
        clearComputerMoves();
        setTurn('black')     
    }

    const handleClick = () => {

        if(checkmates.length > 0){
            return
        }

        if(turn=='black'){
            return
        }

        if(isMove){
            movePiece(activeSquare, data)
        } else if(isCapture){
            capturePiece(activeSquare, data)
        } else if(isCastle){
            castlePiece(activeSquare, data)
        } else if(isEnPassant){
            enPassantPiece(activeSquare, data)
        }else {
            if(piece==null){return}
            if(piece.color=='black'){clearSquareAndMoves(); return}
            if(activeSquare==data){clearSquareAndMoves(); return}

            selectPiece();
        }


    }

    

    return (
        <div onClick={handleClick} className={`square${colorClass}${pieceClass}${hoverableClass}${activeClass}${moveClass}${captureClass}${castleClass}${enPassantClass}${checkClass}${checkmateClass}${computerMoveClass}`}></div>
    )
}

export default NewSquare