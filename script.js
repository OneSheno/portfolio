document.addEventListener('DOMContentLoaded', function() {
    // Contador de visualizações
    const viewCounter = document.getElementById('view-counter');
    
    // Função para gerar um ID único para o visitante
    function generateVisitorId() {
        return 'visitor_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Verifica se o visitante já tem um ID
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = generateVisitorId();
        localStorage.setItem('visitorId', visitorId);
    }
    
    // Verifica se já contou a visita hoje
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    
    // Recupera o contador do localStorage ou inicia com 0
    let viewCount = localStorage.getItem('profileViews') || 0;
    viewCount = parseInt(viewCount);
    
    // Só incrementa se for a primeira visita ou se for um novo dia
    if (lastVisit !== today) {
        viewCount += 1;
        localStorage.setItem('profileViews', viewCount);
        localStorage.setItem('lastVisit', today);
    }
    
    // Atualiza o contador na página
    viewCounter.textContent = viewCount;
    
    // Title animation
    const titles = ['Shennon the Coder', 'Shennon the Skidder'];
    const tabTitles = [
        'Shennon | Die',
        'Shennon | ZedPlayer',
        'Shennon | Skidder Pro',
        'Shennon | Reverse Engineering',
    ];
    let currentTitleIndex = 0;
    let currentTabTitleIndex = 0;
    const titleElement = document.querySelector('.profile h1');

    function animateTitle() {
        currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        currentTabTitleIndex = Math.floor(Math.random() * tabTitles.length);
        titleElement.style.opacity = '0';
        
        setTimeout(() => {
            titleElement.textContent = titles[currentTitleIndex];
            document.title = tabTitles[currentTabTitleIndex];
            titleElement.style.opacity = '1';
        }, 500);
    }

    setInterval(animateTitle, 3000);

    // Discord user information
    const discordUserId = '1154576298803466290';
    
    console.log("Iniciando busca de perfil do Discord...");
    
    // Adiciona botão para adicionar no Discord
    const discordContainer = document.querySelector('.discord-info');
    if (discordContainer) {
        const addDiscordButton = document.createElement('button');
        addDiscordButton.className = 'add-discord-btn';
        addDiscordButton.innerHTML = '<i class="fas fa-user-plus"></i> Add Friend';
        addDiscordButton.addEventListener('click', () => {
            // Copia o ID para a área de transferência
            navigator.clipboard.writeText(discordUserId).then(() => {
                // Altera temporariamente o texto do botão para feedback
                const originalText = addDiscordButton.innerHTML;
                addDiscordButton.innerHTML = '<i class="fas fa-check"></i> ID Copied!';
                
                // Abre o Discord no navegador
                window.open('https://discord.com/channels/@me', '_blank');
                
                // Restaura o texto original após 3 segundos
                setTimeout(() => {
                    addDiscordButton.innerHTML = originalText;
                }, 3000);
            }).catch(err => {
                console.error('Erro ao copiar ID:', err);
                // Abre o Discord de qualquer forma
                window.open('https://discord.com/channels/@me', '_blank');
            });
        });
        
        // Adiciona o botão após as informações de status
        const statusContainer = document.querySelector('.discord-status');
        if (statusContainer) {
            statusContainer.parentNode.insertBefore(addDiscordButton, statusContainer.nextSibling);
        } else {
            discordContainer.appendChild(addDiscordButton);
        }
        
        // Adiciona estilo CSS inline para o botão
        const style = document.createElement('style');
        style.textContent = `
            .add-discord-btn {
                background-color: #5865F2;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                margin-top: 10px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s;
            }
            
            .add-discord-btn i {
                margin-right: 8px;
            }
            
            .add-discord-btn:hover {
                background-color: #4752C4;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Obfuscated updateDiscordProfile function
    function updateDiscordProfile(userData) {
        const _0x3b7c = btoa(JSON.stringify(userData));
        console.log("Updating profile with encrypted data:", _0x3b7c);
        
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
    
    // Basic anti-debugging protection
    const antiDebug = setInterval(() => {
        const startTime = performance.now();
        debugger;
        const endTime = performance.now();
        if (endTime - startTime > 100) {
            window.location.href = 'about:blank';
        }
    }, 1000);

    // Anti-DevTools protection
    window.addEventListener('devtoolschange', function(e) {
        if (e.detail.open) {
            window.location.href = 'about:blank';
        }
    });

    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 73)) || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
    });
    
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
            
            // Limpa o background padrão quando selecionar padrões específicos
            if (bgClass === 'bg-pattern-dots' || bgClass === 'bg-pattern-lines' || bgClass === 'bg-particles') {
                body.style.background = 'rgba(18, 18, 18, 1)';
            } else {
                body.style.background = '';
            }
            
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
        
        // Limpa o background padrão quando selecionar padrões específicos
        if (savedBackground === 'bg-pattern-dots' || savedBackground === 'bg-pattern-lines' || savedBackground === 'bg-particles') {
            body.style.background = 'rgba(18, 18, 18, 1)';
        } else {
            body.style.background = '';
        }
        
        // Marca o botão correspondente como ativo
        const activeButton = document.querySelector(`.bg-button[data-bg="${savedBackground}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
});
