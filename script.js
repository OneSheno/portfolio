// Configurações
const _0x4f2a3c = atob('MTE1NDU3NjI5ODgwMzQ2NjI5MA=='); 
const songs = [
    {
        title: "No, The Moon",
        artist: "Teen Suicide",
        file: "./music/Teen Suicide - No, The Moon.mp3",
        cover: "https://play-lh.googleusercontent.com/YA_VX_XkrHW_rX4zaTuIXi0dBx80BFxfDlSf5f4Q7_-09TQq9rImbD7V8PlMQX_JN4Ai=w526-h296-rw"
    }
];

// Variáveis para animação de títulos
const _0xfb44 = ['\x53\x68\x65\x6E\x6E\x6F\x6E\x20\x74\x68\x65\x20\x43\x6F\x64\x65\x72', '\x53\x68\x65\x6E\x6E\x6F\x6E\x20\x74\x68\x65\x20\x53\x6B\x69\x64\x64\x65\x72'];
const _0xe35a = [
    '\x53\x68\x65\x6E\x6E\x6F\x6E\x20\x7C\x20\x44\x69\x65',
    '\x53\x68\x65\x6E\x6E\x6F\x6E\x20\x7C\x20\x5A\x65\x64\x50\x6C\x61\x79\x65\x72',
    '\x53\x68\x65\x6E\x6E\x6F\x6E\x20\x7C\x20\x53\x6B\x69\x64\x64\x65\x72\x20\x50\x72\x6F',
    '\x53\x68\x65\x6E\x6E\x6F\x6E\x20\x7C\x20\x52\x65\x76\x65\x72\x73\x65\x20\x45\x6E\x67\x69\x6E\x65\x65\x72\x69\x6E\x67'
];
let _0x32cb = 0;
let _0x78ea = 0;

// Variáveis globais
let currentSongIndex = 0;
let isPlaying = false;
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

// Event Listeners
window.addEventListener('DOMContentLoaded', _0x53fa);
playButton.addEventListener('click', togglePlay);
prevButton.addEventListener('click', playPreviousSong);
nextButton.addEventListener('click', playNextSong);
volumeButton.addEventListener('click', toggleMute);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', playNextSong);
progressContainer.addEventListener('click', setProgress);

// Configuração para remover overlay e iniciar música
document.getElementById('overlay').addEventListener('click', function() {
    this.style.opacity = '0';
    setTimeout(() => {
        this.style.display = 'none';
        // Forçar play após interação do usuário
        playSong();
    }, 500);
});

// Links sociais
const githubLink = document.querySelector('.links a:nth-child(1)');
const discordAddLink = document.getElementById('add-discord');

githubLink.setAttribute('href', 'https://github.com/OneSheno');
githubLink.setAttribute('target', '_blank');

discordAddLink.addEventListener('click', function(e) {
    e.preventDefault();
    addDiscordFriend();
});

function addDiscordFriend() {
    const _0xa7b3 = ['open', 'discord://', 'discordapp.com/users/', '_blank', 'https://discord.com/users/'];
    window[_0xa7b3[0]](_0xa7b3[1] + _0xa7b3[2] + _0x4f2a3c, _0xa7b3[3]);
    window[_0xa7b3[0]](_0xa7b3[4] + _0x4f2a3c, _0xa7b3[3]);
}

(function() {
    const _0x3f4c = ['addEventListener', 'contextmenu', 'preventDefault', 'return', 'false', 'keydown'];
    document[_0x3f4c[0]](_0x3f4c[1], function(e) {
        e[_0x3f4c[2]]();
        return false;
    });
    
    document[_0x3f4c[0]](_0x3f4c[5], function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')) {
            e[_0x3f4c[2]]();
            return false;
        }
    });
})();

(function() {
    const keys = {
        ctrlKey: false,
        shiftKey: false,
        iKey: false
    };

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Control') keys.ctrlKey = true;
        if (e.key === 'Shift') keys.shiftKey = true;
        if (e.key === 'I' || e.key === 'i' || e.keyCode === 73) keys.iKey = true;
        
        if (keys.ctrlKey && keys.shiftKey && keys.iKey) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    document.addEventListener('keyup', function(e) {
        if (e.key === 'Control') keys.ctrlKey = false;
        if (e.key === 'Shift') keys.shiftKey = false;
        if (e.key === 'I' || e.key === 'i' || e.keyCode === 73) keys.iKey = false;
    }, true);

    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.keyCode === 73)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
})();

// Inicialização
function _0x53fa() {
    loadSong(currentSongIndex);
    _0x7d1c();
    _0x3be9();
    setInterval(_0x3be9, 60000); 
    
    // Remoção do autoplay inicial - agora será controlado pelo clique no overlay
    
    if (document.body.classList.contains('bg-particles')) {
        _0x9d2e();
    }
    
    _0x5a8c();
    setInterval(_0x5a8c, 3000);
    
    setTimeout(() => {
        document.querySelector('.anime-speech').style.opacity = '1';
        document.querySelector('.anime-speech').style.transform = 'translateY(0)';
    }, 1000);
}

