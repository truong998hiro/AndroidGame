/**
 * Becoming A Legend — Game Engines
 * Combat, Story, Rune, Loot systems
 */

// ══════════════════════════════════════════════════
//  UTILITY
// ══════════════════════════════════════════════════

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function chance(pct) { return Math.random() < pct; }
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ══════════════════════════════════════════════════
//  CHARACTER FACTORY
// ══════════════════════════════════════════════════

const CharacterFactory = {
    create(name, worldId, classId) {
        const cls = CHARACTER_CLASSES[classId];
        const stats = deepClone(cls.baseStats);
        stats.currentHp = stats.maxHp;
        stats.currentMp = stats.maxMp;
        const starterWeapon = ITEMS[STARTER_WEAPONS[worldId]];
        return {
            id: `player_${Date.now()}`,
            name,
            world: worldId,
            classId,
            className: cls.name,
            level: 1,
            exp: 0,
            expToNext: 100,
            stats,
            skills: cls.skills.map(sid => deepClone(SKILLS[sid])),
            runes: [],
            inventory: [
                { ...deepClone(starterWeapon), quantity: 1 },
                { ...deepClone(ITEMS.hp_potion_s), quantity: 3 },
                { ...deepClone(ITEMS.mp_potion_s), quantity: 2 },
            ],
            equipment: { weapon: deepClone(starterWeapon) },
            awakeningLevel: 1,
            currentZone: 'fusion_outskirts',
            gold: 50,
            pvpRank: 0, pvpWins: 0, pvpLosses: 0,
        };
    },

    getExpToNext(level) { return Math.floor(100 * Math.pow(1.3, level - 1)); },

    addExp(player, amount) {
        const logs = [];
        player.exp += amount;
        while (player.exp >= player.expToNext) {
            player.exp -= player.expToNext;
            player.level++;
            player.expToNext = this.getExpToNext(player.level);
            // Stat growth
            const cls = CHARACTER_CLASSES[player.classId];
            player.stats.maxHp += Math.floor(cls.baseStats.maxHp * 0.1);
            player.stats.maxMp += Math.floor(cls.baseStats.maxMp * 0.08);
            player.stats.attack += Math.max(1, Math.floor(cls.baseStats.attack * 0.08));
            player.stats.defense += Math.max(1, Math.floor(cls.baseStats.defense * 0.08));
            player.stats.speed += chance(0.5) ? 1 : 0;
            player.stats.currentHp = player.stats.maxHp;
            player.stats.currentMp = player.stats.maxMp;
            logs.push(`🎉 Thăng cấp! Level ${player.level}! Chỉ số đã được tăng cường.`);
        }
        return logs;
    },

    getEffectiveStats(player) {
        const stats = deepClone(player.stats);
        // Equipment bonuses
        for (const slot in player.equipment) {
            const item = player.equipment[slot];
            if (item && item.stats) {
                for (const key in item.stats) {
                    stats[key] = (stats[key] || 0) + item.stats[key];
                }
            }
        }
        // Rune bonuses
        for (const rune of player.runes) {
            if (rune.stats) {
                for (const key in rune.stats) {
                    stats[key] = (stats[key] || 0) + rune.stats[key];
                }
            }
        }
        return stats;
    },

    healPlayer(player, hpPct) {
        player.stats.currentHp = Math.min(player.stats.maxHp, player.stats.currentHp + Math.floor(player.stats.maxHp * hpPct));
    },

    restoreMp(player, mpPct) {
        player.stats.currentMp = Math.min(player.stats.maxMp, player.stats.currentMp + Math.floor(player.stats.maxMp * mpPct));
    }
};

// ══════════════════════════════════════════════════
//  COMBAT ENGINE
// ══════════════════════════════════════════════════

