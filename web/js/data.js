/**
 * Becoming A Legend — Game Data
 * All game content: worlds, classes, skills, enemies, items, runes, story scenes
 */

// ══════════════════════════════════════════════════
//  ENUMS & CONSTANTS
// ══════════════════════════════════════════════════

const Rarity = {
    COMMON: { name: 'Phổ Thông', color: '#aaaaaa', weight: 50 },
    UNCOMMON: { name: 'Không Phổ Biến', color: '#1eff00', weight: 25 },
    RARE: { name: 'Hiếm', color: '#0070dd', weight: 15 },
    EPIC: { name: 'Sử Thi', color: '#a335ee', weight: 7 },
    LEGENDARY: { name: 'Huyền Thoại', color: '#ff8000', weight: 2.5 },
    MYTHIC: { name: 'Thần Thoại', color: '#e6cc80', weight: 0.5 },
};

const SkillType = { ACTIVE: 'active', PASSIVE: 'passive' };
const TargetType = {
    SELF: 'self', SINGLE_ENEMY: 'single_enemy', ALL_ENEMIES: 'all_enemies',
    SINGLE_ALLY: 'single_ally', ALL_ALLIES: 'all_allies'
};
const ItemType = { WEAPON: 'weapon', ARMOR: 'armor', ACCESSORY: 'accessory', CONSUMABLE: 'consumable', MATERIAL: 'material' };
const EquipSlot = { WEAPON: 'weapon', HEAD: 'head', BODY: 'body', LEGS: 'legs', ACCESSORY_1: 'accessory_1', ACCESSORY_2: 'accessory_2' };
const StatusEffectType = { POISON: 'poison', STUN: 'stun', BURN: 'burn', FREEZE: 'freeze', BUFF_ATK: 'buff_atk', BUFF_DEF: 'buff_def', DEBUFF_ATK: 'debuff_atk', DEBUFF_DEF: 'debuff_def', REGEN: 'regen' };

// ══════════════════════════════════════════════════
//  WORLDS
// ══════════════════════════════════════════════════

const WORLDS = {
    TECHNOLOGY: {
        id: 'TECHNOLOGY', name: 'Công Nghệ Thế Giới',
        subtitle: 'Trái Đất — Kỷ Nguyên Cyberpunk',
        description: 'Kỷ nguyên tương lai, tài nguyên cạn kiệt, bị thống trị bởi các Siêu Tập Đoàn. Hoàn toàn vắng bóng linh khí hay phép thuật.',
        resource: 'Lõi Năng Lượng Nhân Tạo',
        color: '#00d4ff', icon: '⚙️',
    },
    CULTIVATION: {
        id: 'CULTIVATION', name: 'Thế Giới Tu Tiên',
        subtitle: 'Đại Lục Mênh Mông — Vạn Tông Tranh Hùng',
        description: 'Đại lục mênh mông với vô số Tông Môn, Thánh Địa. Cá lớn nuốt cá bé, tuân theo cảnh giới khắt khe.',
        resource: 'Linh Thạch',
        color: '#00ff88', icon: '🏔️',
    },
    MUTANT: {
        id: 'MUTANT', name: 'Thế Giới Dị Nhân',
        subtitle: 'Hành Tinh Ô Nhiễm — Hậu Tận Thế',
        description: 'Hậu tận thế, chuỗi gen sinh vật bị bẻ cong tạo ra các Dị năng. Quái vật đột biến lộng hành.',
        resource: 'Mã Gen (DNA Fragments)',
        color: '#ff4444', icon: '🧬',
    },
    DIVINE: {
        id: 'DIVINE', name: 'Thế Giới Chư Thần',
        subtitle: 'Vương Quốc Trên Mây — Chín Tầng Thiên',
        description: 'Những vương quốc lơ lửng trên chín tầng mây. Quyền lực dựa trên Tín Ngưỡng. Các thần không ngừng giao chiến.',
        resource: 'Tinh Thể Tín Ngưỡng',
        color: '#ffd700', icon: '⚡',
    },
    ENERGY: {
        id: 'ENERGY', name: 'Năng Lượng Thế Giới',
        subtitle: 'Thế Giới Nguyên Thủy — Bão Nguyên Tố',
        description: 'Thế giới hoang sơ không có nền văn minh. Chỉ có bão nguyên tố khổng lồ và Cự Thú Năng Lượng.',
        resource: 'Lõi Tinh Thể Nguyên Tố',
        color: '#ff6600', icon: '🌋',
    },
    ELDRITCH: {
        id: 'ELDRITCH', name: 'Quỷ Dị Thế Giới',
        subtitle: 'Bóng Tối — Sương Mù Vĩnh Hằng',
        description: 'Thế giới của bóng tối và sương mù. Bầu trời huyết dụ. Mọi thứ vận hành theo Quy Tắc Sinh Tồn quái gở.',
        resource: 'Cấm Vật (Vật Phẩm Bị Nguyền)',
        color: '#8b00ff', icon: '👁️',
    },
    SPIRIT: {
        id: 'SPIRIT', name: 'Tinh Thần Thế Giới',
        subtitle: 'Cõi Mộng Cảnh — Ý Niệm & Linh Hồn',
        description: 'Cõi mộng cảnh, nơi hội tụ ý niệm, ký ức và linh hồn. Không có không gian vật lý cố định.',
        resource: 'Hồn Phách',
        color: '#cc99ff', icon: '🌀',
    }
};

// ══════════════════════════════════════════════════
//  SKILLS (defined first, referenced by classes)
// ══════════════════════════════════════════════════

