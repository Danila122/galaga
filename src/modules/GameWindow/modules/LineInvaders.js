import { GreenInvader, RedInvader, BlueInvader } from './Invaders.js'
import settings from '../Settings.js'
import Projectile from './Projectile.js'


//Объект армии захватчиков
class LineInvaders {
  constructor(level) {
    this.level = level; //текущий уровень
    this.destroyedInvaders = []; 
    this.attack = true;
    this.shotFrequency = settings.getRandom(90, 110); // как часто захватчики будут стрелять
    this.velocity = this.level >= 9 ? 10 : this.level + 1; //если level>9, то скорость кораблей не будет увеличиваться
    this.frameNumberFormation = this.level >= 7 ? 8 : 10; //интервал, с которым корабли буду вылетать на игровое поле
    this.numberBand = 0; //номер отряда
    this.numberInvader = 0; // номер захватчика
    this.projectiles = []; // массив снарядов захватчиков
    this.frames = 0;
    this.invaders = []; //массив захватчикоы на поле боя
    this.orderInvaders = []; // массив захватяиков готовых к вылету
    this.finishFormation = false;
    this.attackTimer = 60 - this.velocity < 40 ? 30 : 60 - this.velocity; //интервал, с которым один из кораблей будет нападать
    //массив объектов-отрядов захватчиков
    this.bandsInavader = [
      {
        invaders: ['blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'redInvader', 'redInvader', 'redInvader', 'redInvader'],//захватчики в отряде
        pointsEnd: [[325, 210], [375, 210], [325, 245], [375, 245], [325, 140], [375, 140], [325, 175], [375, 175]],//точка остановки захватчиков
        element: [220, -40, 1200, 400, 200, 850], //контрольные точки кривой Безье
      },
      {
        invaders: ['greenInvader', 'redInvader', 'greenInvader', 'redInvader', 'greenInvader', 'redInvader', 'greenInvader', 'redInvader'],
        pointsEnd: [[280, 100], [275, 140], [326, 100], [425, 140], [373, 100], [275, 175], [419, 100], [425, 175]],
        element: [480, -20, -500, 400, 500, 850], 
      },
      {
        invaders: ['redInvader', 'redInvader', 'redInvader', 'redInvader', 'redInvader', 'redInvader', 'redInvader', 'redInvader',],
        pointsEnd: [[525, 140], [475, 140], [525, 175], [475, 175], [175, 140], [225, 140], [175, 175], [225, 175]],
        element: [220, -40, 1200, 400, 200, 850],
      },
      {
        invaders: ['blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'blueInvader'],
        pointsEnd: [[475, 210], [425, 210], [475, 245], [425, 245], [275, 210], [225, 210], [275, 245], [225, 245]],
        element: [480, -20, -500, 400, 500, 850],
      },
      {
        invaders: ['blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'blueInvader', 'blueInvader'],
        pointsEnd: [[125, 210], [175, 210], [125, 245], [175, 245], [525, 210], [575, 210], [525, 245], [575, 245]],
        element: [220, -40, 1200, 400, 200, 850],
      },
    ]
    this.createInvaders();
  }

  //Метод создает захватчика и передает в него инструкцию
  createInvader(invader, instruction) {
    switch (invader) {
      case 'blueInvader':
        return new BlueInvader(instruction)
      case 'redInvader':
        return new RedInvader(instruction)
      case 'greenInvader':
        return new GreenInvader(instruction)
    }
  }

  //создание инструкция жизни захватчика
  getInstruction(band, numberInvader) {
    const pointEnd = band.pointsEnd[numberInvader];//точка остановки захватчика после построения
    const element = band.element;

    return {
      formationElement: element.concat(pointEnd),
      velocity: this.velocity,
    }
  }

  //Метод заполняет массив this.invaders захватчиками
  createInvaders() {

    this.bandsInavader.forEach(band => {

      let bandInvaders = [];

      band.invaders.forEach((invader, numberInvader) => {

        let createdInvader = this.createInvader(invader, this.getInstruction(band, numberInvader)); //создание захватчика
        bandInvaders.push(createdInvader) ;

        if (band.invaders.length - 1 === numberInvader) { //если один отряд сформироался, он добавляется в массив this.invaders
          this.orderInvaders.push(bandInvaders);
        }
      })
    })
  }

  //создание выстрела (захватчики стреляют только при построении)
  shot() {
    let invadersInFlight = []; //массив захватчиков в полете

    this.invaders.forEach(invader => {
      if (invader.shipIsFlying) invadersInFlight.push(invader); //заполение массива invadersInFlight
    })

    const invader = invadersInFlight[settings.getRandom(0, invadersInFlight.length - 1)]; //выбираем случайного захватчика

    if (invadersInFlight.length === 0) return

    this.projectiles.push(new Projectile({
      position: {
        x: invader.position.x, //получаем текущее положение захватчика
        y: invader.position.y
      },
      speed: {
        x: 0,
        y: this.velocity
      },
      type: invader.type
    }))
  }

  //Метод приводит в движение снаряды в массиве projectiles
  activeProjectile() {
    this.projectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.height < 0 ||
        projectile.position.y + projectile.height > settings.bufferCanvas.height) {  //если снаряд за пределами окна - удаляется из массива
        setTimeout(() => {
          this.projectiles.splice(index, 1);
        }, 0)
      } else {
        projectile.update();
      }
    })
  }

