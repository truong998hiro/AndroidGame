package com.becomingalegend.game.model

// ─────────────────────────────────────────────
// Rarity enum (dùng chung cho Rune, Item, v.v.)
// ─────────────────────────────────────────────

/**
 * Cấp độ hiếm — dùng cho Rune, Item, trang bị.
 */
enum class Rarity(val displayName: String, val colorHex: Long) {
    COMMON("Thường", 0xFFB0B0B0),         // Xám
    UNCOMMON("Không Thường", 0xFF4ADE80),  // Xanh lá
    RARE("Hiếm", 0xFF3B82F6),             // Xanh dương
    EPIC("Sử Thi", 0xFFA855F7),           // Tím
    LEGENDARY("Huyền Thoại", 0xFFF59E0B), // Cam vàng
    MYTHIC("Thần Thoại", 0xFFEF4444);     // Đỏ

    /** Cấp hiếm tiếp theo (dùng cho fusion) */
    fun nextRarity(): Rarity? = when (this) {
        COMMON -> UNCOMMON
        UNCOMMON -> RARE
        RARE -> EPIC
        EPIC -> LEGENDARY
        LEGENDARY -> MYTHIC
        MYTHIC -> null
    }
}

// ─────────────────────────────────────────────
// Rune data class
// ─────────────────────────────────────────────

/**
 * Mảnh vỡ quy tắc — thu thập từ kẻ địch.
 * Mỗi Rune mang đặc tính của một thế giới cụ thể.
 */
data class Rune(
    val id: String,
    val name: String,
    val world: World,
    val rarity: Rarity,
    val statBonus: Stats,
    val powerMultiplier: Float = 1.0f,
    val cooldownReduction: Float = 0f,
    val description: String
)

// ─────────────────────────────────────────────
// Predefined Runes — Runes mẫu cho mỗi thế giới
// ─────────────────────────────────────────────

object PredefinedRunes {

    // ═══ TECHNOLOGY ═══
    val TECH_CIRCUIT_RUNE = Rune(
        id = "rune_tech_circuit", name = "Phù Văn Mạch Điện",
        world = World.TECHNOLOGY, rarity = Rarity.COMMON,
        statBonus = Stats(maxHp = 0, currentHp = 0, maxMp = 10, currentMp = 10, attack = 3, defense = 0, speed = 2, critRate = 0f, critDamage = 0f, spiritualPower = 0),
        powerMultiplier = 1.05f, description = "Mảnh mạch điện cổ đại, tăng công nghệ chiến đấu."
    )
    val TECH_AI_CORE_RUNE = Rune(
        id = "rune_tech_ai_core", name = "Lõi AI",
        world = World.TECHNOLOGY, rarity = Rarity.RARE,
        statBonus = Stats(maxHp = 0, currentHp = 0, maxMp = 20, currentMp = 20, attack = 8, defense = 0, speed = 5, critRate = 0.03f, critDamage = 0.1f, spiritualPower = 0),
        powerMultiplier = 1.12f, cooldownReduction = 0.05f,
        description = "Lõi trí tuệ nhân tạo tiên tiến, tối ưu hóa chiến đấu."
    )
    val TECH_PLASMA_RUNE = Rune(
        id = "rune_tech_plasma", name = "Tinh Thể Plasma",
        world = World.TECHNOLOGY, rarity = Rarity.EPIC,
        statBonus = Stats(maxHp = 0, currentHp = 0, maxMp = 30, currentMp = 30, attack = 15, defense = 0, speed = 5, critRate = 0.05f, critDamage = 0.2f, spiritualPower = 0),
        powerMultiplier = 1.20f, cooldownReduction = 0.08f,
        description = "Tinh thể năng lượng plasma cô đọng sức hủy diệt."
    )

