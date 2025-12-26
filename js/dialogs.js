 // Dados dos diálogos (fáceis de expandir)
      const dialogues = [
        {
          title: "Greeting a Friend",
          level: "Beginner",
          category: "Greetings",
          duration: "2:05",
          lines: [
            { speaker: "Alex", text: "Hi Sarah! How have you been?" },
            { speaker: "Sarah", text: "Hey Alex! I've been great, thanks! And you?" },
            { speaker: "Alex", text: "I'm doing well. It's been ages since we last met!" },
            { speaker: "Sarah", text: "I know! We should catch up more often." },
            { speaker: "Alex", text: "Definitely. How's your new job going?" },
            { speaker: "Sarah", text: "It's amazing! I really love the team." },
          ]
        },
        {
          title: "At the Grocery Store",
          level: "Intermediate",
          category: "Shopping",
          duration: "1:30",
          lines: [
            { speaker: "Customer", text: "Excuse me, where can I find the milk?" },
            { speaker: "Employee", text: "It's in aisle 5, next to the yogurt." },
            { speaker: "Customer", text: "Thank you. Do you have fresh oranges?" },
            { speaker: "Employee", text: "Yes, they're right over there in produce." },
            { speaker: "Customer", text: "Perfect, thanks for your help!" },
          ]
        },
        {
          title: "Asking for Directions",
          level: "Beginner",
          category: "Travel",
          duration: "3:10",
          lines: [
            { speaker: "Tourist", text: "Excuse me, how do I get to the train station?" },
            { speaker: "Local", text: "Go straight for two blocks, then turn left." },
            { speaker: "Tourist", text: "Is it far from here?" },
            { speaker: "Local", text: "No, about 10 minutes walking." },
            { speaker: "Tourist", text: "Thank you so much!" },
            { speaker: "Local", text: "You're welcome! Have a great day." },
          ]
        },
        {
          title: "History Assignment",
          level: "Intermediate",
          category: "School",
          duration: "1:45",
          lines: [
            { speaker: "Mia", text: "Hey, when is the history project due?" },
            { speaker: "Jake", text: "I think it's next Monday." },
            { speaker: "Mia", text: "Are you sure? I thought it was Friday." },
            { speaker: "Jake", text: "Let me check... Oh wait, you're right!" },
            { speaker: "Mia", text: "Good thing we checked. Let's start today." },
          ]
        },
      ];

      const categories = ["All", "Greetings", "Shopping", "Travel", "School"];

      // Elementos
      const categoryFilters = document.getElementById("category-filters");
      const dialogsList = document.getElementById("dialogs-list");
      const player = document.getElementById("player");
      const playerTitle = document.getElementById("player-title");
      const playPauseBtn = document.getElementById("play-pause-btn");
      const repeatBtn = document.getElementById("repeat-btn");
      const progressBar = document.getElementById("progress-bar");
      const currentLineSpan = document.getElementById("current-line");
      const totalLinesSpan = document.getElementById("total-lines");
      const closePlayerBtn = document.getElementById("close-player");
      const downloadDialogBtn = document.getElementById("download-dialog");

      let currentFilter = "All";
      let currentDialogue = null;
      let currentLineIndex = 0;
      let isPlaying = false;
      let utterances = [];
      let repeatMode = false;

      // Renderizar filtros
      function renderFilters() {
        categoryFilters.innerHTML = "";
        categories.forEach(cat => {
          const btn = document.createElement("button");
          btn.className = `flex h-9 shrink-0 items-center justify-center px-5 rounded-full shadow-sm transition-transform active:scale-95 text-sm font-medium ${
            cat === currentFilter ? "bg-primary text-white" : "bg-[#f0f2f4] dark:bg-[#1c252e] text-[#111418] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`;
          btn.textContent = cat;
          btn.onclick = () => {
            currentFilter = cat;
            renderFilters();
            renderDialogs();
          };
          categoryFilters.appendChild(btn);
        });
      }

      // Renderizar lista de diálogos
      function renderDialogs() {
        dialogsList.innerHTML = "";
        const filtered = currentFilter === "All" ? dialogues : dialogues.filter(d => d.category === currentFilter);

        filtered.forEach(dialogue => {
          const article = document.createElement("article");
          article.className = "bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-[#1c252e] cursor-pointer hover:shadow-md transition-all";
          article.onclick = () => startDialogue(dialogue);

          const levelColor = dialogue.level === "Beginner" ? "green" : "yellow";
          article.innerHTML = `
            <div class="flex justify-between items-start mb-2">
              <span class="inline-flex items-center rounded-md bg-${levelColor}-50 dark:bg-${levelColor}-900/30 px-2 py-1 text-xs font-medium text-${levelColor}-700 dark:text-${levelColor}-300 ring-1 ring-inset ring-${levelColor}-600/20">${dialogue.level}</span>
            </div>
            <h3 class="text-[#111418] dark:text-white text-lg font-bold leading-tight mb-1">${dialogue.title}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-xs font-medium mb-3">Duration: ${dialogue.duration}</p>
            <div class="bg-background-light dark:bg-[#010911] rounded-lg p-3 border border-gray-100 dark:border-[#1c252e]">
              <p class="text-[#111418] dark:text-gray-300 text-sm italic">"${dialogue.lines[0].text}"</p>
            </div>
          `;
          dialogsList.appendChild(article);
        });
      }

      // Iniciar diálogo
      function startDialogue(dialogue) {
        currentDialogue = dialogue;
        currentLineIndex = 0;
        playerTitle.textContent = dialogue.title;
        totalLinesSpan.textContent = dialogue.lines.length;
        player.classList.remove("hidden");
        playPause();
      }

      // Reprodução com speechSynthesis
      function playPause() {
        if (isPlaying) {
          speechSynthesis.pause();
          playPauseBtn.innerHTML = '<span class="material-symbols-outlined text-3xl">play_arrow</span>';
          isPlaying = false;
        } else {
          if (speechSynthesis.paused) {
            speechSynthesis.resume();
          } else {
            speakLine(currentLineIndex);
          }
          playPauseBtn.innerHTML = '<span class="material-symbols-outlined text-3xl">pause</span>';
          isPlaying = true;
        }
      }

      function speakLine(index) {
        if (index >= currentDialogue.lines.length) {
          stopPlayback();
          if (repeatMode) startDialogue(currentDialogue);
          return;
        }

        currentLineSpan.textContent = index + 1;
        progressBar.style.width = `${((index + 1) / currentDialogue.lines.length) * 100}%`;

        // Destacar frase atual (visual feedback)
        const preview = [...document.querySelectorAll("#dialogs-list article")].find(a => a.querySelector("h3").textContent === currentDialogue.title);
        if (preview) preview.querySelector("p").textContent = `"${currentDialogue.lines[index].text}"`;

        const utterance = new SpeechSynthesisUtterance(currentDialogue.lines[index].text);
        utterance.lang = "en-US";
        utterance.rate = 0.9;

        utterance.onend = () => {
          currentLineIndex++;
          speakLine(currentLineIndex);
        };

        utterance.onerror = () => stopPlayback();

        speechSynthesis.speak(utterance);
      }

      function stopPlayback() {
        speechSynthesis.cancel();
        isPlaying = false;
        playPauseBtn.innerHTML = '<span class="material-symbols-outlined text-3xl">play_arrow</span>';
        currentLineIndex = 0;
        progressBar.style.width = "0%";
        currentLineSpan.textContent = "1";
      }

      // Eventos do player
      playPauseBtn.onclick = playPause;
      repeatBtn.onclick = () => {
        repeatMode = !repeatMode;
        repeatBtn.classList.toggle("text-primary", repeatMode);
      };
      closePlayerBtn.onclick = () => {
        stopPlayback();
        player.classList.add("hidden");
      };

      // Download como TXT
      downloadDialogBtn.onclick = () => {
        const content = currentDialogue.lines.map(line => `${line.speaker}: ${line.text}`).join("\n\n");
        const blob = new Blob([`${currentDialogue.title}\n\n${content}`], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${currentDialogue.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      };

      // Inicializar
      renderFilters();
      renderDialogs();