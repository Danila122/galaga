import MainShip from './modules/MainShip.js'
import LineInvaders from './modules/LineInvaders.js'
import settings from './Settings.js'



class GameWindow {
  constructor({app}) {
    this.addHealthSoundEffects = new Audio('audio/additionalHP.mp3'); //звуковой эффект дополнительной жизни игроку
    this.bonusForPoints = 15000; //за каждые 15000 игрок получает дополнительную жизнь
    this.sumBonusForPoints = this.bonusForPoints;
    this.mainShip = new MainShip(); 
    this.gameOver = false;
    this.requestAnimationId;
    this.then = Date.now(); //время с начала запуска анимации
    this.app = app;
    
    //вешаем событие на клавиши, которые активирую выстрел корабля игрока ('KeyF','Space')
    window.addEventListener('keydown', (e) => {
      
      if (this.mainShip && !this.mainShip.shipExplosion && (e.code === 'KeyF' || e.code === 'Space')) {
        if (e.repeat || this.mainShip.projectiles.length === 2) {
          return
        } else {
         
          this.mainShip.shot();
          this.app.countShot++
        }
      }
    })                 

    // собираем данные об канвасе
    settings.canvas = document.querySelector('#gameWindow');
    settings.ctx = settings.canvas.getContext("2d");
    // создаем буферизирующий канвас
    settings.bufferCanvas = document.createElement("canvas");
    settings.bufferCtx = settings.bufferCanvas.getContext("2d");
    settings.bufferCtx.canvas.width = settings.ctx.canvas.width;
    settings.bufferCtx.canvas.height = settings.ctx.canvas.height;
  }

  //Метод обрабатывает столкновение кораблей
  shipsCollision() {
    this.lineInvaders.invaders.forEach(invader => { //перебираем вражеские корабли
      if ( //если вражеский корабль столкнуля с кораблем игкока - удаляем корабли
        invader.position.x+ invader.width / 2  >= this.mainShip.position.x - this.mainShip.width / 2 &&
        invader.position.x- invader.width / 2  <= this.mainShip.position.x + this.mainShip.width / 2 && 
        invader.position.y >= this.mainShip.position.y - this.mainShip.height / 2
      ) {
        setTimeout(() => {
          this.hitShip(this.mainShip,'collision');
          this.hitShip(invader, 'collision');       
        }, 0)
      }
    })
  }

  // Метод обрабатывает вылет захватчиков за поле боя
  invaderOutsideBattlefield() {
    this.lineInvaders.invaders.forEach(invader => { //беребираем вражеские корабли
      //если захватчик вылетел за игровое поле, перемещаем его на вверх 
      if (invader.position.y - invader.height / 2 > settings.bufferCanvas.height) {
        invader.position.y = -20; //начальная позиция за игровым полем
        invader.position.x = settings.getRandom(0 + invader.width / 2, 700 - invader.width / 2);//рандомное значение X
      }
    })
  }

  //отслеживаем попадание снаряда в вражеский корабль
  shootInvaders() {
    this.lineInvaders.invaders.forEach(invader => { //беребираем вражеские корабли

      this.mainShip.projectiles.forEach((projectile, numberProjectile) => { //перебираем снаряды коробля игрока

        if ( // отслеживаем попадание снаряда во вражеский корабль
          projectile.position.y <= invader.position.y + invader.height / 2 &&  
          projectile.position.x >= invader.position.x - invader.width / 2 && 
          projectile.position.x <= invader.position.x + invader.width / 2 && 
          projectile.position.y >= invader.position.y - invader.height / 2
        ) { 
          setTimeout(() => {
            const invaderFound = this.lineInvaders.invaders.find(invader2 => invader2 === invader);//находим первый вражеский корабль
            const projectileFound = this.mainShip.projectiles.find(projectile2 => projectile2 === projectile);
            
            if (invaderFound && projectileFound) {
              this.hitShip(invaderFound);
              this.mainShip.projectiles.splice(numberProjectile, 1); //удаляем снаряд из массива
            }
          }, 0)
        }
      })
    })
  }