const SKILLS = {
    // ── Công Nghệ ──
    plasma_shot: { id: 'plasma_shot', name: 'Phát Bắn Plasma', description: 'Bắn một phát plasma năng lượng cao', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.8, mpCost: 15, cooldown: 0, effects: [] },
    emp_blast: { id: 'emp_blast', name: 'Xung Điện Từ', description: 'Gây sốc điện từ, làm choáng mục tiêu', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.2, mpCost: 20, cooldown: 2, effects: [{ type: StatusEffectType.STUN, chance: 0.6, duration: 1 }] },
    nano_repair: { id: 'nano_repair', name: 'Sửa Chữa Nano', description: 'Kích hoạt nano bot phục hồi cơ thể', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 25, cooldown: 3, effects: [{ type: StatusEffectType.REGEN, value: 0.2, duration: 3 }] },
    overcharge: { id: 'overcharge', name: 'Quá Tải Năng Lượng', description: 'Tăng sức tấn công tạm thời', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 20, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_ATK, value: 0.5, duration: 3 }] },
    hack_defense: { id: 'hack_defense', name: 'Hack Phòng Thủ', description: 'Phá vỡ hệ thống phòng thủ của mục tiêu', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 0.5, mpCost: 18, cooldown: 2, effects: [{ type: StatusEffectType.DEBUFF_DEF, value: 0.3, duration: 3 }] },
    artillery_strike: { id: 'artillery_strike', name: 'Pháo Kích Quỹ Đạo', description: 'Gọi hỏa lực từ vệ tinh, tấn công diện rộng', type: SkillType.ACTIVE, target: TargetType.ALL_ENEMIES, damage: 1.4, mpCost: 35, cooldown: 4, effects: [] },

    // ── Tu Tiên ──
    sword_qi: { id: 'sword_qi', name: 'Kiếm Khí', description: 'Phóng kiếm khí chém xuyên hư không', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 2.0, mpCost: 15, cooldown: 0, effects: [] },
    ten_thousand_swords: { id: 'ten_thousand_swords', name: 'Vạn Kiếm Quy Tông', description: 'Triệu hồi vạn kiếm tấn công tất cả kẻ địch', type: SkillType.ACTIVE, target: TargetType.ALL_ENEMIES, damage: 1.6, mpCost: 40, cooldown: 4, effects: [] },
    spirit_shield: { id: 'spirit_shield', name: 'Linh Khí Hộ Thể', description: 'Bọc linh khí tăng phòng thủ', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 20, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_DEF, value: 0.5, duration: 3 }] },
    pill_refine: { id: 'pill_refine', name: 'Luyện Đan', description: 'Luyện đan dược hồi phục sinh lực', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 30, cooldown: 4, effects: [{ type: StatusEffectType.REGEN, value: 0.25, duration: 3 }] },
    poison_mist: { id: 'poison_mist', name: 'Độc Vụ Thuật', description: 'Phun sương độc vào kẻ địch', type: SkillType.ACTIVE, target: TargetType.ALL_ENEMIES, damage: 0.8, mpCost: 25, cooldown: 3, effects: [{ type: StatusEffectType.POISON, value: 0.1, duration: 3, chance: 0.7 }] },
    formation_array: { id: 'formation_array', name: 'Trận Pháp', description: 'Bày trận pháp tăng sức mạnh bản thân', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 25, cooldown: 4, effects: [{ type: StatusEffectType.BUFF_ATK, value: 0.4, duration: 3 }, { type: StatusEffectType.BUFF_DEF, value: 0.3, duration: 3 }] },

    // ── Dị Nhân ──
    gene_burst: { id: 'gene_burst', name: 'Bùng Nổ Gen', description: 'Kích hoạt đột biến gen gây sát thương khủng', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 2.2, mpCost: 20, cooldown: 1, effects: [] },
    mutation_armor: { id: 'mutation_armor', name: 'Giáp Đột Biến', description: 'Da biến đổi thành giáp cứng', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 15, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_DEF, value: 0.6, duration: 2 }] },
    acid_spit: { id: 'acid_spit', name: 'Phun Axit', description: 'Phun dịch axit ăn mòn', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.0, mpCost: 15, cooldown: 2, effects: [{ type: StatusEffectType.BURN, value: 0.08, duration: 3, chance: 0.8 }] },
    regeneration: { id: 'regeneration', name: 'Tái Sinh', description: 'Kích hoạt khả năng tái sinh tế bào', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 25, cooldown: 4, effects: [{ type: StatusEffectType.REGEN, value: 0.3, duration: 3 }] },
    predator_sense: { id: 'predator_sense', name: 'Giác Quan Săn Mồi', description: 'Tăng bản năng chiến đấu', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 15, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_ATK, value: 0.4, duration: 3 }] },
    toxin_claws: { id: 'toxin_claws', name: 'Móng Vuốt Độc', description: 'Tấn công bằng móng vuốt tẩm độc', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.5, mpCost: 18, cooldown: 1, effects: [{ type: StatusEffectType.POISON, value: 0.06, duration: 3, chance: 0.6 }] },

    // ── Chư Thần ──
    holy_smite: { id: 'holy_smite', name: 'Thánh Phạt', description: 'Triệu hồi ánh sáng thánh thiêng giáng xuống kẻ thù', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 2.0, mpCost: 20, cooldown: 1, effects: [] },
    divine_blessing: { id: 'divine_blessing', name: 'Thần Ân', description: 'Nhận phước lành từ thần linh, hồi phục toàn diện', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 30, cooldown: 4, effects: [{ type: StatusEffectType.REGEN, value: 0.25, duration: 3 }, { type: StatusEffectType.BUFF_DEF, value: 0.3, duration: 3 }] },
    wrath_of_god: { id: 'wrath_of_god', name: 'Thần Nộ', description: 'Giải phóng cơn thịnh nộ thiêng liêng lên tất cả kẻ địch', type: SkillType.ACTIVE, target: TargetType.ALL_ENEMIES, damage: 1.5, mpCost: 35, cooldown: 4, effects: [{ type: StatusEffectType.DEBUFF_DEF, value: 0.2, duration: 2 }] },
    faith_shield: { id: 'faith_shield', name: 'Khiên Tín Ngưỡng', description: 'Tạo khiên năng lượng từ sức mạnh tín ngưỡng', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 20, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_DEF, value: 0.6, duration: 2 }] },
    war_cry: { id: 'war_cry', name: 'Chiến Hống', description: 'Tiếng thét chiến trận, tăng sức tấn công', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 15, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_ATK, value: 0.5, duration: 3 }] },
    judgment: { id: 'judgment', name: 'Phán Xét', description: 'Phán xét tội lỗi của kẻ thù', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 2.5, mpCost: 30, cooldown: 3, effects: [] },

    // ── Năng Lượng ──
    flame_burst: { id: 'flame_burst', name: 'Hỏa Diệm Bùng Phát', description: 'Phóng ra cầu lửa nguyên tố', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.8, mpCost: 15, cooldown: 0, effects: [{ type: StatusEffectType.BURN, value: 0.05, duration: 2, chance: 0.4 }] },
    ice_prison: { id: 'ice_prison', name: 'Băng Ngục', description: 'Nhốt mục tiêu trong nhà tù băng', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.2, mpCost: 20, cooldown: 2, effects: [{ type: StatusEffectType.FREEZE, chance: 0.5, duration: 1 }] },
    lightning_storm: { id: 'lightning_storm', name: 'Lôi Đình Bão', description: 'Triệu hồi bão sét tấn công diện rộng', type: SkillType.ACTIVE, target: TargetType.ALL_ENEMIES, damage: 1.3, mpCost: 30, cooldown: 3, effects: [{ type: StatusEffectType.STUN, chance: 0.3, duration: 1 }] },
    elemental_absorb: { id: 'elemental_absorb', name: 'Hấp Thu Nguyên Tố', description: 'Hấp thu năng lượng nguyên tố hồi phục', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 10, cooldown: 3, effects: [{ type: StatusEffectType.REGEN, value: 0.2, duration: 3 }] },
    earth_quake: { id: 'earth_quake', name: 'Địa Chấn', description: 'Gây rung chuyển mặt đất', type: SkillType.ACTIVE, target: TargetType.ALL_ENEMIES, damage: 1.5, mpCost: 25, cooldown: 3, effects: [{ type: StatusEffectType.DEBUFF_DEF, value: 0.2, duration: 2 }] },
    crystal_armor: { id: 'crystal_armor', name: 'Giáp Tinh Thể', description: 'Tạo giáp từ tinh thể nguyên tố', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 15, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_DEF, value: 0.5, duration: 3 }] },

    // ── Quỷ Dị ──
    soul_drain: { id: 'soul_drain', name: 'Hút Linh Hồn', description: 'Hút sinh lực kẻ thù, hồi máu cho bản thân', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.5, mpCost: 20, cooldown: 2, effects: [{ type: StatusEffectType.REGEN, value: 0.1, duration: 1 }] },
    curse_mark: { id: 'curse_mark', name: 'Dấu Ấn Nguyền', description: 'Đặt lời nguyền lên kẻ thù', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 0.8, mpCost: 20, cooldown: 2, effects: [{ type: StatusEffectType.POISON, value: 0.1, duration: 4, chance: 0.9 }, { type: StatusEffectType.DEBUFF_ATK, value: 0.2, duration: 3 }] },
    shadow_step: { id: 'shadow_step', name: 'Bước Bóng Tối', description: 'Di chuyển qua bóng tối, tăng tốc độ', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 15, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_ATK, value: 0.3, duration: 2 }] },
    eldritch_blast: { id: 'eldritch_blast', name: 'Hư Không Nổ', description: 'Giải phóng năng lượng hư không hỗn loạn', type: SkillType.ACTIVE, target: TargetType.ALL_ENEMIES, damage: 1.8, mpCost: 35, cooldown: 4, effects: [{ type: StatusEffectType.DEBUFF_DEF, value: 0.25, duration: 2 }] },
    fear_aura: { id: 'fear_aura', name: 'Hào Quang Sợ Hãi', description: 'Toả ra nỗi sợ hãi nguyên thuỷ', type: SkillType.ACTIVE, target: TargetType.ALL_ENEMIES, damage: 0.5, mpCost: 20, cooldown: 3, effects: [{ type: StatusEffectType.DEBUFF_ATK, value: 0.3, duration: 3 }] },
    forbidden_ritual: { id: 'forbidden_ritual', name: 'Nghi Lễ Cấm', description: 'Thực hiện nghi lễ cấm, sức mạnh tăng vọt nhưng mất máu', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 10, cooldown: 4, effects: [{ type: StatusEffectType.BUFF_ATK, value: 0.8, duration: 3 }] },

    // ── Tinh Thần ──
    mind_blast: { id: 'mind_blast', name: 'Tinh Thần Xung Kích', description: 'Phóng sóng tinh thần tấn công trực tiếp ý thức', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.8, mpCost: 18, cooldown: 1, effects: [{ type: StatusEffectType.STUN, chance: 0.3, duration: 1 }] },
    dream_weave: { id: 'dream_weave', name: 'Dệt Mộng', description: 'Kéo kẻ thù vào giấc mộng', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.0, mpCost: 25, cooldown: 3, effects: [{ type: StatusEffectType.STUN, chance: 0.7, duration: 2 }] },
    psychic_barrier: { id: 'psychic_barrier', name: 'Rào Cản Tâm Linh', description: 'Dựng rào cản bảo vệ tinh thần', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 20, cooldown: 3, effects: [{ type: StatusEffectType.BUFF_DEF, value: 0.5, duration: 3 }] },
    memory_shatter: { id: 'memory_shatter', name: 'Phá Vỡ Ký Ức', description: 'Phá vỡ ký ức kẻ thù, giảm sức mạnh', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 1.2, mpCost: 22, cooldown: 2, effects: [{ type: StatusEffectType.DEBUFF_ATK, value: 0.4, duration: 3 }] },
    soul_mend: { id: 'soul_mend', name: 'Chữa Lành Linh Hồn', description: 'Phục hồi sinh lực bằng sức mạnh tinh thần', type: SkillType.ACTIVE, target: TargetType.SELF, damage: 0, mpCost: 25, cooldown: 3, effects: [{ type: StatusEffectType.REGEN, value: 0.25, duration: 3 }] },
    astral_projection: { id: 'astral_projection', name: 'Xuất Hồn', description: 'Tách linh hồn ra khỏi thể xác, tấn công trực diện ý thức', type: SkillType.ACTIVE, target: TargetType.SINGLE_ENEMY, damage: 2.5, mpCost: 35, cooldown: 4, effects: [] },
};

