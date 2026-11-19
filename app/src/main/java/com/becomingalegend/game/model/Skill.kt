package com.becomingalegend.game.model

// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────

/** Loại kỹ năng */
enum class SkillType {
    ACTIVE,   // Chủ động – cần kích hoạt
    PASSIVE   // Bị động – luôn có hiệu lực
}

/** Loại mục tiêu */
enum class TargetType {
    SELF,           // Bản thân
    SINGLE_ENEMY,   // Một kẻ địch
    ALL_ENEMIES,    // Tất cả kẻ địch
    SINGLE_ALLY,    // Một đồng minh
    ALL_ALLIES      // Tất cả đồng minh
}

/** Loại hiệu ứng trạng thái */
enum class StatusEffectType {
    POISON,  // Trúng Độc – mất HP mỗi lượt
    STUN,    // Choáng – mất lượt
    BURN,    // Thiêu Đốt – mất HP mỗi lượt, giảm DEF
    FREEZE,  // Đóng Băng – mất lượt, tăng sát thương nhận vào
    BUFF,    // Tăng cường – tăng chỉ số
    DEBUFF   // Suy yếu – giảm chỉ số
}

// ─────────────────────────────────────────────
// Data classes
// ─────────────────────────────────────────────

/**
 * Hiệu ứng trạng thái áp lên mục tiêu.
 */
data class StatusEffect(
    val type: StatusEffectType,
    val value: Int,           // Giá trị hiệu ứng (dmg/tick hoặc % buff/debuff)
    val duration: Int,        // Số lượt tồn tại
    val chance: Float = 1.0f, // Xác suất áp dụng (0.0–1.0)
    val statAffected: String? = null // Chỉ số bị ảnh hưởng (cho BUFF/DEBUFF): "attack", "defense", v.v.
)

/**
 * Kỹ năng nhân vật.
 */
data class Skill(
    val id: String,
    val name: String,
    val description: String,
    val type: SkillType,
    val damageMultiplier: Float,
    val mpCost: Int,
    val cooldown: Int,            // Số lượt hồi chiêu
    val targetType: TargetType,
    val effects: List<StatusEffect> = emptyList()
)

// ─────────────────────────────────────────────
// Predefined Skills — 3-4 per base class (14 classes × ~3.5 = ~49 skills)
// ─────────────────────────────────────────────

object PredefinedSkills {

    // ═══════════════════════════════════════════
    // TECHNOLOGY – Công Nghệ Thế Giới
    // ═══════════════════════════════════════════

