document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素獲取 ---
    const gameSection = document.getElementById('game-section');
    const resultSection = document.getElementById('result-section');
    const feedbackFormSection = document.getElementById('feedback-form-section'); 
    
    const gameBoard = document.getElementById('game-board'); 
    
    const startButton = document.getElementById('start-button');
    const scoreDisplay = document.getElementById('score');
    const timeLeftDisplay = document.getElementById('time-left');
    const timerWarning = document.getElementById('timer-warning'); 
    
    const finalScoreDisplay = document.getElementById('final-score-display');
    const openFeedbackButton = document.getElementById('open-feedback-button'); 
    const feedbackForm = document.getElementById('feedback-form');
    const formMessage = document.getElementById('form-message');

    // --- 遊戲變數 ---
    let score = 0;
    const GAME_DURATION = 30; 
    let timeLeft = GAME_DURATION; 
    let lastHole;
    let timeUp = false;
    let gameInterval;
    let moleTimer;
    const HOLE_COUNT = 9; 
    const WARNING_TIME = 5; 

    // --- 遊戲初始化與介面設置 ---
    function setupGame() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < HOLE_COUNT; i++) {
            const holeContainer = document.createElement('div');
            holeContainer.classList.add('col-4', 'col-md-4', 'hole-container');
            
            const hole = document.createElement('div');
            hole.classList.add('hole');
            hole.setAttribute('data-id', i);
            
            const mole = document.createElement('div');
            mole.classList.add('mole');
            
            hole.appendChild(mole);
            holeContainer.appendChild(hole);
            gameBoard.appendChild(holeContainer);

            hole.addEventListener('click', whack);
        }
    }

    // --- 遊戲邏輯函數 ---
    function pickRandomHole() {
        const holes = document.querySelectorAll('.hole');
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        
        if (hole === lastHole) {
            return pickRandomHole();
        }
        lastHole = hole;
        return hole;
    }

    function popUp() {
        const hole = pickRandomHole();
        hole.classList.add('up'); 

        const duration = Math.random() * 500 + 1000; 
        
        setTimeout(() => {
            hole.classList.remove('up');
            if (!timeUp) {
                moleTimer = setTimeout(popUp, Math.random() * 700 + 500);
            }
        }, duration);
    }

    function whack(e) {
        const holeElement = e.currentTarget;
        
        if (holeElement.classList.contains('up') && !timeUp) {
            score++;
            scoreDisplay.textContent = score;
            
            holeElement.classList.add('hit');
            
            holeElement.classList.remove('up'); 
            
            setTimeout(() => {
                holeElement.classList.remove('hit');
            }, 200); 

            clearTimeout(moleTimer);
            moleTimer = setTimeout(popUp, 100); 
        }
    }

    function endGame() {
        timeUp = true;
        clearInterval(gameInterval);
        clearTimeout(moleTimer);
        

        gameSection.classList.add('d-none');
        resultSection.classList.remove('d-none');
        feedbackFormSection.classList.add('d-none'); 

        finalScoreDisplay.textContent = score;
        
        document.querySelectorAll('.hole').forEach(hole => {
            hole.classList.remove('up', 'hit');
        });
    }

    // --- 計時器與開始按鈕 ---
    startButton.addEventListener('click', () => {
        if (timeUp || startButton.disabled) return;
        
        score = 0;
        timeLeft = GAME_DURATION;
        timeUp = false;
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;
        timerWarning.classList.add('d-none');
        timerWarning.classList.remove('warning-active');

        startButton.disabled = true;
        startButton.textContent = '遊戲中...';
        
        resultSection.classList.add('d-none');
        feedbackFormSection.classList.add('d-none');
        gameSection.classList.remove('d-none');

        // 開始計時
        gameInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            
            if (timeLeft <= WARNING_TIME && timeLeft > 0) {
                timerWarning.textContent = `剩餘 ${timeLeft} 秒！`;
                timerWarning.classList.remove('d-none');
                timerWarning.classList.add('warning-active');
            } else if (timeLeft > WARNING_TIME) {
                 timerWarning.classList.add('d-none');
                 timerWarning.classList.remove('warning-active');
            }
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        popUp(); 
    });



    // 顯示表單
    openFeedbackButton.addEventListener('click', () => {
        resultSection.classList.add('d-none');
        feedbackFormSection.classList.remove('d-none');
        feedbackForm.reset();
        feedbackForm.classList.remove('was-validated');
        formMessage.textContent = '';
        feedbackForm.querySelector('button[type="submit"]').disabled = false; // 重新啟用提交按鈕
    });

    // --- 表單處理與驗證 ---
    
    function validateEmailFormat(email) {
        // 接受 @gmail.com 或 @o365.tku.edu.tw
        const pattern = /^(.*)@(gmail\.com|o365\.tku\.edu\.tw)$/i; 
        return pattern.test(email);
    }

    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        this.classList.add('was-validated');

        const emailInput = document.getElementById('username');
        
        if (!validateEmailFormat(emailInput.value)) {
            emailInput.setCustomValidity("Invalid format"); 
            emailInput.reportValidity(); 
            formMessage.textContent = '帳號格式不正確，請重新檢查。';
            formMessage.className = 'mt-3 text-center text-danger';
            return;
        } else {
             emailInput.setCustomValidity(""); 
        }
        
        if (this.checkValidity()) {
            // 獲取數據 (要求 3: 確保 checked 的 radio value 被讀取)
            const satisfaction = document.querySelector('input[name="satisfaction"]:checked').value;
            const suggestion = document.getElementById('suggestion').value;
            const username = emailInput.value;
            
            console.log("--- 表單提交數據 ---");
            console.log(`最終得分: ${score}`);
            console.log(`滿意度: ${satisfaction}`);
            console.log(`建議: ${suggestion}`);
            console.log(`帳號: ${username}`);
            console.log("--------------------");
            
            // 顯示成功訊息 (要求 5)
            formMessage.textContent = `✅ 感謝您的回饋！您的分數 ${score} 分已記錄。`;
            formMessage.className = 'mt-3 text-center text-success';
            
            // 禁用表單按鈕
            feedbackForm.querySelector('button[type="submit"]').disabled = true;

            // 提示用戶：可以點擊瀏覽器後退或重載頁面重新開始
            setTimeout(() => {
                 formMessage.innerHTML += "<p class='mt-2'>請點擊瀏覽器返回按鈕或重新整理頁面以開始新遊戲。</p>";
            }, 1500);
        }
    });


    // --- 初始化 ---
    setupGame();
    // 確保遊戲區塊預設可見，結果區和表單區預設隱藏
    gameSection.classList.remove('d-none');
    resultSection.classList.add('d-none'); 
    feedbackFormSection.classList.add('d-none');
});