// ══════════════════════════════════════════════════
//  CHARACTER CLASSES
// ══════════════════════════════════════════════════

const CHARACTER_CLASSES = {
    // ── Công Nghệ ──
    agent: {
        id: 'agent', name: 'Đặc Vụ', world: 'TECHNOLOGY',
        description: 'Đặc vụ chiến đấu của Siêu Tập Đoàn. Sử dụng súng plasma và giáp cường hóa.',
        baseStats: { maxHp: 90, maxMp: 60, attack: 14, defense: 8, speed: 12, critRate: 0.08, critDamage: 1.6, spiritualPower: 0 },
        skills: ['plasma_shot', 'emp_blast', 'nano_repair'],
    },
    engineer: {
        id: 'engineer', name: 'Kỹ Sư', world: 'TECHNOLOGY',
        description: 'Thiên tài công nghệ, chế tạo vũ khí và hỗ trợ chiến đấu từ xa.',
        baseStats: { maxHp: 80, maxMp: 70, attack: 12, defense: 10, speed: 10, critRate: 0.06, critDamage: 1.5, spiritualPower: 0 },
        skills: ['hack_defense', 'overcharge', 'artillery_strike'],
    },

    // ── Tu Tiên ──
    sword_cultivator: {
        id: 'sword_cultivator', name: 'Kiếm Tu', world: 'CULTIVATION',
        description: 'Tu luyện kiếm đạo, dùng kiếm khí chém xuyên hư không. Sát thương đơn mục tiêu cực mạnh.',
        baseStats: { maxHp: 85, maxMp: 65, attack: 16, defense: 7, speed: 13, critRate: 0.10, critDamage: 1.8, spiritualPower: 5 },
        skills: ['sword_qi', 'ten_thousand_swords', 'spirit_shield'],
    },
    alchemist: {
        id: 'alchemist', name: 'Đan Sư', world: 'CULTIVATION',
        description: 'Chuyên gia luyện đan dược và trận pháp. Có khả năng hỗ trợ và sát thương diện rộng.',
        baseStats: { maxHp: 95, maxMp: 75, attack: 10, defense: 9, speed: 9, critRate: 0.05, critDamage: 1.5, spiritualPower: 8 },
        skills: ['pill_refine', 'poison_mist', 'formation_array'],
    },

    // ── Dị Nhân ──
    mutant_warrior: {
        id: 'mutant_warrior', name: 'Kẻ Đột Biến', world: 'MUTANT',
        description: 'Chiến binh đột biến gen, sức mạnh thể chất vượt trội. Tấn công cận chiến bạo lực.',
        baseStats: { maxHp: 110, maxMp: 50, attack: 15, defense: 10, speed: 11, critRate: 0.07, critDamage: 1.7, spiritualPower: 0 },
        skills: ['gene_burst', 'mutation_armor', 'regeneration'],
    },
    hunter: {
        id: 'hunter', name: 'Thợ Săn', world: 'MUTANT',
        description: 'Thợ săn dị nhân, phát triển giác quan săn mồi. Nhanh nhẹn và có độc.',
        baseStats: { maxHp: 85, maxMp: 55, attack: 13, defense: 7, speed: 14, critRate: 0.12, critDamage: 1.8, spiritualPower: 0 },
        skills: ['toxin_claws', 'predator_sense', 'acid_spit'],
    },

    // ── Chư Thần ──
    paladin: {
        id: 'paladin', name: 'Thánh Kỵ Sĩ', world: 'DIVINE',
        description: 'Kỵ sĩ thần thánh phụng sự Quang Minh Thần Hệ. Vừa tấn công vừa hỗ trợ.',
        baseStats: { maxHp: 100, maxMp: 60, attack: 13, defense: 12, speed: 9, critRate: 0.06, critDamage: 1.5, spiritualPower: 5 },
        skills: ['holy_smite', 'divine_blessing', 'faith_shield'],
    },
    war_priest: {
        id: 'war_priest', name: 'Chiến Thần Quan', world: 'DIVINE',
        description: 'Tư tế thuộc Chiến Tranh Thần Hệ. Chuyên buff bản thân và sát thương diện rộng.',
        baseStats: { maxHp: 95, maxMp: 65, attack: 14, defense: 9, speed: 10, critRate: 0.08, critDamage: 1.6, spiritualPower: 3 },
        skills: ['war_cry', 'wrath_of_god', 'judgment'],
    },

    // ── Năng Lượng ──
    elementalist: {
        id: 'elementalist', name: 'Nguyên Tố Sư', world: 'ENERGY',
        description: 'Điều khiển bão nguyên tố. Sát thương phép thuật diện rộng mạnh nhất.',
        baseStats: { maxHp: 75, maxMp: 80, attack: 16, defense: 6, speed: 10, critRate: 0.07, critDamage: 1.6, spiritualPower: 3 },
        skills: ['flame_burst', 'lightning_storm', 'ice_prison'],
    },
    crystal_guardian: {
        id: 'crystal_guardian', name: 'Thủ Hộ Tinh Thể', world: 'ENERGY',
        description: 'Kết tinh nguyên tố thành giáp, cân bằng giữa tấn công và phòng thủ.',
        baseStats: { maxHp: 100, maxMp: 60, attack: 12, defense: 12, speed: 8, critRate: 0.05, critDamage: 1.5, spiritualPower: 2 },
        skills: ['earth_quake', 'crystal_armor', 'elemental_absorb'],
    },

    // ── Quỷ Dị ──
    occultist: {
        id: 'occultist', name: 'Pháp Sư Hắc Ám', world: 'ELDRITCH',
        description: 'Nắm giữ bí thuật cấm. Debuff và DoT cực mạnh, nhưng bản thân cũng chịu rủi ro.',
        baseStats: { maxHp: 80, maxMp: 75, attack: 15, defense: 6, speed: 11, critRate: 0.08, critDamage: 1.7, spiritualPower: 5 },
        skills: ['curse_mark', 'eldritch_blast', 'forbidden_ritual'],
    },
    shadow_walker: {
        id: 'shadow_walker', name: 'Kẻ Đi Trong Bóng Tối', world: 'ELDRITCH',
        description: 'Di chuyển qua bóng tối, hút sinh lực kẻ thù. Bền bỉ trong chiến đấu kéo dài.',
        baseStats: { maxHp: 90, maxMp: 60, attack: 13, defense: 8, speed: 13, critRate: 0.09, critDamage: 1.6, spiritualPower: 3 },
        skills: ['soul_drain', 'shadow_step', 'fear_aura'],
    },

    // ── Tinh Thần ──
    psychic: {
        id: 'psychic', name: 'Nhà Ngoại Cảm', world: 'SPIRIT',
        description: 'Tấn công bằng sức mạnh tinh thần. Khống chế mạnh nhưng HP thấp.',
        baseStats: { maxHp: 70, maxMp: 85, attack: 14, defense: 5, speed: 12, critRate: 0.07, critDamage: 1.6, spiritualPower: 15 },
        skills: ['mind_blast', 'dream_weave', 'psychic_barrier'],
    },
    soul_healer: {
        id: 'soul_healer', name: 'Linh Hồn Sư', world: 'SPIRIT',
        description: 'Chữa lành bằng sức mạnh linh hồn. Hỗ trợ và debuff kẻ thù.',
        baseStats: { maxHp: 80, maxMp: 80, attack: 11, defense: 7, speed: 10, critRate: 0.05, critDamage: 1.5, spiritualPower: 12 },
        skills: ['soul_mend', 'memory_shatter', 'astral_projection'],
    },
};

