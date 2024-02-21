// javascript file for bird 2-26 game Слугин
"use strict";
const restartButton = document.querySelector(".restartButton"),
  score = document.querySelector(".score"),
  scoreRecord = document.querySelector(".scoreRecord"),
  bgImg = new Image(),
  gameCtx = birdGame.getContext("2d");
bgImg.src = gameAsset.img;

// делитель частоты кадров
let syncDiv = MAX_GEAR - GEAR;
if (syncDiv < 1) {
  syncDiv = 0;
}
// фон
const background = {
  x: birdGame.width,
  syncDiv: syncDiv,
  frameStep: 2,
  skipCycle: syncDiv,
};
// процедура генерации целого случайного числа в диапазоне [0..m)
const rnd = (m) => {
  return Math.floor(Math.random() * m);
};
// счётчик пройденных труб
let pipeCount = 0;
scoreRecord.innerHTML = `${maxCountLabel}${pipeCount}`;
// трубы в обслуживании
let pipe = [];
let run = true;
// record display maintain
const setRecordDisplay = (function () {
  const recordKeyName = "pipeRecord-9487";
  const showRecord = (info) => {
    scoreRecord.innerHTML = `${maxCountLabel}${info}`;
  };
  const putToStorage = (m) => {
    localStorage.setItem(recordKeyName, m);
  };
  function setRecordDisplay() {
    score.innerHTML = `${countLabel}${pipeCount}`;
    let pipeRecord = localStorage.getItem(recordKeyName);
    if (pipeRecord) {
      showRecord(pipeRecord);
    }
    if (pipeCount > pipeRecord) {
      putToStorage(pipeCount);
      showRecord(pipeCount);
    }
  }
  return setRecordDisplay;
})();

class Landscape {
  _lowest = bird1.lowest;
  _ceiling = bird1.ceiling;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  collide(landscape) {
    this.bump(landscape);
  }
  dead() {}
  bump(landscape) {}
  create(landscape) {}
  destroy(pipes) {
    pipes.destroy(pipes);
  }
}
class Bird extends Landscape {
  showBird() {
    if (bird1.wingNumber) {
      bird1.wingNumber--;
    } else {
      bird1.wingNumber = bird1.wingCountMax;
    }
    gameAsset.bird.y =
      Math.floor(
        (bird1.wingNumber % (bird1.flapSpeed * bird1.wingFramesQuantity)) /
          bird1.flapSpeed,
      ) * gameAsset.bird.height;
    const birdSource = {
      x: gameAsset.bird.x,
      width: gameAsset.bird.width,
      y: gameAsset.bird.y,
      height: gameAsset.bird.height,
    };
    gameCtx.drawImage(
      bgImg,
      birdSource.x,
      birdSource.y,
      birdSource.width,
      birdSource.height,
      this.x,
      this.y,
      bird1.width,
      bird1.height,
    );
  }
  dead() {
    if (this.y > this._lowest) {
      game.playEnd();
    }
  }
  flightCeiling() {
    if (this.y < this._ceiling) {
      this.y = this._ceiling;
    }
  }
  bump(landscape) {
    if (landscape instanceof Pipe) {
      pipe.forEach((pipe) => {
        // score counting / show on display
        if (pipe.notPassed && bird1.x > pipe.x + PIPE.halfWidth) {
          pipe.notPassed = false;
          pipeCount++;
          score.innerHTML = `${countLabel}${pipeCount}`;
        }
        // collision detection
        if (bird1.x < pipe.x + PIPE.width) {
          if (bird1.x + bird1.width > pipe.x) {
            if (
              bird1.flightHeight < pipe.cnv.up.height ||
              bird1.flightHeight + bird1.height > pipe.cnv.down.y
            ) {
              //collision detected - program stop
              game.playEnd();
            }
          }
        }
      });
    }
  }
}

class Pipe extends Landscape {
  create(sync) {
    if (sync) {
      PIPE.distance = PIPE.distance + background.frameStep;
    }
    if (PIPE.distance > PIPE.interval) {
      // установка труб через каждый PIPE.interval
      PIPE.distance = 0;
      let pipeSource1 = {
        up: {
          x: gameAsset.pipe.x1,
          width: gameAsset.pipe.width,
          y: gameAsset.pipe.y,
          height: gameAsset.pipe.height,
        },

        down: {
          x: gameAsset.pipe.x2,
          width: gameAsset.pipe.width,
          y: gameAsset.pipe.y,
          height: gameAsset.pipe.height,
        },
      };
      const pipeLength =
          birdGame.height / 2 -
          PIPE.gap +
          rnd(gameAsset.pipe.height - PIPE.minHeight),
        gapPlusLength = PIPE.gap + pipeLength;
      pipeSource1.up.y =
        gameAsset.pipe.y + (gameAsset.pipe.height - pipeLength);
      pipeSource1.up.height = pipeLength;

      pipeSource1.down.height = birdGame.height - gapPlusLength;

      const pipeOnCanvas1 = {
        up: { width: PIPE.width, height: pipeSource1.up.height },
        down: {
          width: PIPE.width,
          height: pipeSource1.down.height,
          y: gapPlusLength,
        },
      };
      // создаёт трубы
      pipe.push({
        src: pipeSource1,
        cnv: pipeOnCanvas1,
        x: birdGame.width,
        notPassed: true,
      });
    }
  }
  move(sync) {
    pipe.forEach((pipe) => {
      // труба: получение очередной координаты положения по оси X для каждой трубы
      if (sync) pipe.x -= background.frameStep;
      // труба верх
      gameCtx.drawImage(
        bgImg,
        pipe.src.up.x,
        pipe.src.up.y,
        pipe.src.up.width,
        pipe.src.up.height,
        pipe.x,
        0,
        pipe.cnv.up.width,
        pipe.cnv.up.height,
      );
      // труба низ
      gameCtx.drawImage(
        bgImg,
        pipe.src.down.x,
        pipe.src.down.y,
        pipe.src.down.width,
        pipe.src.down.height,
        pipe.x,
        pipe.cnv.down.y,
        pipe.cnv.down.width,
        pipe.cnv.down.height,
      );
    });
  }
  destroy(landscape) {
    if (landscape instanceof Pipe) {
      let junkOff = false;
      pipe.forEach((pipe) => {
        if (pipe.x < -pipe.cnv.down.width) {
          junkOff = true;
        }
      });
      if (junkOff) {
        pipe.shift();
      }
    }
  }
}

