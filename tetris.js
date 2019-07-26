class Tetris
{
  constructor()
  {
    this.getNewPiece();
    this.matrix;
    this.id;
    this.posX = 3;
    this.posY = 0;
    this.lastX = 3;
    this.lastY = 0;
    this.startX = 3;
    this.rotationIndex = 0;
    this.lastRotationIndex = 0;
    this.isMoveable = true;
    this.canRotate = true;

    this.controls = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
      esc: false,
    };
  }

  syncPieceToBoard()
  {
    this.clearLastPiece();
    this.lastX = this.posX;
    this.lastY = this.posY;

    for (let i = 0; i < this.matrix[this.rotationIndex].length; i++)
    {
      for (let j = 0; j < this.matrix[this.rotationIndex][i].length; j++)
      {
        if (this.matrix[this.rotationIndex][i][j] === 1)
        {
          board[this.posY][this.posX] = this.id;
          this.checkCollisionBottom(this.posX, this.posY);
          this.posX++;
        }
        else
        {
          this.posX++;
        }
      }
      this.posX = this.posX - this.matrix[this.rotationIndex][0].length;
      this.posY++;
    }
    this.posX = this.lastX;
    this.posY = this.lastY;
  }

  clearLastPiece()
  {
    for (let i = 0; i < this.matrix[this.lastRotationIndex].length; i++)
    {
      for (let j = 0; j < this.matrix[this.lastRotationIndex][i].length; j++)
      {
        if (this.matrix[this.lastRotationIndex][i][j] === 1)
        {
          board[this.lastY][this.lastX] = 0;
          this.lastX++;
        }
        else
        {
          this.lastX++;
        }
      }
      this.lastX = this.lastX - this.matrix[this.lastRotationIndex][0].length;
      this.lastY++;
    }
    this.lastRotationIndex = this.rotationIndex;
  }

  getNewPiece()
  {
    const r = Math.floor(Math.random() * 7);
    switch (r)
    {
      case 0:
      {
        this.matrix = MATRIX_O;
        this.id = 1;
        break;
      }
      case 1:
      {
        this.matrix = MATRIX_I;
        this.id = 2;
        break;
      }
      case 2:
      {
        this.matrix = MATRIX_L;
        this.id = 3;
        break;
      }
      case 3:
      {
        this.matrix = MATRIX_T;
        this.id = 4;
        break;
      }
      case 4:
      {
        this.matrix = MATRIX_J;
        this.id = 5;
        break;
      }
      case 5:
      {
        this.matrix = MATRIX_S;
        this.id = 6;
        break;
      }
      case 6:
      {
        this.matrix = MATRIX_Z;
        this.id = 7;
        break;
      }
    }
  }

  gravity()
  {
    if (!isGamePaused)
    {
      this.posY++;
    }
  }

  checkCollisionBottom(X, Y)
  {
    if (Y + 1 >= 20)
    {
      this.isMoveable = false;
      return true;
    }

    if (Y + 1 < 20)
    {
      if (board[Y + 1][X] > 0)
      {
        console.log('Collision Bottom');
        this.isMoveable = false;
        return true;
      }
    }
    return false;
  }

  checkCollisionLeft(X, Y)
  {
    let canMoveLeft = true;
    let mostX = 3434;

    for (let i = 0; i < this.matrix[this.rotationIndex].length; i++)
    {
      let xCount = 0;

      for (let j = 0; j < this.matrix[this.rotationIndex][i].length; j++)
      {
        if (this.matrix[this.rotationIndex][i][j] === 1)
        {
          if (mostX > this.startX + j)
          {
            mostX = this.startX + j;
          }

          if (board[Y][X - 1] > 0)
          {
            console.log('Collision Left Block');
            canMoveLeft = false;
            break;
          }
        }
        else
        {
          X++;
          xCount++;
        }
      }
      X = X - xCount;
      Y++;
    }

    // left wall
    if (mostX === 0)
    {
      console.log('Collision Left Wall');
      canMoveLeft = false;
      this.canRotate = false;
    }

    return canMoveLeft;
  }

  checkColliosionRight(X, Y)
  {
    let lastX = X + this.matrix[this.rotationIndex][0].length;
    let canMoveRight = true;
    let mostX = 0;

    for (let i = 0; i < this.matrix[this.rotationIndex].length; i++)
    {
      let xCount = 0;

      for (let j = this.matrix[this.rotationIndex][i].length; j >= 0; j--)
      {
        if (this.matrix[this.rotationIndex][i][j] === 1)
        {
          if (mostX < this.startX + j)
          {
            mostX = this.startX + j;
          }
          if (board[Y][lastX + 1] > 0)
          {
            console.log('Collision Right Block');
            canMoveRight = false;
            break;
          }
        }
        else
        {
          lastX--;
          xCount++;
        }
      }
      lastX += xCount;
      Y++;
    }
    if (this.startX + (mostX - this.startX ) == 9)
    {
      console.log('Collision Right Wall');
      canMoveRight = false;
      this.canRotate = false;
    }

    return canMoveRight;
  }

  doControls()
  {
    if (!isGamePaused)
    {
      if (this.controls.left)
      {
        this.controls.left = false;
        if (this.checkCollisionLeft(this.posX, this.posY))
        {
          this.startX--;
          this.posX--;
          this.canRotate = true;
        }
      }

      if (this.controls.right)
      {
        this.controls.right = false;
        if (this.checkColliosionRight(this.posX, this.posY))
        {
          this.startX++;
          this.posX++;
          this.canRotate = true;
        }
      }

      if (this.controls.up)
      {
        this.controls.up = false;

        if (this.canRotate)
        {
          if (this.rotationIndex >= 3)
          {
            this.lastRotationIndex = 3;
            this.rotationIndex = 0;
          }
          else
          {
            this.lastRotationIndex = this.rotationIndex;
            this.rotationIndex++;
          }
        }
      }

      if (this.controls.down)
      {
        this.posY++;
        this.controls.down = false;
      }

      if (this.controls.space)
      {
        this.posY++;
        window.requestAnimationFrame(gameloop);
      }
    }

    if (this.controls.esc)
    {
      this.controls.esc = false;
      const infoBar = document.getElementById('pauseText');

      if (isGamePaused)
      {
        infoBar.style.visibility = 'hidden';
        isGamePaused = false;
      }
      else
      {
        infoBar.style.visibility = 'visible';
        isGamePaused = true;
      }
    }
  }
}

