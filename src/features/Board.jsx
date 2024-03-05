import { useEffect, useState } from "react"
import Square from "../components/Square"
import './Board.css'
const Board = () => {

    const [boardData, setBoardData] = useState([])
    const [selectedSquare, setSelectedSquare] = useState(null)
    const [possibleMoves, setPossibleMoves] = useState([])

    const fetchSquare = (row, column) => {
        return boardData.filter((ele)=>ele.row==row && ele.column==column)[0]
    }

    const selectSquare = (target) => {
        if(target == selectedSquare){
            setSelectedSquare(null)
            generatePossibleMoves(null)
        } else {
            setSelectedSquare(target)
            generatePossibleMoves(target)
        }
        
    }
    
    const generatePossibleMoves = (target) => {
        console.log(target)
        const moves = []
        if(target==null){
            setPossibleMoves([])
            return
        }
        if(target.piece.type == 'pawn'){
            if(target.row == 2){

                console.log('target is pawn')
                moves.push(fetchSquare(target.row+1, target.column))
                moves.push(fetchSquare(target.row+2, target.column))
            }
        }
        console.log(moves)
        setPossibleMoves(moves)
    }

    const movePiece = (target) => {
        
        if(target.piece!=null){
            selectSquare(target)
            return
        }

        if(possibleMoves.includes(target)){
            let tempBoard = boardData.filter((ele)=> ele!= selectedSquare && ele!=target)
            target.piece = selectedSquare.piece
            selectedSquare.piece = null
            let newBoard = [...tempBoard, target, selectedSquare]
            newBoard.sort((a,b)=>{
                return b.row - a.row || a.column - b.column
            })
            setBoardData(newBoard)
            selectSquare(null)
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

    const renderedBoard = boardData.map((ele, index)=><Square key={index} data={ele} selectedSquare={selectedSquare} selectSquare={selectSquare} movePiece={movePiece} possibleMoves={possibleMoves} generatePossibleMoves={generatePossibleMoves}/>)

    return <>
        <div className="board">
            {renderedBoard}
        </div>
    </>
}

export default Board