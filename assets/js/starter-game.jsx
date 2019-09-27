import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
    ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [["A", "C", "B", "E"], ["D", "F", "D", "G"], ["A", "H", "G", "B"], ["E", "F", "C", "H"]],
            status: [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]],
            count: 0,
            prev_i: -1,
            prev_j: -1,
            curr_i: -1,
            curr_j: -1,
            num_click: 0,
        };
    }


    handleClick(i, j) {
        if (this.state.count === 2) {
            console.log("reset")
            let empty_board = this.state.status
            let new_score = this.state.score

            if (this.state.status[this.state.curr_i][this.state.curr_j] !== this.state.status[this.state.prev_i][this.state.prev_j]) {
                empty_board[this.state.curr_i][this.state.curr_j] = ""
                empty_board[this.state.prev_i][this.state.prev_j] = ""
            }
            empty_board[i][j] = this.state.board[i][j]
            this.setState({board: this.state.board, status: empty_board, count: 1, prev_i: -1, prev_j: -1,
                curr_i: i, curr_j: j, num_click: this.state.num_click + 1})
        } else {
            let tmp_status = this.state.status
            tmp_status[i][j] = this.state.board[i][j]
            this.setState({board: this.state.board, status: tmp_status, count: this.state.count + 1,
                prev_i: this.state.curr_i, prev_j: this.state.curr_j, curr_i: i, curr_j: j, num_click: this.state.num_click + 1})
        }
    }

    getNumClick() {
        return this.state.num_click
    }

    getScoreStr() {
        return 116 - this.state.num_click
    }

    reGame() {
        let empty_status = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]]
        this.setState({board: this.state.board, status: empty_status, count: 0, prev_i: -1, prev_j: -1,
            curr_i: -1, curr_j: -1, num_click: 0})
    }

    renderSquare(i, j) {
        return <Square value= {this.state.status[i][j]} onClick={() => this.handleClick(i, j)} />
    }

    render() {
        return (
            <div>
                <h2><b>Welcome to Memory Game</b></h2>
                <div className="game">
                    <div className="game-board">
                        <Board root={this} />
                    </div>
                </div>
                <NumClick root={this} />
                <Score root={this} />
                <button onClick={this.reGame.bind(this)}>Restart</button>
            </div>
        );
    }
}

class Board extends React.Component {
    render() {
        return (
            <div>
                <div className="row">
                    {this.props.root.renderSquare(0, 0)}
                    {this.props.root.renderSquare(0, 1)}
                    {this.props.root.renderSquare(0, 2)}
                    {this.props.root.renderSquare(0, 3)}
                </div>
                <div className="row">
                    {this.props.root.renderSquare(1, 0)}
                    {this.props.root.renderSquare(1, 1)}
                    {this.props.root.renderSquare(1, 2)}
                    {this.props.root.renderSquare(1, 3)}
                </div>
                <div className="row">
                    {this.props.root.renderSquare(2, 0)}
                    {this.props.root.renderSquare(2, 1)}
                    {this.props.root.renderSquare(2, 2)}
                    {this.props.root.renderSquare(2, 3)}
                </div>
                <div className="row">
                    {this.props.root.renderSquare(3, 0)}
                    {this.props.root.renderSquare(3, 1)}
                    {this.props.root.renderSquare(3, 2)}
                    {this.props.root.renderSquare(3, 3)}
                </div>
            </div>
        )
    }
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function NumClick(params) {
    return <div>
            <p><b>Number of Guesses: {params.root.getNumClick()}</b></p>
        </div>;
}

function Score(params) {
    return <div>
        <p><b>Score: {params.root.getScoreStr()}</b>  (Initial score is 116, use one click -1, max score is 100)</p>
    </div>;
}