// ══════════════════════════════════════════════════
//  ENEMIES
// ══════════════════════════════════════════════════

const ENEMIES = {
    // ── Vùng Hư Vô (Tutorial / Starter) ──
    void_larva: { id: 'void_larva', name: 'Ấu Trùng Hư Vô', world: null, level: 1, isBoss: false,
        description: 'Sinh vật nhỏ bé từ Vùng Hư Vô. Yếu ớt nhưng đông đảo.',
        stats: { maxHp: 30, attack: 5, defense: 2, speed: 6, critRate: 0.02, critDamage: 1.3 },
        skills: [], expReward: 15, goldReward: 5,
        loot: [{ itemId: 'void_shard', rate: 0.5 }, { itemId: 'hp_potion_s', rate: 0.3 }] },
    void_stalker: { id: 'void_stalker', name: 'Kẻ Rình Rập Hư Vô', world: null, level: 3, isBoss: false,
        description: 'Thực thể bóng tối, di chuyển nhanh và tàng hình.',
        stats: { maxHp: 55, attack: 10, defense: 4, speed: 12, critRate: 0.08, critDamage: 1.5 },
        skills: ['shadow_step'], expReward: 30, goldReward: 12,
        loot: [{ itemId: 'void_shard', rate: 0.6 }, { itemId: 'rune_common_void', rate: 0.2 }] },
    void_devourer: { id: 'void_devourer', name: 'Kẻ Thôn Phệ Quy Tắc', world: null, level: 5, isBoss: true,
        description: 'Thực thể mang trí tuệ siêu việt, có khả năng nuốt chửng quy tắc vũ trụ.',
        stats: { maxHp: 200, attack: 18, defense: 10, speed: 10, critRate: 0.10, critDamage: 1.8 },
        skills: ['soul_drain', 'fear_aura', 'eldritch_blast'], expReward: 150, goldReward: 80,
        loot: [{ itemId: 'void_shard', rate: 1.0, max: 3 }, { itemId: 'rune_rare_void', rate: 0.3 }] },

    // ── Công Nghệ ──
    rogue_drone: { id: 'rogue_drone', name: 'Drone Phản Loạn', world: 'TECHNOLOGY', level: 2, isBoss: false,
        description: 'Drone chiến đấu mất kiểm soát, bắn laser tự động.',
        stats: { maxHp: 40, attack: 8, defense: 5, speed: 10, critRate: 0.05, critDamage: 1.4 },
        skills: ['plasma_shot'], expReward: 20, goldReward: 10,
        loot: [{ itemId: 'energy_core', rate: 0.4 }, { itemId: 'hp_potion_s', rate: 0.3 }] },
    cyber_enforcer: { id: 'cyber_enforcer', name: 'Thi Hành Giả Cyber', world: 'TECHNOLOGY', level: 4, isBoss: false,
        description: 'Lính đánh thuê của Siêu Tập Đoàn, được trang bị giáp Exoskeleton.',
        stats: { maxHp: 70, attack: 12, defense: 8, speed: 9, critRate: 0.06, critDamage: 1.5 },
        skills: ['plasma_shot', 'emp_blast'], expReward: 40, goldReward: 20,
        loot: [{ itemId: 'energy_core', rate: 0.5 }, { itemId: 'steel_plate', rate: 0.3 }] },
    mega_corp_boss: { id: 'mega_corp_boss', name: 'Giám Đốc Siêu Tập Đoàn', world: 'TECHNOLOGY', level: 8, isBoss: true,
        description: 'Chủ tịch tập đoàn trong bộ giáp chiến đấu tối tân. Vũ khí huỷ diệt hàng loạt.',
        stats: { maxHp: 300, attack: 22, defense: 15, speed: 11, critRate: 0.10, critDamage: 1.7 },
        skills: ['artillery_strike', 'emp_blast', 'overcharge'], expReward: 200, goldReward: 120,
        loot: [{ itemId: 'plasma_rifle', rate: 0.3 }, { itemId: 'rune_epic_tech', rate: 0.2 }] },

    // ── Tu Tiên ──
    wild_beast: { id: 'wild_beast', name: 'Yêu Thú Cấp Thấp', world: 'CULTIVATION', level: 2, isBoss: false,
        description: 'Thú hoang hấp thụ linh khí biến đổi, mang sức mạnh cơ bản.',
        stats: { maxHp: 45, attack: 9, defense: 4, speed: 11, critRate: 0.05, critDamage: 1.4 },
        skills: [], expReward: 20, goldReward: 8,
        loot: [{ itemId: 'spirit_stone', rate: 0.4 }, { itemId: 'beast_core', rate: 0.2 }] },
    evil_cultivator: { id: 'evil_cultivator', name: 'Ma Tu', world: 'CULTIVATION', level: 5, isBoss: false,
        description: 'Tu sĩ theo con đường tà đạo, tu luyện bằng cách đoạt xá người khác.',
        stats: { maxHp: 80, attack: 14, defense: 7, speed: 10, critRate: 0.08, critDamage: 1.6 },
        skills: ['sword_qi', 'poison_mist'], expReward: 50, goldReward: 25,
        loot: [{ itemId: 'spirit_stone', rate: 0.6, max: 2 }, { itemId: 'rune_uncommon_cult', rate: 0.25 }] },
    ancient_patriarch: { id: 'ancient_patriarch', name: 'Đạo Tổ Cổ Đại', world: 'CULTIVATION', level: 10, isBoss: true,
        description: 'Đạo tổ sống hàng vạn năm, cảnh giới đã vượt xa phàm nhân.',
        stats: { maxHp: 400, attack: 25, defense: 14, speed: 12, critRate: 0.12, critDamage: 1.9 },
        skills: ['ten_thousand_swords', 'spirit_shield', 'sword_qi'], expReward: 300, goldReward: 150,
        loot: [{ itemId: 'immortal_sword', rate: 0.2 }, { itemId: 'rune_legendary_cult', rate: 0.1 }] },

    // ── Dị Nhân ──
    mutant_rat: { id: 'mutant_rat', name: 'Chuột Đột Biến', world: 'MUTANT', level: 2, isBoss: false,
        description: 'Chuột khổng lồ bị đột biến, mang theo bệnh dịch.',
        stats: { maxHp: 35, attack: 7, defense: 3, speed: 13, critRate: 0.06, critDamage: 1.4 },
        skills: [], expReward: 18, goldReward: 7,
        loot: [{ itemId: 'dna_fragment', rate: 0.4 }, { itemId: 'hp_potion_s', rate: 0.3 }] },
    berserker: { id: 'berserker', name: 'Dị Nhân Cuồng Bạo', world: 'MUTANT', level: 5, isBoss: false,
        description: 'Dị nhân mất kiểm soát sức mạnh, trở nên điên cuồng.',
        stats: { maxHp: 90, attack: 16, defense: 5, speed: 12, critRate: 0.10, critDamage: 1.7 },
        skills: ['gene_burst', 'predator_sense'], expReward: 45, goldReward: 22,
        loot: [{ itemId: 'dna_fragment', rate: 0.6, max: 2 }, { itemId: 'rune_uncommon_mutant', rate: 0.2 }] },
    apex_predator: { id: 'apex_predator', name: 'Kẻ Săn Mồi Tối Thượng', world: 'MUTANT', level: 9, isBoss: true,
        description: 'Đỉnh cao tiến hoá đột biến. Thân thể hoàn hảo, sức mạnh vô song.',
        stats: { maxHp: 350, attack: 24, defense: 12, speed: 15, critRate: 0.14, critDamage: 2.0 },
        skills: ['gene_burst', 'mutation_armor', 'regeneration', 'predator_sense'], expReward: 250, goldReward: 130,
        loot: [{ itemId: 'apex_claws', rate: 0.25 }, { itemId: 'rune_epic_mutant', rate: 0.15 }] },

    // ── Chư Thần ──
    fanatic: { id: 'fanatic', name: 'Cuồng Tín Đồ', world: 'DIVINE', level: 3, isBoss: false,
        description: 'Tín đồ cuồng nhiệt, chiến đấu bằng niềm tin mù quáng.',
        stats: { maxHp: 50, attack: 10, defense: 6, speed: 8, critRate: 0.04, critDamage: 1.4 },
        skills: ['war_cry'], expReward: 25, goldReward: 12,
        loot: [{ itemId: 'faith_crystal', rate: 0.4 }, { itemId: 'hp_potion_s', rate: 0.3 }] },
    fallen_angel: { id: 'fallen_angel', name: 'Thiên Sứ Sa Đọa', world: 'DIVINE', level: 6, isBoss: false,
        description: 'Thiên sứ phản bội thần hệ, sức mạnh thiêng liêng bị vặn vẹo.',
        stats: { maxHp: 85, attack: 15, defense: 9, speed: 11, critRate: 0.08, critDamage: 1.6 },
        skills: ['holy_smite', 'wrath_of_god'], expReward: 55, goldReward: 30,
        loot: [{ itemId: 'faith_crystal', rate: 0.5, max: 2 }, { itemId: 'rune_rare_divine', rate: 0.2 }] },
    war_god_avatar: { id: 'war_god_avatar', name: 'Hình Chiếu Chiến Thần', world: 'DIVINE', level: 10, isBoss: true,
        description: 'Hình chiếu giáng lâm của Chiến Thần. Chỉ là một phần sức mạnh nhưng đã vô cùng đáng sợ.',
        stats: { maxHp: 450, attack: 28, defense: 16, speed: 13, critRate: 0.12, critDamage: 1.8 },
        skills: ['judgment', 'war_cry', 'wrath_of_god', 'divine_blessing'], expReward: 350, goldReward: 180,
        loot: [{ itemId: 'divine_lance', rate: 0.2 }, { itemId: 'rune_legendary_divine', rate: 0.08 }] },

    // ── Năng Lượng ──
    fire_sprite: { id: 'fire_sprite', name: 'Hỏa Tinh Linh', world: 'ENERGY', level: 2, isBoss: false,
        description: 'Tinh linh lửa nhỏ, bay lơ lửng trong không khí.',
        stats: { maxHp: 30, attack: 10, defense: 3, speed: 12, critRate: 0.06, critDamage: 1.5 },
        skills: ['flame_burst'], expReward: 20, goldReward: 8,
        loot: [{ itemId: 'elemental_core', rate: 0.4 }] },
    storm_elemental: { id: 'storm_elemental', name: 'Nguyên Tố Hồn Bão', world: 'ENERGY', level: 5, isBoss: false,
        description: 'Thực thể nguyên tố sét, luôn bao phủ trong bão điện.',
        stats: { maxHp: 65, attack: 14, defense: 5, speed: 14, critRate: 0.08, critDamage: 1.6 },
        skills: ['lightning_storm'], expReward: 45, goldReward: 20,
        loot: [{ itemId: 'elemental_core', rate: 0.6 }, { itemId: 'rune_uncommon_energy', rate: 0.2 }] },
    elemental_king: { id: 'elemental_king', name: 'Thú Vương Năng Lượng', world: 'ENERGY', level: 9, isBoss: true,
        description: 'Cự thú năng lượng, chúa tể của tất cả nguyên tố.',
        stats: { maxHp: 380, attack: 26, defense: 13, speed: 11, critRate: 0.10, critDamage: 1.8 },
        skills: ['flame_burst', 'lightning_storm', 'ice_prison', 'earth_quake'], expReward: 280, goldReward: 140,
        loot: [{ itemId: 'storm_staff', rate: 0.2 }, { itemId: 'rune_epic_energy', rate: 0.15 }] },

    // ── Quỷ Dị ──
    shadow_fiend: { id: 'shadow_fiend', name: 'Ác Linh Bóng Tối', world: 'ELDRITCH', level: 3, isBoss: false,
        description: 'Thực thể bóng tối, không có hình dạng cố định.',
        stats: { maxHp: 40, attack: 11, defense: 4, speed: 13, critRate: 0.07, critDamage: 1.5 },
        skills: ['curse_mark'], expReward: 25, goldReward: 10,
        loot: [{ itemId: 'cursed_shard', rate: 0.4 }] },
    nameless_horror: { id: 'nameless_horror', name: 'Thực Thể Vô Danh', world: 'ELDRITCH', level: 6, isBoss: false,
        description: 'Thứ không thể định danh. Nhìn vào nó quá lâu sẽ mất đi lý trí.',
        stats: { maxHp: 75, attack: 13, defense: 7, speed: 10, critRate: 0.08, critDamage: 1.6 },
        skills: ['fear_aura', 'soul_drain'], expReward: 55, goldReward: 28,
        loot: [{ itemId: 'cursed_shard', rate: 0.5, max: 2 }, { itemId: 'rune_rare_eldritch', rate: 0.2 }] },
    old_god: { id: 'old_god', name: 'Cổ Thần Hắc Ám', world: 'ELDRITCH', level: 10, isBoss: true,
        description: 'Thực thể tà ác cổ đại, nằm ngoài mọi quy tắc. Nhìn thấy nó là đã mất đi một phần linh hồn.',
        stats: { maxHp: 500, attack: 20, defense: 18, speed: 8, critRate: 0.08, critDamage: 1.6 },
        skills: ['eldritch_blast', 'fear_aura', 'curse_mark', 'soul_drain', 'forbidden_ritual'], expReward: 400, goldReward: 200,
        loot: [{ itemId: 'void_grimoire', rate: 0.15 }, { itemId: 'rune_legendary_eldritch', rate: 0.08 }] },

    // ── Tinh Thần ──
    nightmare: { id: 'nightmare', name: 'Ác Mộng', world: 'SPIRIT', level: 3, isBoss: false,
        description: 'Giấc mơ xấu trở thành thực thể, tấn công ý thức.',
        stats: { maxHp: 35, attack: 9, defense: 3, speed: 11, critRate: 0.06, critDamage: 1.4 },
        skills: ['mind_blast'], expReward: 22, goldReward: 9,
        loot: [{ itemId: 'soul_fragment', rate: 0.4 }] },
    dream_eater: { id: 'dream_eater', name: 'Thực Thể Ăn Mộng', world: 'SPIRIT', level: 6, isBoss: false,
        description: 'Sinh vật nuốt chửng giấc mơ và ký ức của sinh linh.',
        stats: { maxHp: 70, attack: 12, defense: 5, speed: 12, critRate: 0.07, critDamage: 1.5 },
        skills: ['dream_weave', 'memory_shatter'], expReward: 50, goldReward: 25,
        loot: [{ itemId: 'soul_fragment', rate: 0.5, max: 2 }, { itemId: 'rune_rare_spirit', rate: 0.2 }] },
    inner_demon: { id: 'inner_demon', name: 'Tâm Ma', world: 'SPIRIT', level: 10, isBoss: true,
        description: 'Tâm ma của chính nhân vật, hội tụ mọi nỗi sợ hãi và ký ức đen tối.',
        stats: { maxHp: 420, attack: 24, defense: 12, speed: 14, critRate: 0.12, critDamage: 1.9 },
        skills: ['mind_blast', 'dream_weave', 'astral_projection', 'psychic_barrier'], expReward: 320, goldReward: 160,
        loot: [{ itemId: 'mind_crown', rate: 0.2 }, { itemId: 'rune_legendary_spirit', rate: 0.08 }] },
};

