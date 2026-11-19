package com.becomingalegend.game.offline

import com.becomingalegend.game.model.*
import java.util.UUID
import kotlin.math.max
import kotlin.math.roundToInt
import kotlin.random.Random

/**
 * Tạo nhân vật bot ngẫu nhiên cho chế độ offline.
 * Bot có thế giới, class, level, chỉ số, kỹ năng, rune, trang bị ngẫu nhiên.
 */
object BotPlayer {

    // ── Danh sách class cơ bản theo từng thế giới ──
    private val classesByWorld: Map<World, List<CharacterClass>> = mapOf(
        World.TECHNOLOGY to listOf(
            makeClass("tech_soldier", "Đặc Vụ", World.TECHNOLOGY,
                Stats(maxHp = 120, currentHp = 120, maxMp = 40, currentMp = 40, attack = 14, defense = 8, speed = 12, critRate = 0.08f, critDamage = 1.6f),
                "Chiến binh công nghệ cao với súng và giáp cường hóa."),
            makeClass("tech_hacker", "Tin Tặc", World.TECHNOLOGY,
                Stats(maxHp = 90, currentHp = 90, maxMp = 70, currentMp = 70, attack = 8, defense = 4, speed = 15, critRate = 0.10f, critDamage = 1.8f),
                "Hack vào hệ thống địch, gây hỗn loạn và phá hoại.")
        ),
        World.CULTIVATION to listOf(
            makeClass("cult_swordsman", "Kiếm Tu", World.CULTIVATION,
                Stats(maxHp = 110, currentHp = 110, maxMp = 50, currentMp = 50, attack = 15, defense = 6, speed = 13, critRate = 0.07f, critDamage = 1.7f),
                "Kiếm tu luyện kiếm khí, trảm thiên diệt địa."),
            makeClass("cult_alchemist", "Đan Sư", World.CULTIVATION,
                Stats(maxHp = 100, currentHp = 100, maxMp = 65, currentMp = 65, attack = 9, defense = 5, speed = 10, critRate = 0.05f, critDamage = 1.5f),
                "Luyện đan dược, hỗ trợ đồng đội và suy yếu kẻ thù.")
        ),
        World.MUTANT to listOf(
            makeClass("mut_berserker", "Kẻ Đột Biến", World.MUTANT,
                Stats(maxHp = 140, currentHp = 140, maxMp = 30, currentMp = 30, attack = 18, defense = 7, speed = 9, critRate = 0.12f, critDamage = 1.9f),
                "Dị nhân cuồng nộ, sức mạnh bùng nổ."),
            makeClass("mut_psionic", "Ngoại Cảm", World.MUTANT,
                Stats(maxHp = 85, currentHp = 85, maxMp = 75, currentMp = 75, attack = 7, defense = 4, speed = 14, critRate = 0.06f, critDamage = 1.5f),
                "Kiểm soát tâm trí, gây thiệt hại tinh thần.")
        ),
        World.DIVINE to listOf(
            makeClass("div_paladin", "Thánh Kỵ Sĩ", World.DIVINE,
                Stats(maxHp = 130, currentHp = 130, maxMp = 45, currentMp = 45, attack = 12, defense = 12, speed = 8, critRate = 0.05f, critDamage = 1.5f),
                "Kỵ sĩ thần thánh, phòng thủ vững chắc."),
            makeClass("div_priest", "Thần Quan", World.DIVINE,
                Stats(maxHp = 95, currentHp = 95, maxMp = 70, currentMp = 70, attack = 6, defense = 6, speed = 11, critRate = 0.04f, critDamage = 1.4f),
                "Tín đồ của thần, chữa lành và ban phước.")
        ),
        World.ENERGY to listOf(
            makeClass("eng_elementalist", "Nguyên Tố Sư", World.ENERGY,
                Stats(maxHp = 100, currentHp = 100, maxMp = 60, currentMp = 60, attack = 13, defense = 5, speed = 11, critRate = 0.07f, critDamage = 1.6f),
                "Điều khiển nguyên tố, hủy diệt kẻ thù."),
            makeClass("eng_beastmaster", "Thú Vương", World.ENERGY,
                Stats(maxHp = 120, currentHp = 120, maxMp = 40, currentMp = 40, attack = 14, defense = 9, speed = 10, critRate = 0.08f, critDamage = 1.7f),
                "Thuần phục cự thú năng lượng.")
        ),
        World.ELDRITCH to listOf(
            makeClass("eld_warlock", "Tà Thuật Sư", World.ELDRITCH,
                Stats(maxHp = 90, currentHp = 90, maxMp = 70, currentMp = 70, attack = 11, defense = 4, speed = 12, critRate = 0.09f, critDamage = 1.8f),
                "Sử dụng tà thuật từ Quỷ Dị Thế Giới."),
            makeClass("eld_cursed", "Kẻ Bị Nguyền", World.ELDRITCH,
                Stats(maxHp = 130, currentHp = 130, maxMp = 35, currentMp = 35, attack = 16, defense = 6, speed = 8, critRate = 0.15f, critDamage = 2.0f),
                "Mang lời nguyền, trao đổi sinh mệnh lấy sức mạnh.")
        ),
        World.SPIRIT to listOf(
            makeClass("spi_dreamer", "Mộng Du Sư", World.SPIRIT,
                Stats(maxHp = 95, currentHp = 95, maxMp = 65, currentMp = 65, attack = 10, defense = 5, speed = 13, critRate = 0.06f, critDamage = 1.5f, spiritualPower = 15),
                "Thao túng mộng cảnh, gây thiệt hại tinh thần."),
            makeClass("spi_soulweaver", "Hồn Sư", World.SPIRIT,
                Stats(maxHp = 85, currentHp = 85, maxMp = 75, currentMp = 75, attack = 8, defense = 4, speed = 14, critRate = 0.05f, critDamage = 1.5f, spiritualPower = 20),
                "Thu hoạch và vận dụng linh hồn trong chiến đấu.")
        )
    )

