let targetNumber; // 電腦要猜的數字
let guessCount = 0; // 猜測次數
let outputElement; // <pre> 元素的參考
let logMessage = ""; // 用於累積顯示在 <pre> 裡的訊息

/**
 * 初始化遊戲並開始猜測迴圈。
 */
function startGame() {
    // 產生 1 到 100 之間的隨機整數
    targetNumber = Math.floor(Math.random() * 100) + 1;
    guessCount = 0;
    
    // 獲取顯示結果的 <pre> 元素
    outputElement = document.getElementById('gameOutput');
    
    logMessage = "遊戲開始！\n我已經在 1 到 100 之間選擇了一個數字。\n";
    outputElement.textContent = logMessage;
    
    // 開始遊戲迴圈
    gameLoop();
}

function gameLoop() {
    let guessInput;
    let userGuess;
    let isValidInput = false;

    // 使用一個 while(true) 來確保直到使用者輸入有效值或取消才會繼續
    while (!isValidInput) {
        // 2. 使用 prompt() 讀取使用者猜測
        guessInput = prompt("請輸入您的猜測數字 (1-100)");

        // 檢查使用者是否按了取消 (null) 或輸入了空值
        if (guessInput === null) {
            alert("遊戲已取消。");
            logMessage += "\n- - - - -\n遊戲已取消。";
            outputElement.textContent = logMessage;
            return; // 終止遊戲
        }

        userGuess = parseInt(guessInput.trim());

        // 檢查是否為有效數字，且在 1 到 100 之間
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            alert("輸入無效！請輸入 1 到 100 之間的一個數字。");
            logMessage += `[錯誤輸入] ${guessInput} - 無效。\n`;
            outputElement.textContent = logMessage;
            // 繼續迴圈，要求重新輸入
        } else {
            isValidInput = true; // 輸入有效，跳出 while 迴圈
        }
    }
    
    // 統計猜測次數
    guessCount++;
    logMessage += `\n[第 ${guessCount} 次] 您猜測的數字是: ${userGuess}\n`;

    // 3. 判斷猜測結果
    if (userGuess === targetNumber) {
        // 猜中
        const successMessage = `恭喜！您猜對了！\n這個數字就是 ${targetNumber}。\n您總共猜了 ${guessCount} 次。`;
        
        // 結果以 alert() 顯示
        alert(successMessage);
        
        // 結果以頁面 <pre> 顯示
        logMessage += "\n- - - - -\n" + successMessage + "\n- - - - -";
        outputElement.textContent = logMessage;

    } else if (userGuess < targetNumber) {
        // 再大一點
        const hintMessage = "提示：再大一點！";
        
        // 結果以 alert() 顯示
        alert(hintMessage);
        
        // 結果以頁面 <pre> 顯示
        logMessage += hintMessage;
        outputElement.textContent = logMessage;
        
        // 繼續下一次猜測
        gameLoop(); // 遞迴調用，繼續遊戲

    } else { // userGuess > targetNumber
        // 再小一點
        const hintMessage = "提示：再小一點！";

        // 結果以 alert() 顯示
        alert(hintMessage);
        
        // 結果以頁面 <pre> 顯示
        logMessage += hintMessage;
        outputElement.textContent = logMessage;
        
        // 繼續下一次猜測
        gameLoop(); // 遞迴調用，繼續遊戲
    }
}