// Função para animar o título
function _0x5a8c() {
    _0x32cb = (_0x32cb + 1) % _0xfb44.length;
    _0x78ea = Math.floor(Math.random() * _0xe35a.length);
    const titleElement = document.querySelector('.profile h1');
    
    titleElement.style.opacity = '0';
    
    setTimeout(() => {
        titleElement.textContent = _0xfb44[_0x32cb];
        document.title = _0xe35a[_0x78ea];
        titleElement.style.opacity = '1';
    }, 500);
}

// Funções para o Player de Música
function loadSong(index) {
    const song = songs[index];
    songTitleElement.textContent = song.title;
    songArtistElement.textContent = song.artist;
    songCoverElement.src = song.cover;
    audioPlayer.src = song.file;
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
    audioPlayer.play();
}

function pauseSong() {
    isPlaying = false;
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    audioPlayer.pause();
}

function playPreviousSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

function playNextSong() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

function toggleMute() {
    audioPlayer.muted = !audioPlayer.muted;
    volumeButton.innerHTML = audioPlayer.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
}

function updateProgress() {
    const { duration, currentTime } = audioPlayer;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        currentTimeElement.textContent = formatTime(currentTime);
        durationElement.textContent = formatTime(duration);
    }
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

function _0x3be9() {
    const _0xb431 = ['api.lanyard.rest/v1/users/', 'json', 'success', 'data', 'catch', 'error', 'log', 'discord-avatar', 'src', 'discord-name', 'textContent', 'Shennon', 'innerHTML', '<i class="fas fa-circle" style="color: #43b581;"></i> Online'];
    
    fetch(`https://${_0xb431[0]}${_0x4f2a3c}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar perfil do Discord');
            }
            return response[_0xb431[1]]();
        })
        .then(data => {
            if (data[_0xb431[2]]) {
                updateDiscordProfile(data[_0xb431[3]]);
            }
        })
        [_0xb431[4]](error => {
            console[_0xb431[6]]('Erro:', error);
            const avatarElement = document.getElementById(_0xb431[7]);
            avatarElement[_0xb431[8]] = "https://i.pinimg.com/474x/e8/99/c4/e899c402060976f7611257f2810e9167.jpg";
            
            const discordNameElement = document.getElementById(_0xb431[9]);
            discordNameElement[_0xb431[10]] = _0xb431[11];
            
            const statusElement = document.querySelector('.discord-status');
            statusElement[_0xb431[12]] = _0xb431[13];
        });
}

function updateDiscordProfile(userData) {
    const avatarElement = document.getElementById('discord-avatar');
    try {
        if (userData.discord_user && userData.discord_user.avatar) {
            avatarElement.src = `https://cdn.discordapp.com/avatars/${_0x4f2a3c}/${userData.discord_user.avatar}?size=128`;
            avatarElement.onerror = function() {
                this.src = "https://i.pinimg.com/474x/e8/99/c4/e899c402060976f7611257f2810e9167.jpg";
            };
        } else {
            avatarElement.src = "https://i.pinimg.com/474x/e8/99/c4/e899c402060976f7611257f2810e9167.jpg";
        }
    } catch (e) {
        avatarElement.src = "https://i.pinimg.com/474x/e8/99/c4/e899c402060976f7611257f2810e9167.jpg";
    }
    
    const discordNameElement = document.getElementById('discord-name');
    discordNameElement.textContent = userData.discord_user ? userData.discord_user.username : "Shennon";
    
    const discordDiscriminatorElement = document.getElementById('discord-discriminator');
    discordDiscriminatorElement.textContent = userData.discord_user && userData.discord_user.discriminator ? 
        `#${userData.discord_user.discriminator}` : '';
    
    const statusElement = document.querySelector('.discord-status');
    const statusIcon = statusElement.querySelector('i');
    
    let statusColor;
    let statusText;
    
    switch (userData.discord_status) {
        case 'online':
            statusColor = '#43b581';
            statusText = 'Online';
            break;
        case 'idle':
            statusColor = '#faa61a';
            statusText = 'Ausente';
            break;
        case 'dnd':
            statusColor = '#f04747';
            statusText = 'Não Perturbe';
            break;
        default:
            statusColor = '#747f8d';
            statusText = 'Offline';
    }
    
    statusIcon.style.color = statusColor;
    statusElement.innerHTML = `<i class="fas fa-circle" style="color: ${statusColor};"></i> ${statusText}`;
}

// Funções de background
function _0x7d1c() {
    const buttons = document.querySelectorAll('.bg-button');
    const body = document.body;
    
    body.className = 'bg-gradient-purple';
    buttons[0].classList.add('active');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const bg = this.getAttribute('data-bg');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            
            this.classList.add('active');
            
            body.className = '';
            
            body.classList.add(bg);
            
            if (bg === 'bg-particles') {
                _0x9d2e();
            }
        });
    });
}

// Configuração das partículas
function _0x9d2e() {
    const existingCanvas = document.querySelector('.particle-background');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-background';
    document.body.appendChild(canvas);
    
    const particles = [];
    const particleCount = 100;
    const maxSize = 5;
    const minSize = 1;
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = minSize + Math.random() * (maxSize - minSize);
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
    }
    
    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) {
            this.speedX = -this.speedX;
        }
        
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY = -this.speedY;
        }
    };
    
    Particle.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };
    
    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();
}