    // ── Skill pool theo class ID ──
    private val skillPool: Map<String, List<Skill>> = mapOf(
        "tech_soldier" to listOf(
            Skill("ts_1", "Plasma Shot", "Bắn một phát plasma năng lượng cao.", SkillType.ACTIVE, 1.5f, 10, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ts_2", "EMP Blast", "Phóng sóng EMP gây choáng.", SkillType.ACTIVE, 1.2f, 15, 2, TargetType.ALL_ENEMIES, emptyList()),
            Skill("ts_3", "Nano Shield", "Kích hoạt khiên nano phòng thủ.", SkillType.ACTIVE, 0f, 12, 3, TargetType.SELF, emptyList()),
            Skill("ts_4", "Overcharge", "Tăng sát thương 50% trong 3 lượt.", SkillType.ACTIVE, 0f, 20, 4, TargetType.SELF, emptyList())
        ),
        "tech_hacker" to listOf(
            Skill("th_1", "Virus Upload", "Cài virus gây sát thương liên tục.", SkillType.ACTIVE, 0.8f, 8, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("th_2", "System Crash", "Hack hệ thống, giảm phòng thủ địch.", SkillType.ACTIVE, 1.0f, 12, 2, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("th_3", "Firewall", "Tạo tường lửa phòng thủ.", SkillType.ACTIVE, 0f, 10, 3, TargetType.SELF, emptyList()),
            Skill("th_4", "Data Drain", "Hút năng lượng kẻ địch.", SkillType.ACTIVE, 1.3f, 15, 2, TargetType.SINGLE_ENEMY, emptyList())
        ),
        "cult_swordsman" to listOf(
            Skill("cs_1", "Kiếm Khí Trảm", "Phóng kiếm khí chém kẻ thù.", SkillType.ACTIVE, 1.6f, 12, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("cs_2", "Vạn Kiếm Quy Tông", "Triệu hồi vạn kiếm tấn công.", SkillType.ACTIVE, 2.0f, 25, 3, TargetType.ALL_ENEMIES, emptyList()),
            Skill("cs_3", "Kiếm Ý Hộ Thể", "Dùng kiếm ý làm khiên.", SkillType.ACTIVE, 0f, 10, 2, TargetType.SELF, emptyList()),
            Skill("cs_4", "Nhất Kiếm Phá Vạn Pháp", "Chiêu tối thượng xuyên phá phòng thủ.", SkillType.ACTIVE, 2.5f, 35, 5, TargetType.SINGLE_ENEMY, emptyList())
        ),
        "cult_alchemist" to listOf(
            Skill("ca_1", "Hỏa Diệm Đan", "Ném đan dược nổ gây sát thương diện rộng.", SkillType.ACTIVE, 1.3f, 10, 0, TargetType.ALL_ENEMIES, emptyList()),
            Skill("ca_2", "Hồi Xuân Đan", "Hồi phục HP đáng kể.", SkillType.ACTIVE, 0f, 15, 2, TargetType.SELF, emptyList()),
            Skill("ca_3", "Độc Vụ", "Tạo sương độc gây thiệt hại liên tục.", SkillType.ACTIVE, 0.5f, 12, 2, TargetType.ALL_ENEMIES, emptyList()),
            Skill("ca_4", "Cường Hóa Đan", "Tăng chỉ số tấn công.", SkillType.ACTIVE, 0f, 18, 3, TargetType.SELF, emptyList())
        ),
        "mut_berserker" to listOf(
            Skill("mb_1", "Cuồng Nộ", "Tấn công với sức mạnh bùng nổ.", SkillType.ACTIVE, 1.8f, 8, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("mb_2", "Đột Biến Toàn Phần", "Biến hình, tăng mọi chỉ số.", SkillType.ACTIVE, 0f, 20, 4, TargetType.SELF, emptyList()),
            Skill("mb_3", "Tái Sinh", "Hồi phục HP dựa trên % HP tối đa.", SkillType.ACTIVE, 0f, 15, 3, TargetType.SELF, emptyList()),
            Skill("mb_4", "Chấn Động", "Gây sát thương diện rộng.", SkillType.ACTIVE, 1.4f, 12, 2, TargetType.ALL_ENEMIES, emptyList())
        ),
        "mut_psionic" to listOf(
            Skill("mp_1", "Tâm Linh Kích", "Tấn công tinh thần kẻ thù.", SkillType.ACTIVE, 1.4f, 10, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("mp_2", "Ảo Giác", "Gây hỗn loạn, giảm chính xác.", SkillType.ACTIVE, 0.6f, 12, 2, TargetType.ALL_ENEMIES, emptyList()),
            Skill("mp_3", "Khiên Tinh Thần", "Tạo khiên tinh thần phòng thủ.", SkillType.ACTIVE, 0f, 10, 3, TargetType.SELF, emptyList()),
            Skill("mp_4", "Chi Phối Tâm Trí", "Kiểm soát kẻ thù một lượt.", SkillType.ACTIVE, 0f, 25, 5, TargetType.SINGLE_ENEMY, emptyList())
        ),
        "div_paladin" to listOf(
            Skill("dp_1", "Thánh Kiếm Trảm", "Chém bằng thánh kiếm.", SkillType.ACTIVE, 1.5f, 10, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("dp_2", "Thiên Thần Hộ Thể", "Tăng phòng thủ đáng kể.", SkillType.ACTIVE, 0f, 12, 3, TargetType.SELF, emptyList()),
            Skill("dp_3", "Ánh Sáng Thánh Thiện", "Hồi phục HP và thanh lọc debuff.", SkillType.ACTIVE, 0f, 18, 3, TargetType.SELF, emptyList()),
            Skill("dp_4", "Thần Phạt", "Chiêu tối thượng gây sát thương thánh.", SkillType.ACTIVE, 2.2f, 30, 5, TargetType.SINGLE_ENEMY, emptyList())
        ),
        "div_priest" to listOf(
            Skill("dpr_1", "Thánh Quang", "Phóng tia sáng gây sát thương.", SkillType.ACTIVE, 1.2f, 8, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("dpr_2", "Chữa Lành", "Hồi phục lượng lớn HP.", SkillType.ACTIVE, 0f, 15, 2, TargetType.SELF, emptyList()),
            Skill("dpr_3", "Phước Lành", "Tăng chỉ số bản thân.", SkillType.ACTIVE, 0f, 12, 3, TargetType.SELF, emptyList()),
            Skill("dpr_4", "Phán Xét Thánh Thần", "Gây sát thương diện rộng.", SkillType.ACTIVE, 1.8f, 25, 4, TargetType.ALL_ENEMIES, emptyList())
        ),
        "eng_elementalist" to listOf(
            Skill("ee_1", "Hỏa Cầu", "Phóng cầu lửa gây sát thương.", SkillType.ACTIVE, 1.4f, 10, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ee_2", "Bão Băng", "Triệu hồi bão băng diện rộng.", SkillType.ACTIVE, 1.6f, 18, 2, TargetType.ALL_ENEMIES, emptyList()),
            Skill("ee_3", "Sét Thiên Lôi", "Đánh sét gây sát thương cao.", SkillType.ACTIVE, 2.0f, 22, 3, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ee_4", "Nguyên Tố Hộ Thuẫn", "Tạo khiên nguyên tố.", SkillType.ACTIVE, 0f, 12, 3, TargetType.SELF, emptyList())
        ),
        "eng_beastmaster" to listOf(
            Skill("eb_1", "Thú Tập Kích", "Sai thú tấn công.", SkillType.ACTIVE, 1.5f, 10, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("eb_2", "Gầm Gừ", "Giảm phòng thủ kẻ thù.", SkillType.ACTIVE, 0.3f, 8, 2, TargetType.ALL_ENEMIES, emptyList()),
            Skill("eb_3", "Cưỡi Thú", "Tăng tốc độ và tấn công.", SkillType.ACTIVE, 0f, 15, 3, TargetType.SELF, emptyList()),
            Skill("eb_4", "Triệu Hồi Cự Thú", "Triệu hồi cự thú gây sát thương khổng lồ.", SkillType.ACTIVE, 2.5f, 30, 5, TargetType.SINGLE_ENEMY, emptyList())
        ),
        "eld_warlock" to listOf(
            Skill("ew_1", "Tà Hỏa", "Phóng lửa tà thuật.", SkillType.ACTIVE, 1.4f, 10, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ew_2", "Nguyền Rủa", "Giảm chỉ số kẻ thù.", SkillType.ACTIVE, 0.4f, 12, 2, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ew_3", "Hấp Hồn", "Hút HP kẻ thù để hồi phục.", SkillType.ACTIVE, 1.0f, 15, 2, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ew_4", "Triệu Hồi Ác Linh", "Gây sát thương diện rộng.", SkillType.ACTIVE, 1.8f, 25, 4, TargetType.ALL_ENEMIES, emptyList())
        ),
        "eld_cursed" to listOf(
            Skill("ec_1", "Móng Vuốt Tà", "Cào xé kẻ thù.", SkillType.ACTIVE, 1.6f, 6, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ec_2", "Nổ Huyết", "Gây sát thương dựa trên HP đã mất.", SkillType.ACTIVE, 2.0f, 15, 2, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ec_3", "Hồi Máu", "Hút máu kẻ thù.", SkillType.ACTIVE, 0.8f, 10, 2, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ec_4", "Lời Nguyền Bất Diệt", "Tăng sức mạnh đáng kể khi HP thấp.", SkillType.ACTIVE, 0f, 20, 5, TargetType.SELF, emptyList())
        ),
        "spi_dreamer" to listOf(
            Skill("sd_1", "Ảo Mộng Kích", "Tấn công bằng mộng cảnh.", SkillType.ACTIVE, 1.3f, 10, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("sd_2", "Mê Cung Mộng", "Gây hỗn loạn kẻ thù.", SkillType.ACTIVE, 0.5f, 12, 2, TargetType.ALL_ENEMIES, emptyList()),
            Skill("sd_3", "Mộng Du Thuẫn", "Phòng thủ bằng mộng cảnh.", SkillType.ACTIVE, 0f, 10, 3, TargetType.SELF, emptyList()),
            Skill("sd_4", "Tỉnh Mộng", "Hồi phục HP và MP.", SkillType.ACTIVE, 0f, 20, 4, TargetType.SELF, emptyList())
        ),
        "spi_soulweaver" to listOf(
            Skill("ss_1", "Hồn Kích", "Tấn công bằng linh hồn.", SkillType.ACTIVE, 1.4f, 10, 0, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ss_2", "Thu Hồn", "Hút năng lượng tinh thần kẻ thù.", SkillType.ACTIVE, 1.0f, 12, 2, TargetType.SINGLE_ENEMY, emptyList()),
            Skill("ss_3", "Hồn Giáp", "Tạo giáp linh hồn phòng thủ.", SkillType.ACTIVE, 0f, 10, 3, TargetType.SELF, emptyList()),
            Skill("ss_4", "Vạn Hồn Quy Nhất", "Chiêu tối thượng linh hồn.", SkillType.ACTIVE, 2.5f, 30, 5, TargetType.ALL_ENEMIES, emptyList())
        )
    )

    // ── Rune pool theo thế giới ──
    private val runePool: Map<World, List<Rune>> = World.entries.associateWith { world ->
        val rarities = Rarity.entries
        (1..5).map { i ->
            Rune(
                id = "${world.name.lowercase()}_rune_$i",
                name = "${world.displayName} Rune ${toRomanNumeral(i)}",
                world = world,
                rarity = rarities[i.coerceAtMost(rarities.size) - 1],
                statBonus = Stats(
                    attack = i * 2,
                    defense = i,
                    maxHp = i * 10,
                    currentHp = 0,
                    maxMp = i * 5,
                    currentMp = 0,
                    speed = i
                ),
                powerMultiplier = 1f + i * 0.05f,
                cooldownReduction = i * 0.02f,
                description = "Mảnh vỡ quy tắc từ ${world.displayName}."
            )
        }
    }

    // ── Equipment templates ──
    private val weaponTemplates = listOf(
        "Kiếm" to ItemType.WEAPON,
        "Đao" to ItemType.WEAPON,
        "Thương" to ItemType.WEAPON,
        "Cung" to ItemType.WEAPON,
        "Trượng" to ItemType.WEAPON
    )

    private val armorTemplates = listOf(
        EquipSlot.HEAD to "Mũ",
        EquipSlot.BODY to "Giáp",
        EquipSlot.LEGS to "Hộ Tất"
    )

    /**
     * Tạo một bot PlayerCharacter ngẫu nhiên.
     * @param playerLevel Level hiện tại của người chơi, bot sẽ ±2 levels.
     */
    fun generateBot(playerLevel: Int): PlayerCharacter {
        val world = World.entries.random()
        val classes = classesByWorld[world] ?: classesByWorld.values.first()
        val charClass = classes.random()

        val botLevel = max(1, playerLevel + Random.nextInt(-2, 3))
        val scaledStats = scaleStats(charClass.baseStats, botLevel)

        // Pick 2-3 skills from pool
        val availableSkills = skillPool[charClass.id] ?: emptyList()
        val numSkills = Random.nextInt(2, minOf(4, availableSkills.size + 1))
        val botSkills = availableSkills.shuffled().take(numSkills).toMutableList()

        // Pick 1-3 random runes
        val worldRunes = runePool[world] ?: emptyList()
        val numRunes = Random.nextInt(1, minOf(4, worldRunes.size + 1))
        val botRunes = worldRunes.shuffled().take(numRunes).toMutableList()

        // Generate equipment
        val equipment = generateEquipment(botLevel, world)

        return PlayerCharacter(
            id = "bot_${UUID.randomUUID()}",
            name = BotNameGenerator.generateDisplayName(),
            world = world,
            characterClass = charClass,
            level = botLevel,
            exp = 0L,
            stats = scaledStats,
            skills = botSkills,
            runes = botRunes,
            inventory = mutableListOf(),
            equipment = equipment,
            awakeningLevel = if (botLevel >= 20) 1 else 0,
            currentZone = "Thánh Vực Dung Hợp",
            gold = (botLevel * 50 + Random.nextInt(0, 200)).toLong()
        )
    }

    /** Scale base stats by level. */
    private fun scaleStats(base: Stats, level: Int): Stats {
        val multiplier = 1f + (level - 1) * 0.12f
        return Stats(
            maxHp = (base.maxHp * multiplier).roundToInt(),
            currentHp = (base.maxHp * multiplier).roundToInt(),
            maxMp = (base.maxMp * multiplier).roundToInt(),
            currentMp = (base.maxMp * multiplier).roundToInt(),
            attack = (base.attack * multiplier).roundToInt(),
            defense = (base.defense * multiplier).roundToInt(),
            speed = (base.speed * (1f + (level - 1) * 0.05f)).roundToInt(),
            critRate = base.critRate + level * 0.002f,
            critDamage = base.critDamage + level * 0.01f,
            spiritualPower = (base.spiritualPower * multiplier).roundToInt()
        )
    }

    /** Generate random equipment for a bot. */
    private fun generateEquipment(level: Int, world: World): MutableMap<EquipSlot, Item> {
        val equip = mutableMapOf<EquipSlot, Item>()
        val rarityPool = Rarity.entries.filter { it.ordinal <= (level / 10).coerceAtMost(Rarity.entries.size - 1) }

        // Weapon
        val (weaponName, weaponType) = weaponTemplates.random()
        val rarity = rarityPool.randomOrNull() ?: Rarity.COMMON
        val statScale = (1 + rarity.ordinal) * level / 2
        equip[EquipSlot.WEAPON] = Item(
            id = "bot_wpn_${UUID.randomUUID()}",
            name = "${rarity.name.lowercase().replaceFirstChar { it.uppercase() }} $weaponName",
            type = weaponType,
            rarity = rarity,
            statBonus = Stats(attack = statScale, defense = 0, maxHp = 0, currentHp = 0, maxMp = 0, currentMp = 0, speed = 0),
            equipSlot = EquipSlot.WEAPON,
            description = "Vũ khí từ ${world.displayName}."
        )

        // Armor pieces
        for ((slot, armorName) in armorTemplates) {
            if (Random.nextFloat() < 0.7f) { // 70% chance to have each piece
                val armorRarity = rarityPool.randomOrNull() ?: Rarity.COMMON
                val defScale = (1 + armorRarity.ordinal) * level / 3
                equip[slot] = Item(
                    id = "bot_arm_${UUID.randomUUID()}",
                    name = "${armorRarity.name.lowercase().replaceFirstChar { it.uppercase() }} $armorName",
                    type = ItemType.ARMOR,
                    rarity = armorRarity,
                    statBonus = Stats(attack = 0, defense = defScale, maxHp = defScale * 3, currentHp = 0, maxMp = 0, currentMp = 0, speed = 0),
                    equipSlot = slot,
                    description = "Trang bị phòng thủ từ ${world.displayName}."
                )
            }
        }

        return equip
    }

    private fun makeClass(id: String, name: String, world: World, baseStats: Stats, description: String): CharacterClass {
        return CharacterClass(
            id = id,
            name = name,
            world = world,
            tier = ClassTier.BASIC,
            baseStats = baseStats,
            skills = emptyList(), // skills are in skillPool
            description = description,
            evolutionPaths = emptyList()
        )
    }

    private fun toRomanNumeral(n: Int): String = when (n) {
        1 -> "I"; 2 -> "II"; 3 -> "III"; 4 -> "IV"; 5 -> "V"; else -> n.toString()
    }
}
