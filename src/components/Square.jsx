import './Square.css'

const Square = ({data, selectedSquare, selectSquare, movePiece, possibleMoves}) => {

    const {piece} = data
    const hasColor = piece==null ? false : piece.color=='white' ? true : false

    const isSelected = () => {
        return selectedSquare == data
    }

    const isPossibleMove = () => {
        return possibleMoves.includes(data)
    }

    const handleClick = () => {
        if(selectedSquare!=null){
            movePiece(data)
        } else {
            if(!hasColor){
                selectSquare(null)
            } else {
                selectSquare(data)
            }
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
    <div onClick={handleClick} className={`square${hoverableClass()}${(data.row+data.column)%2==0?' dark':' light'}${pieceTypeClass()}${pieceColorClass()}${isSelected()?' selected':''}${possibleMoveClass()}`}>{data.row}-{data.column}</div>
    )
}

export default Square