window.onload = function () {
    var wordToDiscover = ""; // Variable global para la palabra a descubrir
    var lettersCounterPerRow = 0; // Variable global para el contador de letras
    var insertedWord = ""; // Variable global para la palabra insertada
    var attempt = 0; // Variable global para el intento
    const alphabet = 'qwertyuiopasdfghjklñzxcvbnm';
    var url = "";
    let instructionsShown = false;


    function generateLettersSquares(){
        // Definimos debajo de qué elemento vamos a generar la tabla (letterSquaresContainer)
        letterSquaresContainer = document.getElementById('wordsSquares');

        const table = document.createElement('table');
        table.className = 'table__words'; // Asignamos la clase 'table-words' a la tabla para darle estilo en css
        table.id = 'table__words';
        const numRows = 6;
        const numColumns = 5;

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');
            row.id = 'wordIn__' + i;
            for (let j = 0; j < numColumns; j++) {
                const cell = document.createElement('td');
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        // Añadimos la tabla al elemento padre
        letterSquaresContainer.appendChild(table);
    }
    generateLettersSquares();

    function generateKeyboard(){
        // Definimos debajo de qué elemento vamos a generar la tabla (parentElement)
        parentElement = document.getElementById('keyboardSquares');
        const table = document.createElement('table');
        table.className = 'table__keyboard';
        table.id = 'table__keyboard';
        const numRows = 3;
        const numColumns = 10;
        let lettersCounter = 0;
        let alphabetKeyboard = 'QWERTYUIOPASDFGHJKLÑ ZXCVBNM';  // Declaro dos alphabet porque uno tiene el espacio y otro no
        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');
            row.classList.add('lettersKeyboard');
            for (let j = 0; j < numColumns; j++) {
                const cell = document.createElement('td');
                if(i == 2 && j == 9) cell.innerHTML = `<button type="button" style="background-color: rgba(43, 43, 43, 0.542)" id="deleteLetter"><</button>`;
                else if (i == 2 && j == 0) {
                    cell.innerHTML = `<button type="button" style="background-color: rgba(43, 43, 43, 0.542); width:100px;" id="sendWord">ENVIAR</button>`;
                    j++;
                }
                else {
                    const letter = alphabetKeyboard.charAt(lettersCounter);
                    cell.innerHTML = `<button type="button" id="${letter.toLowerCase()}">${letter}</button>`;
                }
                row.appendChild(cell);
                lettersCounter++;
            }
            table.appendChild(row);
        }

        // Añadir la tabla al elemento padre
        parentElement.appendChild(table);
        gameInnit();
    }
    generateKeyboard();


    function gameInnit(){
        url = 'https://clientes.api.greenborn.com.ar/public-random-word?c=9&l=5';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                wordToDiscover = data[Math.floor(Math.random() * data.length)];
                console.log("Palabra a descubrir: " + wordToDiscover);
            })
            .catch(error => {
                console.error('Error al obtener palabras:', error);
            });    

        // Esto asigna las funciones a los eventos
        for (var i = 0; i < alphabet.length; i++) {
            document.getElementById(alphabet[i]).addEventListener('click', letterClickedHandler);
            document.addEventListener('keyup', keyDownHandler);
        }

        // Asigna el handler al botón enviar
        document.getElementById("sendWord").addEventListener('click', sendWordHandler);
        // Asigna el handler al botón instrucciones
        document.getElementById("buttonInstructions").addEventListener('click', function(){
            if (!instructionsShown) {
                instructionsPopUp();
            }
        });
        // Agregamos el evento al botón eliminar
        document.getElementById("deleteLetter").addEventListener('click', deleteLastLetter);
        // Agregamos el evento al botón reiniciar valores
        document.getElementById("buttonResetGame").addEventListener('click', function(){
            cleanTable();
            gameInnit();
        });
    }


    function deleteLastLetter(){
        if (insertedWord.length > 0) {
            insertedWord = insertedWord.slice(0, -1);
            insertWordInTable(insertedWord, attempt);
            lettersCounterPerRow--; 
        }
    }

    function keyDownHandler(event){
        const key = event.key.toLowerCase();
        if (alphabet.includes(key) && lettersCounterPerRow < 5) { // el .includes(key) nos asegura que solo se escuchan las teclas del abecedario
            lettersCounterPerRow++;
            insertedWord += key;
            insertWordInTable(insertedWord, attempt);
        } else if (key === "backspace") {
            event.preventDefault(); // Esto limita el uso del delete para que solo sirva para borrar una letra
            deleteLastLetter();
        } else if (key === "enter") {
            event.preventDefault(); // Esto limita el uso del enter para que solo sirva para enviar la palabra
            sendWordHandler(); // llamamos al handler del botón enviar
        }
    }

    function sendWordHandler(){
        if (lettersCounterPerRow > 4){
            processInput(wordToDiscover, insertedWord, attempt);
            lettersCounterPerRow = 0;
            attempt++;
            insertedWord = "";
        }
    }

    function letterClickedHandler(){
        if (lettersCounterPerRow < 5){
            lettersCounterPerRow++;
            insertedWord += this.id;
            insertWordInTable(insertedWord, attempt);
        } else sendWordHandler(); // llamamos al handler del botón enviar
    }

    
    function cleanTable(){
        // Restablece las variables
        lettersCounterPerRow = 0;
        insertedWord = "";
        attempt = 0;
        instructionsShown = False;

        // Dejamos tanto la tabla como el teclado con el fondo blanco
        for (let k = 0; k < 6; k++) {
            for (let o = 0; o < 5; o++) {
                var attemptRow = document.getElementById("wordIn__" + k);
                attemptRow.cells[o].style.backgroundColor = "white";
                attemptRow.cells[o].innerHTML = ""; // Limpia el contenido de la celda
            }
        }
        // Limpiar el teclado
        for (let k = 0; k < alphabet.length; k++) {
            document.getElementById(alphabet.charAt(k)).style.backgroundColor = "white";
        }
    }

    function processInput(wordToDiscover, insertedWord, attempt){
        let arrayWordToDiscover = wordToDiscover.toLowerCase().split("");
        let arrayinsertedWord = insertedWord.toLowerCase().split("");
        let correctLettersIn = ["_", "_", "_", "_", "_"];
        let correctLettersCounter = 0;
        for (let k = 0; k < 5; k++){
            if (arrayinsertedWord[k] == arrayWordToDiscover[k]){
                // Aqui buscamos la fila en la que hemos introducido la palabra
                var attemptRow = document.getElementById("wordIn__" + attempt);
                // mediante "cells" de js accedemos al td que nos interesa y le cambiamos el color
                attemptRow.cells[k].style.backgroundColor = "green";
                // ahora le cambiamos el color a la tecla del teclado
                document.getElementById(arrayinsertedWord[k]).style.backgroundColor = "green";
                // Añadimos la letra al array de letras correctas para evitar duplicidades
                correctLettersIn[k] = arrayWordToDiscover[k];
                correctLettersCounter++;
            } else {
                let missplacedLettersCounter = 0;
                for (let m = 0; m < 5; m++){
                    if (arrayinsertedWord[k] == arrayWordToDiscover[m] && arrayinsertedWord[m] != correctLettersIn[m]){
                        // Aqui buscamos la fila en la que hemos introducido la palabra
                        var attemptRow = document.getElementById("wordIn__" + attempt);
                        // mediante "cells" de js accedemos al td que nos interesa y le cambiamos el color
                        attemptRow.cells[k].style.backgroundColor = "orange";
                        // ahora le cambiamos el color a la tecla del teclado
                        document.getElementById(arrayinsertedWord[k]).style.backgroundColor = "orange";
                        missplacedLettersCounter++; 
                    }
                }
                if (missplacedLettersCounter === 0) {
                    // Letra incorrecta
                    document.getElementById(arrayinsertedWord[k]).style.backgroundColor = "gray";
                }
            }
        } 
        if (correctLettersCounter == 5) gamePassedPopUp();
        if (correctLettersCounter < 5 && attempt == 5) gameOverPopUp();
    }

    function insertWordInTable(wordToDiscover, rowNumber){
        // Cogemos la referencia de la tabla
        var row = document.getElementById('wordIn__' + rowNumber);
        var columns = row.getElementsByTagName("td");
        // Itera sobre las celdas y asigna las letras de la palabra
        for (var i = 0; i < 5; i++) columns[i].innerHTML = wordToDiscover.charAt(i).toUpperCase();
    }
      
    function gamePassedPopUp() {
        setTimeout(function() {
            Swal.fire({
                title: '¡Has ganado!',
                text: '¿Quieres jugar otra partida?',
                icon: 'success',
                confirmButtonText: 'Jugar otra partida'
            }).then((result) => {
                if (result.isConfirmed) {
                    cleanTable();
                    gameInnit();
                }
            });
        }, 500); // 500 milisegundos (0,5 segundos)
    }
       
    function gameOverPopUp() {
        setTimeout(function() {
            Swal.fire({
                title: 'Has perdido amigo mío',
                text: '¿Quieres jugar otra partida?' ,
                icon: 'error', 
                confirmButtonText: 'Jugar otra partida'
            }).then((result) => {
                if (result.isConfirmed) {
                    cleanTable();
                    gameInnit();
                }
            });
        }, 500);
    }

    function instructionsPopUp(){
        Swal.fire({
            title: 'Instrucciones wordle',
            text: `Escribir una palabra y ver las letras que has acertado.
            Si la letra aparece en naranja es porque está en la palabra, pero ubicada en otra posición. 
            Si la letra aparece en verde es porque está en la palabra y en esa exacta posición.
            Si no tiene color es porque no está en la palabra.`
        }).then((result) => {
            if (result.isConfirmed) {
                instructionsShown = true;
            }
        })
    }  
}