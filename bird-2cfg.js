// configuration file for bird 2-26 game Слугин
const birdGame = document.getElementById("birdGame"),
  // координаты элементов игры
  gameAsset = {
    // источник изображения элементов
    img: "./img/flappy-bird-set.png",
    // трубы
    pipe: { x1: 432, x2: 510, y: 108, width: 77, height: 480 },
    // изображение номер один, птица
    bird: { x: 433, y: 0, width: 51, height: 36 },
  },
  // максимальная скорость
  MAX_GEAR = 11;
// заданная текущая скорость
let GEAR = 9;
// птица: период махания крыльями
const wingPeriod = 15,
  // соотношение высоты к ширине исходного изображения птицы
  birdRatio = gameAsset.bird.height / gameAsset.bird.width,
  // отображаемая высота изображения птицы
  birdHeight = gameAsset.pipe.height / 15,
  // начальная высота полёта
  flightHeightInitial = birdGame.height / 2,
  // количество кадров положений крыльев
  wingFramesQuantity = 3,
  bird1 = {
    //расчёт констант для махания крыльями
    flapSpeed: wingPeriod,
    wingNumber: wingPeriod * wingFramesQuantity,
    wingCountMax: wingPeriod * wingFramesQuantity,
    wingFramesQuantity: wingFramesQuantity,
    // отображаемая высота птицы
    height: birdHeight,
    // отображаемая ширина птицы
    width: birdHeight / birdRatio,
    // максимальная высота полёта
    ceiling: 150,
    // минимальная высота полёта
    lowest: 700,
    // шаг подъёма по высоте
    goUpSpeed: 2,
    // время подъёма
    goUpTimeout: 220,
    // время удержания высоты после окончания подъёма
    sustainTimeout: Math.floor(1600 / GEAR),
    // идентификатор таймера подъёма
    goUpTimeoutId: 0,
    // идентификатор таймера удержания высоты после окончания подъёма
    sustainTimeoutId: 0,
    // направление полёта
    fly: "",
    // установка высооты полёта равной начальная высота полёта
    flightHeight: flightHeightInitial,
    // горизонтальное положение изображения птицы
    x: Math.floor(birdGame.width / 3),
    // переменная для определения текущего ускорения падения птицы
    acceleration: 0,
    // ускорение падения птицы
    accelerationFactor: 0.03 + GEAR / 400,
  },
  // труба
  PIPE = {
    // длина видимой на канвасе короткой трубы
    minHeight: 300,
    // ширина коридора между трубами для пролёта птицы
    gap: Math.floor(gameAsset.pipe.height / 4),
    // ширина трубы
    width: bird1.width * 2,
    // половинная ширина трубы для подсчета очков
    halfWidth: bird1.width,
    // граница интервала для установки труб
    interval: bird1.width * 6,
    // вычисляемый интервал между трубами
    distance: 0,
    // разрешение для начала установки труб
    disable: true,
  },
  // задержка перед повторным запуском
  restartDelay = 1000,
  // табло
  countLabel = "Счёт: ",
  maxCountLabel = "Рекорд: ";
