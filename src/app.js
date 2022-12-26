
import HomePage from "./pages/HomePage.js";
import RecordsPage from "./pages/RecordsPage.js";
import GamePage from './pages/GamePage.js';
import ResultPage from './pages/ResultPage.js';
import FormPage from './pages/FormPage.js';
import ErrorPage from './pages/ErrorPage.js';
import RulesPage from './pages/RulesPage.js';
import ControlPage from './pages/ControlPage.js';

import ContentHeader from "./components/ContentHeader.js";
import ContentBody from "./components/ContentBody.js";
import ContentFooter from "./components/ContentFooter.js";

import StarrySky from './modules/StarrySky/StarrySky.js';
import GameWindow from './modules/GameWindow/GameWindow.js';
import userData from './modules/UserData/UserData.js';


class App{
  constructor(){
    this.components = {
      header: ContentHeader,
      content: ContentBody,
      footer: ContentFooter,
    }
    
    this.routes = {
      form: FormPage,
      main: HomePage,
      records: RecordsPage,
      game: GamePage,
      default: HomePage,
      result:ResultPage,
      rules: RulesPage,
      control: ControlPage,
      error: ErrorPage,
    };

    this.userData = new userData();
    this.playerHealthPoints = 3; //количество жизней игрока
    this.playerPoints = 0; //количество очков игрока за игу
    this.level = 0; //бесконечное количество уровней. После девятого уровня скорость кораблей не будет увеличиваться. Номер уровня можно менять в методе blankInfo()
    this.countShot = 0; //количество выстрелов 
    this.numberHits = 0; //количество сбитых захватчиков
    this.game = true;
    this.confirmMessage = 'You will lose your score!';
    this.prevHash;
    this.gameWindow;
    this.starrySky;
  }

  beforeUnloadListener(e){
    e.preventDefault();
    return e.returnValue = this.confirmMessage;
  }

  //Метод выводить на старницу компоненты приложения
  renderComponents() {

    const container = document.querySelector('.app__container');
    
    for (let item in this.components) {
      if (this.components.hasOwnProperty(item)) {
        container.innerHTML += this.components[item].render();
      }
    }
    this.starrySky = new StarrySky({speed: 3}); //создаем звездное небо
  }

  //Метод выводить в приложение страницы
  renderContent(_hashPageName='') {
    let routeName 

    if (_hashPageName.length > 0) {
      routeName = _hashPageName in this.routes ? _hashPageName : "error";
    }else{
      if(localStorage.getItem('galagaGameUserInfo')){ //если в localStorage есть объект с данными пользователя, но по умолчанию открывается главная страница
        routeName = 'main';
        this.userData.printBestPlayerResult(); //выводим на страницу максимальное количество очков заработанных пользователем
      }else{
        routeName = 'form';
      }

      location.hash = '#'+routeName;
    }

    document.querySelector('.app__content').innerHTML = this.routes[routeName].render();

    if(routeName==='game'){
      this.gameWindow = new GameWindow({app:this}); //создаем новую игру
      this.startGame();
      this.starrySky.start(); //запускаем движение звезд
      addEventListener('beforeunload', this.beforeUnloadListener); //вешаем событие, которое предупредит пользоваетля о потере прогресса, если он перезагрузит страницу
    }else{
      removeEventListener('beforeunload',this.beforeUnloadListener);
      this.starrySky.stop(); // останавливаем движение звезд
    }
   
    if(routeName!=='game' && routeName!=='main' && routeName!=='form'){

      this.createHomePageBtn(routeName); //добавляем на страницу кнопку для быстрого перехода на главную страницу
    }

    if(routeName==='result'){
      this.createBattleResult(routeName); //вывод таблицы с результатами боя
      this.userData.updateUserDataInDataBase(this.playerPoints); //обновляем лучший результат пользователя в БД
    }

    if(routeName==='form'){
      this.userData.getInfoFromInput();   
    }

    if(routeName==='records'){
      this.printTopPlayersTable(routeName); //вывод таблицы с лучшими игроками
    }
  }

  //Метод срабатывает перед изменением хэша
  beforeHashChange(){
    
    //если пользователь уже ввел свое имя, то страница с формой не бует открываться
    if(location.hash=='#form' && localStorage.getItem('galagaGameUserInfo')){
      location.hash= '#main';
    }

    if(this.prevHash === 'game' && location.hash!=='#result'){
      //если во время игры пользователь переходит на предыдущую страницу, появляется предупреждающее сообщение
      if(!confirm(this.confirmMessage)){
        location.hash = '#game';
        return
      }else{
        this.game = false;
        this.gameWindow.stop();
      }
    }

    if(location.hash !== '#result'){
      this.blankInfo();
    }

    if(this.prevHash === 'game'){
      this.gameWindow.stop(); //остановка игры
    }

    //получаем данные с хэша и отображаем страницу
    const hashPageName = location.hash.slice(1).toLowerCase();
    this.renderContent(hashPageName);
    this.prevHash = hashPageName;
  }

