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
        // Esto recorre todos los id y en caso de que algun evento se haya producido llama a la funcion letterClicked
        for (var i = 0; i < lettersInAlphabet; i++) {
            document.getElementById(alphabet[i]).addEventListener('click', function() {
                lettersCounterForRow++;
                console.log(lettersCounterForRow);
                insertedWord += this.id;
                console.log(insertedWord);
                if (lettersCounterForRow > 4) {
                    // Una vez se han introducido las 5 letras
                    //lettersCounterForRow = 0;
                    //insertedWord = "";
                    document.getElementById("sendWord").addEventListener('click', function(){
                        processInput(wordToDiscover, insertedWord, wordsInCounter, alphabet, attempt);
                    })
                }
                insertWordInTable(insertedWord, 0);
            });
        }

    }
    resetValues();

    function processInput(wordToDiscover, insertedWord, wordsInCounter, alphabet, attempt){
        // 2 partes: colorea tabla y colorea teclado
        // Palabra a descubrir: remar
        // Palabra introducida: marea
        let arrayWordToDiscover = wordToDiscover.toLowerCase().split("");
        let arrayinsertedWord = insertedWord.toLowerCase().split("");
        for (let k = 0; k < 5; k++){
            if (arrayinsertedWord[k] == arrayWordToDiscover[k]){
                // Aqui buscamos la fila en la que hemos introducido la palabra
                var attemptRow = document.getElementById("wordIn__" + attempt);
                // mediante "cells" de js accedemos al td que nos interesa y le cambiamos el color
                attemptRow.cells[k].style.backgroundColor = "green";
                // ahora le cambiamos el color a la tecla del teclado
                document.getElementById(arrayinsertedWord[k]).style.backgroundColor = "green";
            }
        }
        
    }


    function letterClicked(id, wordToDiscover){
        alert("La letra clicada es " + id + ". Y la palabra buscada es: " + wordToDiscover);
    }


    function insertWordInTable(wordToDiscover, rowNumber){
        // Cogemos la referencia de la tabla
        var row = document.getElementById('wordIn__' + rowNumber);
        var columns = row.getElementsByTagName("td");
        // Itera sobre las celdas y asigna las letras de la palabra
        for (var i = 0; i < 5; i++) columns[i].innerHTML = wordToDiscover.charAt(i);
    }
    insertWordInTable('MAREA', 1);
}