const CombatEngine = {
    state: null,

    createCombatant(source, isPlayer) {
        const stats = isPlayer ? CharacterFactory.getEffectiveStats(source) : deepClone(source.stats);
        if (!stats.currentHp) stats.currentHp = stats.maxHp;
        if (!stats.currentMp) stats.currentMp = stats.maxMp || 0;
        return {
            id: source.id, name: source.name || source.name,
            isPlayer, source: deepClone(source),
            stats, statusEffects: [],
            isDefending: false, cooldowns: {},
            skills: isPlayer ? source.skills : (source.skills || []).map(sid => typeof sid === 'string' ? deepClone(SKILLS[sid]) : deepClone(sid)),
        };
    },

    startCombat(player, enemies) {
        const playerCombatant = this.createCombatant(player, true);
        const enemyCombatants = enemies.map(e => {
            const enemy = typeof e === 'string' ? ENEMIES[e] : e;
            return this.createCombatant(enemy, false);
        });
        this.state = {
            player: playerCombatant,
            enemies: enemyCombatants,
            turn: 0, phase: 'player_turn',
            log: [], isOver: false, outcome: null,
        };
        this.state.log.push({ type: 'system', text: `── Chiến Đấu Bắt Đầu! ──` });
        for (const e of enemyCombatants) {
            this.state.log.push({ type: 'narration', text: `${e.name} (Lv.${e.source.level}) xuất hiện!` });
        }
        return this.state;
    },

    // Player actions
    playerAttack(targetIdx) {
        const target = this.state.enemies[targetIdx];
        if (!target || target.stats.currentHp <= 0) return;
        const dmg = this.calcDamage(this.state.player, target, 1.0);
        this.applyDamage(target, dmg);
        this.state.log.push({ type: 'combat_player', text: `Ngươi tấn công ${target.name} gây ${dmg.final} sát thương!${dmg.crit ? ' 💥 Chí mạng!' : ''}` });
        this.endPlayerTurn();
    },

    playerUseSkill(skillIdx, targetIdx) {
        const skill = this.state.player.skills[skillIdx];
        if (!skill) return;
        const cd = this.state.player.cooldowns[skill.id] || 0;
        if (cd > 0) { this.state.log.push({ type: 'system', text: `${skill.name} đang hồi chiêu (${cd} lượt)` }); return false; }
        if (this.state.player.stats.currentMp < skill.mpCost) { this.state.log.push({ type: 'system', text: 'Không đủ MP!' }); return false; }

        this.state.player.stats.currentMp -= skill.mpCost;
        if (skill.cooldown > 0) this.state.player.cooldowns[skill.id] = skill.cooldown;

        if (skill.target === TargetType.SELF || skill.target === TargetType.SINGLE_ALLY) {
            // Self-buff/heal
            this.applySkillEffects(skill, this.state.player, this.state.player);
            this.state.log.push({ type: 'combat_player', text: `Ngươi sử dụng ${skill.name}!` });
        } else if (skill.target === TargetType.ALL_ENEMIES) {
            this.state.log.push({ type: 'combat_player', text: `Ngươi sử dụng ${skill.name}!` });
            for (const enemy of this.state.enemies) {
                if (enemy.stats.currentHp > 0) {
                    const dmg = this.calcDamage(this.state.player, enemy, skill.damage);
                    this.applyDamage(enemy, dmg);
                    this.applySkillEffects(skill, this.state.player, enemy);
                    this.state.log.push({ type: 'combat_dmg', text: `  → ${enemy.name} nhận ${dmg.final} sát thương${dmg.crit ? ' 💥' : ''}` });
                }
            }
        } else {
            const target = this.state.enemies[targetIdx];
            if (!target || target.stats.currentHp <= 0) return false;
            const dmg = skill.damage > 0 ? this.calcDamage(this.state.player, target, skill.damage) : { final: 0, crit: false };
            if (dmg.final > 0) this.applyDamage(target, dmg);
            this.applySkillEffects(skill, this.state.player, target);
            this.state.log.push({ type: 'combat_player', text: `Ngươi sử dụng ${skill.name} lên ${target.name}${dmg.final > 0 ? ` gây ${dmg.final} sát thương` : ''}!${dmg.crit ? ' 💥' : ''}` });
        }
        this.endPlayerTurn();
        return true;
    },

    playerDefend() {
        this.state.player.isDefending = true;
        this.state.log.push({ type: 'combat_player', text: 'Ngươi tập trung phòng thủ! (DEF +50% trong lượt này)' });
        this.endPlayerTurn();
    },

    playerUseItem(itemIdx) {
        const player = this.state.player.source;
        const invItem = player.inventory[itemIdx];
        if (!invItem || invItem.type !== ItemType.CONSUMABLE) return false;
        const item = ITEMS[invItem.id] || invItem;

        if (item.effect) {
            if (item.effect.heal) {
                const healAmt = Math.floor(this.state.player.stats.maxHp * item.effect.heal);
                this.state.player.stats.currentHp = Math.min(this.state.player.stats.maxHp, this.state.player.stats.currentHp + healAmt);
                this.state.log.push({ type: 'combat_heal', text: `Sử dụng ${item.name}! HP +${healAmt}` });
            }
            if (item.effect.mana) {
                const manaAmt = Math.floor(this.state.player.stats.maxMp * item.effect.mana);
                this.state.player.stats.currentMp = Math.min(this.state.player.stats.maxMp, this.state.player.stats.currentMp + manaAmt);
                this.state.log.push({ type: 'combat_heal', text: `Sử dụng ${item.name}! MP +${manaAmt}` });
            }
            if (item.effect.buff) {
                this.state.player.statusEffects.push({ type: item.effect.buff, value: item.effect.value, duration: item.effect.duration, source: 'item' });
                this.state.log.push({ type: 'combat_buff', text: `${item.name} kích hoạt hiệu ứng!` });
            }
        }

        invItem.quantity--;
        if (invItem.quantity <= 0) player.inventory.splice(itemIdx, 1);
        this.endPlayerTurn();
        return true;
    },

    playerFlee() {
        const fleeChance = 0.3 + (this.state.player.stats.speed / 100);
        if (chance(fleeChance)) {
            this.state.log.push({ type: 'system', text: 'Ngươi đã bỏ chạy thành công!' });
            this.state.isOver = true;
            this.state.outcome = 'fled';
        } else {
            this.state.log.push({ type: 'system', text: 'Không thể bỏ chạy!' });
            this.endPlayerTurn();
        }
    },

    // Damage calculation
    calcDamage(attacker, defender, skillMult) {
        const atkStat = attacker.stats.attack;
        const defStat = defender.stats.defense * (defender.isDefending ? 1.5 : 1.0);
        // Apply buff/debuff
        let atkMod = 1, defMod = 1;
        for (const eff of attacker.statusEffects) {
            if (eff.type === StatusEffectType.BUFF_ATK) atkMod += eff.value;
            if (eff.type === StatusEffectType.DEBUFF_ATK) atkMod -= eff.value;
        }
        for (const eff of defender.statusEffects) {
            if (eff.type === StatusEffectType.BUFF_DEF) defMod += eff.value;
            if (eff.type === StatusEffectType.DEBUFF_DEF) defMod -= eff.value;
        }
        const baseDmg = atkStat * Math.max(0.5, atkMod) * skillMult;
        const reduction = defStat * Math.max(0.3, defMod);
        const isCrit = chance(attacker.stats.critRate || 0.05);
        const critMult = isCrit ? (attacker.stats.critDamage || 1.5) : 1.0;
        const variance = 0.9 + Math.random() * 0.2;
        const finalDmg = Math.max(1, Math.floor((baseDmg - reduction * 0.5) * critMult * variance));
        return { final: finalDmg, crit: isCrit };
    },

    applyDamage(target, dmg) {
        target.stats.currentHp = Math.max(0, target.stats.currentHp - dmg.final);
    },

    applySkillEffects(skill, caster, target) {
        if (!skill.effects) return;
        for (const eff of skill.effects) {
            if (eff.chance && !chance(eff.chance)) continue;
            const effectTarget = (skill.target === TargetType.SELF || skill.target === TargetType.SINGLE_ALLY) ? caster : target;
            effectTarget.statusEffects.push({
                type: eff.type, value: eff.value || 0,
                duration: eff.duration || 1, source: skill.name,
            });
            const effName = this.getEffectName(eff.type);
            this.state.log.push({ type: 'combat_effect', text: `  💠 ${effectTarget.name} bị ảnh hưởng: ${effName} (${eff.duration} lượt)` });
        }
    },

    getEffectName(type) {
        const names = {
            poison: 'Trúng Độc', stun: 'Choáng', burn: 'Bỏng', freeze: 'Đóng Băng',
            buff_atk: 'Tăng ATK', buff_def: 'Tăng DEF', debuff_atk: 'Giảm ATK',
            debuff_def: 'Giảm DEF', regen: 'Hồi Phục',
        };
        return names[type] || type;
    },

    // End player turn → enemy turns
    endPlayerTurn() {
        this.state.player.isDefending = false;
        // Check enemies dead
        this.removeDeadEnemies();
        if (this.checkWin()) return;
        // Enemy turns
        this.executeEnemyTurns();
        if (this.checkWin()) return;
        // Process status effects
        this.processStatusEffects();
        if (this.checkWin()) return;
        // Tick cooldowns
        this.tickCooldowns();
        this.state.turn++;
    },

    executeEnemyTurns() {
        for (const enemy of this.state.enemies) {
            if (enemy.stats.currentHp <= 0) continue;
            // Check stun
            const stunned = enemy.statusEffects.some(e => e.type === StatusEffectType.STUN || e.type === StatusEffectType.FREEZE);
            if (stunned) {
                this.state.log.push({ type: 'combat_enemy', text: `${enemy.name} không thể hành động!` });
                continue;
            }
            // Simple AI: use skill if available, else attack
            const usableSkills = enemy.skills.filter(s => {
                const cd = enemy.cooldowns[s.id] || 0;
                return cd <= 0 && s.type === SkillType.ACTIVE && s.damage > 0;
            });
            if (usableSkills.length > 0 && chance(0.4)) {
                const skill = pick(usableSkills);
                if (skill.cooldown > 0) enemy.cooldowns[skill.id] = skill.cooldown;
                if (skill.target === TargetType.ALL_ENEMIES || skill.target === TargetType.SINGLE_ENEMY) {
                    const dmg = this.calcDamage(enemy, this.state.player, skill.damage);
                    this.applyDamage(this.state.player, dmg);
                    this.applySkillEffects(skill, enemy, this.state.player);
                    this.state.log.push({ type: 'combat_enemy', text: `${enemy.name} sử dụng ${skill.name} gây ${dmg.final} sát thương!${dmg.crit ? ' 💥' : ''}` });
                }
            } else {
                const dmg = this.calcDamage(enemy, this.state.player, 1.0);
                this.applyDamage(this.state.player, dmg);
                this.state.log.push({ type: 'combat_enemy', text: `${enemy.name} tấn công ngươi gây ${dmg.final} sát thương!${dmg.crit ? ' 💥' : ''}` });
            }
        }
    },

    processStatusEffects() {
        const allCombatants = [this.state.player, ...this.state.enemies.filter(e => e.stats.currentHp > 0)];
        for (const c of allCombatants) {
            const remaining = [];
            for (const eff of c.statusEffects) {
                // Tick damage effects
                if (eff.type === StatusEffectType.POISON || eff.type === StatusEffectType.BURN) {
                    const dot = Math.max(1, Math.floor(c.stats.maxHp * (eff.value || 0.05)));
                    c.stats.currentHp = Math.max(0, c.stats.currentHp - dot);
                    this.state.log.push({ type: 'combat_effect', text: `  🔥 ${c.name} nhận ${dot} sát thương từ ${this.getEffectName(eff.type)}` });
                }
                if (eff.type === StatusEffectType.REGEN) {
                    const heal = Math.max(1, Math.floor(c.stats.maxHp * (eff.value || 0.1)));
                    c.stats.currentHp = Math.min(c.stats.maxHp, c.stats.currentHp + heal);
                    this.state.log.push({ type: 'combat_heal', text: `  💚 ${c.name} hồi phục ${heal} HP` });
                }
                eff.duration--;
                if (eff.duration > 0) remaining.push(eff);
            }
            c.statusEffects = remaining;
        }
    },

    tickCooldowns() {
        const tickCD = (combatant) => {
            for (const key in combatant.cooldowns) {
                if (combatant.cooldowns[key] > 0) combatant.cooldowns[key]--;
            }
        };
        tickCD(this.state.player);
        for (const e of this.state.enemies) tickCD(e);
    },

    removeDeadEnemies() {
        for (const e of this.state.enemies) {
            if (e.stats.currentHp <= 0 && !e._dead) {
                e._dead = true;
                this.state.log.push({ type: 'combat_kill', text: `💀 ${e.name} đã bị tiêu diệt!` });
            }
        }
    },

    checkWin() {
        const allDead = this.state.enemies.every(e => e.stats.currentHp <= 0);
        if (allDead) {
            this.state.isOver = true;
            this.state.outcome = 'victory';
            this.state.log.push({ type: 'system', text: '✦ CHIẾN THẮNG! ✦' });
            return true;
        }
        if (this.state.player.stats.currentHp <= 0) {
            this.state.isOver = true;
            this.state.outcome = 'defeat';
            this.state.log.push({ type: 'system', text: '✖ BẠI TRẬN... ✖' });
            return true;
        }
        return false;
    },

    getRewards() {
        if (this.state.outcome !== 'victory') return null;
        let totalExp = 0, totalGold = 0;
        const items = [], runes = [];
        for (const e of this.state.enemies) {
            const src = e.source;
            totalExp += src.expReward || 0;
            totalGold += src.goldReward || 0;
            if (src.loot) {
                for (const drop of src.loot) {
                    if (chance(drop.rate)) {
                        const item = ITEMS[drop.itemId];
                        if (item) items.push({ ...deepClone(item), quantity: rand(1, drop.max || 1) });
                    }
                }
            }
            // Chance to drop rune
            if (chance(0.3)) {
                const worldId = src.world || pick(Object.keys(WORLDS));
                const rarity = this.rollRarity();
                const rune = generateRune(worldId, rarity);
                if (rune) runes.push(rune);
            }
        }
        return { exp: totalExp, gold: totalGold, items, runes };
    },

    rollRarity() {
        const roll = Math.random() * 100;
        let acc = 0;
        for (const [key, val] of Object.entries(Rarity)) {
            acc += val.weight;
            if (roll < acc) return key;
        }
        return 'COMMON';
    }
};

