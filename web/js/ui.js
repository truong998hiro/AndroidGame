/**
 * Becoming A Legend — UI Controller
 * Manages all screens, rendering, transitions
 */

const UI = {
    currentScreen: null,
    typewriterTimer: null,
    storyLogEntries: [],
    combatLogEntries: [],

    // ══════════════════════════════════════════════════
    //  SCREEN MANAGEMENT
    // ══════════════════════════════════════════════════

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
        }
    },

    // ══════════════════════════════════════════════════
    //  MAIN MENU
    // ══════════════════════════════════════════════════

    initMainMenu() {
        const continueBtn = document.getElementById('btn-continue');
        continueBtn.style.display = SaveSystem.hasSave() ? 'block' : 'none';
    },

    // ══════════════════════════════════════════════════
    //  CHARACTER CREATION
    // ══════════════════════════════════════════════════

    renderWorldSelection() {
        const container = document.getElementById('world-grid');
        container.innerHTML = '';
        for (const [id, world] of Object.entries(WORLDS)) {
            const card = document.createElement('div');
            card.className = 'world-card';
            card.style.borderColor = world.color;
            card.innerHTML = `
                <div class="world-icon" style="color:${world.color}">${world.icon}</div>
                <div class="world-name" style="color:${world.color}">${world.name}</div>
                <div class="world-subtitle">${world.subtitle}</div>
                <div class="world-desc">${world.description}</div>
                <div class="world-resource">📦 ${world.resource}</div>
            `;
            card.addEventListener('click', () => Game.selectWorld(id));
            container.appendChild(card);
        }
    },

    renderClassSelection(worldId) {
        const container = document.getElementById('class-grid');
        container.innerHTML = '';
        const classes = Object.values(CHARACTER_CLASSES).filter(c => c.world === worldId);
        const world = WORLDS[worldId];
        document.getElementById('class-world-name').textContent = world.name;
        document.getElementById('class-world-name').style.color = world.color;

        for (const cls of classes) {
            const card = document.createElement('div');
            card.className = 'class-card';
            card.innerHTML = `
                <div class="class-name">${cls.name}</div>
                <div class="class-desc">${cls.description}</div>
                <div class="class-stats">
                    <span>❤ HP ${cls.baseStats.maxHp}</span>
                    <span>💧 MP ${cls.baseStats.maxMp}</span>
                    <span>⚔ ATK ${cls.baseStats.attack}</span>
                    <span>🛡 DEF ${cls.baseStats.defense}</span>
                    <span>💨 SPD ${cls.baseStats.speed}</span>
                </div>
                <div class="class-skills">Kỹ năng: ${cls.skills.map(s => SKILLS[s]?.name).join(', ')}</div>
            `;
            card.addEventListener('click', () => Game.selectClass(cls.id));
            container.appendChild(card);
        }
    },

    // ══════════════════════════════════════════════════
    //  STORY / GAME SCREEN
    // ══════════════════════════════════════════════════

    clearStoryLog() {
        this.storyLogEntries = [];
        document.getElementById('story-log').innerHTML = '';
    },

    addStoryEntry(entry, skipAnim) {
        const log = document.getElementById('story-log');
        const div = document.createElement('div');
        div.className = `story-entry story-${entry.type}`;

        let text = entry.text;
        if (entry.type === 'dialogue' && entry.speaker) {
            text = `【${entry.speaker}】${entry.text}`;
        }

        if (skipAnim) {
            div.textContent = text;
            log.appendChild(div);
        } else {
            div.textContent = '';
            log.appendChild(div);
            this.typewrite(div, text, 20);
        }
        this.storyLogEntries.push(entry);
        log.scrollTop = log.scrollHeight;
    },

    addStoryEntries(entries, callback) {
        let idx = 0;
        const addNext = () => {
            if (idx >= entries.length) {
                if (callback) callback();
                return;
            }
            this.addStoryEntry(entries[idx], false);
            idx++;
            setTimeout(addNext, entries[idx - 1].text.length * 15 + 300);
        };
        addNext();
    },

    renderChoices(choices) {
        const container = document.getElementById('choice-buttons');
        container.innerHTML = '';
        for (const choice of choices) {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => Game.handleChoice(choice));
            container.appendChild(btn);
        }
    },

    updateLocationBar(text) {
        document.getElementById('location-bar').textContent = text;
    },

    // ══════════════════════════════════════════════════
    //  COMBAT SCREEN
    // ══════════════════════════════════════════════════

    initCombatUI(state) {
        this.combatLogEntries = [];
        document.getElementById('combat-log').innerHTML = '';
        this.updateCombatUI(state);
    },

    updateCombatUI(state) {
        // Enemy info
        const enemyPanel = document.getElementById('enemy-panel');
        enemyPanel.innerHTML = '';
        for (const enemy of state.enemies) {
            const hpPct = Math.max(0, (enemy.stats.currentHp / enemy.stats.maxHp) * 100);
            const div = document.createElement('div');
            div.className = `enemy-info ${enemy.stats.currentHp <= 0 ? 'dead' : ''}`;
            div.innerHTML = `
                <div class="enemy-name">${enemy.name} <span class="enemy-level">Lv.${enemy.source.level}</span></div>
                <div class="stat-bar hp-bar"><div class="stat-bar-fill" style="width:${hpPct}%"></div>
                    <span class="stat-bar-text">${enemy.stats.currentHp}/${enemy.stats.maxHp}</span></div>
                ${enemy.statusEffects.length > 0 ? `<div class="effects">${enemy.statusEffects.map(e => this.getEffectIcon(e.type)).join(' ')}</div>` : ''}
            `;
            enemyPanel.appendChild(div);
        }

        // Player info
        const player = state.player;
        const playerHpPct = Math.max(0, (player.stats.currentHp / player.stats.maxHp) * 100);
        const playerMpPct = Math.max(0, (player.stats.currentMp / (player.stats.maxMp || 1)) * 100);
        document.getElementById('player-combat-name').textContent = `${player.name} Lv.${player.source.level}`;
        document.getElementById('player-hp-bar').style.width = `${playerHpPct}%`;
        document.getElementById('player-hp-text').textContent = `${player.stats.currentHp}/${player.stats.maxHp}`;
        document.getElementById('player-mp-bar').style.width = `${playerMpPct}%`;
        document.getElementById('player-mp-text').textContent = `${player.stats.currentMp}/${player.stats.maxMp}`;
        const effDiv = document.getElementById('player-effects');
        effDiv.innerHTML = player.statusEffects.map(e => this.getEffectIcon(e.type)).join(' ');

        // Combat actions
        this.updateCombatActions(state);
    },

    updateCombatActions(state) {
        const container = document.getElementById('combat-actions');
        if (state.isOver) {
            container.innerHTML = '';
            if (state.outcome === 'victory') {
                const rewards = CombatEngine.getRewards();
                this.showRewards(rewards);
            } else if (state.outcome === 'defeat') {
                const btn = document.createElement('button');
                btn.className = 'combat-btn btn-flee';
                btn.textContent = 'Quay về...';
                btn.addEventListener('click', () => Game.endCombat('defeat'));
                container.appendChild(btn);
            } else {
                const btn = document.createElement('button');
                btn.className = 'combat-btn';
                btn.textContent = 'Tiếp tục';
                btn.addEventListener('click', () => Game.endCombat('fled'));
                container.appendChild(btn);
            }
            return;
        }
        container.innerHTML = `
            <button class="combat-btn btn-attack" onclick="Game.combatAction('attack')">⚔ Tấn Công</button>
            <button class="combat-btn btn-skill" onclick="Game.toggleSkillPanel()">✨ Kỹ Năng</button>
            <button class="combat-btn btn-defend" onclick="Game.combatAction('defend')">🛡 Phòng Thủ</button>
            <button class="combat-btn btn-item" onclick="Game.toggleItemPanel()">🎒 Vật Phẩm</button>
            <button class="combat-btn btn-flee" onclick="Game.combatAction('flee')">🏃 Bỏ Chạy</button>
        `;
    },

    showSkillPanel(skills, cooldowns) {
        const panel = document.getElementById('sub-panel');
        panel.innerHTML = '<div class="sub-panel-title">── Kỹ Năng ──</div>';
        for (let i = 0; i < skills.length; i++) {
            const s = skills[i];
            const cd = cooldowns[s.id] || 0;
            const btn = document.createElement('button');
            btn.className = `skill-btn ${cd > 0 ? 'disabled' : ''}`;
            btn.innerHTML = `${s.name} <small>(MP: ${s.mpCost}${cd > 0 ? ` | CD: ${cd}` : ''})</small>`;
            if (cd <= 0) btn.addEventListener('click', () => Game.combatAction('skill', i));
            panel.appendChild(btn);
        }
        const closeBtn = document.createElement('button');
        closeBtn.className = 'skill-btn close-btn';
        closeBtn.textContent = '← Quay lại';
        closeBtn.addEventListener('click', () => { panel.innerHTML = ''; });
        panel.appendChild(closeBtn);
    },

    showItemPanel(inventory) {
        const panel = document.getElementById('sub-panel');
        panel.innerHTML = '<div class="sub-panel-title">── Vật Phẩm ──</div>';
        const consumables = inventory.filter((item, _) => item.type === ItemType.CONSUMABLE);
        if (consumables.length === 0) {
            panel.innerHTML += '<div class="no-items">Không có vật phẩm sử dụng được</div>';
        }
        for (let i = 0; i < inventory.length; i++) {
            const item = inventory[i];
            if (item.type !== ItemType.CONSUMABLE) continue;
            const btn = document.createElement('button');
            btn.className = 'skill-btn';
            btn.innerHTML = `${item.name} <small>(x${item.quantity})</small>`;
            btn.addEventListener('click', () => Game.combatAction('item', i));
            panel.appendChild(btn);
        }
        const closeBtn = document.createElement('button');
        closeBtn.className = 'skill-btn close-btn';
        closeBtn.textContent = '← Quay lại';
        closeBtn.addEventListener('click', () => { panel.innerHTML = ''; });
        panel.appendChild(closeBtn);
    },

    showRewards(rewards) {
        const panel = document.getElementById('sub-panel');
        panel.innerHTML = `
            <div class="rewards-panel">
                <div class="rewards-title">🏆 Phần Thưởng</div>
                <div class="reward-line">⭐ EXP: +${rewards.exp}</div>
                <div class="reward-line">💰 Vàng: +${rewards.gold}</div>
                ${rewards.items.map(i => `<div class="reward-line">📦 ${i.name} x${i.quantity}</div>`).join('')}
                ${rewards.runes.map(r => `<div class="reward-line" style="color:${Rarity[r.rarity].color}">💎 ${r.name}</div>`).join('')}
            </div>
        `;
        const btn = document.createElement('button');
        btn.className = 'combat-btn btn-attack';
        btn.textContent = '▸ Thu thập & Tiếp tục';
        btn.addEventListener('click', () => Game.endCombat('victory', rewards));
        document.getElementById('combat-actions').appendChild(btn);
    },

    addCombatLog(entries) {
        const log = document.getElementById('combat-log');
        for (const entry of entries) {
            const div = document.createElement('div');
            div.className = `combat-entry combat-${entry.type}`;
            div.textContent = entry.text;
            log.appendChild(div);
        }
        log.scrollTop = log.scrollHeight;
    },

    getEffectIcon(type) {
        const icons = {
            poison: '🟢☠', stun: '⚡💫', burn: '🔥', freeze: '❄️', regen: '💚',
            buff_atk: '⬆⚔', buff_def: '⬆🛡', debuff_atk: '⬇⚔', debuff_def: '⬇🛡',
        };
        return `<span class="effect-icon" title="${CombatEngine.getEffectName(type)}">${icons[type] || '?'}</span>`;
    },

    // ══════════════════════════════════════════════════
    //  CHARACTER SHEET
    // ══════════════════════════════════════════════════

    renderCharacterSheet(player) {
        const world = WORLDS[player.world];
        const cls = CHARACTER_CLASSES[player.classId];
        const stats = CharacterFactory.getEffectiveStats(player);
        const expPct = (player.exp / player.expToNext * 100).toFixed(1);

        document.getElementById('cs-content').innerHTML = `
            <div class="cs-header" style="border-color:${world.color}">
                <div class="cs-name">${player.name}</div>
                <div class="cs-class" style="color:${world.color}">${world.icon} ${cls.name} — ${world.name}</div>
                <div class="cs-level">Level ${player.level}</div>
                <div class="stat-bar exp-bar"><div class="stat-bar-fill exp-fill" style="width:${expPct}%"></div>
                    <span class="stat-bar-text">EXP: ${player.exp}/${player.expToNext}</span></div>
            </div>
            <div class="cs-stats">
                <div class="stat-row"><span>❤ HP</span><span>${player.stats.currentHp}/${stats.maxHp}</span></div>
                <div class="stat-row"><span>💧 MP</span><span>${player.stats.currentMp}/${stats.maxMp}</span></div>
                <div class="stat-row"><span>⚔ ATK</span><span>${stats.attack}</span></div>
                <div class="stat-row"><span>🛡 DEF</span><span>${stats.defense}</span></div>
                <div class="stat-row"><span>💨 SPD</span><span>${stats.speed}</span></div>
                <div class="stat-row"><span>💥 Chí Mạng</span><span>${(stats.critRate * 100).toFixed(1)}% / x${stats.critDamage.toFixed(1)}</span></div>
                <div class="stat-row"><span>🌀 Tinh Thần Lực</span><span>${stats.spiritualPower || 0}</span></div>
                <div class="stat-row"><span>💰 Vàng</span><span>${player.gold}</span></div>
                <div class="stat-row"><span>🏆 PvP</span><span>${player.pvpWins}W / ${player.pvpLosses}L</span></div>
            </div>
            <div class="cs-section-title">── Trang Bị ──</div>
            <div class="cs-equipment">
                ${Object.entries(player.equipment).map(([slot, item]) =>
                    item ? `<div class="equip-slot"><span class="equip-label">${slot.toUpperCase()}</span><span style="color:${Rarity[item.rarity]?.color || '#aaa'}">${item.name}</span></div>` : ''
                ).join('')}
            </div>
            <div class="cs-section-title">── Kỹ Năng ──</div>
            <div class="cs-skills">
                ${player.skills.map(s => `<div class="skill-entry"><span class="skill-name">${s.name}</span><span class="skill-desc">${s.description}</span></div>`).join('')}
            </div>
            <div class="cs-section-title">── Runes (${player.runes.length}) ──</div>
            <div class="cs-runes">
                ${player.runes.length === 0 ? '<div class="no-items">Chưa có Rune nào</div>' :
                player.runes.map(r => `<div class="rune-entry" style="border-color:${Rarity[r.rarity]?.color || '#aaa'}"><span style="color:${Rarity[r.rarity]?.color}">${r.name}</span><small>${r.description}</small></div>`).join('')}
            </div>
        `;
    },

    // ══════════════════════════════════════════════════
    //  INVENTORY
    // ══════════════════════════════════════════════════

    renderInventory(player) {
        const container = document.getElementById('inv-content');
        container.innerHTML = '';
        if (player.inventory.length === 0) {
            container.innerHTML = '<div class="no-items">Túi đồ trống</div>';
            return;
        }
        for (const item of player.inventory) {
            const itemData = ITEMS[item.id] || item;
            const div = document.createElement('div');
            div.className = 'inv-item';
            div.style.borderColor = Rarity[item.rarity]?.color || '#555';
            div.innerHTML = `
                <div class="inv-item-name" style="color:${Rarity[item.rarity]?.color || '#aaa'}">${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}</div>
                <div class="inv-item-desc">${item.description || itemData.description || ''}</div>
                ${item.stats ? `<div class="inv-item-stats">${Object.entries(item.stats).map(([k,v]) => `${k}: +${v}`).join(', ')}</div>` : ''}
            `;
            container.appendChild(div);
        }
    },

    // ══════════════════════════════════════════════════
    //  TYPEWRITER EFFECT
    // ══════════════════════════════════════════════════

    typewrite(element, text, speed) {
        let i = 0;
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = setInterval(() => {
            element.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(this.typewriterTimer);
        }, speed);
        // Click to skip
        element.addEventListener('click', () => {
            clearInterval(this.typewriterTimer);
            element.textContent = text;
        }, { once: true });
    },

    // ══════════════════════════════════════════════════
    //  TOAST NOTIFICATION
    // ══════════════════════════════════════════════════

    showToast(message, duration = 2000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    }
};