  //Метод выводить на старницу табоицу Top 5 лучших игроков
  printTopPlayersTable(nameClass){
    const container = document.querySelector(`.${nameClass}`).querySelector('tbody');
    const database = this.userData.database; //объекты пользователей в БД
    let arrayObjects = []; //массив объектов всех игроков
    let numberUser = 1;

    for(let key in database){
      arrayObjects.push(database[key]);
    }

    sortByScore(arrayObjects) //сортировака объектов по убыванию по свойству score

    for (let i = 0; i < arrayObjects.length; i++) {
      if(i<=4){ 
        container.append(createRow(arrayObjects[i]));
      }
    }

    function sortByScore(arr){
      arr.sort((a, b) => a.score > b.score ? -1 : 1);
    }

    function createRow(user){
        let row = document.createElement('tr'),
        td1=document.createElement('td'),
        td2=document.createElement('td'),
        td3=document.createElement('td')
        
      td1.innerHTML = `${numberUser++}`;
      td2.innerHTML = `${user.name}`;
      td3.innerHTML = `${user.score}`;
      row.append(td1);
      row.append(td2);
      row.append(td3);
      
      
      return row
    }
  }

  //Метод создает кнопку для быстрого перехода на главную страницу
  createHomePageBtn(nameClass){
    const container = document.querySelector(`.${nameClass}`);
    const homePageBtn = document.createElement('a');
    homePageBtn.href = '#main';
    homePageBtn.textContent = 'home page';
    homePageBtn.classList.add('homePage-btn');
    container.prepend(homePageBtn);
  }

  //Метод создает таблицу с результатами боя
  createBattleResult(nameClass){
    const container = document.querySelector(`.${nameClass}__body`);
    const result = this.countShot===0? 0: this.numberHits/this.countShot*100;
    
    container.innerHTML = `
      <div class="result___title title">result</div>
      <table>
        <tr>
          <td>Shot fired</td>
          <td>${this.countShot}</td>
        </tr>
        <tr>
          <td>number of hits</td>
          <td>${this.numberHits}</td>
        </tr>
        <tr>
          <td>hit_miss ratio</td>
          <td>${result.toFixed(1)}%</td>
        </tr>
     </table>
    `
  }

  
  //Метод отображает на странице очки заработанные пользователем во время боя
  printPoint(point){
    if(!point){
      this.playerPoints = '00';
    }else{
      if(this.playerPoints==='00') this.playerPoints=0;
      this.playerPoints += point;
    }

    document.querySelector('.points').innerHTML = this.playerPoints;
  }

  //Метод отображает на странице номер уровня
  printLevel(){
    document.querySelector('.level').innerHTML = this.level;
  }

  //Метод отображает на странице количество жизней корабля игрока
  printPlayerHealthPoints(){
    const container = document.querySelector('.footer__hit-points');
    container.innerHTML = ''
    

    for (let i = 0; i < this.playerHealthPoints; i++) {
      const img = new Image();
      img.src = 'img/mainShip.png';
      img.alt = "mainShip";
      container.append(img);
    }
  }

  //Метод создает временные страницы с информацие: номер уровня, игра началась, игра закончилась
  craeteTemporaryPage(textContent){
    const contaner = document.querySelector('.game');
    const elem = document.createElement('span');
    let time = 1700;

    if(textContent==='stage'){
      elem.textContent = `stage ${this.level}`;
    }else{
      elem.textContent = textContent;
    }
    
    return new Promise((resolve)=>{
      contaner.append(elem);

      setTimeout(() =>{
        elem.remove();
        resolve();
      }, time);
    })
  }

  //Метод начинает новую игру
  startGame(){
    this.game = true;
    this.gameWindow.stop();

    if(this.level===0){
      this.countShot = 0;
      this.numberHits = 0;
      this.level=1;
    }else{
      this.level++
    }

    this.printLevel()

    this.craeteTemporaryPage('stage').then(()=>{
      if(this.game){
        this.gameWindow.start(this.level);
      }
    })
  } 

  //Метод заканчивает игру
  gameOver(){
    this.craeteTemporaryPage('game over')
    .then(()=>{
       location.hash = '#result';
       this.gameWindow.gameOver=false;
    })
  }

  //Метод очищает информацию о: номере уровня, количестве очков за игру, количество жизней
  blankInfo(){
    this.playerHealthPoints = 3;
    this.level=0;
   
    this.printLevel();
    this.printPoint();
    this.printPlayerHealthPoints();
    
  }

  init(root){
    document.getElementById(root).innerHTML = `<div class='app__container'></div>`;
    document.querySelector('.app__container').innerHTML= '<div class="app__loader"><img src="img/loader.gif" ></div>' ;

    this.userData.init().then(()=>{
      document.querySelector('.app__container').innerHTML='';
      this.renderComponents();
      this.renderContent();
      this.printLevel();
      this.printPoint();
      this.printPlayerHealthPoints() ;
    })


    window.addEventListener("hashchange", (e)=>{
      e.preventDefault();
      if(localStorage.getItem('galagaGameUserInfo') && this.prevHash !== location.hash.slice(1).toLowerCase()){
        this.beforeHashChange();
      }
    });
   
  }
}


const app = new App();
app.init('app');

export default App

