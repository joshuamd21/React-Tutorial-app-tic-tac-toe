import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/* class version of square
class Square extends React.Component {
    render() {
      return (
        <button 
          className="square" 
          onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </button>
      );
    }
  }
*/
// function version of square
function Square(props){
  return(
    <button 
      className ="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
          key = {i}
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)} 
        />
      );
    }
  
    render() {
      const rows = [0,1,2];
      const cols = [0,1,2];
      return(
          rows.map((row) =>{
            return(
              <div key={row} className='board-row'>
                {cols.map((col) =>{
                  return this.renderSquare(row*3 + col)
                })}
              </div>
            )
        })
      )
      /* hard coded board state
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );*/
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0,
        order: true,
      }
    }
    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]/*this equates to sqaures[i] != null*/){
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }
    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) == 0,
      })
    }
    move_order(){
      this.setState({
        order: !this.state.order ? true : false,
      });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const order = this.state.order ? "Ascending order" : "Descending order";
      const moves = history.map((step,move) => {
      let pos = 0;
      if(!this.state.order){
        move = Math.abs(move - history.length + 1);
      }
      if(move > 0){
        for(let i = 0; i < 9; i++){
          if(history[move].squares[i] != history[move - 1].squares[i]){
            pos = i;
            break;
          }
        }
      }
      let row = 0;
      while(pos >= 3){
        pos = pos - 3;
        row++;
      }
      const desc = move ? 
        'Go to move #' + move + " location: (" + row + "," + pos + ")" : 'Go to game start';
      if(move == this.state.stepNumber){
        return (
          <li key ={move}>
            <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>
          </li>
        )
      }
      else{
        return (
          <li key ={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      }
    });

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className='Order of buttons' onClick={() => this.move_order()}>{order}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }