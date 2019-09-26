// Your web app's Firebase configuration
  let firebaseConfig = {
    apiKey: "AIzaSyDJ04cD1xgXu8_sF-pZLvRwmZfDN5j-DuQ",
    authDomain: "rock-paper-scissors-5e0e7.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-5e0e7.firebaseio.com",
    projectId: "rock-paper-scissors-5e0e7",
    storageBucket: "",
    messagingSenderId: "943030700059",
    appId: "1:943030700059:web:4a2728fb418d71f46550be"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let database = firebase.database();

  //Global Variables
  let gameOver = false;
  let currentPlayer;
  let noStatus = "N/A"
  let globalCounter = 0;
  let clearObj = {};
  
  
let player1 = {
    name: "Player 1",
    choice: {rock: false, paper: false, scissors: false, hasPicked: false},
    wins: 0,
    losses: 0,
    ties: 0,
    hasWon: false,
    connected: false,
    
  }

let player2 = {
    name: "Player 2",
    choice: {rock: false, paper: false, scissors: false, hasPicked: false},
    wins: 0,
    losses: 0,
    ties: 0,
    hasWon: false,
    connected: false,
    
}





  $(document).ready(function(){
    $('#player1-controls').hide()
    $('#player2-controls').hide()
    
    
    
    //Updates the local changes to FB
    function updatePlayers(){
      
      database.ref().set({
            players: {
                player1, 
                player2,
                gameOver},
                
          });
    }

    function getName() {
      let name;
        if(currentPlayer == 'Player1'){
          name = player1.name;
        }else {
          name = player2.name;
        }

        return name;
    }

    function updateMessage(){
      let name =  getName();
      let msg = `[${new moment().format("HH:mm A")}] ${name}: ${$("#message").val()}`
      database.ref("messages").push({
          msg
      });
      $("#message").val("");
 
}

    
    


    database.ref('messages').on('child_added', function(snapshot){
      let sv = snapshot.val();
      $('#message-box').append(sv.msg);
    });
   



    //set the name of players
    database.ref().on("value", function (snapshot) {
        let sv = snapshot.val();
        if(sv == null){
            console.log("nothing here")
        }else{

            //pulling data from Firebase and then updating local variables
            player1 = sv.players.player1;
            player2 = sv.players.player2;
            gameOver = sv.players.gameOver;
            
            console.log(player1);
            console.log(player2);
            gameLogic();
            readData();
            if(gameOver == false){
                $("#newgame").empty();
            }
        }

        
    })

    function readData(){
        console.log("reading new data from DB")
        //Player 1
        $("#player1-h2").html(`<h2>${player1.name} Controls</h2>`)
        $("#player1Wins").text(`Wins: ${player1.wins}`);
        $("#player1Losses").text(`Losses: ${player1.losses}`);
        $("#player1Ties").text(`Ties: ${player1.ties}`);

        //Player 2
        $("#player2-h2").html(`<h2>${player2.name} Controls</h2>`)
        $("#player2Wins").text(`Wins: ${player2.wins}`);
        $("#player2Losses").text(`Losses: ${player2.losses}`);
        $("#player2Ties").text(`Ties: ${player2.ties}`);

        

        
    }

$(document).on("click", ".set-name", function(e) {
    e.preventDefault();
    if(player1.connected == false && player2.connected == false){
        //save Player1 to FireBase
        currentPlayer = 'Player1'
        player1.connected = true;
        player1.name = $("#player_name").val().trim();
        updatePlayers();
        readData();
        $("#player1-controls").show();
        let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${player1.name} connected.</p>`
        database.ref("messages").push({
            msg
        });
        
        
    }else if(player1.connected == true && player2.connected == false){
        //save Player2 to FireBase
        currentPlayer = 'Player2'
        player2.connected = true;
        player2.name = $("#player_name").val().trim();
        updatePlayers();
        readData();
        $("#player2-controls").show();
        let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${player2.name} connected.</p>`
        database.ref("messages").push({
            msg
        });
    }else if(player1.connected == false && player2.connected == true) {
      currentPlayer = 'Player1'
        player1.connected = true;
        player1.name = $("#player_name").val().trim();
        updatePlayers();
        readData();
        $("#player1-controls").show();
        let msg = `<p class="status-msg">[${new moment().format("HH:mm A")}] ${player1.name} connected.</p>`
        database.ref("messages").push({
            msg
        });
    }
    
});
    


    $(document).on('click', '.player1-choice', function(){
      let player1Choice = $(this).data('value');

      switch(player1Choice) {
        case 'rock':
          if(player1.choice.hasPicked == false) {
            player1.choice.rock = true;
            player1.choice.hasPicked = true;
            $('#message-box').append(`<p><span class='choice-text'>You have picked rock!</span></p>`);
            console.log(player1.choice.rock);
            updatePlayers();
            
          }

          break;
        case 'paper':
          if(player1.choice.hasPicked == false) {
            player1.choice.paper = true;
            player1.choice.hasPicked = true;
            $('#message-box').append(`<p><span class='choice-text'>You have picked paper!</span></p>`);
            console.log("Picked paper");
            updatePlayers();
          }
          break;
        case 'scissors':
            if(player1.choice.hasPicked == false) {
            player1.choice.scissors = true;
            player1.choice.hasPicked = true;
            $('#message-box').append(`<p><span class='choice-text'>You have picked scissors!</span></p>`);
            console.log("Picked scissors");
            updatePlayers();
            }
          break;
      }

    })

    $(document).on('click', '.player2-choice', function(){
      let player2Choice = $(this).data('value');

      switch(player2Choice) {
        case 'rock':
          if(player2.choice.hasPicked == false) {
              player2.choice.rock = true;
              player2.choice.hasPicked = true;
              $('#message-box').append(`<p><span class='choice-text'>You have picked rock!</span></p>`);
              console.log("Picked rock");
              updatePlayers();
            }
          break;
        case 'paper':
          if(player2.choice.hasPicked == false) {
              player2.choice.paper = true;
              player2.choice.hasPicked = true;
              $('#message-box').append(`<p><span class='choice-text'>You have picked paper!</span></p>`);              
              updatePlayers();
            }
          break;
        case 'scissors':
          if(player2.choice.hasPicked == false) {
            player2.choice.scissors = true;
            player2.choice.hasPicked = true;
            $('#message-box').append(`<p><span class='choice-text'>You have picked scissors!</span></p>`);
            console.log("Picked scissors");
            updatePlayers();
          }
          break;
      }

    })

    function gameLogic(){
      if(gameOver){
          $("#newgame").empty();
          $("#newgame").append(`<button class="btn btn-danger new-game">New Game</button>`)
          if (currentPlayer == 'Player1') {
            $('#message-box').append(`<p class='status-msg'>[${new moment().format("HH:mm A")}] ${player1.name} has started a new game.</p>`);
          }
      }  
      if(player1.choice.hasPicked && player2.choice.hasPicked && gameOver == false){
          let player1_rock = player1.choice.rock;
          let player1_paper = player1.choice.paper;
          let player1_scissors = player1.choice.scissors;
          
          let player2_rock = player2.choice.rock;
          let player2_paper = player2.choice.paper;
          let player2_scissors = player2.choice.scissors;

          
          
          if((player1_rock && player2_rock) || (player1_paper && player2_paper) || (player1_rock && player2_rock) || (player1_scissors && player2_scissors)){
          player1.ties++;
          player2.ties++;
          $('#message-box').append("<p class='win-text'>Oh lawdy it's a tie!</p>")
          gameOver = true;
  
          }else if(player1_rock && player2_paper) {
            player1.losses++;
            player2.wins++;
          
            $('#message-box').append(`<p class="win-text">[${new moment().format("HH:mm A")}] ${player2.name} wins! Rock is suffocated by paper.</p>`);
            gameOver = true;
          }else if(player1_rock && player2_scissors) {
            player1.wins++;
            player2.losses++;
            $('#message-box').append(`<p class="win-text">[${new moment().format("HH:mm A")}] ${player1.name} wins! Scissors are bludgeoned by rock.</p>`);
            gameOver = true;
          }else if(player1_paper && player2_rock) {
            player1.wins++;
            player2.losses++;
            $('#message-box').append(`<p class="win-text">[${new moment().format("HH:mm A")}] ${player1.name} wins! Rock is bullied into submission by paper.</p>`);
            gameOver = true;
          }else if(player1_scissors && player2_rock) {
            player1.losses++;
            player2.wins++;
            $('#message-box').append(`<p class="win-text">[${new moment().format("HH:mm A")}] ${player2.name} wins! Scissors have a rock phobia.</p>`);
            gameOver = true;
          }else if(player1_scissors && player2_paper) {
            player1.wins++;
            player2.losses++;
            $('#message-box').append(`<p class="win-text">[${new moment().format("HH:mm A")}] ${player1.name} wins! Paper was literally invented to be cut by scissors.</p>`);
            gameOver = true;
          }else if(player1_paper && player2_scissors) {
            player1.losses++;
            player2.wins++;
            $('#message-box').append(`<p class="win-text">[${new moment().format("HH:mm A")}] ${player2.name} wins! Paper's mental constitution is nothing compared to scissors.</p>`);
            gameOver = true;
          }
          
          updatePlayers();
          } 
      
    }


    $(document).on("click", ".new-game", function (){
      startOver();
      updatePlayers();
      
    });
  
  
  
  function startOver() {
    player1.choice.rock = false;
      player1.choice.paper = false;
      player1.choice.scissors = false;
      player1.choice.hasPicked = false;
      player1.choiceStr = "";
  
      player2.choice.rock = false;
      player2.choice.paper = false;
      player2.choice.scissors = false;
      player2.choice.hasPicked = false;
      player2.choiceStr = "";
      gameOver=false;
      
  }

  function unloadP1() {
    player1 = {
      name: "Player 1",
      choice: {rock: false, paper: false, scissors: false, hasPicked: false},
      wins: 0,
      losses: 0,
      ties: 0,
      hasWon: false,
      connected: false,
  }
  
}

  function unloadP2() {
    player2 = {
      name: "Player 2",
      choice: {rock: false, paper: false, scissors: false, hasPicked: false},
      wins: 0,
      losses: 0,
      ties: 0,
      hasWon: false,
      connected: false,
  }
}

   //detecs window close
   $(window).on("unload", function(e) {
    if(currentPlayer == "Player1"){
      unloadP1();
      updatePlayers();
      
      $('#waiting-for').append('<h2>Waiting for another player to connect...</h2>');

      if (player1.connected == false && player2.connected == false) {
        $('#waiting-for').append('<h2>Waiting for another player to connect...</h2>');
        startNewGameSession();
      }else if(player1.connected == false && player2.connected) {
        let msg = `<p class="status-msg">[${new moment().format("HH:mm")}] ${player1.name} dissconnected.</p>`
      database.ref("messages").push({
          msg
      });
      }

       //send status msg
      
  }else if(currentPlayer == "Player2"){
    unloadP2();
    updatePlayers();
    
    $('#waiting-for').append('<h2>Waiting for another player to connect...</h2>');
    if (player1.connected == false && player2.connected == false) {
      startNewGameSession();
    }else if(player1.connected && player2.connected == false) {
      let msg = `<p class="status-msg">[${new moment().format("HH:mm")}] ${player2.name} dissconnected.</p>`
      database.ref("messages").push({
          msg
      });
    }
      //send status msg
      

  }
  
    
});

function startNewGameSession(){
    database.ref().set({
      clearObj
    });
    
}

$(document).on('click', ".send-message", function() {
  updateMessage();
});
     
function testRemove() {
  $('#player1-controls').hide();
}

      
});