// ══════════════════════════════════════════════════
//  BOT AI
// ══════════════════════════════════════════════════

const BotAI = {
    NAME_PREFIXES: ['Thiên', 'Long', 'Hắc', 'Bạch', 'Hỏa', 'Băng', 'Lôi', 'Phong', 'Kim', 'Thủy', 'Huyết', 'U', 'Minh', 'Tử', 'Cương'],
    NAME_SUFFIXES: ['Vân', 'Phong', 'Kiếm', 'Lôi', 'Hà', 'Dạ', 'Nhan', 'Tuyết', 'Y', 'Linh', 'Hồn', 'Ma', 'Thần', 'Long', 'Hổ'],
    TITLES: ['Kiếm Thánh', 'Ma Vương', 'Huyết Đế', 'Phong Thần', 'Băng Hậu', 'Lôi Đế', 'Quỷ Tu', 'Tiên Nữ', 'Thiên Tài', 'Cuồng Nhân'],

    generateName() {
        return pick(this.NAME_PREFIXES) + ' ' + pick(this.NAME_SUFFIXES);
    },

    generateBot(playerLevel, difficulty) {
        const levelOffset = { easy: -1, normal: 0, hard: 2 };
        const level = Math.max(1, playerLevel + (levelOffset[difficulty] || 0));
        const worldId = pick(Object.keys(WORLDS));
        const worldClasses = Object.values(CHARACTER_CLASSES).filter(c => c.world === worldId);
        const cls = pick(worldClasses);
        const statMult = { easy: 0.8, normal: 1.0, hard: 1.3 }[difficulty] || 1.0;

        const bot = CharacterFactory.create(this.generateName(), worldId, cls.id);
        bot.level = level;
        bot.name = `${bot.name} "${pick(this.TITLES)}"`;
        // Scale stats
        for (let i = 1; i < level; i++) {
            bot.stats.maxHp += Math.floor(cls.baseStats.maxHp * 0.1);
            bot.stats.maxMp += Math.floor(cls.baseStats.maxMp * 0.08);
            bot.stats.attack += Math.max(1, Math.floor(cls.baseStats.attack * 0.08));
            bot.stats.defense += Math.max(1, Math.floor(cls.baseStats.defense * 0.08));
        }
        bot.stats.maxHp = Math.floor(bot.stats.maxHp * statMult);
        bot.stats.attack = Math.floor(bot.stats.attack * statMult);
        bot.stats.defense = Math.floor(bot.stats.defense * statMult);
        bot.stats.currentHp = bot.stats.maxHp;
        bot.stats.currentMp = bot.stats.maxMp;

        // Add random runes
        const runeCount = { easy: 0, normal: 1, hard: 3 }[difficulty] || 0;
        for (let i = 0; i < runeCount; i++) {
            const rune = generateRune(worldId, CombatEngine.rollRarity());
            if (rune) bot.runes.push(rune);
        }
        return bot;
    },

    // Bot combat decisions
    chooseAction(bot, state, difficulty) {
        const combatant = state.enemies[0]; // Bot is always enemy[0] in PvP
        if (difficulty === 'easy') return this.easyStrategy(combatant);
        if (difficulty === 'hard') return this.hardStrategy(combatant, state);
        return this.normalStrategy(combatant, state);
    },

    easyStrategy(bot) {
        // Mostly just attack
        if (chance(0.8)) return { type: 'attack' };
        const usable = bot.skills.filter(s => s.type === SkillType.ACTIVE && (bot.cooldowns[s.id] || 0) <= 0);
        if (usable.length > 0) return { type: 'skill', skill: pick(usable) };
        return { type: 'attack' };
    },

    normalStrategy(bot, state) {
        const hpPct = bot.stats.currentHp / bot.stats.maxHp;
        const usable = bot.skills.filter(s => s.type === SkillType.ACTIVE && (bot.cooldowns[s.id] || 0) <= 0 && bot.stats.currentMp >= (s.mpCost || 0));

        // Heal if low HP
        if (hpPct < 0.3) {
            const heals = usable.filter(s => s.effects && s.effects.some(e => e.type === StatusEffectType.REGEN));
            if (heals.length > 0) return { type: 'skill', skill: pick(heals) };
            if (chance(0.5)) return { type: 'defend' };
        }
        // Use damage skill
        if (usable.length > 0 && chance(0.5)) {
            const dmgSkills = usable.filter(s => s.damage > 0);
            if (dmgSkills.length > 0) return { type: 'skill', skill: pick(dmgSkills) };
        }
        return { type: 'attack' };
    },

    hardStrategy(bot, state) {
        const hpPct = bot.stats.currentHp / bot.stats.maxHp;
        const usable = bot.skills.filter(s => s.type === SkillType.ACTIVE && (bot.cooldowns[s.id] || 0) <= 0 && bot.stats.currentMp >= (s.mpCost || 0));

        // Always buff if no buffs active
        const hasBuffs = bot.statusEffects.some(e => e.type.startsWith('buff'));
        if (!hasBuffs) {
            const buffs = usable.filter(s => s.effects && s.effects.some(e => e.type.startsWith('buff')));
            if (buffs.length > 0) return { type: 'skill', skill: pick(buffs) };
        }
        // Heal if low HP
        if (hpPct < 0.4) {
            const heals = usable.filter(s => s.effects && s.effects.some(e => e.type === StatusEffectType.REGEN));
            if (heals.length > 0) return { type: 'skill', skill: pick(heals) };
            return { type: 'defend' };
        }
        // Use strongest damage skill
        const dmgSkills = usable.filter(s => s.damage > 0).sort((a, b) => b.damage - a.damage);
        if (dmgSkills.length > 0) return { type: 'skill', skill: dmgSkills[0] };
        return { type: 'attack' };
    }
};