    // ═══ CULTIVATION ═══
    val CULT_SPIRIT_STONE = Rune(
        id = "rune_cult_spirit_stone", name = "Linh Thạch",
        world = World.CULTIVATION, rarity = Rarity.COMMON,
        statBonus = Stats(maxHp = 15, currentHp = 15, maxMp = 5, currentMp = 5, attack = 2, defense = 1, speed = 0, critRate = 0f, critDamage = 0f, spiritualPower = 5),
        powerMultiplier = 1.05f, description = "Viên đá chứa linh khí cơ bản."
    )
    val CULT_GOLDEN_CORE = Rune(
        id = "rune_cult_golden_core", name = "Kim Đan",
        world = World.CULTIVATION, rarity = Rarity.RARE,
        statBonus = Stats(maxHp = 30, currentHp = 30, maxMp = 15, currentMp = 15, attack = 6, defense = 3, speed = 2, critRate = 0.02f, critDamage = 0.1f, spiritualPower = 15),
        powerMultiplier = 1.15f, description = "Kim đan ngưng tụ, cội nguồn sức mạnh tu tiên."
    )
    val CULT_NASCENT_SOUL = Rune(
        id = "rune_cult_nascent_soul", name = "Nguyên Anh",
        world = World.CULTIVATION, rarity = Rarity.LEGENDARY,
        statBonus = Stats(maxHp = 80, currentHp = 80, maxMp = 40, currentMp = 40, attack = 15, defense = 8, speed = 5, critRate = 0.05f, critDamage = 0.25f, spiritualPower = 40),
        powerMultiplier = 1.30f, cooldownReduction = 0.10f,
        description = "Nguyên anh xuất thể — cảnh giới tu tiên tối cao."
    )

    // ═══ MUTANT ═══
    val MUT_DNA_FRAGMENT = Rune(
        id = "rune_mut_dna", name = "Mảnh Gen Đột Biến",
        world = World.MUTANT, rarity = Rarity.COMMON,
        statBonus = Stats(maxHp = 20, currentHp = 20, maxMp = 0, currentMp = 0, attack = 3, defense = 2, speed = 1, critRate = 0.01f, critDamage = 0f, spiritualPower = 0),
        powerMultiplier = 1.04f, description = "Mảnh gen sinh vật đột biến đơn giản."
    )
    val MUT_EVOLVED_GENE = Rune(
        id = "rune_mut_evolved_gene", name = "Gen Tiến Hóa",
        world = World.MUTANT, rarity = Rarity.RARE,
        statBonus = Stats(maxHp = 40, currentHp = 40, maxMp = 5, currentMp = 5, attack = 8, defense = 5, speed = 3, critRate = 0.03f, critDamage = 0.1f, spiritualPower = 0),
        powerMultiplier = 1.12f, description = "Gen đã tiến hóa hoàn chỉnh, sức mạnh ghê gớm."
    )
    val MUT_APEX_GENOME = Rune(
        id = "rune_mut_apex", name = "Bộ Gen Đỉnh Cao",
        world = World.MUTANT, rarity = Rarity.EPIC,
        statBonus = Stats(maxHp = 60, currentHp = 60, maxMp = 10, currentMp = 10, attack = 14, defense = 8, speed = 5, critRate = 0.05f, critDamage = 0.15f, spiritualPower = 0),
        powerMultiplier = 1.18f, description = "Bộ gen đỉnh cao của chuỗi tiến hóa."
    )