const gameCanvas = document.getElementById('gameboard');
const gameCtx = gameCanvas.getContext('2d');

const nextPieceCanvas = document.getElementById('nextPiece');
const nextPieceCtx = nextPieceCanvas.getContext('2d');

const MATRIX_O = [
  [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
];

const MATRIX_I = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
];

const MATRIX_L = [
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
];

const MATRIX_T = [
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const MATRIX_J = [
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];

const MATRIX_S = [
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

const MATRIX_Z = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
];

const unit = 32;
const gravitySpeed = 1;
let lastTimestamp = 0;
let activePiece = new Tetris();
let nextPiece = new Tetris();
let isLoss = false;
let isGamePaused = false;
let linesCount = 0;
let tetrisCount = 0;

const board =
[
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

drawNextPiece();
window.requestAnimationFrame(gameloop);

// controls
document.addEventListener('keydown', function(e)
{
  // left arrow
  if (e.keyCode === 37)
  {
    e.preventDefault();
    activePiece.controls.left = true;
  }

  // right arrow
  if (e.keyCode === 39)
  {
    e.preventDefault();
    activePiece.controls.right = true;
  }

  // down arrow
  if (e.keyCode === 40)
  {
    e.preventDefault();
    activePiece.controls.down = true;
  }

  // Up arrow
  if (e.keyCode === 38)
  {
    e.preventDefault();
    activePiece.controls.up = true;
  }

  // esc
  if (e.keyCode === 27)
  {
    e.preventDefault();
    activePiece.controls.esc = true;
  }

  // space
  if (e.keyCode === 32)
  {
    e.preventDefault();
    activePiece.controls.space = true;
  }
});

function gameloop(timestamp)
{
  if (!isLoss)
  {
    if (!lastTimestamp || timestamp - lastTimestamp >= gravitySpeed * 1000)
    {
      lastTimestamp = timestamp;
      activePiece.gravity();
    }

    if (!activePiece.isMoveable)
    {
      clearLines();
      checkLoss();
      if (!isLoss)
      {
        activePiece = nextPiece;
        nextPiece = new Tetris();
        drawNextPiece();
      }
    }

    activePiece.doControls();
    activePiece.syncPieceToBoard();
    drawBoard();
    syncScore();
    window.requestAnimationFrame(gameloop);
  }
}

function drawBoard()
{
  const width = unit - 3;
  const height = unit - 3;
  const rounded = 7;
  const halfRadians = (2 * Math.PI)/2;
  const quarterRadians = (2 * Math.PI)/4;

  for (let i = 0; i < board.length; i++)
  {
    for (let j = 0; j < board[i].length; j++)
    {
      const x = j * unit + 3;
      const y = i * unit + 3;
      switch (board[i][j])
      {
        case 0:
        {
          gameCtx.fillStyle = '#4a4c58';
          break;
        }

        case 1:
        {
          gameCtx.fillStyle = '#F4D71E';
          break;
        }

        case 2:
        {
          gameCtx.fillStyle = '#32ff7e';
          break;
        }

        case 3:
        {
          gameCtx.fillStyle = '#ffaf40';
          break;
        }

        case 4:
        {
          gameCtx.fillStyle = '#ff4d4d';
          break;
        }

        case 5:
        {
          gameCtx.fillStyle = '#ffcccc';
          break;
        }

        case 6:
        {
          gameCtx.fillStyle = '#cd84f1';
          break;
        }

        case 7:
        {
          gameCtx.fillStyle = '#7efff5';
          break;
        }
      }

      gameCtx.beginPath();
      gameCtx.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true);
      gameCtx.lineTo(x, y + height - rounded);
      gameCtx.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true);
      gameCtx.lineTo(x + width - rounded, y + height);
      gameCtx.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true);
      gameCtx.lineTo(x + width, y + rounded);
      gameCtx.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true);
      gameCtx.lineTo(x + rounded, y);
      gameCtx.fill();
    }
  }
}