    // ── Đặc Vụ (Agent) ──
    val AGENT_PRECISION_SHOT = Skill(
        id = "tech_agent_precision_shot",
        name = "Phát Bắn Chính Xác",
        description = "Nhắm bắn chính xác vào điểm yếu, gây sát thương cao.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.8f,
        mpCost = 15,
        cooldown = 1,
        targetType = TargetType.SINGLE_ENEMY
    )
    val AGENT_SMOKE_BOMB = Skill(
        id = "tech_agent_smoke_bomb",
        name = "Bom Khói",
        description = "Ném bom khói gây choáng kẻ địch, giảm chính xác.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0.5f,
        mpCost = 20,
        cooldown = 3,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.DEBUFF, 20, 2, 0.7f, "attack"))
    )
    val AGENT_TACTICAL_SCAN = Skill(
        id = "tech_agent_tactical_scan",
        name = "Quét Chiến Thuật",
        description = "Phân tích kẻ địch, tăng tỷ lệ bạo kích bản thân.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 10,
        cooldown = 4,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 15, 3, 1.0f, "critRate"))
    )

    // ── Kỹ Sư (Engineer) ──
    val ENGINEER_TURRET_DEPLOY = Skill(
        id = "tech_engineer_turret",
        name = "Triển Khai Pháo Đài",
        description = "Đặt pháo tự động bắn tất cả kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.2f,
        mpCost = 25,
        cooldown = 3,
        targetType = TargetType.ALL_ENEMIES
    )
    val ENGINEER_SHIELD_BOOST = Skill(
        id = "tech_engineer_shield",
        name = "Tăng Cường Khiên",
        description = "Kích hoạt lá chắn năng lượng, tăng phòng thủ.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 20,
        cooldown = 4,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 30, 3, 1.0f, "defense"))
    )
    val ENGINEER_EMP_BLAST = Skill(
        id = "tech_engineer_emp",
        name = "Xung Điện Từ",
        description = "Phát xung EMP gây choáng và sát thương.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.0f,
        mpCost = 30,
        cooldown = 4,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.STUN, 0, 1, 0.5f))
    )

    // ═══════════════════════════════════════════
    // CULTIVATION – Thế Giới Tu Tiên
    // ═══════════════════════════════════════════

    // ── Kiếm Tu (Sword Cultivator) ──
    val SWORD_SLASH = Skill(
        id = "cult_sword_slash",
        name = "Kiếm Khí Trảm",
        description = "Phóng kiếm khí chém xuyên kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 2.0f,
        mpCost = 15,
        cooldown = 1,
        targetType = TargetType.SINGLE_ENEMY
    )
    val SWORD_STORM = Skill(
        id = "cult_sword_storm",
        name = "Vạn Kiếm Quy Tông",
        description = "Triệu hồi nghìn kiếm tấn công tất cả.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.5f,
        mpCost = 35,
        cooldown = 4,
        targetType = TargetType.ALL_ENEMIES
    )
    val SWORD_INTENT = Skill(
        id = "cult_sword_intent",
        name = "Kiếm Ý",
        description = "Tập trung kiếm ý, tăng sát thương bạo kích.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 10,
        cooldown = 5,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 25, 3, 1.0f, "critDamage"))
    )
    val SWORD_DEFENSE = Skill(
        id = "cult_sword_defense",
        name = "Hộ Thể Kiếm Trận",
        description = "Kiếm khí bao quanh hộ thể, tăng phòng thủ.",
        type = SkillType.PASSIVE,
        damageMultiplier = 0f,
        mpCost = 0,
        cooldown = 0,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 10, -1, 1.0f, "defense"))
    )

    // ── Đan Sư (Alchemist) ──
    val ALCHEMIST_POISON_PILL = Skill(
        id = "cult_alchemist_poison",
        name = "Độc Đan Thuật",
        description = "Ném đan dược độc vào kẻ địch, gây trúng độc.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0.8f,
        mpCost = 15,
        cooldown = 2,
        targetType = TargetType.SINGLE_ENEMY,
        effects = listOf(StatusEffect(StatusEffectType.POISON, 15, 3, 0.8f))
    )
    val ALCHEMIST_HEAL = Skill(
        id = "cult_alchemist_heal",
        name = "Hồi Xuân Đan",
        description = "Luyện đan hồi phục sinh lực cho bản thân.",
        type = SkillType.ACTIVE,
        damageMultiplier = -1.5f, // negative = heal
        mpCost = 20,
        cooldown = 3,
        targetType = TargetType.SELF
    )
    val ALCHEMIST_EXPLODE = Skill(
        id = "cult_alchemist_explode",
        name = "Nổ Lôi Đan",
        description = "Ném đan dược nổ gây sát thương diện rộng.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.6f,
        mpCost = 25,
        cooldown = 3,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.BURN, 10, 2, 0.4f))
    )

    // ═══════════════════════════════════════════
    // MUTANT – Thế Giới Dị Nhân
    // ═══════════════════════════════════════════

    // ── Kẻ Đột Biến (Mutator) ──
    val MUTATOR_CLAW_STRIKE = Skill(
        id = "mut_mutator_claw",
        name = "Vuốt Đột Biến",
        description = "Tấn công bằng vuốt sắc bén đã biến dị.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.9f,
        mpCost = 12,
        cooldown = 1,
        targetType = TargetType.SINGLE_ENEMY
    )
    val MUTATOR_REGEN = Skill(
        id = "mut_mutator_regen",
        name = "Tái Sinh Tế Bào",
        description = "Kích hoạt gen tái sinh, hồi phục HP mỗi lượt.",
        type = SkillType.ACTIVE,
        damageMultiplier = -1.0f,
        mpCost = 18,
        cooldown = 4,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 20, 3, 1.0f, "defense"))
    )
    val MUTATOR_FRENZY = Skill(
        id = "mut_mutator_frenzy",
        name = "Cuồng Hóa",
        description = "Đột biến toàn thân, tăng mạnh tấn công nhưng giảm phòng thủ.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 20,
        cooldown = 5,
        targetType = TargetType.SELF,
        effects = listOf(
            StatusEffect(StatusEffectType.BUFF, 40, 3, 1.0f, "attack"),
            StatusEffect(StatusEffectType.DEBUFF, 20, 3, 1.0f, "defense")
        )
    )

    // ── Kẻ Thích Nghi (Adaptor) ──
    val ADAPTOR_ABSORB = Skill(
        id = "mut_adaptor_absorb",
        name = "Hấp Thụ Gen",
        description = "Hấp thụ gen kẻ địch, giảm chỉ số đối phương.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.0f,
        mpCost = 20,
        cooldown = 3,
        targetType = TargetType.SINGLE_ENEMY,
        effects = listOf(StatusEffect(StatusEffectType.DEBUFF, 15, 3, 0.7f, "attack"))
    )
    val ADAPTOR_CARAPACE = Skill(
        id = "mut_adaptor_carapace",
        name = "Giáp Sinh Học",
        description = "Mọc lớp giáp sinh học cứng cáp.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 15,
        cooldown = 4,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 35, 3, 1.0f, "defense"))
    )
    val ADAPTOR_TOXIC_SPRAY = Skill(
        id = "mut_adaptor_toxic",
        name = "Phun Độc Tố",
        description = "Phun chất độc sinh học lên tất cả kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0.7f,
        mpCost = 22,
        cooldown = 3,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.POISON, 12, 3, 0.65f))
    )

    // ═══════════════════════════════════════════
    // DIVINE – Thế Giới Chư Thần
    // ═══════════════════════════════════════════

    // ── Thánh Chiến Binh (Holy Warrior) ──
    val HOLY_SMITE = Skill(
        id = "div_holy_smite",
        name = "Thần Thánh Phán Xét",
        description = "Triệu hồi thánh quang phán xét kẻ thù.",
        type = SkillType.ACTIVE,
        damageMultiplier = 2.2f,
        mpCost = 20,
        cooldown = 2,
        targetType = TargetType.SINGLE_ENEMY
    )
    val HOLY_SHIELD = Skill(
        id = "div_holy_shield",
        name = "Thần Khiên",
        description = "Tạo khiên thần thánh bảo vệ bản thân.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 18,
        cooldown = 4,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 40, 2, 1.0f, "defense"))
    )
    val HOLY_WRATH = Skill(
        id = "div_holy_wrath",
        name = "Cơn Thịnh Nộ Thiêng",
        description = "Giáng cơn thịnh nộ thần thánh lên tất cả kẻ thù.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.6f,
        mpCost = 35,
        cooldown = 4,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.BURN, 15, 2, 0.5f))
    )

    // ── Thần Quan (Oracle) ──
    val ORACLE_BLESSING = Skill(
        id = "div_oracle_blessing",
        name = "Thần Phúc",
        description = "Ban phước lành, hồi phục HP cho bản thân.",
        type = SkillType.ACTIVE,
        damageMultiplier = -2.0f,
        mpCost = 22,
        cooldown = 3,
        targetType = TargetType.SELF
    )
    val ORACLE_DIVINE_RAY = Skill(
        id = "div_oracle_ray",
        name = "Thần Quang Tuyến",
        description = "Bắn tia sáng thần thánh xuyên thấu kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.8f,
        mpCost = 18,
        cooldown = 2,
        targetType = TargetType.SINGLE_ENEMY
    )
    val ORACLE_PROPHECY = Skill(
        id = "div_oracle_prophecy",
        name = "Lời Tiên Tri",
        description = "Tiên đoán tương lai, tăng tốc độ và bạo kích.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 15,
        cooldown = 5,
        targetType = TargetType.SELF,
        effects = listOf(
            StatusEffect(StatusEffectType.BUFF, 20, 3, 1.0f, "speed"),
            StatusEffect(StatusEffectType.BUFF, 10, 3, 1.0f, "critRate")
        )
    )
    val ORACLE_SMITE_EVIL = Skill(
        id = "div_oracle_smite_evil",
        name = "Trừ Tà",
        description = "Đánh bại tà ác, gây sát thương cộng thêm lên quái Hư Vô.",
        type = SkillType.ACTIVE,
        damageMultiplier = 2.5f,
        mpCost = 30,
        cooldown = 4,
        targetType = TargetType.SINGLE_ENEMY
    )

    // ═══════════════════════════════════════════
    // ENERGY – Năng Lượng Thế Giới
    // ═══════════════════════════════════════════

    // ── Nguyên Tố Sư (Elementalist) ──
    val ELEM_FIRE_BURST = Skill(
        id = "ene_elem_fire",
        name = "Hỏa Viêm Bộc Phát",
        description = "Phóng cầu lửa nguyên tố cháy rực.",
        type = SkillType.ACTIVE,
        damageMultiplier = 2.0f,
        mpCost = 18,
        cooldown = 2,
        targetType = TargetType.SINGLE_ENEMY,
        effects = listOf(StatusEffect(StatusEffectType.BURN, 12, 2, 0.6f))
    )
    val ELEM_ICE_WAVE = Skill(
        id = "ene_elem_ice",
        name = "Băng Sương Triều",
        description = "Triệu hồi sóng băng đóng băng kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.4f,
        mpCost = 22,
        cooldown = 3,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.FREEZE, 0, 1, 0.4f))
    )
    val ELEM_THUNDER_STRIKE = Skill(
        id = "ene_elem_thunder",
        name = "Lôi Đình Kích",
        description = "Giáng sấm sét lên kẻ địch, gây choáng.",
        type = SkillType.ACTIVE,
        damageMultiplier = 2.3f,
        mpCost = 28,
        cooldown = 3,
        targetType = TargetType.SINGLE_ENEMY,
        effects = listOf(StatusEffect(StatusEffectType.STUN, 0, 1, 0.5f))
    )

    // ── Thuần Thú Sư (Beast Tamer) ──
    val TAMER_SUMMON_BEAST = Skill(
        id = "ene_tamer_summon",
        name = "Triệu Hồi Năng Thú",
        description = "Triệu hồi thú năng lượng tấn công kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.7f,
        mpCost = 20,
        cooldown = 2,
        targetType = TargetType.SINGLE_ENEMY
    )
    val TAMER_PRIMAL_ROAR = Skill(
        id = "ene_tamer_roar",
        name = "Tiếng Gầm Nguyên Thủy",
        description = "Gầm vang khiến kẻ địch sợ hãi, giảm tấn công.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0.5f,
        mpCost = 15,
        cooldown = 3,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.DEBUFF, 25, 2, 0.7f, "attack"))
    )
    val TAMER_NATURE_HEAL = Skill(
        id = "ene_tamer_heal",
        name = "Sinh Lực Đại Ngàn",
        description = "Hấp thụ năng lượng tự nhiên hồi phục bản thân.",
        type = SkillType.ACTIVE,
        damageMultiplier = -1.8f,
        mpCost = 22,
        cooldown = 4,
        targetType = TargetType.SELF
    )

    // ═══════════════════════════════════════════
    // ELDRITCH – Quỷ Dị Thế Giới
    // ═══════════════════════════════════════════

    // ── Trục Ma Sư (Exorcist) ──
    val EXORCIST_PURIFY = Skill(
        id = "eld_exorcist_purify",
        name = "Tịnh Hóa",
        description = "Tịnh hóa tà khí, gây sát thương lên quái quỷ dị.",
        type = SkillType.ACTIVE,
        damageMultiplier = 2.0f,
        mpCost = 18,
        cooldown = 2,
        targetType = TargetType.SINGLE_ENEMY
    )
    val EXORCIST_SEAL = Skill(
        id = "eld_exorcist_seal",
        name = "Phong Ấn Thuật",
        description = "Phong ấn kẻ địch, gây choáng.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0.8f,
        mpCost = 25,
        cooldown = 4,
        targetType = TargetType.SINGLE_ENEMY,
        effects = listOf(StatusEffect(StatusEffectType.STUN, 0, 2, 0.6f))
    )
    val EXORCIST_WARD = Skill(
        id = "eld_exorcist_ward",
        name = "Bùa Hộ Mệnh",
        description = "Dán bùa hộ mệnh, tăng phòng thủ và kháng hiệu ứng.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 15,
        cooldown = 5,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 30, 3, 1.0f, "defense"))
    )

    // ── Nguyền Sư (Hex Caster) ──
    val HEX_CURSE = Skill(
        id = "eld_hex_curse",
        name = "Lời Nguyền Hắc Ám",
        description = "Giáng lời nguyền lên kẻ địch, gây suy yếu toàn diện.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.0f,
        mpCost = 22,
        cooldown = 3,
        targetType = TargetType.SINGLE_ENEMY,
        effects = listOf(
            StatusEffect(StatusEffectType.DEBUFF, 20, 3, 0.75f, "defense"),
            StatusEffect(StatusEffectType.DEBUFF, 15, 3, 0.75f, "attack")
        )
    )
    val HEX_SOUL_DRAIN = Skill(
        id = "eld_hex_drain",
        name = "Hút Hồn",
        description = "Hút sinh lực kẻ địch hồi phục cho bản thân.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.5f,
        mpCost = 20,
        cooldown = 3,
        targetType = TargetType.SINGLE_ENEMY
    )
    val HEX_DARK_RITUAL = Skill(
        id = "eld_hex_ritual",
        name = "Nghi Lễ Hắc Ám",
        description = "Thực hiện nghi lễ, gây sát thương diện rộng và trúng độc.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.3f,
        mpCost = 30,
        cooldown = 4,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.POISON, 18, 3, 0.6f))
    )
    val HEX_FEAR = Skill(
        id = "eld_hex_fear",
        name = "Nỗi Sợ Vô Hình",
        description = "Gieo rắc nỗi sợ, giảm tốc độ kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0.3f,
        mpCost = 12,
        cooldown = 2,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.DEBUFF, 20, 2, 0.6f, "speed"))
    )

    // ═══════════════════════════════════════════
    // SPIRIT – Tinh Thần Thế Giới
    // ═══════════════════════════════════════════

    // ── Mộng Du Giả (Dreamwalker) ──
    val DREAM_ILLUSION = Skill(
        id = "spi_dream_illusion",
        name = "Ảo Mộng Trận",
        description = "Tạo ảo giác khiến kẻ địch lạc lối.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.2f,
        mpCost = 18,
        cooldown = 2,
        targetType = TargetType.ALL_ENEMIES,
        effects = listOf(StatusEffect(StatusEffectType.DEBUFF, 15, 2, 0.6f, "speed"))
    )
    val DREAM_PSYCHIC_BLAST = Skill(
        id = "spi_dream_psychic",
        name = "Tinh Thần Xung Kích",
        description = "Tấn công tinh thần trực tiếp vào tâm trí kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 2.0f,
        mpCost = 20,
        cooldown = 2,
        targetType = TargetType.SINGLE_ENEMY
    )
    val DREAM_MIND_SHIELD = Skill(
        id = "spi_dream_shield",
        name = "Tâm Thần Hộ Giáp",
        description = "Tạo rào cản tinh thần bảo vệ bản thân.",
        type = SkillType.ACTIVE,
        damageMultiplier = 0f,
        mpCost = 15,
        cooldown = 4,
        targetType = TargetType.SELF,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 25, 3, 1.0f, "defense"))
    )

    // ── Hồn Sư (Soul Mage) ──
    val SOUL_STRIKE = Skill(
        id = "spi_soul_strike",
        name = "Hồn Kích",
        description = "Đánh thẳng vào linh hồn kẻ địch.",
        type = SkillType.ACTIVE,
        damageMultiplier = 2.2f,
        mpCost = 22,
        cooldown = 2,
        targetType = TargetType.SINGLE_ENEMY
    )
    val SOUL_HARVEST = Skill(
        id = "spi_soul_harvest",
        name = "Thu Hoạch Linh Hồn",
        description = "Thu hoạch mảnh hồn, tăng tinh thần lực.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.0f,
        mpCost = 18,
        cooldown = 3,
        targetType = TargetType.SINGLE_ENEMY,
        effects = listOf(StatusEffect(StatusEffectType.BUFF, 15, 4, 1.0f, "spiritualPower"))
    )
    val SOUL_LINK = Skill(
        id = "spi_soul_link",
        name = "Liên Kết Hồn",
        description = "Liên kết linh hồn hồi phục HP bản thân.",
        type = SkillType.ACTIVE,
        damageMultiplier = -1.5f,
        mpCost = 20,
        cooldown = 3,
        targetType = TargetType.SELF
    )
    val SOUL_BANISH = Skill(
        id = "spi_soul_banish",
        name = "Trục Hồn",
        description = "Trục xuất linh hồn khỏi thể xác, gây choáng.",
        type = SkillType.ACTIVE,
        damageMultiplier = 1.8f,
        mpCost = 30,
        cooldown = 4,
        targetType = TargetType.SINGLE_ENEMY,
        effects = listOf(StatusEffect(StatusEffectType.STUN, 0, 1, 0.55f))
    )

    // ═══════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════

    /** Lấy danh sách skill mặc định cho class ID */
    fun getSkillsForClass(classId: String): List<Skill> = when (classId) {
        // Technology
        "tech_agent" -> listOf(AGENT_PRECISION_SHOT, AGENT_SMOKE_BOMB, AGENT_TACTICAL_SCAN)
        "tech_engineer" -> listOf(ENGINEER_TURRET_DEPLOY, ENGINEER_SHIELD_BOOST, ENGINEER_EMP_BLAST)
        // Cultivation
        "cult_sword" -> listOf(SWORD_SLASH, SWORD_STORM, SWORD_INTENT, SWORD_DEFENSE)
        "cult_alchemist" -> listOf(ALCHEMIST_POISON_PILL, ALCHEMIST_HEAL, ALCHEMIST_EXPLODE)
        // Mutant
        "mut_mutator" -> listOf(MUTATOR_CLAW_STRIKE, MUTATOR_REGEN, MUTATOR_FRENZY)
        "mut_adaptor" -> listOf(ADAPTOR_ABSORB, ADAPTOR_CARAPACE, ADAPTOR_TOXIC_SPRAY)
        // Divine
        "div_holy_warrior" -> listOf(HOLY_SMITE, HOLY_SHIELD, HOLY_WRATH)
        "div_oracle" -> listOf(ORACLE_BLESSING, ORACLE_DIVINE_RAY, ORACLE_PROPHECY, ORACLE_SMITE_EVIL)
        // Energy
        "ene_elementalist" -> listOf(ELEM_FIRE_BURST, ELEM_ICE_WAVE, ELEM_THUNDER_STRIKE)
        "ene_beast_tamer" -> listOf(TAMER_SUMMON_BEAST, TAMER_PRIMAL_ROAR, TAMER_NATURE_HEAL)
        // Eldritch
        "eld_exorcist" -> listOf(EXORCIST_PURIFY, EXORCIST_SEAL, EXORCIST_WARD)
        "eld_hex_caster" -> listOf(HEX_CURSE, HEX_SOUL_DRAIN, HEX_DARK_RITUAL, HEX_FEAR)
        // Spirit
        "spi_dreamwalker" -> listOf(DREAM_ILLUSION, DREAM_PSYCHIC_BLAST, DREAM_MIND_SHIELD)
        "spi_soul_mage" -> listOf(SOUL_STRIKE, SOUL_HARVEST, SOUL_LINK, SOUL_BANISH)
        else -> emptyList()
    }
}
