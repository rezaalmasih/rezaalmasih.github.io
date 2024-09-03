const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            result.innerHTML = `
            <div class="word">
                <h3>${inpWord}</h3>
                <button onclick="playSound()">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="details">
                <p>${data[0].meanings[0].partOfSpeech}</p>
                <p>/${data[0].phonetic}/</p>
            </div>
            <p class="word-meaning">
                ${data[0].meanings[0].definitions[0].definition}
            </p>
            <p class="word-example">
                ${data[0].meanings[0].definitions[0].example || ""}
            </p>`;

            // Mencari URL audio yang valid
            const audioData = data[0].phonetics.find(phonetic => phonetic.audio && phonetic.audio.includes('.mp3'));
            if (audioData) {
                let audioUrl = audioData.audio;

                // Jika URL audio dimulai dengan '//', tambahkan protokol 'https:'
                if (audioUrl.startsWith('//')) {
                    audioUrl = 'https:' + audioUrl;
                }

                sound.setAttribute("src", audioUrl);
                console.log(`Audio URL set to: ${audioUrl}`);
            } else {
                console.error('Tidak ada URL audio yang didukung.');
                sound.removeAttribute("src"); // Hapus sumber audio sebelumnya
            }
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Tidak dapat menemukan kata</h3>`;
        });
});

function playSound() {
    if (sound.src) {  // Periksa apakah ada sumber audio untuk diputar
        sound.play()
            .then(() => {
                console.log('Audio berhasil diputar');
            })
            .catch(error => {
                console.error('Kesalahan saat memutar audio:', error);
            });
    } else {
        console.log('Tidak ada sumber audio yang tersedia untuk diputar.');
    }
}
