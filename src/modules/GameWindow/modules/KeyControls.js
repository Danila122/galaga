//Класс обрабатывает нажатие клавиш на клавиатуре
class KeyControls {
  constructor(keysList){ //массив клавиш, нажание на которые надо отслеживать
    this.keysList = keysList;
    this.keys = {};
    window.addEventListener('keydown', (e) => this.changeState(e));
    window.addEventListener('keyup', (e) => this.changeState(e));
  } 

  changeState(e){
     
    if(!this.keysList.includes(e.code)) return //проврека, нажата ли клавиша из массива keysList

    //если клавиша нажата, ей присваивается значение true, если отпущена - false 
    this.keys[e.code] = e.type === 'keydown' ? true : false;
  }
}

export default KeyControls