// ══════════════════════════════════════════════════
//  ITEMS
// ══════════════════════════════════════════════════

const ITEMS = {
    // ── Consumables ──
    hp_potion_s: { id: 'hp_potion_s', name: 'Thuốc Hồi Máu (Nhỏ)', type: ItemType.CONSUMABLE, rarity: 'COMMON', description: 'Hồi phục 30% HP', effect: { heal: 0.3 }, buyPrice: 20, sellPrice: 8 },
    hp_potion_m: { id: 'hp_potion_m', name: 'Thuốc Hồi Máu (Vừa)', type: ItemType.CONSUMABLE, rarity: 'UNCOMMON', description: 'Hồi phục 60% HP', effect: { heal: 0.6 }, buyPrice: 50, sellPrice: 20 },
    hp_potion_l: { id: 'hp_potion_l', name: 'Thuốc Hồi Máu (Lớn)', type: ItemType.CONSUMABLE, rarity: 'RARE', description: 'Hồi phục 100% HP', effect: { heal: 1.0 }, buyPrice: 120, sellPrice: 50 },
    mp_potion_s: { id: 'mp_potion_s', name: 'Thuốc Hồi MP (Nhỏ)', type: ItemType.CONSUMABLE, rarity: 'COMMON', description: 'Hồi phục 30% MP', effect: { mana: 0.3 }, buyPrice: 25, sellPrice: 10 },
    mp_potion_m: { id: 'mp_potion_m', name: 'Thuốc Hồi MP (Vừa)', type: ItemType.CONSUMABLE, rarity: 'UNCOMMON', description: 'Hồi phục 60% MP', effect: { mana: 0.6 }, buyPrice: 60, sellPrice: 25 },
    atk_boost: { id: 'atk_boost', name: 'Dược Liệu Tăng Lực', type: ItemType.CONSUMABLE, rarity: 'UNCOMMON', description: 'Tăng 30% ATK trong 3 lượt', effect: { buff: StatusEffectType.BUFF_ATK, value: 0.3, duration: 3 }, buyPrice: 40, sellPrice: 15 },

    // ── Materials ──
    void_shard: { id: 'void_shard', name: 'Mảnh Hư Vô', type: ItemType.MATERIAL, rarity: 'COMMON', description: 'Mảnh vỡ từ Vùng Hư Vô', sellPrice: 5 },
    energy_core: { id: 'energy_core', name: 'Lõi Năng Lượng', type: ItemType.MATERIAL, rarity: 'UNCOMMON', description: 'Lõi năng lượng từ thiết bị Công Nghệ', sellPrice: 12 },
    spirit_stone: { id: 'spirit_stone', name: 'Linh Thạch', type: ItemType.MATERIAL, rarity: 'UNCOMMON', description: 'Viên đá chứa linh khí thuần khiết', sellPrice: 15 },
    beast_core: { id: 'beast_core', name: 'Thú Hạch', type: ItemType.MATERIAL, rarity: 'UNCOMMON', description: 'Hạch năng lượng từ yêu thú', sellPrice: 18 },
    dna_fragment: { id: 'dna_fragment', name: 'Mã Gen', type: ItemType.MATERIAL, rarity: 'UNCOMMON', description: 'DNA Fragment từ sinh vật đột biến', sellPrice: 14 },
    faith_crystal: { id: 'faith_crystal', name: 'Tinh Thể Tín Ngưỡng', type: ItemType.MATERIAL, rarity: 'UNCOMMON', description: 'Kết tinh từ sức mạnh tín ngưỡng', sellPrice: 16 },
    elemental_core: { id: 'elemental_core', name: 'Lõi Nguyên Tố', type: ItemType.MATERIAL, rarity: 'UNCOMMON', description: 'Lõi tinh thể nguyên tố thuần túy', sellPrice: 15 },
    cursed_shard: { id: 'cursed_shard', name: 'Mảnh Cấm Vật', type: ItemType.MATERIAL, rarity: 'UNCOMMON', description: 'Mảnh vỡ của vật phẩm bị nguyền rủa', sellPrice: 20 },
    soul_fragment: { id: 'soul_fragment', name: 'Mảnh Hồn Phách', type: ItemType.MATERIAL, rarity: 'UNCOMMON', description: 'Mảnh vỡ hồn phách phiêu bạt', sellPrice: 13 },
    steel_plate: { id: 'steel_plate', name: 'Thép Tấm', type: ItemType.MATERIAL, rarity: 'COMMON', description: 'Tấm thép công nghiệp', sellPrice: 8 },

    // ── Weapons (one per world, boss drops) ──
    plasma_rifle: { id: 'plasma_rifle', name: 'Súng Plasma X-9', type: ItemType.WEAPON, rarity: 'EPIC', slot: EquipSlot.WEAPON, description: 'Súng plasma thế hệ mới của Siêu Tập Đoàn', stats: { attack: 15, critRate: 0.05 }, sellPrice: 200 },
    immortal_sword: { id: 'immortal_sword', name: 'Tiên Kiếm: Vân Hải', type: ItemType.WEAPON, rarity: 'EPIC', slot: EquipSlot.WEAPON, description: 'Thanh kiếm tiên được đúc từ hồng hoang', stats: { attack: 18, speed: 3, critDamage: 0.3 }, sellPrice: 250 },
    apex_claws: { id: 'apex_claws', name: 'Vuốt Kẻ Săn Tối Thượng', type: ItemType.WEAPON, rarity: 'EPIC', slot: EquipSlot.WEAPON, description: 'Móng vuốt sắc bén từ Kẻ Săn Mồi Tối Thượng', stats: { attack: 16, speed: 4, critRate: 0.08 }, sellPrice: 220 },
    divine_lance: { id: 'divine_lance', name: 'Thánh Thương: Ánh Sáng', type: ItemType.WEAPON, rarity: 'LEGENDARY', slot: EquipSlot.WEAPON, description: 'Vũ khí của Chiến Thần, chứa đựng Thần Tính', stats: { attack: 22, defense: 5, spiritualPower: 5 }, sellPrice: 400 },
    storm_staff: { id: 'storm_staff', name: 'Trượng Bão Nguyên Tố', type: ItemType.WEAPON, rarity: 'EPIC', slot: EquipSlot.WEAPON, description: 'Trượng điều khiển mọi nguyên tố', stats: { attack: 14, maxMp: 30, critDamage: 0.2 }, sellPrice: 230 },
    void_grimoire: { id: 'void_grimoire', name: 'Ma Thư Hư Vô', type: ItemType.WEAPON, rarity: 'LEGENDARY', slot: EquipSlot.WEAPON, description: 'Cuốn sách cấm chứa tri thức ngoài vũ trụ. Rất mạnh nhưng nguy hiểm.', stats: { attack: 20, maxMp: 40, critRate: 0.06 }, sellPrice: 380 },
    mind_crown: { id: 'mind_crown', name: 'Vương Miện Tâm Trí', type: ItemType.WEAPON, rarity: 'EPIC', slot: EquipSlot.HEAD, description: 'Vương miện tăng cường tinh thần lực', stats: { defense: 8, maxMp: 25, spiritualPower: 10 }, sellPrice: 240 },

    // ── Starter weapons ──
    starter_pistol: { id: 'starter_pistol', name: 'Súng Lục Tiêu Chuẩn', type: ItemType.WEAPON, rarity: 'COMMON', slot: EquipSlot.WEAPON, description: 'Vũ khí cơ bản của Đặc Vụ', stats: { attack: 3 }, sellPrice: 10 },
    starter_sword: { id: 'starter_sword', name: 'Mộc Kiếm', type: ItemType.WEAPON, rarity: 'COMMON', slot: EquipSlot.WEAPON, description: 'Thanh kiếm gỗ của tân đệ tử', stats: { attack: 3 }, sellPrice: 10 },
    starter_claws: { id: 'starter_claws', name: 'Vuốt Sắt', type: ItemType.WEAPON, rarity: 'COMMON', slot: EquipSlot.WEAPON, description: 'Móng vuốt kim loại thô sơ', stats: { attack: 3 }, sellPrice: 10 },
    starter_mace: { id: 'starter_mace', name: 'Chùy Tín Đồ', type: ItemType.WEAPON, rarity: 'COMMON', slot: EquipSlot.WEAPON, description: 'Vũ khí đơn giản của người phụng sự', stats: { attack: 3 }, sellPrice: 10 },
    starter_staff: { id: 'starter_staff', name: 'Trượng Nguyên Tố', type: ItemType.WEAPON, rarity: 'COMMON', slot: EquipSlot.WEAPON, description: 'Trượng cơ bản điều khiển nguyên tố', stats: { attack: 3 }, sellPrice: 10 },
    starter_dagger: { id: 'starter_dagger', name: 'Dao Găm Bóng Tối', type: ItemType.WEAPON, rarity: 'COMMON', slot: EquipSlot.WEAPON, description: 'Con dao từ vùng bóng tối', stats: { attack: 3 }, sellPrice: 10 },
    starter_orb: { id: 'starter_orb', name: 'Linh Cầu Mộng Giới', type: ItemType.WEAPON, rarity: 'COMMON', slot: EquipSlot.WEAPON, description: 'Quả cầu kết nối với cõi mộng', stats: { attack: 2, spiritualPower: 3 }, sellPrice: 10 },
};