  //отслеживаем попадание снаряда в корабль игрока
  invadersShootBack() {
    this.lineInvaders.projectiles.forEach((projectile, numberProjectile) => {
      if (
        projectile.position.y + projectile.height >= this.mainShip.position.y
        && projectile.position.x + projectile.width >= this.mainShip.position.x - this.mainShip.width / 2
        && projectile.position.x <= this.mainShip.position.x + this.mainShip.width / 2
      ) {
        setTimeout(() => {
          this.lineInvaders.projectiles.splice(numberProjectile, 1); // удаляем снаряд захватчика
          this.hitShip(this.mainShip);
        }, 0)
      }
    })
  }

  //Метод принимает корабль (захвтчик/игрок), в который попал снаряд 
  hitShip(ship,type) {

    if (ship.type === 'player') {
      this.returnMainShip(ship);
      
    } else {
      if(type!=='collision' && ship.healthPoints===1){ //если завхтчик уничтожился не в столкновении, то увеличиваем количество сбитых захватчиков
        this.app.numberHits++
        if (ship.shipIsFlying) { //проверка, захватчик находился в полете или в строю (от этого зависит количество очков)
          this.app.printPoint(ship.pointsinvaderInFlight);
        } else{  
          this.app.printPoint(ship.pointsinvaderInLine);
        }
      }
      
      this.lineInvaders.hit(ship, type);
    }
    
    //если игкрок набрал 15000 очков, он получает дополнительную жизнь
    if(type!=='collision' && this.app.playerPoints>=this.sumBonusForPoints && this.app.playerHealthPoints!==9){
      settings.playSound( this.addHealthSoundEffects);
      this.app.playerHealthPoints++
      this.app.printPlayerHealthPoints();
      this.sumBonusForPoints+=this.bonusForPoints;
    }
  }

  //Метод воскрешает корабль игрока
  returnMainShip(ship){
    this.lineInvaders.stopAttack();//останавливаем атаку захватчиков
    this.lineInvaders.projectiles=[]; //удаляем все снаряды с поле боя
    this.app.playerHealthPoints-- //удаляем один HP у корабля игрока
    this.app.printPlayerHealthPoints();


    ship.hit().then(()=>{
      //после того, как закончилаьс анимация взрыва проверяем, если у игрока нет HP, заканчиваем игру
      if(!this.gameOver && this.app.playerHealthPoints<=0){
        this.gameOver=true;
        this.stop();
        this.app.gameOver();
        return
      }

      if(this.lineInvaders){
        this.lineInvaders.start();
        this.mainShip = new MainShip();
      }
    })
  }

  //Метод завершает игру
  stop() {
    if(settings.canvas)  this.blank();
    cancelAnimationFrame(this.requestAnimationId);
    this.mainShip = null;
  }

  //Метод начинает игру
  start(level){
    this.then = Date.now();
    this.lineInvaders = new LineInvaders(level);
    this.mainShip = new MainShip();
    this.update();
  }

  blank(){
    settings.bufferCtx.clearRect(0, 0, settings.bufferCanvas.width, settings.bufferCanvas.height);//очистка полотна 
    settings.ctx.clearRect(0, 0, settings.bufferCanvas.width, settings.bufferCanvas.height);//очистка полотна 
  }

  //Метод отрисовывает все элементы игры
  draw(){
    this.blank();
    this.mainShip.update();
    this.lineInvaders.update();
    this.invaderOutsideBattlefield();
    this.shipsCollision();
    this.shootInvaders();
    this.invadersShootBack();
  
    settings.ctx.drawImage(settings.bufferCanvas, 0, 0, settings.bufferCanvas.width, settings.bufferCanvas.height);
  }

  update() {
  
    //если игрок уничтожил все корабли, начинается новый уровень
    if(this.app.playerHealthPoints!==0 &&this.lineInvaders.destroyedInvaders.length===0 && this.lineInvaders.numberBand===this.lineInvaders.bandsInavader.length && this.lineInvaders.invaders.length===0){
      this.app.startGame();
      return
    }


    // Функция контролирует fps для requestAnimationFrame, т.е. указываем частоту кадров не более settings.fps
    // Такая функция необходима для корректной работы приложения на мониторах с частотой обновления экрана > 60гц  
    let delta;
    let interval = 1000/settings.fps;
    let now = Date.now();
    delta = now - this.then;
    
    if (delta > interval) {
      this.then = now - (delta % interval);
      this.draw();
    }

    this.requestAnimationId = requestAnimationFrame(() => this.update());
  }
}


export default GameWindow


