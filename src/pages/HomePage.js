const HomePage = {
  render: () => {
    return `
    <section class="main page">
      <div class="main__menu menu page-body menu">
        <div class='main__user-info'>
          <div class='main__user-name'>hi, ${JSON.parse(localStorage.getItem('galagaGameUserInfo')).name}</div>
        </div>
        <a href="#game" class="menu__item start-game-button">Start Game</a>
        <a href="#records" class="menu__item records">records</a>
        <a href="#rules" class="menu__item rules">rules</a>
        <a href="#control" class="menu__item">control</a>
      </div>
    </section> 
    `;
  }
};

export default HomePage;

{/* <div class='main__user-score'></div> */}