function clearLines()
{
  let linesNum = 0;

  for (let i = 0; i < board.length; i++)
  {
    let piecesInRow = 0;
    for (let j = 0; j < board[i].length; j++)
    {
      if (board[i][j] > 0)
      {
        piecesInRow++;
      }
    }
    if (piecesInRow === 10)
    {
      linesNum++;
      linesCount++;
      shiftBoard(i);
    }
    piecesInRow = 0;
  }

  if (linesNum === 4)
  {
    tetrisCount++;
  }
}

function shiftBoard(index)
{
  board.splice(index, 1);
  board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

function checkLoss()
{
  for (let i = 0; i < board[0].length; i++)
  {
    if (board[0][i] > 0)
    {
      isLoss = true;
    }
  }
}

function syncScore()
{
  const lines = document.getElementById('lines');
  const tetris = document.getElementById('tetris');

  tetris.innerText = tetrisCount;
  lines.innerText = linesCount;
}

function drawNextPiece()
{
  const matrix = nextPiece.matrix[0];
  const id = nextPiece.id;
  let color;

  const width = unit - 3;
  const height = unit - 3;
  const rounded = 7;
  const halfRadians = (2 * Math.PI)/2;
  const quarterRadians = (2 * Math.PI)/4;

  switch (id)
  {
    case 0:
    {
      color = '#4a4c58';
      break;
    }

    case 1:
    {
      color = '#F4D71E';
      break;
    }

    case 2:
    {
      color = '#32ff7e';
      break;
    }

    case 3:
    {
      color = '#ffaf40';
      break;
    }

    case 4:
    {
      color = '#ff4d4d';
      break;
    }

    case 5:
    {
      color = '#ffcccc';
      break;
    }

    case 6:
    {
      color = '#cd84f1';
      break;
    }

    case 7:
    {
      color = '#7efff5';
      break;
    }
  }

  // clear previous drawn piece
  nextPieceCtx.fillStyle = '#4b4b4b';
  for (let i = 0; i < 4; i++)
  {
    for (let j = 0; j < 4; j++)
    {
      const x = j * unit + 3;
      const y = i * unit + 3;

      nextPieceCtx.beginPath();
      nextPieceCtx.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true);
      nextPieceCtx.lineTo(x, y + height - rounded);
      nextPieceCtx.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true);
      nextPieceCtx.lineTo(x + width - rounded, y + height);
      nextPieceCtx.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true);
      nextPieceCtx.lineTo(x + width, y + rounded);
      nextPieceCtx.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true);
      nextPieceCtx.lineTo(x + rounded, y);
      nextPieceCtx.fill();
    }
  }

  nextPieceCtx.fillStyle = color;
  for (let i = 0; i < matrix.length; i++)
  {
    for (let j = 0; j < matrix[i].length; j++)
    {
      const x = j * unit + 3;
      const y = i * unit + 3;

      if (matrix[i][j] === 1)
      {
        nextPieceCtx.beginPath();
        nextPieceCtx.arc(rounded + x, rounded + y, rounded, -quarterRadians, halfRadians, true);
        nextPieceCtx.lineTo(x, y + height - rounded);
        nextPieceCtx.arc(rounded + x, height - rounded + y, rounded, halfRadians, quarterRadians, true);
        nextPieceCtx.lineTo(x + width - rounded, y + height);
        nextPieceCtx.arc(x + width - rounded, y + height - rounded, rounded, quarterRadians, 0, true);
        nextPieceCtx.lineTo(x + width, y + rounded);
        nextPieceCtx.arc(x + width - rounded, y + rounded, rounded, 0, -quarterRadians, true);
        nextPieceCtx.lineTo(x + rounded, y);
        nextPieceCtx.fill();
      }
    }
  }
}
