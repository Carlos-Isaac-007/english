      // Carregar vocabulário
      let vocabularyData = JSON.parse(localStorage.getItem("myVocabulary")) || [
        { english: "Book", portuguese: "Livro", category: "School", icon: "menu_book", color: "orange" },
        { english: "Apple", portuguese: "Maçã", category: "Food", icon: "nutrition", color: "red" },
        { english: "To Run", portuguese: "Correr", category: "Verbs", icon: "directions_run", color: "purple" },
        { english: "Morning", portuguese: "Manhã", category: "Daily Life", icon: "wb_sunny", color: "yellow" },
        { english: "Water", portuguese: "Água", category: "Food", icon: "water_drop", color: "blue" },
        { english: "Pencil", portuguese: "Lápis", category: "School", icon: "edit", color: "teal" },
        { english: "Hello", portuguese: "Olá", category: "Daily Life", icon: "waving_hand", color: "green" },
        { english: "Friend", portuguese: "Amigo", category: "Daily Life", icon: "group", color: "pink" },
        { english: "To Eat", portuguese: "Comer", category: "Verbs", icon: "restaurant", color: "amber" },
        { english: "Travel", portuguese: "Viajar", category: "Travel", icon: "flight", color: "indigo" },
      ];

      function getCategories() {
        return ["All", ...new Set(vocabularyData.map(item => item.category))];
      }
      let categories = getCategories();

      // Elementos
      const searchInput = document.getElementById("search-input");
      const categoryFilters = document.getElementById("category-filters");
      const vocabularyList = document.getElementById("vocabulary-list");
      const addBtn = document.getElementById("add-word-btn");
      const modal = document.getElementById("add-modal");
      const closeModal = document.getElementById("close-modal");
      const form = document.getElementById("add-word-form");
      const englishInput = document.getElementById("english-input");
      const portugueseInput = document.getElementById("portuguese-input");
      const categorySelect = document.getElementById("category-select");

      let currentFilter = "All";

      const colorMap = {
        orange: { light: "orange-100", dark: "orange-900/30", text: "orange-600", textDark: "orange-400" },
        red: { light: "red-100", dark: "red-900/30", text: "red-600", textDark: "red-400" },
        purple: { light: "purple-100", dark: "purple-900/30", text: "purple-600", textDark: "purple-400" },
        yellow: { light: "yellow-100", dark: "yellow-900/30", text: "yellow-600", textDark: "yellow-400" },
        blue: { light: "blue-100", dark: "blue-900/30", text: "blue-600", textDark: "blue-400" },
        teal: { light: "teal-100", dark: "teal-900/30", text: "teal-600", textDark: "teal-400" },
        green: { light: "green-100", dark: "green-900/30", text: "green-600", textDark: "green-400" },
        pink: { light: "pink-100", dark: "pink-900/30", text: "pink-600", textDark: "pink-400" },
        amber: { light: "amber-100", dark: "amber-900/30", text: "amber-600", textDark: "amber-400" },
        indigo: { light: "indigo-100", dark: "indigo-900/30", text: "indigo-600", textDark: "indigo-400" },
      };

      const defaultIcons = { School: "school", Food: "restaurant", Verbs: "directions_run", "Daily Life": "calendar_today", Travel: "flight", default: "bookmark" };
      const defaultColors = { School: "orange", Food: "red", Verbs: "purple", "Daily Life": "yellow", Travel: "indigo", default: "blue" };

      function populateCategorySelect() {
        categorySelect.innerHTML = "";
        categories.slice(1).forEach(cat => {
          const opt = document.createElement("option");
          opt.value = cat;
          opt.textContent = cat;
          categorySelect.appendChild(opt);
        });
        const newOpt = document.createElement("option");
        newOpt.value = "new";
        newOpt.textContent = "+ Create new category";
        categorySelect.appendChild(newOpt);
      }

      function renderFilters() {
        categoryFilters.innerHTML = "";
        categories.forEach(cat => {
          const isActive = cat === currentFilter;
          const btn = document.createElement("button");
          btn.className = `flex h-9 shrink-0 items-center justify-center px-4 rounded-full shadow-sm transition-transform active:scale-95 whitespace-nowrap text-sm font-medium ${
            isActive ? "bg-primary text-white shadow-primary/30" : "bg-white dark:bg-card-dark border border-transparent dark:border-slate-800 text-slate-600 dark:text-slate-300"
          }`;
          btn.textContent = cat;
          btn.addEventListener("click", () => {
            currentFilter = cat;
            renderFilters();
            renderVocabulary();
          });
          categoryFilters.appendChild(btn);
        });
      }

      function renderVocabulary() {
        let filtered = vocabularyData.slice().reverse();
        if (currentFilter !== "All") filtered = filtered.filter(item => item.category === currentFilter);
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
          filtered = filtered.filter(item => item.english.toLowerCase().includes(query) || item.portuguese.toLowerCase().includes(query));
        }

        vocabularyList.innerHTML = `
          <div class="py-2">
            <h3 class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              ${filtered.length > 0 ? "Recently Added" : "No words found"}
            </h3>
          </div>
        `;

        if (filtered.length === 0) {
          vocabularyList.innerHTML += `<p class="text-center text-slate-500 py-8">No words yet. Add one using the + button!</p>`;
          return;
        }

        filtered.forEach((item, index) => {
          const originalIndex = vocabularyData.length - 1 - filtered.indexOf(item); // índice real no array original
          const colors = colorMap[item.color || defaultColors[item.category] || "blue"] || colorMap.blue;
          const icon = item.icon || defaultIcons[item.category] || defaultIcons.default;

          const card = document.createElement("div");
          card.className = "flex items-center justify-between p-3.5 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors";
          card.innerHTML = `
            <div class="flex items-center gap-4">
              <div class="flex items-center justify-center size-12 rounded-xl ${colors.light} dark:${colors.dark} ${colors.text} dark:${colors.textDark} shrink-0">
                <span class="material-symbols-outlined">${icon}</span>
              </div>
              <div class="flex flex-col">
                <p class="text-slate-900 dark:text-white text-base font-bold leading-tight">${item.english}</p>
                <p class="text-slate-500 dark:text-slate-400 text-sm font-normal">${item.portuguese}</p>
                <span class="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded mt-1 w-fit">${item.category}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="speak-btn size-10 flex items-center justify-center rounded-full text-primary bg-primary/10 hover:bg-primary/20 transition-colors" data-word="${item.english}">
                <span class="material-symbols-outlined">volume_up</span>
              </button>
              <button class="delete-btn size-10 flex items-center justify-center rounded-full text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors" data-index="${originalIndex}">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          `;
          vocabularyList.appendChild(card);
        });

        // Pronúncia
        document.querySelectorAll(".speak-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const word = btn.getAttribute("data-word");
            if ("speechSynthesis" in window) {
              const utterance = new SpeechSynthesisUtterance(word);
              utterance.lang = "en-US";
              utterance.rate = 0.9;
              speechSynthesis.speak(utterance);
            }
          });
        });

        // Apagar palavra
        document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            if (confirm(`Tem certeza que deseja remover "${vocabularyData[index].english}" do vocabulário?`)) {
              vocabularyData.splice(index, 1);
              localStorage.setItem("myVocabulary", JSON.stringify(vocabularyData));
              categories = getCategories();
              renderFilters();
              renderVocabulary();
            }
          });
        });
      }

      // Modal e adição (igual ao anterior)
      addBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        populateCategorySelect();
        englishInput.focus();
      });
      closeModal.addEventListener("click", () => modal.classList.add("hidden"));
      modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });

      form.addEventListener("submit", e => {
        e.preventDefault();
        let category = categorySelect.value;
        if (category === "new") {
          category = prompt("Enter new category name:");
          if (!category || category.trim() === "") return;
          category = category.trim();
        }
        const newWord = {
          english: englishInput.value.trim(),
          portuguese: portugueseInput.value.trim(),
          category: category,
          icon: defaultIcons[category] || defaultIcons.default,
          color: defaultColors[category] || defaultColors.default,
        };
        vocabularyData.unshift(newWord);
        localStorage.setItem("myVocabulary", JSON.stringify(vocabularyData));
        categories = getCategories();
        renderFilters();
        modal.classList.add("hidden");
        form.reset();
        renderVocabulary();
      });

      searchInput.addEventListener("input", renderVocabulary);

      // Inicializar
      renderFilters();
      renderVocabulary();