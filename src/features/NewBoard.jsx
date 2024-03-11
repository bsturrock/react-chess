import NewSquare from "../components/NewSquare"
import useStore from "../scripts/store"
import './Board.css'
const NewBoard = () => {

    const board = useStore((store)=>store.board)
    const renderedSquares = board.map((ele, index)=><NewSquare key={index} data={ele}/>)

    return <>
        <div className="board">
            {renderedSquares}
        </div>
    </>

}

export default NewBoard 
