document.addEventListener('DOMContentLoaded', function() {
    // Discord user information
    const discordUserId = '1154576298803466290';
    
    console.log("Iniciando busca de perfil do Discord...");
    
    // Função para buscar dados do Discord via REST API
    function fetchDiscordProfile() {
        console.log("Buscando perfil via REST API...");
        
        fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`)
            .then(response => {
                console.log("Status da resposta:", response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Dados completos recebidos:", data);
                
                if (data.success) {
                    updateDiscordProfile(data.data);
                } else {
                    console.error("API retornou resposta sem sucesso");
                    fallbackDiscordInfo();
                }
            })
            .catch(error => {
                console.error('Erro ao buscar perfil do Discord:', error);
                fallbackDiscordInfo();
            });
    }
    
    function updateDiscordProfile(userData) {
        console.log("Atualizando perfil com dados:", userData);
        
        // Update avatar
        const avatarElement = document.getElementById('discord-avatar');
        if (avatarElement && userData.discord_user && userData.discord_user.avatar) {
            const avatarHash = userData.discord_user.avatar;
            const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUserId}/${avatarHash}?size=128`;
            console.log("Definindo avatar URL:", avatarUrl);
            avatarElement.src = avatarUrl;
        } else {
            console.error("Avatar element not found or no avatar data:", 
                          {element: !!avatarElement, user: !!userData.discord_user, 
                           avatar: userData.discord_user?.avatar});
            if (avatarElement) {
                avatarElement.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            }
        }
        // Update username and discriminator
        const nameElement = document.getElementById('discord-name');
        if (nameElement && userData.discord_user) {
            nameElement.textContent = userData.discord_user.username || "Shennon";
            console.log("Nome definido:", userData.discord_user.username);
            
            // Update discriminator if it exists
            const discriminatorElement = document.getElementById('discord-discriminator');
            if (discriminatorElement) {
                // Discord is phasing out discriminators, so check if it exists
                if (userData.discord_user.discriminator && userData.discord_user.discriminator !== '0') {
                    discriminatorElement.textContent = `#${userData.discord_user.discriminator}`;
                } else {
                    discriminatorElement.textContent = ''; // Remove discriminator if not present
                }
            }
        }
        
        // Update status
        const statusContainer = document.querySelector('.discord-status');
        if (statusContainer) {
            console.log("Status atual:", userData.discord_status);
            
            if (userData.discord_status === 'online') {
                statusContainer.innerHTML = '<i class="fas fa-circle" style="color: #43b581;"></i> Online';
            } else if (userData.discord_status === 'idle') {
                statusContainer.innerHTML = '<i class="fas fa-circle" style="color: #faa61a;"></i> Ausente';
            } else if (userData.discord_status === 'dnd') {
                statusContainer.innerHTML = '<i class="fas fa-circle" style="color: #f04747;"></i> Não perturbe';
            } else {
                statusContainer.innerHTML = '<i class="fas fa-circle" style="color: #747f8d;"></i> Offline';
            }
            
            // If there's a custom status
            if (userData.activities && userData.activities.length > 0) {
                const customStatus = userData.activities.find(activity => activity.type === 4);
                if (customStatus && customStatus.state) {
                    const statusText = document.createElement('div');
                    statusText.className = 'discord-custom-status';
                    statusText.textContent = customStatus.state;
                    statusContainer.appendChild(statusText);
                    console.log("Status personalizado adicionado:", customStatus.state);
                }
            }
        } else {
            console.error("Elemento de status não encontrado");
        }
    }
    
    // Fallback function for Discord info
    function fallbackDiscordInfo() {
        console.log("Usando informações de fallback");
        
        const avatarElement = document.getElementById('discord-avatar');
        if (avatarElement) {
            avatarElement.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
        }
        
        const nameElement = document.getElementById('discord-name');
        if (nameElement) {
            nameElement.textContent = 'Shennon';
        }
        
        const statusElement = document.querySelector('.discord-status');
        if (statusElement) {
            statusElement.innerHTML = '<i class="fas fa-circle" style="color: #747f8d;"></i> Offline';
        }
    }
    
    // Buscar perfil imediatamente
    fetchDiscordProfile();
    
    // Atualizar a cada 60 segundos
    setInterval(fetchDiscordProfile, 60000);
    // Music Player code
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.getElementById('play');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const volumeButton = document.getElementById('volume');
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration');
    const songTitleElement = document.getElementById('song-title');
    const songArtistElement = document.getElementById('song-artist');
    const songCoverElement = document.getElementById('song-cover');
    
    // List of songs - using GitHub repository URLs
    const songs = [
        {
            title: "Your Betrayal",
            artist: "Bullet For My Valentine",
            src: "./music/Bullet For My Valentine - Your Betrayal (Official Video) - bulletvalentineVEVO.mp3",
            cover: "https://i.ytimg.com/vi/IHgFJEJgUrg/maxresdefault.jpg"
        }
    ];
    
    let currentSongIndex = 0;
    let isPlaying = false;
    
    // Load the first song
    loadSong(songs[currentSongIndex]);
    
    function loadSong(song) {
        songTitleElement.textContent = song.title;
        songArtistElement.textContent = song.artist;
        songCoverElement.src = song.cover;
        audioPlayer.src = song.src;
        audioPlayer.load();
    }
    
    function playSong() {
        isPlaying = true;
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        audioPlayer.play().catch(error => {
            console.error("Erro ao reproduzir áudio:", error);
        });
    }
    function pauseSong() {
        isPlaying = false;
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        audioPlayer.pause();
    }
    
    // Event Listeners
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    prevButton.addEventListener('click', () => {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(songs[currentSongIndex]);
        if (isPlaying) playSong();
    });
    
    nextButton.addEventListener('click', () => {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        loadSong(songs[currentSongIndex]);
        if (isPlaying) playSong();
    });
    
    // Progress bar update
    audioPlayer.addEventListener('timeupdate', () => {
        const { duration, currentTime } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time displays
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeElement.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
        
        if (!isNaN(duration)) {
            const totalMinutes = Math.floor(duration / 60);
            const totalSeconds = Math.floor(duration % 60);
            durationElement.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        }
    });
    
    // Click on progress bar
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    });
    
    // Volume control
    let isMuted = false;
    volumeButton.addEventListener('click', () => {
        if (isMuted) {
            audioPlayer.volume = 1;
            volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            isMuted = false;
        } else {
            audioPlayer.volume = 0;
            volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            isMuted = true;
        }
    });
    
    // Auto-play next song
    audioPlayer.addEventListener('ended', () => {
        nextButton.click();
    });
    
    // Background selector functionality
    const bgButtons = document.querySelectorAll('.bg-button');
    const body = document.body;
    let particleInstance = null;
    
    // Adiciona botão para partículas animadas
    const backgroundSelector = document.querySelector('.background-selector');
    const particleButton = document.createElement('button');
    particleButton.className = 'bg-button';
    particleButton.setAttribute('data-bg', 'bg-particles');
    particleButton.textContent = 'Partículas';
    backgroundSelector.appendChild(particleButton);
    
    // Remove todas as classes de background
    function removeBackgroundClasses() {
        body.classList.remove('bg-gradient-purple', 'bg-gradient-blue', 'bg-gradient-dark', 'bg-pattern-dots', 'bg-pattern-lines', 'bg-particles');
    }
    
    // Função para mostrar ou esconder o canvas de partículas
    function toggleParticles(show) {
        const canvas = document.querySelector('.particle-background');
        if (canvas) {
            canvas.style.display = show ? 'block' : 'none';
        }
    }
    
    // Inicialmente esconde as partículas
    toggleParticles(false);
    
    // Adiciona event listeners para os botões de background
    bgButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bgClass = button.getAttribute('data-bg');
            removeBackgroundClasses();
            body.classList.add(bgClass);
            
            // Mostra ou esconde partículas baseado na seleção
            toggleParticles(bgClass === 'bg-particles');
            
            // Salva a preferência do usuário no localStorage
            localStorage.setItem('preferredBackground', bgClass);
            
            // Atualiza a aparência dos botões
            bgButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Carrega a preferência de background salva, se existir
    const savedBackground = localStorage.getItem('preferredBackground');
    if (savedBackground) {
        removeBackgroundClasses();
        body.classList.add(savedBackground);
        
        // Mostra ou esconde partículas baseado na seleção salva
        toggleParticles(savedBackground === 'bg-particles');
        
        // Marca o botão correspondente como ativo
        const activeButton = document.querySelector(`.bg-button[data-bg="${savedBackground}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
        removeBackgroundClasses();
        body.classList.add(savedBackground);
        
        // Mostra ou esconde partículas baseado na seleção salva
        toggleParticles(savedBackground === 'bg-particles');
        
        // Marca o botão correspondente como ativo
        const activeButton = document.querySelector(`.bg-button[data-bg="${savedBackground}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
)