// Map world to starter weapon
const STARTER_WEAPONS = {
    TECHNOLOGY: 'starter_pistol', CULTIVATION: 'starter_sword', MUTANT: 'starter_claws',
    DIVINE: 'starter_mace', ENERGY: 'starter_staff', ELDRITCH: 'starter_dagger', SPIRIT: 'starter_orb'
};

// ══════════════════════════════════════════════════
//  RUNES
// ══════════════════════════════════════════════════

function createRune(id, name, world, rarity, stats, desc) {
    return { id, name, world, rarity, stats, description: desc };
}

const RUNE_TEMPLATES = [
    // Each world has runes at multiple rarities
    { world: 'TECHNOLOGY', prefix: 'Mạch Vi Xử Lý', stat: 'attack', desc: 'Rune công nghệ tăng sát thương' },
    { world: 'CULTIVATION', prefix: 'Linh Văn', stat: 'maxMp', desc: 'Rune tu tiên tăng linh lực' },
    { world: 'MUTANT', prefix: 'Mã Gen', stat: 'maxHp', desc: 'Rune dị nhân tăng sinh lực' },
    { world: 'DIVINE', prefix: 'Thần Ấn', stat: 'defense', desc: 'Rune thần thánh tăng phòng ngự' },
    { world: 'ENERGY', prefix: 'Tinh Thể', stat: 'critDamage', desc: 'Rune nguyên tố tăng bạo kích' },
    { world: 'ELDRITCH', prefix: 'Cấm Chú', stat: 'critRate', desc: 'Rune quỷ dị tăng tỉ lệ chí mạng' },
    { world: 'SPIRIT', prefix: 'Hồn Văn', stat: 'spiritualPower', desc: 'Rune tinh thần tăng tinh thần lực' },
];

