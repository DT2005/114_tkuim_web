/**
 * 攝氏 ↔ 華氏 溫度轉換器
 */

function startConversion() {
    // 1. 讀入溫度值
    const inputTemp = prompt("輸入溫度 (例如: 25):");

    // 檢查使用者是否取消或輸入空值
    if (inputTemp === null || inputTemp.trim() === "") {
        const message = "使用者取消或未輸入溫度值。";
        alert(message);
        document.getElementById('resultOutput').textContent = message;
        return;
    }

    const tempValue = parseFloat(inputTemp);

    // 檢查輸入是否為有效數字
    if (isNaN(tempValue)) {
        const message = "無效輸入。";
        alert(message);
        document.getElementById('resultOutput').textContent = message;
        return;
    }

    // 2. 讀入單位
    let unit = prompt("輸入溫度單位 (C 或 F):").toUpperCase();

    // 檢查單位是否有效
    if (unit !== 'C' && unit !== 'F') {
        const message = "輸入無效。";
        alert(message);
        document.getElementById('resultOutput').textContent = message;
        return;
    }

    let convertedTemp;
    let originalUnit;
    let targetUnit;
    let resultMessage;

    // 3. 執行轉換
    if (unit === 'C') {
        // 攝氏轉華氏: F = C * 9 / 5 + 32
        convertedTemp = (tempValue * 9 / 5) + 32;
        originalUnit = 'C';
        targetUnit = 'F';
    } else { // unit === 'F'
        // 華氏轉攝氏: C = (F - 32) * 5 / 9
        convertedTemp = (tempValue - 32) * 5 / 9;
        originalUnit = 'F';
        targetUnit = 'C';
    }

    // 格式化結果，保留小數點後兩位
    const roundedConvertedTemp = convertedTemp.toFixed(2);

    // 4. 準備結果訊息
    resultMessage = `${tempValue}°${originalUnit} 轉換結果為：\n${roundedConvertedTemp}°${targetUnit}`;

    // 5. 結果以 alert() 顯示
    alert(resultMessage);

    // 6. 結果以頁面 <pre> 顯示
    document.getElementById('resultOutput').textContent = resultMessage;
}