// кадр
const frame = () => {
  let sync = false;
  if (background.skipCycle) {
    background.skipCycle--;
  } else {
    background.skipCycle = background.syncDiv;
    sync = true;
    // получение горизонтальной координаты для движения фона
    background.x -= background.frameStep;
    if (background.x < 0) {
      background.x = birdGame.width;
    }
  }
  // фон
  const bgSource = {
    x: 0,
    width: birdGame.width,
    y: 0,
    height: birdGame.height,
  }; // фон: первая часть
  const bgImg1 = {
    x: background.x,
    width: birdGame.width,
    y: 0,
    height: birdGame.height,
  };
  gameCtx.drawImage(
    bgImg,
    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,
    bgImg1.x,
    bgImg1.y,
    bgImg1.width,
    bgImg1.height,
  );
  // фон: вторая часть
  const bgImg2 = {
    x: background.x - birdGame.width,
    width: birdGame.width,
    y: 0,
    height: birdGame.height,
  };
  gameCtx.drawImage(
    bgImg,
    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,
    bgImg2.x,
    bgImg2.y,
    bgImg2.width,
    bgImg2.height,
  );

  // птица: получение координаты высоты
  switch (bird1.fly) {
    case "up":
      if (sync) {
        bird1.flightHeight -= bird1.goUpSpeed;
      }
      bird1.acceleration = 1;
      break;

    case "down":
      if (sync) {
        bird1.acceleration += bird1.accelerationFactor;
        bird1.flightHeight += Math.floor(bird1.acceleration);
      }
      break;
  }
  const landscape = new Landscape();
  // птица
  const bird = new Bird(bird1.x, bird1.flightHeight);
  bird.dead();
  bird.flightCeiling();
  bird.showBird();
  // труба
  if (!PIPE.disable) {
    const pipes = new Pipe();
    pipes.create(sync);
    pipes.move(sync);
    landscape.destroy(pipes);
    //столкновение птицы с трубой
    bird.collide(pipes);
  }

  if (run) {
    window.requestAnimationFrame(frame);
  }
};

const birdGoDown = () => {
  clearTimeout(bird1.goUpTimeoutId);
  clearTimeout(bird1.sustainTimeoutId);
  bird1.goUpTimeoutId = setTimeout(() => {
    bird1.fly = "";
    bird1.sustainTimeoutId = setTimeout(() => {
      bird1.fly = "down";
    }, bird1.sustainTimeout);
  }, bird1.goUpTimeout);
};

const clickControl = () => {
  if (run && !PIPE.disable) {
    bird1.fly = "up";
    birdGoDown();
  }
};
// вкл. опроса мыши
birdGame.addEventListener("click", clickControl);

class Game {
  playStart() {
    bird1.flightHeight = flightHeightInitial;
    bird1.acceleration = 1;
    bird1.fly = "";
    // обнуление счета очков
    pipeCount = 0;
    // удаление труб
    pipe = [];
    // last maximum score display
    setRecordDisplay();
    // первичный запуск
    bgImg.onload = frame;
  }
  playEnd() {
    run = false;
    setRecordDisplay();
    PIPE.disable = true;
    score.style.top = "";
    scoreRecord.style.top = "";
    scoreRecord.style.opacity = "1";
    restartButton.style.opacity = "0";
    restartButton.innerHTML = "RESTART";
    setTimeout(() => {
      restartButton.style.display = "block";
      setTimeout(() => {
        restartButton.style.opacity = "1";
      }, restartDelay);
    }, restartDelay);
  }
}
const game = new Game();
run = true;
game.playStart();
restartButton.addEventListener("click", () => {
  if (PIPE.disable) {
    PIPE.disable = false;
  }
  restartButton.style.opacity = "0";
  score.style.top = "1%";
  scoreRecord.style.top = "8%";
  birdGoDown();
  game.playStart();
  if (!run) {
    run = true;
    frame();
  }
  setTimeout(() => {
    restartButton.style.display = "none";
    scoreRecord.style.opacity = "0";
  }, restartDelay);
});
