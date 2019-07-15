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
      const infoBar = document.getElementById('infoBar');

      if (isGamePaused)
      {
        infoBar.innerText = '';
        isGamePaused = false;
      }
      else
      {
        infoBar.innerText = 'Game Paused';

        isGamePaused = true;
      }
    }
  }
}

const canvas = document.getElementById('gameboard');
const context = canvas.getContext('2d');

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
let isLoss = false;
let isGamePaused = false;

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
        activePiece = new Tetris();
      }
    }

    activePiece.syncPieceToBoard();
    activePiece.doControls();

    drawBoard();
    window.requestAnimationFrame(gameloop);
  }
}
function drawBoard()
{
  for (let i = 0; i < board.length; i++)
  {
    for (let j = 0; j < board[i].length; j++)
    {
      switch (board[i][j])
      {
        case 0:
        {
          context.fillStyle = '#262722';
          context.fillRect(j * unit, i * unit, unit, unit);
          break;
        }

        case 1:
        {
          context.fillStyle = '#274696';
          context.fillRect(j * unit, i * unit, unit, unit);
          break;
        }

        case 2:
        {
          context.fillStyle = '#E5282E';
          context.fillRect(j * unit, i * unit, unit, unit);
          break;
        }

        case 3:
        {
          context.fillStyle = '#F8D517';
          context.fillRect(j * unit, i * unit, unit, unit);
          break;
        }

        case 4:
        {
          context.fillStyle = '#5CAD2C';
          context.fillRect(j * unit, i * unit, unit, unit);
          break;
        }

        case 5:
        {
          context.fillStyle = '#DF2384';
          context.fillRect(j * unit, i * unit, unit, unit);
          break;
        }

        case 6:
        {
          context.fillStyle = '#EF7E18';
          context.fillRect(j * unit, i * unit, unit, unit);
          break;
        }

        case 7:
        {
          context.fillStyle = '#2CB099';
          context.fillRect(j * unit, i * unit, unit, unit);
          break;
        }
      }
    }
  }
}

function clearLines()
{
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
      shiftBoard(i);
    }
    piecesInRow = 0;
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
