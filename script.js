document.addEventListener('DOMContentLoaded', function() {
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
    const discordUserId = '1154576298803466290'; // ID do usuário do Discord
    
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
    
    // Função para atualização do perfil do Discord
    function updateDiscordProfile(userData) {
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
        const fallbackData = {
            discord_user: {
                username: "Shennon",
                discriminator: "0000",
                avatar: null
            },
            discord_status: "offline",
            activities: []
        };
        updateDiscordProfile(fallbackData);
    }
    
    // Função para buscar dados do Discord via REST API
    function fetchDiscordProfile() {
        console.log("Buscando perfil do Discord...");
        
        // Tenta buscar os dados do servidor
        fetch('/api/discord-profile?user_id=' + discordUserId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados do Discord, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log("Dados do Discord recebidos:", data);
                updateDiscordProfile(data);
            })
            .catch(error => {
                console.error("Erro ao buscar perfil do Discord:", error);
                fallbackDiscordInfo();
            });
    }
    
    // Buscar perfil imediatamente
    fetchDiscordProfile();
});