function generateRuneId(world, rarity) {
    return `rune_${rarity.toLowerCase()}_${world.toLowerCase().substring(0, 4)}`;
}

const RARITY_STAT_MULT = { COMMON: 1, UNCOMMON: 2, RARE: 4, EPIC: 7, LEGENDARY: 12, MYTHIC: 20 };
const RARITY_BASE_STATS = { attack: 2, maxHp: 10, maxMp: 8, defense: 1, speed: 1, critRate: 0.01, critDamage: 0.05, spiritualPower: 2 };

function generateRune(worldId, rarity) {
    const template = RUNE_TEMPLATES.find(t => t.world === worldId);
    if (!template) return null;
    const mult = RARITY_STAT_MULT[rarity] || 1;
    const baseVal = RARITY_BASE_STATS[template.stat] || 1;
    const stats = {};
    stats[template.stat] = Math.round((baseVal * mult) * 100) / 100;
    return {
        id: `${generateRuneId(worldId, rarity)}_${Date.now()}_${Math.random().toString(36).substr(2,4)}`,
        name: `${template.prefix} [${Rarity[rarity].name}]`,
        world: worldId, rarity, stats, description: template.desc,
    };
}

// ══════════════════════════════════════════════════
//  ZONES
// ══════════════════════════════════════════════════

const ZONES = {
    // Thánh Vực Dung Hợp (starter)
    fusion_outskirts: { id: 'fusion_outskirts', name: 'Ngoại Vi Thánh Vực', world: null, minLevel: 1, maxLevel: 3,
        description: 'Rìa ngoài của Thánh Vực Dung Hợp. Quái vật Hư Vô yếu ớt xuất hiện nơi đây.',
        enemies: ['void_larva', 'void_stalker'], encounterRate: 0.4 },
    fusion_core: { id: 'fusion_core', name: 'Lõi Thánh Vực', world: null, minLevel: 4, maxLevel: 7,
        description: 'Trung tâm Thánh Vực Dung Hợp, nơi quy tắc 7 thế giới hội tụ.',
        enemies: ['void_stalker', 'void_devourer'], encounterRate: 0.5 },

    // Công Nghệ
    tech_slums: { id: 'tech_slums', name: 'Khu Ổ Chuột Neo-Tokyo', world: 'TECHNOLOGY', minLevel: 2, maxLevel: 4,
        description: 'Khu phố tối tăm dưới bóng các toà nhà Siêu Tập Đoàn.',
        enemies: ['rogue_drone', 'cyber_enforcer'], encounterRate: 0.4 },
    tech_corp_tower: { id: 'tech_corp_tower', name: 'Tháp Siêu Tập Đoàn', world: 'TECHNOLOGY', minLevel: 5, maxLevel: 8,
        description: 'Trụ sở chính của Siêu Tập Đoàn. An ninh cực kỳ nghiêm ngặt.',
        enemies: ['cyber_enforcer', 'mega_corp_boss'], encounterRate: 0.5 },

    // Tu Tiên
    spirit_forest: { id: 'spirit_forest', name: 'Linh Khí Thâm Lâm', world: 'CULTIVATION', minLevel: 2, maxLevel: 4,
        description: 'Khu rừng cổ thụ tràn đầy linh khí, nơi yêu thú sinh sống.',
        enemies: ['wild_beast', 'evil_cultivator'], encounterRate: 0.4 },
    forbidden_peak: { id: 'forbidden_peak', name: 'Cấm Địa Tuyệt Đỉnh', world: 'CULTIVATION', minLevel: 6, maxLevel: 10,
        description: 'Đỉnh núi cấm địa, nơi các Đạo Tổ ẩn tu.',
        enemies: ['evil_cultivator', 'ancient_patriarch'], encounterRate: 0.5 },

    // Dị Nhân
    wasteland: { id: 'wasteland', name: 'Hoang Mạc Đột Biến', world: 'MUTANT', minLevel: 2, maxLevel: 4,
        description: 'Vùng đất hoang ô nhiễm, sinh vật đột biến lang thang.',
        enemies: ['mutant_rat', 'berserker'], encounterRate: 0.4 },
    apex_lair: { id: 'apex_lair', name: 'Hang Ổ Tối Thượng', world: 'MUTANT', minLevel: 6, maxLevel: 9,
        description: 'Nơi Kẻ Săn Mồi Tối Thượng ngự trị.',
        enemies: ['berserker', 'apex_predator'], encounterRate: 0.5 },

    // Chư Thần
    temple_grounds: { id: 'temple_grounds', name: 'Thần Điện Ngoại Viện', world: 'DIVINE', minLevel: 3, maxLevel: 5,
        description: 'Khuôn viên ngoài thần điện, Cuồng Tín Đồ canh gác.',
        enemies: ['fanatic', 'fallen_angel'], encounterRate: 0.4 },
    heavenly_arena: { id: 'heavenly_arena', name: 'Thiên Giới Đấu Trường', world: 'DIVINE', minLevel: 7, maxLevel: 10,
        description: 'Đấu trường trên chín tầng mây, nơi thần linh thử thách.',
        enemies: ['fallen_angel', 'war_god_avatar'], encounterRate: 0.5 },

    // Năng Lượng
    elemental_plains: { id: 'elemental_plains', name: 'Đồng Bằng Nguyên Tố', world: 'ENERGY', minLevel: 2, maxLevel: 4,
        description: 'Đồng bằng bao phủ bởi các luồng năng lượng nguyên tố.',
        enemies: ['fire_sprite', 'storm_elemental'], encounterRate: 0.4 },
    crystal_cavern: { id: 'crystal_cavern', name: 'Động Tinh Thể', world: 'ENERGY', minLevel: 6, maxLevel: 9,
        description: 'Hang động tinh thể khổng lồ, nơi Thú Vương trú ngụ.',
        enemies: ['storm_elemental', 'elemental_king'], encounterRate: 0.5 },

    // Quỷ Dị
    mist_village: { id: 'mist_village', name: 'Làng Sương Mù', world: 'ELDRITCH', minLevel: 3, maxLevel: 5,
        description: 'Ngôi làng bị bao phủ sương mù vĩnh hằng. Đừng ra ngoài sau 12h đêm.',
        enemies: ['shadow_fiend', 'nameless_horror'], encounterRate: 0.4 },
    void_cathedral: { id: 'void_cathedral', name: 'Giáo Đường Hư Vô', world: 'ELDRITCH', minLevel: 7, maxLevel: 10,
        description: 'Giáo đường cổ xưa thờ phụng Cổ Thần. Không khí đặc quánh sự điên loạn.',
        enemies: ['nameless_horror', 'old_god'], encounterRate: 0.5 },

    // Tinh Thần
    dream_shallows: { id: 'dream_shallows', name: 'Vùng Mộng Nông', world: 'SPIRIT', minLevel: 2, maxLevel: 5,
        description: 'Tầng mộng cảnh bề mặt, nơi ác mộng lang thang.',
        enemies: ['nightmare', 'dream_eater'], encounterRate: 0.4 },
    deep_subconscious: { id: 'deep_subconscious', name: 'Tiềm Thức Sâu Thẳm', world: 'SPIRIT', minLevel: 7, maxLevel: 10,
        description: 'Nơi sâu nhất của tiềm thức, Tâm Ma ẩn nấp.',
        enemies: ['dream_eater', 'inner_demon'], encounterRate: 0.5 },
};