    // ═══ DIVINE ═══
    val DIV_FAITH_CRYSTAL = Rune(
        id = "rune_div_faith", name = "Tinh Thể Tín Ngưỡng",
        world = World.DIVINE, rarity = Rarity.COMMON,
        statBonus = Stats(maxHp = 10, currentHp = 10, maxMp = 10, currentMp = 10, attack = 2, defense = 2, speed = 0, critRate = 0f, critDamage = 0f, spiritualPower = 5),
        powerMultiplier = 1.05f, description = "Tinh thể chứa đựng lòng tin của tín đồ."
    )
    val DIV_DIVINITY_SHARD = Rune(
        id = "rune_div_divinity", name = "Mảnh Thần Tính",
        world = World.DIVINE, rarity = Rarity.RARE,
        statBonus = Stats(maxHp = 25, currentHp = 25, maxMp = 20, currentMp = 20, attack = 5, defense = 5, speed = 2, critRate = 0.02f, critDamage = 0.1f, spiritualPower = 15),
        powerMultiplier = 1.15f, description = "Mảnh thần tính rơi từ thần linh."
    )
    val DIV_GOD_RELIC = Rune(
        id = "rune_div_god_relic", name = "Thần Khí",
        world = World.DIVINE, rarity = Rarity.LEGENDARY,
        statBonus = Stats(maxHp = 60, currentHp = 60, maxMp = 50, currentMp = 50, attack = 12, defense = 10, speed = 5, critRate = 0.05f, critDamage = 0.3f, spiritualPower = 35),
        powerMultiplier = 1.30f, cooldownReduction = 0.12f,
        description = "Thần khí cổ đại — khí giới của chư thần."
    )

    // ═══ ENERGY ═══
    val ENE_CRYSTAL_SHARD = Rune(
        id = "rune_ene_crystal", name = "Mảnh Tinh Thể Nguyên Tố",
        world = World.ENERGY, rarity = Rarity.COMMON,
        statBonus = Stats(maxHp = 5, currentHp = 5, maxMp = 15, currentMp = 15, attack = 4, defense = 0, speed = 1, critRate = 0f, critDamage = 0f, spiritualPower = 0),
        powerMultiplier = 1.06f, description = "Mảnh tinh thể nguyên tố thô."
    )
    val ENE_STORM_CORE = Rune(
        id = "rune_ene_storm_core", name = "Lõi Bão Nguyên Tố",
        world = World.ENERGY, rarity = Rarity.RARE,
        statBonus = Stats(maxHp = 10, currentHp = 10, maxMp = 25, currentMp = 25, attack = 10, defense = 2, speed = 4, critRate = 0.03f, critDamage = 0.1f, spiritualPower = 0),
        powerMultiplier = 1.15f, description = "Lõi bão nguyên tố ngưng tụ sức mạnh hủy diệt."
    )
    val ENE_PRIMAL_ESSENCE = Rune(
        id = "rune_ene_primal", name = "Tinh Hoa Nguyên Thủy",
        world = World.ENERGY, rarity = Rarity.EPIC,
        statBonus = Stats(maxHp = 20, currentHp = 20, maxMp = 40, currentMp = 40, attack = 16, defense = 3, speed = 6, critRate = 0.04f, critDamage = 0.2f, spiritualPower = 0),
        powerMultiplier = 1.22f, cooldownReduction = 0.07f,
        description = "Tinh hoa nguyên thủy thuần khiết, nguồn năng lượng bất tận."
    )

    // ═══ ELDRITCH ═══
    val ELD_CURSED_FRAGMENT = Rune(
        id = "rune_eld_cursed", name = "Mảnh Cấm Vật",
        world = World.ELDRITCH, rarity = Rarity.COMMON,
        statBonus = Stats(maxHp = -5, currentHp = -5, maxMp = 5, currentMp = 5, attack = 5, defense = 0, speed = 0, critRate = 0.02f, critDamage = 0.05f, spiritualPower = 0),
        powerMultiplier = 1.08f, description = "Mảnh cấm vật mang lời nguyền, sức mạnh đổi bằng sinh lực."
    )
    val ELD_DARK_TOTEM = Rune(
        id = "rune_eld_totem", name = "Bùa Hắc Ám",
        world = World.ELDRITCH, rarity = Rarity.RARE,
        statBonus = Stats(maxHp = -10, currentHp = -10, maxMp = 15, currentMp = 15, attack = 12, defense = 0, speed = 2, critRate = 0.04f, critDamage = 0.15f, spiritualPower = 5),
        powerMultiplier = 1.18f, description = "Bùa hắc ám từ vực sâu, chỉ số khủng nhưng đánh đổi HP."
    )
    val ELD_ELDRITCH_RELIC = Rune(
        id = "rune_eld_relic", name = "Di Vật Thượng Cổ",
        world = World.ELDRITCH, rarity = Rarity.EPIC,
        statBonus = Stats(maxHp = -15, currentHp = -15, maxMp = 25, currentMp = 25, attack = 20, defense = 0, speed = 3, critRate = 0.06f, critDamage = 0.25f, spiritualPower = 10),
        powerMultiplier = 1.28f, cooldownReduction = 0.10f,
        description = "Di vật thượng cổ, sức mạnh kinh hoàng đi kèm cái giá đắt."
    )

