/**
 * Becoming A Legend — Main Game Controller
 */

const Game = {
    player: null,
    currentScene: null,
    selectedWorld: null,
    selectedClass: null,
    combatState: null,
    pvpDifficulty: null,

    // ══════════════════════════════════════════════════
    //  INITIALIZATION
    // ══════════════════════════════════════════════════

    init() {
        UI.initMainMenu();
        UI.showScreen('main-menu');
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('btn-new-game').addEventListener('click', () => this.newGame());
        document.getElementById('btn-continue').addEventListener('click', () => this.continueGame());
        document.getElementById('btn-name-confirm').addEventListener('click', () => this.confirmName());
        document.getElementById('btn-back-world').addEventListener('click', () => {
            UI.showScreen('character-creation');
            this.creationStep = 'world';
        });

        // Bottom nav
        document.getElementById('nav-story').addEventListener('click', () => UI.showScreen('game-screen'));
        document.getElementById('nav-character').addEventListener('click', () => {
            UI.renderCharacterSheet(this.player);
            UI.showScreen('character-sheet');
        });
        document.getElementById('nav-inventory').addEventListener('click', () => {
            UI.renderInventory(this.player);
            UI.showScreen('inventory-screen');
        });
        document.getElementById('nav-save').addEventListener('click', () => this.saveGame());

        // Back buttons
        document.getElementById('btn-back-game').addEventListener('click', () => UI.showScreen('game-screen'));
        document.getElementById('btn-back-game-2').addEventListener('click', () => UI.showScreen('game-screen'));

        // Enter key for name input
        document.getElementById('char-name-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.confirmName();
        });
    },

    // ══════════════════════════════════════════════════
    //  GAME FLOW
    // ══════════════════════════════════════════════════

    newGame() {
        UI.showScreen('character-creation');
        UI.renderWorldSelection();
    },

    continueGame() {
        const save = SaveSystem.load();
        if (save) {
            this.player = save.player;
            this.currentScene = save.currentScene || 'enter_fusion_domain';
            UI.showScreen('game-screen');
            this.showScene(this.currentScene);
            UI.showToast('Đã tải game!');
        }
    },

    selectWorld(worldId) {
        this.selectedWorld = worldId;
        UI.showScreen('class-selection');
        UI.renderClassSelection(worldId);
    },

    selectClass(classId) {
        this.selectedClass = classId;
        UI.showScreen('name-input');
        document.getElementById('char-name-input').focus();
    },

    confirmName() {
        const name = document.getElementById('char-name-input').value.trim();
        if (!name) {
            UI.showToast('Hãy nhập tên nhân vật!');
            return;
        }
        // Create character
        this.player = CharacterFactory.create(name, this.selectedWorld, this.selectedClass);
        this.currentScene = 'intro';

        // Show game screen and start story
        UI.showScreen('game-screen');
        UI.clearStoryLog();
        document.getElementById('bottom-nav').style.display = 'flex';
        this.showScene('intro');
        this.saveGame();
    },

    // ══════════════════════════════════════════════════
    //  STORY SYSTEM
    // ══════════════════════════════════════════════════

    showScene(sceneId) {
        this.currentScene = sceneId;
        const scene = STORY_SCENES[sceneId];
        if (!scene) return;

        UI.clearStoryLog();
        const zone = ZONES[this.player?.currentZone];
        UI.updateLocationBar(zone ? `📍 ${zone.name}` : '📍 Thánh Vực Dung Hợp');

        // Add scene text with animation
        UI.addStoryEntries(scene.text, () => {
            // Handle dynamic choices
            let choices = [...scene.choices];
            if (sceneId === 'choose_world') {
                choices = Object.entries(WORLDS).map(([id, w]) => ({
                    text: `${w.icon} ${w.name}`, nextScene: 'world_selected', action: 'select_world', data: id
                }));
            }
            if (sceneId === 'world_selected') {
                const classes = Object.values(CHARACTER_CLASSES).filter(c => c.world === this.selectedWorld || c.world === this.player?.world);
                choices = classes.map(c => ({
                    text: `▸ ${c.name} — ${c.description.substring(0, 50)}...`, nextScene: 'awakening_complete', action: 'select_class', data: c.id
                }));
            }
            UI.renderChoices(choices);
        });
    },

    handleChoice(choice) {
        // Handle actions
        if (choice.action) {
            switch (choice.action) {
                case 'select_world':
                    this.selectedWorld = choice.data;
                    this.player.world = choice.data;
                    break;
                case 'select_class':
                    // Already created character, this is for story flow only
                    break;
                case 'start_exploration':
                    this.player.currentZone = 'fusion_outskirts';
                    break;
                case 'random_encounter':
                    this.startRandomEncounter();
                    return;
                case 'explore_careful':
                    this.exploreCareful();
                    return;
                case 'pvp_bot_easy':
                    this.startPvP('easy');
                    return;
                case 'pvp_bot_normal':
                    this.startPvP('normal');
                    return;
                case 'pvp_bot_hard':
                    this.startPvP('hard');
                    return;
                case 'pvp_online_placeholder':
                    UI.showToast('Phiên bản Online đang phát triển! 🚧');
                    return;
                case 'open_character_sheet':
                    UI.renderCharacterSheet(this.player);
                    UI.showScreen('character-sheet');
                    return;
                case 'open_pvp':
                    break;
            }
        }

        if (choice.nextScene) {
            this.showScene(choice.nextScene);
        }
        this.saveGame();
    },

    // ══════════════════════════════════════════════════
    //  EXPLORATION
    // ══════════════════════════════════════════════════

    startRandomEncounter() {
        const zone = ZONES[this.player.currentZone] || ZONES.fusion_outskirts;
        const enemyId = pick(zone.enemies);
        const enemy = ENEMIES[enemyId];
        if (!enemy) return;

        // Scale enemy slightly
        const scaledEnemy = deepClone(enemy);
        const levelDiff = Math.max(0, this.player.level - enemy.level);
        if (levelDiff > 0) {
            scaledEnemy.stats.maxHp += levelDiff * 10;
            scaledEnemy.stats.currentHp = scaledEnemy.stats.maxHp;
            scaledEnemy.stats.attack += levelDiff;
            scaledEnemy.stats.defense += Math.floor(levelDiff * 0.5);
        }

        this.startCombat([scaledEnemy]);
    },

    exploreCareful() {
        const events = [
            () => {
                UI.clearStoryLog();
                UI.addStoryEntry({ type: 'narration', text: 'Ngươi thận trọng quan sát xung quanh...' });
                setTimeout(() => {
                    if (chance(0.5)) {
                        // Find item
                        const items = ['hp_potion_s', 'mp_potion_s', 'hp_potion_s'];
                        const itemId = pick(items);
                        const item = ITEMS[itemId];
                        this.addItemToInventory(itemId);
                        UI.addStoryEntry({ type: 'system', text: `📦 Phát hiện ${item.name}!` }, true);
                    } else if (chance(0.3)) {
                        // Find gold
                        const gold = rand(10, 30);
                        this.player.gold += gold;
                        UI.addStoryEntry({ type: 'system', text: `💰 Tìm thấy ${gold} vàng!` }, true);
                    } else {
                        UI.addStoryEntry({ type: 'narration', text: 'Không phát hiện gì đặc biệt. Vùng đất yên tĩnh một cách kỳ lạ...' }, true);
                    }
                    UI.renderChoices(STORY_SCENES.exploration_start.choices);
                }, 1000);
            },
        ];
        pick(events)();
    },

    // ══════════════════════════════════════════════════
    //  COMBAT
    // ══════════════════════════════════════════════════

    startCombat(enemies, isPvP = false) {
        this.pvpDifficulty = null;
        this.combatState = CombatEngine.startCombat(this.player, enemies);
        UI.showScreen('combat-screen');
        UI.initCombatUI(this.combatState);
        UI.addCombatLog(this.combatState.log);
        this.combatState.log = [];
    },

    startPvP(difficulty) {
        this.pvpDifficulty = difficulty;
        const bot = BotAI.generateBot(this.player.level, difficulty);
        // Convert bot to enemy format
        const botEnemy = {
            id: bot.id, name: bot.name, level: bot.level,
            world: bot.world, isBoss: false,
            stats: { ...bot.stats },
            skills: bot.skills.map(s => s.id || s),
            expReward: Math.floor(50 * (difficulty === 'hard' ? 2 : difficulty === 'normal' ? 1.5 : 1)),
            goldReward: Math.floor(30 * (difficulty === 'hard' ? 2 : difficulty === 'normal' ? 1.5 : 1)),
            loot: [],
        };
        // Add rune drop chance in PvP
        if (chance(0.4)) {
            const rarity = CombatEngine.rollRarity();
            botEnemy._pvpRuneDrop = generateRune(bot.world, rarity);
        }
        this.startCombat([botEnemy], true);
    },

    combatAction(type, param) {
        if (this.combatState?.isOver) return;

        // Check stun
        const stunned = this.combatState.player.statusEffects.some(e =>
            e.type === StatusEffectType.STUN || e.type === StatusEffectType.FREEZE);
        if (stunned && type !== 'flee') {
            CombatEngine.state.log.push({ type: 'system', text: 'Ngươi bị khống chế, không thể hành động!' });
            CombatEngine.endPlayerTurn();
            UI.addCombatLog(this.combatState.log);
            this.combatState.log = [];
            UI.updateCombatUI(this.combatState);
            return;
        }

        const prevLogLen = this.combatState.log.length;

        switch (type) {
            case 'attack':
                // Auto-target first alive enemy
                const targetIdx = this.combatState.enemies.findIndex(e => e.stats.currentHp > 0);
                CombatEngine.playerAttack(targetIdx);
                break;
            case 'skill':
                const skill = this.combatState.player.skills[param];
                if (skill.target === TargetType.ALL_ENEMIES || skill.target === TargetType.SELF) {
                    CombatEngine.playerUseSkill(param, 0);
                } else {
                    const tgt = this.combatState.enemies.findIndex(e => e.stats.currentHp > 0);
                    CombatEngine.playerUseSkill(param, tgt);
                }
                break;
            case 'defend':
                CombatEngine.playerDefend();
                break;
            case 'item':
                CombatEngine.playerUseItem(param);
                break;
            case 'flee':
                CombatEngine.playerFlee();
                break;
        }

        // Show new log entries
        UI.addCombatLog(this.combatState.log);
        this.combatState.log = [];
        UI.updateCombatUI(this.combatState);
        document.getElementById('sub-panel').innerHTML = '';
    },

    toggleSkillPanel() {
        UI.showSkillPanel(this.combatState.player.skills, this.combatState.player.cooldowns);
    },

    toggleItemPanel() {
        UI.showItemPanel(this.player.inventory);
    },

    endCombat(outcome, rewards) {
        // Sync HP/MP back to player
        if (this.combatState) {
            this.player.stats.currentHp = Math.max(1, this.combatState.player.stats.currentHp);
            this.player.stats.currentMp = this.combatState.player.stats.currentMp;
        }

        if (outcome === 'victory' && rewards) {
            const levelLogs = CharacterFactory.addExp(this.player, rewards.exp);
            this.player.gold += rewards.gold;
            for (const item of rewards.items) this.addItemToInventory(item.id, item.quantity);
            for (const rune of rewards.runes) this.player.runes.push(rune);

            if (this.pvpDifficulty) {
                this.player.pvpWins++;
                this.player.pvpRank += { easy: 10, normal: 25, hard: 50 }[this.pvpDifficulty] || 10;
            }

            // Show level up messages
            for (const msg of levelLogs) UI.showToast(msg, 3000);
        } else if (outcome === 'defeat') {
            this.player.stats.currentHp = Math.floor(this.player.stats.maxHp * 0.5);
            this.player.stats.currentMp = Math.floor(this.player.stats.maxMp * 0.5);
            if (this.pvpDifficulty) {
                this.player.pvpLosses++;
                this.player.pvpRank = Math.max(0, this.player.pvpRank - 10);
            }
        }

        this.combatState = null;
        this.pvpDifficulty = null;
        UI.showScreen('game-screen');
        this.showScene(outcome === 'defeat' ? 'defeat' : (this.pvpDifficulty ? 'pvp_intro' : 'victory'));
        this.saveGame();
    },

    // ══════════════════════════════════════════════════
    //  INVENTORY HELPERS
    // ══════════════════════════════════════════════════

    addItemToInventory(itemId, quantity = 1) {
        const existing = this.player.inventory.find(i => i.id === itemId);
        if (existing && (ITEMS[itemId]?.type === ItemType.CONSUMABLE || ITEMS[itemId]?.type === ItemType.MATERIAL)) {
            existing.quantity += quantity;
        } else {
            const item = ITEMS[itemId];
            if (item) this.player.inventory.push({ ...deepClone(item), quantity });
        }
    },

    // ══════════════════════════════════════════════════
    //  SAVE / LOAD
    // ══════════════════════════════════════════════════

    saveGame() {
        if (!this.player) return;
        SaveSystem.save({
            player: this.player,
            currentScene: this.currentScene,
            timestamp: Date.now(),
        });
        UI.showToast('💾 Đã lưu!');
    },
};

// ══════════════════════════════════════════════════
//  STARTUP
// ══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => Game.init());
