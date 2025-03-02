document.addEventListener('DOMContentLoaded', function() {
    // Discord user information
    const discordUserId = '1154576298803466290';
    
    // Fetch Discord profile using Lanyard API
    fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Lanyard API response:", data); // Debug output
            
            if (data.success) {
                const userData = data.data;
                
                // Update avatar
                const avatarElement = document.getElementById('discord-avatar');
                if (avatarElement && userData.discord_user.avatar) {
                    const avatarHash = userData.discord_user.avatar;
                    const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUserId}/${avatarHash}?size=128`;
                    avatarElement.src = avatarUrl;
                    console.log("Avatar URL:", avatarUrl); // Debug output
                } else {
                    console.error("Avatar element not found or no avatar data");
                }
                
                // Update username and discriminator
                const nameElement = document.getElementById('discord-name');
                if (nameElement) {
                    nameElement.textContent = userData.discord_user.username || "Unknown User";
                }
                
                // Update status
                const statusElement = document.querySelector('.discord-status i');
                if (statusElement) {
                    statusElement.className = 'fas fa-circle';
                    const statusContainer = document.querySelector('.discord-status');
                    
                    if (userData.discord_status === 'online') {
                        statusElement.style.color = '#43b581';
                        statusContainer.innerHTML = '<i class="fas fa-circle"></i> Online';
                    } else if (userData.discord_status === 'idle') {
                        statusElement.style.color = '#faa61a';
                        statusContainer.innerHTML = '<i class="fas fa-circle"></i> Ausente';
                    } else if (userData.discord_status === 'dnd') {
                        statusElement.style.color = '#f04747';
                        statusContainer.innerHTML = '<i class="fas fa-circle"></i> Não perturbe';
                    } else {
                        statusElement.style.color = '#747f8d';
                        statusContainer.innerHTML = '<i class="fas fa-circle"></i> Offline';
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
            } else {
                console.error("Lanyard API returned unsuccessful response");
                fallbackDiscordInfo();
            }
        })
        .catch(error => {
            console.error('Error fetching Discord profile:', error);
            fallbackDiscordInfo();
        });
    
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
    
    // Music Player code remains unchanged
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
    
    // List of songs
    const songs = [
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
    
    let currentSongIndex = 0;
    let isPlaying = false;
    
    // Load the first song
    loadSong(songs[currentSongIndex]);
    
    function loadSong(song) {
        songTitleElement.textContent = song.title;
        songArtistElement.textContent = song.artist;
        songCoverElement.src = song.cover;
        audioPlayer.src = song.src;
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