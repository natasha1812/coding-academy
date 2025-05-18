'use strict'

const MINE = 'MINE'
const FLAG = 'FLAG'

const MINE_IMG = '<img src="img/bomb.png">'
const FLAG_IMG = '<img src="img/flag.png">'

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

const gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gBoard

function onInit() {
    gBoard = buildBoard(gLevel.SIZE)
    addMines(gBoard)
    setMinesNegsCount(gBoard)

    //gBoard[1][2].isRevealed = true
    //gBoard[2][3].isRevealed = true

    //gBoard[0][1].isRevealed = true
    //gBoard[2][2].isRevealed = true
    //gBoard[3][2].isRevealed = true
    
    //revealAll(gBoard)

    renderBoard(gBoard)
}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        const row = []
        for (var j = 0; j < size; j++) {
            var cell = createCell()
            row.push(cell)
        }
        board.push(row)
    }
    return board
}

function createCell() {
    return {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false
    }
}

function addMines(board) {
    board[1][2].isMine = true
    board[2][3].isMine = true
}

function renderBoard(board) {
    const elTable = document.querySelector('.game-board')
    var htmlStr = '<tbody>'

    for (var i = 0; i < board.length; i++) {
        htmlStr += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const cellId = `cell-${i}-${j}`

            var cellContent = ''
            if (cell.isRevealed) {
                if (cell.isMine) cellContent = MINE_IMG
                else if (cell.minesAroundCount > 0) {
                    cellContent = cell.minesAroundCount
                } else {
                    cellContent = ''
                }
            } else if (cell.isMarked) {
                cellContent = FLAG_IMG
            }

            htmlStr += `<td id="${cellId}" onclick="onCellClicked(${i}, ${j})">${cellContent}</td>`
        }
        htmlStr += '</tr>'
    }

    htmlStr += '</tbody>'
    elTable.innerHTML = htmlStr
}

function setMinesNegsCount(board) {
    //count mines around each cell and set the cell's minesAroundCount
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) continue
            board[i][j].minesAroundCount = countNegs(i, j, board)
        }
    }
}

function countNegs(cellI, cellJ, board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) negsCount++
        }
    }
    return negsCount
}

function onCellClicked(elCell, i, j) {

}

function onCellMarked(elCell, i, j) {

}

function checkGameOver() {
    //The game ends when all mines are marked, and all the other cells are revealed
}

function expandReveal(board, elCell, i, j) {
    //When the user clicks a cell with no mines around, 
    //reveal not only that cell, but also its neighbors
}

function revealAll(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j].isRevealed = true
      }
    }
  }