// ══════════════════════════════════════════════════
//  RUNE SYSTEM
// ══════════════════════════════════════════════════

const RuneSystem = {
    RARITY_ORDER: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'],

    canFuse(runes) {
        if (runes.length !== 3) return false;
        const rarity = runes[0].rarity;
        const world = runes[0].world;
        return runes.every(r => r.rarity === rarity && r.world === world) && rarity !== 'MYTHIC';
    },

    fuse(runes) {
        if (!this.canFuse(runes)) return null;
        const currentIdx = this.RARITY_ORDER.indexOf(runes[0].rarity);
        const nextRarity = this.RARITY_ORDER[currentIdx + 1];
        return generateRune(runes[0].world, nextRarity);
    },

    getTotalBonus(runes) {
        const bonus = {};
        for (const rune of runes) {
            if (rune.stats) {
                for (const key in rune.stats) {
                    bonus[key] = (bonus[key] || 0) + rune.stats[key];
                }
            }
        }
        return bonus;
    }
};

// ══════════════════════════════════════════════════
//  LOOT SYSTEM
// ══════════════════════════════════════════════════

const LootSystem = {
    rollLoot(lootTable) {
        const drops = [];
        for (const entry of lootTable) {
            if (chance(entry.rate)) {
                const item = ITEMS[entry.itemId];
                if (item) drops.push({ ...deepClone(item), quantity: rand(1, entry.max || 1) });
            }
        }
        return drops;
    },

    rollRune(worldId) {
        const roll = Math.random() * 100;
        let acc = 0;
        let rarity = 'COMMON';
        for (const [key, val] of Object.entries(Rarity)) {
            acc += val.weight;
            if (roll < acc) { rarity = key; break; }
        }
        return generateRune(worldId, rarity);
    }
};

// ══════════════════════════════════════════════════
//  SAVE / LOAD
// ══════════════════════════════════════════════════

const SaveSystem = {
    SAVE_KEY: 'bal_save_v1',

    save(gameState) {
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(gameState));
            return true;
        } catch (e) { console.error('Save failed:', e); return false; }
    },

    load() {
        try {
            const data = localStorage.getItem(this.SAVE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) { console.error('Load failed:', e); return null; }
    },

    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    }
};