  //Метод срабатывает, когда по захватчику попал снаряд
  hit(invader, type) {

    const numberInvader = this.invaders.indexOf(invader); //по индексу находим захватчика

    //если снаряд игрока попал в зеленый корабль, то поменять ему цвет
    if (invader.healthPoints > 1 && type !== 'collision') {
      cancelAnimationFrame(invader.spriteIntervalId);
      invader.image.src = 'img/invaders/green/spritePurple.png';
      invader.healthPoints--
      return
    }

    //если захватчик и корабль игрока столкнулись, то звук взрыва не активируется 
    if (type !== 'collision') settings.playSound(invader.bangSoundEffects);


    this.invaders.splice(numberInvader, 1); //удаление корабля из массива захватчиков
    this.destroyedInvaders.push(invader); //добавление корабля в массив уничтоженных кораблей(для анимации взрыва)

    invader.shipIsFlying = false;

    cancelAnimationFrame(invader.requestAnimationId);

    invader.drawBang().then(() => {
      this.destroyedInvaders.shift(); //как только анимация взрыва закончиться, захватчик удаляется из массива
    })
  }

  //Метод активирует построение кораблей 
  formationInvaders() {

    //отряд начинает строиться через определенный интервал и тогда, когда предыдущий отряд построился 
    if (this.frames % this.frameNumberFormation === 0 && this.numberBand <= this.orderInvaders.length - 1) {
      let band = this.orderInvaders[this.numberBand]; //одна группировака 
      let prevBand = this.orderInvaders[this.numberBand - 1];
      let invader = this.orderInvaders[this.numberBand][this.numberInvader]; //один захватчик
      //если корабль уже в полете, то не вызывать у него метод
      if (this.numberBand > 0 && prevBand[prevBand.length - 1].shipIsFlying) {
        return
      }

      //по очереди вызывает медот у кораблей в группировке  
      band[this.numberInvader].formation();

      //добавляем корабль в массив кораблей на игровом поле
      this.invaders.push(invader);

      this.numberInvader++ //увеличиваем номер корабля

      if (this.numberInvader > band.length - 1) {
        this.numberBand++ //увеличиваем номер отряда
        this.numberInvader = 0;
      }
    }


    //проверка, если последний корабль из отрада прекратил летать, значит отряд сформиррован
    if (this.numberBand - 1 === this.orderInvaders.length - 1 && !this.finishFormation) {
      this.invaders.forEach(invader => {
        if (invader.shipIsFlying) {
          this.finishFormation = false;
        } else {
          this.finishFormation = true;
        }
      })
    }
  }

  //Метод активирует атаку кораблей 
  attackInvaders() {
    //через определенный интервал, один из кораблей будет нападать
    if (this.frames % this.attackTimer === 0 && this.invaders.length !== 0 && this.attack) {
      const randomShip = settings.getRandom(0, this.invaders.length); //генерация случайного номера(интекса) захватчика

      if (!this.invaders[randomShip].shipIsFlying) { //если выбранный корабль не в полете, захватчик начинает атаку
        this.invaders[randomShip].angle = 180;
        this.invaders[randomShip].attack();
      }
    }
  }

  //Метод останавливает атаку 
  stopAttack() {
    this.attack = false;
    this.invaders.forEach(invader => {
      invader.velocity = 0;
    })
  }

  //Метод возобновляет атаку
  start() {
    this.attack = true;
    this.invaders.forEach(invader => {
      //если после возраждения корабля игкрока на пути есть враги, они смещаются в сторону
      if (invader.position.x < 390 && invader.position.x > 310 && invader.shipIsFlying)  invader.position.x = 300;
      
      invader.velocity = this.velocity; // скорости до соатновки 
    })
  }

  //Метод активирует движение захватчиков
  update() {
    this.activeProjectile();
    this.formationInvaders();

    if (this.finishFormation) this.attackInvaders(); //если отряды построились, начинается нападение


    //начиная с пятого уровня захватчики будут стрелять
    if (this.attack && this.level >= 5 && this.frames % this.shotFrequency === 0 && !this.finishFormation && this.invaders.length !== 0) {
      this.shot();
    }

    //анимируем спрайт взрыва
    this.destroyedInvaders.forEach(invader => {
      invader.draw();
    })

    //перерисовываем корабли
    this.invaders.forEach(invader => {
      invader.draw();
    })

    this.frames++
  }
}

export default LineInvaders