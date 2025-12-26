      // Banco de perguntas com mistura de palavras e frases
      const questions = {
        easy: [
          { word: "Hello", options: ["Olá", "Tchau", "Por favor", "Obrigado"], correct: 0 },
          { word: "Good morning", options: ["Boa tarde", "Boa noite", "Bom dia", "Adeus"], correct: 2 },
          { word: "Water", options: ["Fogo", "Água", "Ar", "Terra"], correct: 1 },
          { word: "Thank you", options: ["Por favor", "Obrigado", "Desculpe", "De nada"], correct: 1 },
          { word: "House", options: ["Carro", "Rua", "Casa", "Apartamento"], correct: 2 },
          { word: "I am happy", options: ["Eu estou triste", "Eu estou feliz", "Eu estou cansado", "Eu estou com fome"], correct: 1 },
          { word: "Dog", options: ["Gato", "Pássaro", "Cão", "Peixe"], correct: 2 },
          { word: "See you later", options: ["Até logo", "Bom dia", "Boa noite", "Olá"], correct: 0 },
          { word: "Blue", options: ["Verde", "Vermelho", "Amarelo", "Azul"], correct: 3 },
          { word: "Family", options: ["Amigos", "Família", "Trabalho", "Escola"], correct: 1 },
        ],
        medium: [
          { word: "Ambiguous", options: ["Claro", "Confuso", "Ambíguo", "Preciso"], correct: 2 },
          { word: "Make an effort", options: ["Desistir", "Fazer um esforço", "Relaxar", "Ignorar"], correct: 1 },
          { word: "Reliable", options: ["Inseguro", "Confiável", "Perigoso", "Frágil"], correct: 1 },
          { word: "Face a challenge", options: ["Enfrentar um desafio", "Evitar problema", "Ignorar dificuldade", "Fugir do risco"], correct: 0 },
          { word: "Improve", options: ["Piorar", "Estagnar", "Melhorar", "Manter"], correct: 2 },
          { word: "Ancient history", options: ["História moderna", "História antiga", "Futuro", "Presente"], correct: 1 },
          { word: "Be curious about", options: ["Ser indiferente", "Ter curiosidade sobre", "Ignorar", "Evitar"], correct: 1 },
          { word: "Achieve a goal", options: ["Falhar", "Alcançar um objetivo", "Abandonar", "Adiar"], correct: 1 },
          { word: "Brave decision", options: ["Decisão covarde", "Decisão corajosa", "Decisão errada", "Decisão rápida"], correct: 1 },
          { word: "Daily routine", options: ["Rotina diária", "Viagem", "Festa", "Aventura"], correct: 0 },
        ],
        hard: [
          { word: "Ephemeral beauty", options: ["Beleza eterna", "Beleza passageira", "Beleza artificial", "Beleza permanente"], correct: 1 },
          { word: "Ubiquitous technology", options: ["Tecnologia rara", "Tecnologia onipresente", "Tecnologia antiga", "Tecnologia futura"], correct: 1 },
          { word: "Nefarious plan", options: ["Plano bondoso", "Plano honesto", "Plano maligno", "Plano simples"], correct: 2 },
          { word: "Eloquent speaker", options: ["Orador tímido", "Orador eloquente", "Orador confuso", "Orador silencioso"], correct: 1 },
          { word: "Serendipity led him there", options: ["Planejamento", "Sorte inesperada o levou lá", "Azar", "Esforço"], correct: 1 },
          { word: "Quixotic dream", options: ["Sonho realista", "Sonho idealista irreal", "Sonho comum", "Sonho prático"], correct: 1 },
          { word: "A paradox of life", options: ["Uma verdade simples", "Um paradoxo da vida", "Uma lógica clara", "Um fato óbvio"], correct: 1 },
          { word: "Meticulous work", options: ["Trabalho descuidado", "Trabalho detalhista", "Trabalho rápido", "Trabalho superficial"], correct: 1 },
          { word: "Inscrutable expression", options: ["Expressão clara", "Expressão indecifrável", "Expressão alegre", "Expressão triste"], correct: 1 },
          { word: "Laconic response", options: ["Resposta longa", "Resposta breve e direta", "Resposta confusa", "Resposta emocional"], correct: 1 },
        ]
      };

      // Estado do jogo
      let currentQuestions = [];
      let currentQuestionIndex = 0;
      let correctAnswers = 0;
      let selectedOption = null;
      let score = 0;

      // Elementos DOM
      const difficultyInputs = document.querySelectorAll('input[name="difficulty"]');
      const progressText = document.getElementById('progress-text');
      const progressPercent = document.getElementById('progress-percent');
      const progressBar = document.getElementById('progress-bar');
      const questionWord = document.getElementById('question-word');
      const instructionText = document.getElementById('instruction-text');
      const optionsContainer = document.getElementById('options-container');
      const nextBtn = document.getElementById('next-btn');
      const speakBtn = document.getElementById('speak-btn');
      const completionScreen = document.getElementById('completion-screen');
      const finalScore = document.getElementById('final-score');
      const finalText = document.getElementById('final-text');
      const finalCircle = document.getElementById('final-circle');
      const scoreDisplay = document.getElementById('score-display');

      // Função para embaralhar array
      function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      // Iniciar o quiz
      function startQuiz() {
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        let selectedQuestions = questions[difficulty];

        // Embaralhar perguntas e pegar 10
        currentQuestions = shuffle(selectedQuestions).slice(0, 10);

        currentQuestionIndex = 0;
        correctAnswers = 0;
        score = 0;
        updateScore();
        loadQuestion();
      }

      // Carregar pergunta atual
      function loadQuestion() {
        const q = currentQuestions[currentQuestionIndex];

        // Ajustar instrução: "word" ou "sentence/phrase"
        if (q.word.includes(' ') || q.word.length > 15) {
          instructionText.textContent = "Translate this sentence";
        } else {
          instructionText.textContent = "Translate this word";
        }

        questionWord.textContent = q.word;

        // Atualizar progresso
        const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
        progressPercent.textContent = `${Math.round(progress)}%`;
        progressBar.style.width = `${progress}%`;

        // Embaralhar opções, mantendo a correta no índice certo
        const optionsWithIndex = q.options.map((opt, idx) => ({ opt, idx }));
        const shuffledOptions = shuffle(optionsWithIndex);
        const correctNewIndex = shuffledOptions.findIndex(item => item.idx === q.correct);

        // Limpar e criar opções
        optionsContainer.innerHTML = '';
        selectedOption = null;
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');

        shuffledOptions.forEach(({ opt }, index) => {
          const btn = document.createElement('button');
          btn.className = `group relative flex items-center w-full p-4 text-left border-2 border-gray-800 bg-background-surface rounded-xl hover:border-primary/50 hover:bg-background-highlight transition-all active:scale-[0.99]`;
          btn.innerHTML = `
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-background-highlight text-gray-400 text-sm font-bold mr-4 group-hover:bg-primary group-hover:text-white transition-colors border border-gray-700 group-hover:border-primary">
              ${String.fromCharCode(65 + index)}
            </span>
            <span class="text-base font-medium text-gray-200 flex-1">${opt}</span>
            <div class="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-primary transition-colors"></div>
          `;
          btn.addEventListener('click', () => selectOption(btn, index, correctNewIndex));
          optionsContainer.appendChild(btn);
        });

        nextBtn.textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'Finish Quiz' : 'Next Question';
      }

      // Selecionar opção
      function selectOption(btn, selectedIndex, correctIndex) {
        if (selectedOption !== null) return;
        selectedOption = selectedIndex;
        const isCorrect = selectedIndex === correctIndex;

        const allBtns = optionsContainer.querySelectorAll('button');
        allBtns.forEach((b, i) => {
          b.classList.remove('hover:border-primary/50', 'hover:bg-background-highlight', 'active:scale-[0.99]');
          const letter = b.querySelector('span:first-child');
          const iconContainer = b.querySelector('div:last-child');

          if (i === correctIndex) {
            b.classList.add('border-success/40', 'bg-success/10');
            letter.classList.replace('bg-background-highlight', 'bg-success');
            letter.classList.add('text-white');
            iconContainer.outerHTML = '<span class="material-symbols-outlined text-success">check_circle</span>';
          } else if (i === selectedIndex && !isCorrect) {
            b.classList.add('border-error/40', 'bg-error/10');
            letter.classList.replace('bg-background-highlight', 'bg-error');
            letter.classList.add('text-white');
            iconContainer.outerHTML = '<span class="material-symbols-outlined text-error">close</span>';
          }
        });

        if (isCorrect) {
          correctAnswers++;
          score += 10;
          updateScore();
        }

        nextBtn.disabled = false;
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }

      function updateScore() {
        scoreDisplay.textContent = score;
      }

      nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
          currentQuestionIndex++;
          loadQuestion();
        } else {
          showCompletionScreen();
        }
      });

      function showCompletionScreen() {
        const percentage = Math.round((correctAnswers / currentQuestions.length) * 100);
        const circumference = 439.8;
        const offset = circumference - (percentage / 100) * circumference;

        finalScore.textContent = `${percentage}%`;
        finalText.textContent = `You correctly answered ${correctAnswers} out of ${currentQuestions.length} questions. Great job!`;
        finalCircle.style.strokeDashoffset = offset;

        completionScreen.classList.remove('hidden');
      }

      speakBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(questionWord.textContent);
          utterance.lang = 'en-US';
          utterance.rate = 0.8;
          speechSynthesis.speak(utterance);
        }
      });

      // Mudar dificuldade reinicia
      difficultyInputs.forEach(input => {
        input.addEventListener('change', startQuiz);
      });

      // Iniciar
      startQuiz();