 // Usando Lecto Translation API (necessário API Key)
      const API_URL = "https://api.lecto.ai/v1/translate/text";
      const API_KEY = "SD5HJHH-28N4BG6-MNMXJFE-4ANVZCG"; // substitui pela tua chave

      const inputText = document.getElementById("input-text");
      const sourceLang = document.getElementById("source-lang");
      const targetLang = document.getElementById("target-lang");
      const swapLangs = document.getElementById("swap-langs");
      const translateBtn = document.getElementById("translate-btn");
      const resultContainer = document.getElementById("result-container");
      const translatedText = document.getElementById("translated-text");
      const statusMessage = document.getElementById("status-message");
      const speakInput = document.getElementById("speak-input");
      const speakOutput = document.getElementById("speak-output");
      const copyResult = document.getElementById("copy-result");

      // Trocar idiomas
      swapLangs.addEventListener("click", () => {
        const temp = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = temp;

        if (inputText.value.trim()) {
          translateText();
        }
      });

      // Traduzir ao clicar no botão ou ao digitar (debounce)
      translateBtn.addEventListener("click", translateText);
      inputText.addEventListener("input", debounce(translateText, 800));

      async function translateText() {
        const text = inputText.value.trim();
        if (!text) {
          resultContainer.classList.add("hidden");
          statusMessage.textContent = "";
          return;
        }

        statusMessage.textContent = "Traduzindo...";
        resultContainer.classList.add("hidden");

        try {
          const res = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-API-Key": API_KEY,
            },
            body: JSON.stringify({
              texts: [text],
              from: sourceLang.value === "auto" ? undefined : sourceLang.value,
              to: [targetLang.value],
            }),
          });

          if (!res.ok) throw new Error("Erro na tradução");

          const data = await res.json();
          // A resposta vem como array de traduções
          translatedText.textContent = data.translations[0].translated;
          resultContainer.classList.remove("hidden");
          statusMessage.textContent = "";
        } catch (err) {
          statusMessage.textContent = "Erro ao traduzir. Tente novamente.";
          console.error(err);
        }
      }

      // Função debounce para não traduzir a cada tecla
      function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      }

      // Pronúncia
      function speak(text, lang) {
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 0.9;
          speechSynthesis.speak(utterance);
        }
      }

      speakInput.addEventListener("click", () => {
        speak(
          inputText.value,
          sourceLang.value === "auto" ? "en" : sourceLang.value
        );
      });

      speakOutput.addEventListener("click", () => {
        speak(translatedText.textContent, targetLang.value);
      });

      // Copiar tradução
      copyResult.addEventListener("click", () => {
        navigator.clipboard.writeText(translatedText.textContent);
        copyResult.innerHTML =
          '<span class="material-symbols-outlined">check</span>';
        setTimeout(() => {
          copyResult.innerHTML =
            '<span class="material-symbols-outlined">content_copy</span>';
        }, 2000);
      });

      // Tradução automática ao carregar se houver texto (opcional)
      // translateText();