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
    addRandomMines(gBoard)
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

function addRandomMines(board) {
    board[1][2].isMine = true
    board[2][3].isMine = true

    /*
    var addedMines = 0

    while (addedMines < gLevel.MINES) {
        var i = getRandomInt(gLevel.SIZE)
        var j = getRandomInt(gLevel.SIZE)

        if (!board[i][j].isMine) {
            board[i][j].isMine = true
            addedMines++
        }
    }
        */
}

function renderBoard(board) {
    const elTable = document.querySelector('.game-board')
    var strHTML = '<tbody>'

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
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

            strHTML += `<td id="${cellId}" onclick="onCellClicked(this, ${i}, ${j})" 
            oncontextmenu="onCellMarked(this, ${i}, ${j})"> ${cellContent}</td>`
        }
        strHTML += '</tr>'
    }

    strHTML += '</tbody>'
    elTable.innerHTML = strHTML
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
    var cell = gBoard[i][j]

    if (cell.isRevealed || cell.isMarked) return

    cell.isRevealed = true

    if (cell.isMine) {
        elCell.innerHTML = MINE_IMG
    } else if (cell.minesAroundCount > 0) {
        elCell.innerText = cell.minesAroundCount
    } else {
        elCell.innerText = ''
    }
    checkGameOver()
}

function onCellMarked(elCell, i, j) {
    var cell = gBoard[i][j]

    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked

    if (cell.isMarked) {
        elCell.innerHTML = FLAG_IMG
    } else if (!cell.isMarked) {
        elCell.innerText = ''
    }
    checkGameOver()
}

function checkGameOver() {
    //The game ends when all mines are marked, and all the other cells are revealed
    //Mine is clicked or all mines are marked and other cells are revealed

    var totalCells = gLevel.SIZE ** 2
    var cellsRevealed = 0
    var minesMarkedCorrectly = 0
    var mineClicked = false

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]

            if (cell.isRevealed) {
                cellsRevealed++
                if (cell.isMine) mineClicked = true
            }

            if (cell.isMarked && cell.isMine) {
                minesMarkedCorrectly++
            }
        }
    }

    if (mineClicked) {
        console.log('You lost.')
        gGame.isOn = false
        return
    }

    if (cellsRevealed === (totalCells - gLevel.MINES) &&
        minesMarkedCorrectly === gLevel.MINES) {
        console.log('You won!')
        gGame.isOn = false
    }
}

function expandReveal(i, j, elCell, board) {
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

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}