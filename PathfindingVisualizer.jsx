import { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';

var START_NODE_ROW = 8
var START_NODE_COL = 8
var FINISH_NODE_ROW = 8
var FINISH_NODE_COL = 15

export default class Visualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            weight: 1,
            changeWeight: false
        }
    }

    componentDidMount() {
        const grid = getInitialGrid()
        this.setState({ grid })
    }

    handleMouseDown(row, col) {
        let newGrid = [];
        if (this.state.changeWeight) {
            newGrid = getNewGridWithWeightToggled(
              this.state.grid,
              row,
              col,
              this.state.weight
            );
          } else {
           newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          }
          this.setState({ grid: newGrid, mouseIsPressed: true })
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        let newGrid = [];

        if (this.state.changeWeight) {
          newGrid = getNewGridWithWeightToggled(
            this.state.grid,
            row,
            col,
            this.state.weight
          );
        } else {
          newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        }
    
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false })
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(
                    () => {
                        this.animateShortestPath(nodesInShortestPathOrder);
                    }, 10 * i)
                return
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i]
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i
            );
        }

    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {

            setTimeout(
                () => {
                    const node = nodesInShortestPathOrder[i];
                    if (nodesInShortestPathOrder[i].isWeight) {
                        document.getElementById(`node-${node.row}-${node.col}`).className =
                          "node node-path-weight";
                      } else {
                        document.getElementById(`node-${node.row}-${node.col}`).className =
                          "node node-shortest-path";
                      }
                    if (`node-${node.row}-${node.col}`.isFinish) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path node-finish';
                    if (`node-${node.row}-${node.col}`.isStart) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path node-start';
                }, 50 * i
            );

        }
    }


    weightChangeHandler = (event) => {
        this.setState({ weight: event.target.value });
      };


    visualizeDijkstra() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL]
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);

        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        nodesInShortestPathOrder[0].style.backgroundColor = 'green'
        nodesInShortestPathOrder[nodesInShortestPathOrder.length() - 1].style.backgroundColor = 'red'
        nodesInShortestPathOrder.shift();
        nodesInShortestPathOrder.pop();

    }

    weightChangeHandler = (event) => {
        this.setState({ weight: event.target.value });
      };

      toggleWeight = () => {
        const temp = this.state.changeWeight;
        this.setState({ changeWeight: !temp });
        console.log("change");
      };    

    clearFormat(grid) {
        console.log(START_NODE_COL,START_NODE_ROW,FINISH_NODE_COL,FINISH_NODE_ROW);
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {

                document.getElementById(`node-${row}-${col}`).className = 'node white';
                if (row === START_NODE_ROW && col === START_NODE_COL)
                {
                    document.getElementById(`node-${row}-${col}`).className = 'node node-start';
                    console.log("hithere");
                }
                if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
                    document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
                    console.log("hithere");
            }

        }
    }
}

    reset() {
        const grid = getInitialGrid()
        this.setState({ grid })
        this.clearFormat(grid)
        document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node node-start';
        document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node node-finish';
    }

    clickstart(){
        var ptx=document.getElementById('startptx').value;
        console.log(ptx);
        START_NODE_ROW=ptx;
        console.log()
        var pty=document.getElementById('startpty').value;
        START_NODE_COL=pty;
      }
      
      clickend(){
          var ptx=document.getElementById("endptx").value;
          FINISH_NODE_ROW=ptx;
          var pty=document.getElementById("endpty").value;
          FINISH_NODE_COL=pty;
      }

      resetpts(){
        const grid = getInitialGrid();
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        this.setState({ grid });
        this.clearFormat(grid);
        document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node node-start';
        document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node node-finish';
      }
      

    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            <div className='container'>
                <div>
                    <button className='button-27  ' onClick={
                        () => {
                            console.log("Chal jaa bhai")
                            this.visualizeDijkstra()
                        }
                    }>Visualize Dijkstra's Algorithm
                    </button>
                    <button className='button-27 reset' onClick={
                        () => {
                            console.log("reset ho bhai")
                            this.reset()
                        }
                    }>
                        Reset
                    </button>
                </div>
                <div className='start-pt'>
                <div >enter the start pt</div>
                    <input type="number" id="startptx" placeholder='x cor:'></input>
                    <input type="number" id="startpty" placeholder='y cor:'></input>
                    <button  className='sub' onClick={()=>{console.log("hi");this.clickstart();this.resetpts()}}>submit</button>
                </div>
                <div className='end-pt'>
                <div>enter the end pt</div>
                    <input type="number" id="endptx" placeholder='x cor:'></input>
                    <input type="number" id="endpty" placeholder='y cor:'></input>
                    <button className='sub' onClick={()=>{this.clickend();this.resetpts()}}>submit</button>
                </div>
                    
  

  

                <div className='grid'>
                    {
                        grid.map(
                            (row, rowIdx) => {
                                return (
                                    <div key={rowIdx}>
                                        {row.map(
                                            (node, nodeIdx) => {
                                                const { row, col, isFinish, isStart, isWall, isVisited,isWeight } = node;
                                                return (
                                                    <Node
                                                        key={nodeIdx}
                                                        row={row}
                                                        col={col}
                                                        isFinish={isFinish}
                                                        isStart={isStart}
                                                        isWall={isWall}
                                                        isWeight={isWeight}
                                                        isVisited={isVisited}
                                                        mouseIsPressed={mouseIsPressed}
                                                        onMouseDown={
                                                            (row, col) => this.handleMouseDown(row, col)
                                                        }
                                                        onMouseEnter={
                                                            (row, col) => this.handleMouseEnter(row, col)
                                                        }
                                                        onMouseUp={
                                                            (row, col) => this.handleMouseUp()
                                                        }
                                                    ></Node>
                                                )
                                            }
                                        )}
                                    </div>
                                )
                            }
                        )
                    }

                </div>
            </div>
        )

    }

}

const createNode = (col, row) => {
    return {
        col, row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null
    };
};

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row <17; row++) {
        const currentRow = [];
        for (let col = 0; col <40; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
}

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall
    }
    newGrid[row][col] = newNode;
    return newGrid;
}

const getNewGridWithWeightToggled = (grid, row, col, weight) => {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    const newNode = {
      ...node, // copying other properties of the node
      isWeight: !node.isWeight,
      weight: parseInt(weight),
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };