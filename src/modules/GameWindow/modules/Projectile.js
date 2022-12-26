
import settings from '../Settings.js'

//Объект снаряда корабля
class Projectile {
  constructor({ position, speed, type }) {
    this.position = position; //начальная поцизия снаряда
    this.speed = speed; //скорость снаряда
    this.height = 10; //длина снаряда
    this.width = 2; //ширина снаряда
    this.type = type; //снаряд корабля захватчика или игрока
  }

  //Метод отрисовывает снаряд
  draw() {
    if (this.type === 'player') {
      settings.bufferCtx.fillStyle = '#006AD7'
      settings.bufferCtx.fillRect(this.position.x - this.width / 2 - 2, this.position.y - 2, 6, 4)  ;
      settings.bufferCtx.fillStyle = '#006AD7';
      settings.bufferCtx.fillRect(this.position.x - this.width / 2, this.position.y - 5, this.width, this.height - 5);
      settings.bufferCtx.fillStyle = '#fc0300';
      settings.bufferCtx.fillRect(this.position.x - this.width / 2, this.position.y, this.width, this.height);
      settings.bufferCtx.fillStyle = 'white';
      settings.bufferCtx.fillRect(this.position.x - this.width / 2, this.position.y, this.width, this.width);
    } else {
      settings.bufferCtx.fillStyle = '#fc0300';
      settings.bufferCtx.fillRect(this.position.x - this.width / 2 - 2, this.position.y + 8, 6, 4);
      settings.bufferCtx.fillStyle = '#fc0300';
      settings.bufferCtx.fillRect(this.position.x - this.width / 2, this.position.y + 10, this.width, 6);
      settings.bufferCtx.fillStyle = 'white';
      settings.bufferCtx.fillRect(this.position.x - this.width / 2, this.position.y, this.width, this.height);
    }
  }

  //Метод обновляет позицию снаряда
  update() {
    this.draw();
    this.position.y += this.speed.y;
  }
}

export default Projectile