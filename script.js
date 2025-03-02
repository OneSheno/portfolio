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
    
    // Spotify API credentials - substitua com suas próprias credenciais
    const clientId = '898f5ae84a3e4d95861025964ec25b52';
    const clientSecret = 'ab7cf8a060c1497eba1114a1c6f0bb1e';
    
    // Playlist do Spotify - substitua com o ID da sua playlist
    const playlistId = '37i9dQZF1DX4SBhb3fqCJd'; // Exemplo: playlist Lo-Fi Beats
    
    // Token de acesso do Spotify
    let accessToken = '';
    
    // Obter token de acesso do Spotify
    async function getSpotifyToken() {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
    
        const data = await result.json();
        accessToken = data.access_token;
        return accessToken;
    }
    
    // Obter faixas da playlist do Spotify
    async function getPlaylistTracks() {
        const token = await getSpotifyToken();
        
        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
    
        const data = await result.json();
        return data.items.map(item => ({
            title: item.track.name,
            artist: item.track.artists.map(artist => artist.name).join(', '),
            cover: item.track.album.images[0].url,
            preview: item.track.preview_url,
            external_url: item.track.external_urls.spotify
        })).filter(track => track.preview !== null);
    }
    
    // Lista de músicas
    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    
    // Inicializar o player de música
    async function initMusicPlayer() {
        try {
            songs = await getPlaylistTracks();
            console.log("Músicas carregadas:", songs);
            
            if (songs.length > 0) {
                loadSong(songs[currentSongIndex]);
            } else {
                console.error("Nenhuma música com preview disponível encontrada");
                // Usar músicas de fallback se não conseguir carregar do Spotify
                useFallbackSongs();
            }
        } catch (error) {
            console.error("Erro ao inicializar o player de música:", error);
            useFallbackSongs();
        }
    }
    
    // Usar músicas de fallback se o Spotify falhar
    function useFallbackSongs() {
        songs = [
            {
                title: "Phonk Music",
                artist: "Kordhell",
                src: "https://files.catbox.moe/2jzzps.mp3",
                cover: "https://i.ytimg.com/vi/PCo8OrFs2U8/maxresdefault.jpg"
            },
            {
                title: "Murder In My Mind",
                artist: "Kordhell",
                src: "https://files.catbox.moe/qbw9ck.mp3",
                cover: "https://i.ytimg.com/vi/gykWYPrArbY/maxresdefault.jpg"
            }
        ];
        loadSong(songs[currentSongIndex]);
    }
    
    function loadSong(song) {
        songTitleElement.textContent = song.title;
        songArtistElement.textContent = song.artist;
        songCoverElement.src = song.cover;
        // Se for do Spotify, use o preview_url
        if (song.preview) {
            audioPlayer.src = song.preview;
        } else {
            audioPlayer.src = song.src;
        }
        
        // Preload audio
        audioPlayer.load();
        console.log("Carregando música:", song.title);
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
    
    // Play/Pause event
    playButton.addEventListener('click', function() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    // Previous song
    prevButton.addEventListener('click', function() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(songs[currentSongIndex]);
        if (isPlaying) {
            playSong();
        }
    });
    
    // Next song
    nextButton.addEventListener('click', function() {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(songs[currentSongIndex]);
        if (isPlaying) {
            playSong();
        }
    });
    
    // Iniciar o player de música
    initMusicPlayer();
    
    // O resto do código do player permanece o mesmo
    // Update progress bar
    audioPlayer.addEventListener('timeupdate', function() {
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time info
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeElement.textContent = 
            `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
        
        if (!isNaN(duration)) {
            const totalMinutes = Math.floor(duration / 60);
            const totalSeconds = Math.floor(duration % 60);
            durationElement.textContent = 
                `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
        }
    });
    
    // Click on progress bar
    progressContainer.addEventListener('click', function(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    });
    
    // Song ends
    audioPlayer.addEventListener('ended', function() {
        nextButton.click();
    });
    
    // Volume control
    let isMuted = false;
    volumeButton.addEventListener('click', function() {
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
});
