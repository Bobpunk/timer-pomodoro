document.addEventListener('DOMContentLoaded', () => {

    const minutosSpan = document.getElementById('minutos');
    const segundosSpan = document.getElementById('segundos');
    const btnPomodoro = document.getElementById('btn-pomodoro');
    const btnPausaCurta = document.getElementById('btn-pausa-curta');
    const btnPausaLonga = document.getElementById('btn-pausa-longa');
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnPausar = document.getElementById('btn-pausar');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const ciclosSpan = document.getElementById('ciclos');
    const modoBotoes = document.querySelectorAll('.modo-btn');

    let modoAtual = 'pomodoro';
    let ciclosCompletos = 0;
    let intervalId = null;
    
    const duracoes = {
        pomodoro: 30 * 60,
        pausaCurta: 5 * 60,
        pausaLonga: 30 * 60
    };
    
    let tempoRestante = duracoes.pomodoro;

    function tocarAlarme() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 3);
    }

    function atualizarMostrador() {
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;

        minutosSpan.textContent = String(minutos).padStart(2, '0');
        segundosSpan.textContent = String(segundos).padStart(2, '0');
    }

    function contagemRegressiva() {
        if (tempoRestante > 0) {
            tempoRestante--;
            atualizarMostrador();
        } else {
            clearInterval(intervalId);
            intervalId = null;
            tocarAlarme();

            if (modoAtual === 'pomodoro') {
                ciclosCompletos++;
                ciclosSpan.textContent = ciclosCompletos;
            }
            sugerirProximoModo();
        }
    }
    
    function sugerirProximoModo() {
        if (modoAtual === 'pomodoro') {
            if (ciclosCompletos > 0 && ciclosCompletos % 4 === 0) {
                mudarModo('pausaLonga');
            } else {
                mudarModo('pausaCurta');
            }
        } else {
            mudarModo('pomodoro');
        }
    }

    function iniciarTimer() {
        if (intervalId === null) {
            intervalId = setInterval(contagemRegressiva, 1000);
            btnIniciar.style.display = 'none';
            btnPausar.style.display = 'inline-block';
        }
    }

    function pausarTimer() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
            btnIniciar.style.display = 'inline-block';
            btnPausar.style.display = 'none';
        }
    }
    
    function reiniciarTimer() {
        pausarTimer();
        tempoRestante = duracoes[modoAtual];
        atualizarMostrador();
    }

    function mudarModo(novoModo) {
        modoAtual = novoModo;
        modoBotoes.forEach(btn => btn.classList.remove('ativo'));

        if (novoModo === 'pausaCurta') {
            btnPausaCurta.classList.add('ativo');
        } else if (novoModo === 'pausaLonga') {
            btnPausaLonga.classList.add('ativo');
        } else {
             btnPomodoro.classList.add('ativo');
        }

        reiniciarTimer();
    }

    btnIniciar.addEventListener('click', iniciarTimer);
    btnPausar.addEventListener('click', pausarTimer);
    btnReiniciar.addEventListener('click', reiniciarTimer);

    btnPomodoro.addEventListener('click', () => mudarModo('pomodoro'));
    btnPausaCurta.addEventListener('click', () => mudarModo('pausaCurta'));
    btnPausaLonga.addEventListener('click', () => mudarModo('pausaLonga'));

    const infoContainer = document.querySelector('.info-container');
    const btnInfo = document.getElementById('btn-info');
    const infoPanel = document.getElementById('info-panel');

    btnInfo.addEventListener('click', (event) => {
        event.stopPropagation();
        infoPanel.classList.add('ativo');
    });

    infoContainer.addEventListener('mouseleave', () => {
        infoPanel.classList.remove('ativo');
    });
    
    atualizarMostrador();
});