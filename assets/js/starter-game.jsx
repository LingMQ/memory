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
        console.log(this.state.status)
        console.log(this.state.num_click)
        this.setState(view.game);
    }

    handleClick(i, j) {
        console.log("I:" + i + " J:" + j)
        this.channel.push("guess", {i, j})
            .receive("ok", this.get_view.bind(this));
    }



    getNumClick() {
        return this.state.num_click
    }

    getScoreStr() {
        return 116 - this.state.num_click
    }


    reGame() {
        this.channel.push("restart", {})
            .receive("ok", this.get_view.bind(this))
    }


    renderSquare(i, j) {
        return <Square value= {this.state.status[i * 4 + j]} onClick={() => this.handleClick(i, j)} />
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
