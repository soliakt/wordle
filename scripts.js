window.onload = function () {
    const lettersInAlphabet = 27;


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
        let alphabet = 'QWERTYUIOPASDFGHJKLÑ ZXCVBNM';
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
                    const letter = alphabet.charAt(lettersCounter);
                    cell.innerHTML = `<button type="button" id="${letter.toLowerCase()}">${letter}</button>`;
                }
                row.appendChild(cell);
                lettersCounter++;
            }
            table.appendChild(row);
        }

        // Añadir la tabla al elemento padre
        parentElement.appendChild(table);
    }
    generateKeyboard();
    function resetValues(){
        var wordsToDiscover = ["marea", "arena", "diana"];
        wordToDiscover = wordsToDiscover[Math.floor(Math.random() * wordsToDiscover.length)].toUpperCase();
        alert("SPOILER ALERT. La palabra a descubrir es: " + wordToDiscover)
        // Declaro dos alphabet porque uno tiene el espacio y otro no
        let alphabet = 'qwertyuiopasdfghjklñzxcvbnm';
        let lettersCounterForRow = 0;
        let insertedWord = "";
        let wordsInCounter = 0;
        let attempt = 0;

        function letterClickedHandler(){
            if (lettersCounterForRow < 5){
                lettersCounterForRow++;
                insertedWord += this.id;
                insertWordInTable(insertedWord, attempt);
            } else sendWordHandler(); // llamamos al handler del botón enviar
        }

        function sendWordHandler(){
            if (lettersCounterForRow > 4){
                processInput(wordToDiscover, insertedWord, attempt);
                lettersCounterForRow = 0;
                attempt++;
                insertedWord = "";
            }
        }
        // Asigna el handler al botón enviar
        document.getElementById("sendWord").addEventListener('click', sendWordHandler);


        function keyDownHandler(event){
            const key = event.key.toLowerCase();
            if (alphabet.includes(key) && lettersCounterForRow < 5) {
                lettersCounterForRow++;
                insertedWord += key;
                insertWordInTable(insertedWord, attempt);
            } else if (alphabet.includes(key) && lettersCounterForRow < 6){
                sendWordHandler(); // llamamos al handler del botón enviar
            }
        }
        // Esto asigna las funciones a los eventos
        for (var i = 0; i < alphabet.length; i++) {
            document.getElementById(alphabet[i]).addEventListener('click', letterClickedHandler);
            window.addEventListener('keydown', keyDownHandler);
        }
    }

    resetValues();

    function processInput(wordToDiscover, insertedWord, attempt){
        let arrayWordToDiscover = wordToDiscover.toLowerCase().split("");
        let arrayinsertedWord = insertedWord.toLowerCase().split("");
        let correctLettersIn = ["_", "_", "_", "_", "_"];
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
            } else {
                for (let m = 0; m < 5; m++){
                    if (arrayinsertedWord[k] == arrayWordToDiscover[m] && arrayinsertedWord[m] != correctLettersIn[m]){
                       // Aqui buscamos la fila en la que hemos introducido la palabra
                        var attemptRow = document.getElementById("wordIn__" + attempt);
                        // mediante "cells" de js accedemos al td que nos interesa y le cambiamos el color
                        attemptRow.cells[k].style.backgroundColor = "orange";
                        // ahora le cambiamos el color a la tecla del teclado
                        document.getElementById(arrayinsertedWord[k]).style.backgroundColor = "orange"; 
                    }
                }
            }
        }
    }


    function insertWordInTable(wordToDiscover, rowNumber){
        // Cogemos la referencia de la tabla
        var row = document.getElementById('wordIn__' + rowNumber);
        var columns = row.getElementsByTagName("td");
        // Itera sobre las celdas y asigna las letras de la palabra
        for (var i = 0; i < 5; i++) columns[i].innerHTML = wordToDiscover.charAt(i).toUpperCase();
    }
}