    // ═══ SPIRIT ═══
    val SPI_SOUL_FRAGMENT = Rune(
        id = "rune_spi_soul", name = "Hồn Phách",
        world = World.SPIRIT, rarity = Rarity.COMMON,
        statBonus = Stats(maxHp = 10, currentHp = 10, maxMp = 10, currentMp = 10, attack = 0, defense = 0, speed = 2, critRate = 0f, critDamage = 0f, spiritualPower = 8),
        powerMultiplier = 1.03f, description = "Mảnh hồn phách từ cõi mộng, tăng tinh thần lực."
    )
    val SPI_IDEA_ESSENCE = Rune(
        id = "rune_spi_idea", name = "Tinh Hoa Ý Niệm",
        world = World.SPIRIT, rarity = Rarity.RARE,
        statBonus = Stats(maxHp = 20, currentHp = 20, maxMp = 20, currentMp = 20, attack = 3, defense = 2, speed = 4, critRate = 0.02f, critDamage = 0.05f, spiritualPower = 20),
        powerMultiplier = 1.10f, description = "Tinh hoa ý niệm ngưng tụ từ nghìn linh hồn."
    )
    val SPI_DREAM_CORE = Rune(
        id = "rune_spi_dream_core", name = "Lõi Mộng Cảnh",
        world = World.SPIRIT, rarity = Rarity.LEGENDARY,
        statBonus = Stats(maxHp = 50, currentHp = 50, maxMp = 50, currentMp = 50, attack = 8, defense = 5, speed = 8, critRate = 0.04f, critDamage = 0.15f, spiritualPower = 50),
        powerMultiplier = 1.25f, cooldownReduction = 0.10f,
        description = "Lõi mộng cảnh — quyền năng tối thượng của Tinh Thần Thế Giới."
    )

    /** Lấy tất cả rune theo thế giới */
    fun getRunesByWorld(world: World): List<Rune> = when (world) {
        World.TECHNOLOGY -> listOf(TECH_CIRCUIT_RUNE, TECH_AI_CORE_RUNE, TECH_PLASMA_RUNE)
        World.CULTIVATION -> listOf(CULT_SPIRIT_STONE, CULT_GOLDEN_CORE, CULT_NASCENT_SOUL)
        World.MUTANT -> listOf(MUT_DNA_FRAGMENT, MUT_EVOLVED_GENE, MUT_APEX_GENOME)
        World.DIVINE -> listOf(DIV_FAITH_CRYSTAL, DIV_DIVINITY_SHARD, DIV_GOD_RELIC)
        World.ENERGY -> listOf(ENE_CRYSTAL_SHARD, ENE_STORM_CORE, ENE_PRIMAL_ESSENCE)
        World.ELDRITCH -> listOf(ELD_CURSED_FRAGMENT, ELD_DARK_TOTEM, ELD_ELDRITCH_RELIC)
        World.SPIRIT -> listOf(SPI_SOUL_FRAGMENT, SPI_IDEA_ESSENCE, SPI_DREAM_CORE)
    }

    /** Lấy tất cả rune */
    fun getAllRunes(): List<Rune> = World.entries.flatMap { getRunesByWorld(it) }
}