// ══════════════════════════════════════════════════
//  STORY SCENES
// ══════════════════════════════════════════════════

const STORY_SCENES = {
    intro: {
        id: 'intro',
        text: [
            { type: 'narration', text: 'Từ thuở hồng hoang, Vũ Trụ là một khối thống nhất...' },
            { type: 'narration', text: 'Sau sự kiện "Đại Phân Liệt", vũ trụ vỡ ra thành 7 không gian độc lập, vận hành theo 7 bộ quy tắc hoàn toàn khác biệt.' },
            { type: 'narration', text: 'Trải qua vô số kỷ nguyên, lực hấp dẫn nguyên thủy đang dần kéo 7 thế giới lại với nhau...' },
            { type: 'system', text: '── Thánh Vực Dung Hợp ──' },
            { type: 'narration', text: 'Một không gian trung tâm đã được tạo ra — Thánh Vực Dung Hợp — vùng không gian hoàn hảo chứa đựng quy tắc tối cao của cả 7 thế giới.' },
            { type: 'narration', text: 'Nhưng mặt trái của nó cũng xé rách không gian, sinh ra Vùng Hư Vô — chiều không gian vô quy tắc và hỗn loạn.' },
            { type: 'system', text: '⚠ Hiểm hoạ đang đến...' },
            { type: 'narration', text: 'Những thực thể mang trí tuệ siêu việt từ Vùng Hư Vô đang tìm cách thôn phệ quy tắc vũ trụ...' },
            { type: 'narration', text: 'Và ngươi — một sinh linh được Hệ Thống chọn lựa — sẽ phải đứng lên.' },
        ],
        choices: [
            { text: '▸ Tiếp tục...', nextScene: 'choose_world' }
        ]
    },

    choose_world: {
        id: 'choose_world',
        text: [
            { type: 'system', text: '── Chọn Thế Giới Xuất Thân ──' },
            { type: 'narration', text: 'Hệ Thống đã kết nối với ý thức của ngươi. Hãy chọn thế giới mà ngươi thuộc về.' },
            { type: 'narration', text: 'Thế giới xuất thân sẽ quyết định năng lực bẩm sinh và con đường phát triển của ngươi.' },
        ],
        choices: [] // Dynamically generated from WORLDS
    },

    world_selected: {
        id: 'world_selected',
        text: [
            { type: 'system', text: '── Thức Tỉnh Lần 1: Khởi Nguyên ──' },
            { type: 'narration', text: 'Ngươi đã chọn thế giới của mình. Bây giờ, hãy chọn con đường tu luyện.' },
            { type: 'narration', text: 'Thông qua lần thức tỉnh đầu tiên, ngươi sẽ được chọn một Nghề (Class) đặc trưng cho thế giới gốc.' },
        ],
        choices: [] // Dynamically generated from classes
    },

    awakening_complete: {
        id: 'awakening_complete',
        text: [
            { type: 'system', text: '✦ THỨC TỈNH THÀNH CÔNG ✦' },
            { type: 'narration', text: 'Một luồng năng lượng khổng lồ bùng phát từ bên trong cơ thể ngươi!' },
            { type: 'narration', text: 'Ngươi cảm nhận được sức mạnh mới — quy tắc của thế giới gốc đang chảy trong huyết mạch.' },
            { type: 'system', text: '── Hệ Thống đã kích hoạt ──' },
            { type: 'dialogue', speaker: 'Hệ Thống', text: '"Thức tỉnh thành công. Nghề nghiệp đã được thiết lập. Bây giờ, hãy tiến vào Thánh Vực Dung Hợp và bắt đầu hành trình của ngươi."' },
            { type: 'narration', text: 'Trước mắt ngươi, một cánh cổng không gian mở ra, dẫn tới Thánh Vực Dung Hợp — chiến trường chính nơi mọi thế giới giao thoa.' },
        ],
        choices: [
            { text: '▸ Bước vào Thánh Vực Dung Hợp', nextScene: 'enter_fusion_domain' }
        ]
    },

    enter_fusion_domain: {
        id: 'enter_fusion_domain',
        text: [
            { type: 'system', text: '── Thánh Vực Dung Hợp ──' },
            { type: 'narration', text: 'Ngươi bước qua cánh cổng. Ánh sáng chói lòa bao phủ tầm mắt.' },
            { type: 'narration', text: 'Khi thị giác trở lại, ngươi thấy mình đứng giữa một vùng đất kỳ lạ — nơi cảnh vật liên tục biến đổi.' },
            { type: 'narration', text: 'Phía xa, bầu trời vặn vẹo, nơi các mảnh ghép của 7 thế giới đang dần dung hợp.' },
            { type: 'narration', text: 'Và trong bóng tối rìa tầm nhìn, những sinh vật Hư Vô đang rình rập...' },
            { type: 'dialogue', speaker: 'Hệ Thống', text: '"Phát hiện thực thể Hư Vô tại Ngoại Vi Thánh Vực. Khuyến nghị: tiêu diệt để thu thập Mảnh Vỡ Quy Tắc (Runes) và tích lũy kinh nghiệm."' },
        ],
        choices: [
            { text: '⚔ Khám phá Ngoại Vi Thánh Vực', nextScene: 'exploration_start', action: 'start_exploration' },
            { text: '🏟 Đấu Trường PvP', nextScene: 'pvp_intro', action: 'open_pvp' },
            { text: '📋 Xem thông tin nhân vật', action: 'open_character_sheet' },
        ]
    },

    exploration_start: {
        id: 'exploration_start',
        text: [
            { type: 'narration', text: 'Ngươi tiến vào vùng Ngoại Vi Thánh Vực. Không khí đặc quánh năng lượng hỗn loạn.' },
            { type: 'narration', text: 'Đâu đó trong sương mù, có tiếng gầm gừ vọng lại...' },
        ],
        choices: [
            { text: '⚔ Tiến lên phía trước (Chiến đấu)', action: 'random_encounter' },
            { text: '🔍 Thận trọng quan sát xung quanh', action: 'explore_careful' },
            { text: '🏠 Quay về trung tâm', nextScene: 'enter_fusion_domain' },
        ]
    },

    pvp_intro: {
        id: 'pvp_intro',
        text: [
            { type: 'system', text: '── Đấu Trường PvP ──' },
            { type: 'narration', text: 'Tại trung tâm Thánh Vực, một đấu trường cổ đại tồn tại từ thời hồng hoang.' },
            { type: 'narration', text: 'Nơi đây, những chiến binh từ 7 thế giới đọ sức với nhau để tranh giành Runes và danh vọng.' },
        ],
        choices: [
            { text: '🤖 Đấu với Đối Thủ (Bot - Dễ)', action: 'pvp_bot_easy' },
            { text: '🤖 Đấu với Đối Thủ (Bot - Thường)', action: 'pvp_bot_normal' },
            { text: '🤖 Đấu với Đối Thủ (Bot - Khó)', action: 'pvp_bot_hard' },
            { text: '🌐 Đấu Online (Chưa mở)', action: 'pvp_online_placeholder' },
            { text: '🏠 Quay về', nextScene: 'enter_fusion_domain' },
        ]
    },

    victory: {
        id: 'victory',
        text: [
            { type: 'system', text: '✦ CHIẾN THẮNG ✦' },
        ],
        choices: [
            { text: '▸ Tiếp tục khám phá', nextScene: 'exploration_start' },
            { text: '🏠 Quay về trung tâm', nextScene: 'enter_fusion_domain' },
        ]
    },

    defeat: {
        id: 'defeat',
        text: [
            { type: 'system', text: '✖ THẤT BẠI ✖' },
            { type: 'narration', text: 'Ngươi gục ngã... Nhưng Hệ Thống đã can thiệp, kéo ý thức ngươi trở lại.' },
            { type: 'dialogue', speaker: 'Hệ Thống', text: '"Phục hồi khẩn cấp hoàn tất. HP đã được hồi phục 50%. Hãy cẩn thận hơn."' },
        ],
        choices: [
            { text: '▸ Đứng dậy và tiếp tục', nextScene: 'enter_fusion_domain' },
        ]
    }
};
