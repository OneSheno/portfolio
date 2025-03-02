document.addEventListener('DOMContentLoaded', function() {
    // Discord user information
    const discordUserId = '1154576298803466290';
    
    // Fetch Discord profile using Lanyard API with WebSocket for real-time updates
    const ws = new WebSocket('wss://api.lanyard.rest/socket');
    
    ws.onopen = () => {
        console.log('WebSocket connected');
        // Subscribe to updates for your Discord ID
        ws.send(JSON.stringify({
            op: 2,
            d: {
                subscribe_to_ids: [discordUserId]
            }
        }));
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
        
        // Handle different operation codes
        if (data.op === 1) {
            // Heartbeat
            setInterval(() => {
                ws.send(JSON.stringify({ op: 3 }));
            }, data.d.heartbeat_interval);
        } else if (data.op === 0) {
            // Event
            if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
                if (data.d[discordUserId]) {
                    updateDiscordProfile(data.d[discordUserId]);
                }
            }
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Fallback to REST API
        fetchDiscordProfileREST();
    };
    
    ws.onclose = () => {
        console.log('WebSocket closed');
        // Fallback to REST API
        fetchDiscordProfileREST();
    };
    
    function fetchDiscordProfileREST() {
        fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Lanyard API response:", data);
                
                if (data.success) {
                    updateDiscordProfile(data.data);
                } else {
                    fallbackDiscordInfo();
                }
            })
            .catch(error => {
                console.error('Error fetching Discord profile:', error);
                fallbackDiscordInfo();
            });
    }
    
    function updateDiscordProfile(userData) {
        // Update avatar
        const avatarElement = document.getElementById('discord-avatar');
        if (avatarElement && userData.discord_user && userData.discord_user.avatar) {
            const avatarHash = userData.discord_user.avatar;
            const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUserId}/${avatarHash}?size=128`;
            avatarElement.src = avatarUrl;
            console.log("Avatar URL:", avatarUrl);
        } else {
            console.error("Avatar element not found or no avatar data");
            if (avatarElement) {
                avatarElement.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            }
        }
        
        // Update username
        const nameElement = document.getElementById('discord-name');
        if (nameElement && userData.discord_user) {
            nameElement.textContent = userData.discord_user.username || "Shennon";
        }
        
        // Update status
        const statusElement = document.querySelector('.discord-status i');
        if (statusElement) {
            statusElement.className = 'fas fa-circle';
            const statusContainer = document.querySelector('.discord-status');
            
            if (userData.discord_status === 'online') {
                statusElement.style.color = '#43b581';
                statusContainer.innerHTML = '<i class="fas fa-circle" style="color: #43b581;"></i> Online';
            } else if (userData.discord_status === 'idle') {
                statusElement.style.color = '#faa61a';
                statusContainer.innerHTML = '<i class="fas fa-circle" style="color: #faa61a;"></i> Ausente';
            } else if (userData.discord_status === 'dnd') {
                statusElement.style.color = '#f04747';
                statusContainer.innerHTML = '<i class="fas fa-circle" style="color: #f04747;"></i> Não perturbe';
            } else {
                statusElement.style.color = '#747f8d';
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
                }
            }
        } else {
            console.error("Status element not found");
        }
    }
    
    // Fallback function for Discord info
    function fallbackDiscordInfo() {
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
    
    // List of songs - using local files
    const songs = [
        {
            title: "Phonk Music",
            artist: "Kordhell",
            src: "music/phonk-music.mp3",
            cover: "https://i.ytimg.com/vi/PCo8OrFs2U8/maxresdefault.jpg"
        },
        {
            title: "Murder In My Mind",
            artist: "Kordhell",
            src: "music/murder-in-my-mind.mp3",
            cover: "https://i.ytimg.com/vi/gykWYPrArbY/maxresdefault.jpg"
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
        
        // Preload audio
        audioPlayer.load();
    }
    
    function playSong() {
        isPlaying = true;
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        audioPlayer.play().catch(error => {
            console.error("Error playing audio:", error);
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
