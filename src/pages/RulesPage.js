const Rules = {

  render: () => {
    return `
    <section class="rules page">
      <div class="rules__body page-body">
        <div class="rules__title title">rules</div>
        <div class="rules__body body">
          <p>Destroy the invaders and get points!</p>
          <p>At the top of the enemy formation are four large aliens - which require two shots to destroy.</p>
          <p>As the game progresses, invaders become more aggressive, increase speed and attack with projectiles.</p>
          <p>for every 15000 pts the player gets a health points.</p>
          <p>player gets more points if he destroys the invader in flight.</p>
          <table>
            <thead>
              <tr>
                <td></td>
                <td>convoy</td>
                <td>charger</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><img src="img/invaders/green/green_02.png" alt="greenInvader"></td>
                <td>150</td>
                <td>400</td>
                <td>pts</td>
              </tr>
              <tr>
                <td><img src="img/invaders/red/red_02.png" alt="redInvader"></td>
                <td>80</td>
                <td>160</td>
                <td>pts</td>
              </tr>
              <tr>
                <td><img src="img/invaders/blue/blue_02.png" alt="blueInvader"></td>
                <td>50</td>
                <td>100</td>
                <td>pts</td>
              </tr>
            </tbody>
          </table>
        </div>
     
      </div>
    </section> 
    `;
  }
};

export default Rules;