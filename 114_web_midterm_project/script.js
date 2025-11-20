document.addEventListener('DOMContentLoaded', () => {
    //DOM 元素
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
    const jsConfetti = new JSConfetti();
    //遊戲變數
    let score = 0;
    const GAME_DURATION = 30; // 遊戲時間 30 秒
    let timeLeft = GAME_DURATION;
    let lastHole;               // 防止地鼠連續出現在同一洞
    let timeUp = false;
    let gameInterval;           // 計時器
    let moleTimer;              // 地鼠出現定時器
    const HOLE_COUNT = 9;       // 地鼠洞數量
    const WARNING_TIME = 5;     // 倒數提示時間
    const HIT_DURATION = 400;   // 擊中特效和圖片顯示持續時間 (ms)

    //遊戲初始化
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

            // 監聽打擊事件
            hole.addEventListener('click', whack);
        }
    }
    //遊戲邏輯函數

    // 隨機挑選一個洞
    function pickRandomHole() {
        const holes = document.querySelectorAll('.hole');
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];

        // 防止連續出現在同一洞
        if (hole === lastHole) {
            return pickRandomHole();
        }

        lastHole = hole;
        return hole;
    }

    // 地鼠彈出函數
    function popUp() {
        const hole = pickRandomHole();
        hole.classList.add('up');

        // 動畫速度：1000 ~ 1500ms
        const duration = Math.random() * 500 + 1000;

        setTimeout(() => {
            // 確保地鼠沒有被打中 (因為被打中的話 'up' 已經被移除)
            if (hole.classList.contains('up')) {
                hole.classList.remove('up');
            }

            // 隨機延遲 500 ~ 1200ms 再跳下一隻
            if (!timeUp) {
                moleTimer = setTimeout(popUp, Math.random() * 700 + 500);
            }
        }, duration);
    }

    // 打擊地鼠 (whack)
    function whack(e) {
        const holeElement = e.currentTarget;
        const moleElement = holeElement.querySelector('.mole'); // 獲取地鼠元素

        // 檢查是否擊中且遊戲未結束
        if (holeElement.classList.contains('up') && !timeUp) {
        
            score++;
            scoreDisplay.textContent = score;

            // 替換圖片：加入 'mole-dizzy' 類別
            moleElement.classList.add('mole-dizzy'); 

            holeElement.classList.add('hit');
            holeElement.classList.remove('up');

            // 使用 HIT_DURATION 決定特效和圖片顯示多久
            setTimeout(() => {
                holeElement.classList.remove('hit');
                // 清理：移除 'mole-dizzy' 類別，換回正常圖片
                moleElement.classList.remove('mole-dizzy'); 
            }, HIT_DURATION);

            // 立即生成下一隻地鼠 (微調延遲時間確保特效能播放完)
            clearTimeout(moleTimer);
            moleTimer = setTimeout(popUp, HIT_DURATION + 100); 
        }
    }

 // 遊戲結束
    function endGame() {
        timeUp = true;
        clearInterval(gameInterval);
        clearTimeout(moleTimer);

        gameSection.classList.add('d-none');
        resultSection.classList.remove('d-none');
        feedbackFormSection.classList.add('d-none');

        finalScoreDisplay.textContent = score;

        // 核心修改 1: 觸發 CSS 分數慶祝動畫
        finalScoreDisplay.classList.remove('score-highlight');
        setTimeout(() => {
            finalScoreDisplay.classList.add('score-highlight');
        }, 50);

        // 在 endGame 函數中替換原有的 addConfetti 呼叫：

    // 第一次噴發 (較少數量，但快速)
    jsConfetti.addConfetti({
    emojis: ['🎉'],
    confettiNumber: 20, // 第一次 50 個
    });

    // 第二次噴發 (延遲 300 毫秒後，再噴一部分)
    setTimeout(() => {
    jsConfetti.addConfetti({
        emojis: ['💖'],
        confettiNumber: 10, // 第二次 10個
    });
    }, 500); // 延遲 0.5 秒

        // 清除地鼠狀態
        document.querySelectorAll('.hole').forEach(hole => {
            hole.classList.remove('up', 'hit');
            hole.querySelector('.mole').classList.remove('mole-dizzy');
        });

        // 小動畫：拍手效果 (animate-clap)
        resultSection.classList.add('animate-clap');
        setTimeout(() => {
            resultSection.classList.remove('animate-clap');
            startButton.disabled = false;
            startButton.textContent = '重新開始';
        }, 1500);
    }
    //開始按鈕與計時器
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

        // 遊戲計時器
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

        // 開始彈出地鼠
        popUp();
    });

    //顯示表單
    openFeedbackButton.addEventListener('click', () => {
        resultSection.classList.add('d-none');
        feedbackFormSection.classList.remove('d-none');

        feedbackForm.reset();
        feedbackForm.classList.remove('was-validated');
        formMessage.textContent = '';

        feedbackForm.querySelector('button[type="submit"]').disabled = false;
    });

    //表單驗證
    function validateEmailFormat(email) {
        // 只接受 @gmail.com 或 @o365.tku.edu.tw
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
            const satisfaction = document.querySelector('input[name="satisfaction"]:checked').value;
            const suggestion = document.getElementById('suggestion').value;
            const username = emailInput.value;

            console.log("--- 表單提交數據 ---");
            console.log(`最終得分: ${score}`);
            console.log(`滿意度: ${satisfaction}`);
            console.log(`建議: ${suggestion}`);
            console.log(`帳號: ${username}`);
            console.log("--------------------");

            // 成功訊息
            formMessage.textContent = `感謝您的回饋！您的分數 ${score} 分已記錄。`;
            formMessage.className = 'mt-3 text-center text-success';

            // 禁用提交按鈕
            feedbackForm.querySelector('button[type="submit"]').disabled = true;

            setTimeout(() => {
                formMessage.innerHTML += "<p class='mt-2'>請點擊瀏覽器返回或重新整理頁面以開始新遊戲。</p>";
            }, 1500);
        }
    });

    //初始化
    setupGame();
    // 預設介面狀態
    gameSection.classList.remove('d-none');
    resultSection.classList.add('d-none');
    feedbackFormSection.classList.add('d-none');
});