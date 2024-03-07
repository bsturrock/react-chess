import './Square.css'

const Square = ({data, selectedSquare, selectSquare, movePiece, possibleMoves, gameData, possibleCaptures, capturePiece, previousComputerSquare, newComputerSquare, whiteCheck}) => {

    const {piece} = data
    const isWhite = piece==null ? false : piece.color=='white' ? true : false

    const kingInCheckClass = () => {
        if(isWhite && piece.type == 'king' && whiteCheck){
            return ' check'
        } else {
            return ''
        }
    }

    const isSelected = () => {
        return selectedSquare == data
    }

    const isPossibleMove = () => {
        return possibleMoves.includes(data)
    }

    const isPossibleCapture = () => {
        return possibleCaptures.includes(data)
    }

    const isPreviousComputerSquare = previousComputerSquare == data

    const isNewComputerSquare = newComputerSquare == data

    const handleClick = () => {

        if(gameData.turn!='white'){
            return
        }

        if(!isPossibleMove() && !isPossibleCapture() && !isWhite){
            return
        }

        if(isPossibleMove()){
            movePiece(data)
        } else if (isPossibleCapture()){
            capturePiece(data)
        } else {
            if(!isWhite){
                selectSquare(null)
            } else {
                selectSquare(data)
            }
        }
    }

    const computerSquareClass = () => {
        if(isPreviousComputerSquare){
            return ' prevComp'
        }
        if(isNewComputerSquare){
            return ' newComp'
        }
        return ''
    }

    const possibleCaptureClass = () => {
        if(isPossibleCapture()){
            return ' capture'
        } else {
            return ''
        }
    }

    const possibleMoveClass = () => {
        if(isPossibleMove()){
            return ' move'
        } else {
            return ''
        }
    }

    const pieceTypeClass = () => {
        if(piece == null){
            return ''
        }
        return ' ' + piece.type
    }

    const pieceColorClass = () => {
        if(piece == null){
            return ''
        }
        return ' ' + piece.color
    }

    const hoverableClass = () => {
        if(piece == null){
            return ''
        } else {
            if(piece.color == 'white'){
                return ' hoverable'
            } else {
                return ''
            }
        }
    }

    return (
    <div onClick={handleClick} className={`square${hoverableClass()}${(data.row+data.column)%2==0?' dark':' light'}${pieceTypeClass()}${pieceColorClass()}${isSelected()?' selected':''}${possibleMoveClass()}${possibleCaptureClass()}${computerSquareClass()}${kingInCheckClass()}`}></div>
    )
}

export default Square