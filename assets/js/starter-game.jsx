import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
    ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
    constructor(props) {
        super(props);
        this.channel = props.channel
        this.state = {
            status: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            num_click: 0,
        };

        this.channel
            .join()
            .receive("ok", this.get_view.bind(this))
            .receive("error", resp => { console.log("Unable to join", resp); });
    }

    get_view(view) {
        console.log(view);
        this.setState(view.game);
    }

    handleClick(i, j) {
        this.channel.push("guess", {click: i, j})
            .receive("ok", this.get_view.bind(this));
    }



    getNumClick() {
        return this.state.num_click
    }

    getScoreStr() {
        return 116 - this.state.num_click
    }

    /*
    reGame() {
        let empty_status = [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]]
        this.setState({board: this.state.board, status: empty_status, count: 0, prev_i: -1, prev_j: -1,
            curr_i: -1, curr_j: -1, num_click: 0})
    }*/

    reGame() {
        this.channel.push("restart", {})
            .receive("ok", this.get_view.bind(this))
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
                    {this.props.root.renderSquare(0)}
                    {this.props.root.renderSquare(1)}
                    {this.props.root.renderSquare(2)}
                    {this.props.root.renderSquare(3)}
                </div>
                <div className="row">
                    {this.props.root.renderSquare(4)}
                    {this.props.root.renderSquare(5)}
                    {this.props.root.renderSquare(6)}
                    {this.props.root.renderSquare(7)}
                </div>
                <div className="row">
                    {this.props.root.renderSquare(8)}
                    {this.props.root.renderSquare(9)}
                    {this.props.root.renderSquare(10)}
                    {this.props.root.renderSquare(11)}
                </div>
                <div className="row">
                    {this.props.root.renderSquare(12)}
                    {this.props.root.renderSquare(13)}
                    {this.props.root.renderSquare(14)}
                    {this.props.root.renderSquare(15)}
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
