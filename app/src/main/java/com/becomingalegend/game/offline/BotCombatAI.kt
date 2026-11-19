package com.becomingalegend.game.offline

import com.becomingalegend.game.model.*
import kotlin.random.Random

/**
 * Interface chiến lược chiến đấu cho bot.
 * Mỗi lần đến lượt bot, chooseAction() sẽ quyết định hành động.
 */
interface CombatStrategy {
    fun chooseAction(bot: PlayerCharacter, enemies: List<Any>, state: Any): CombatAction
}

/**
 * Hành động chiến đấu của bot / người chơi.
 */
sealed class CombatAction {
    /** Đánh thường */
    data class Attack(val targetIndex: Int = 0) : CombatAction()

    /** Sử dụng kỹ năng */
    data class UseSkill(val skillId: String, val targetIndex: Int = 0) : CombatAction()

    /** Phòng thủ — giảm sát thương nhận vào 50% trong lượt này */
    object Defend : CombatAction()

    /** Sử dụng vật phẩm */
    data class UseItem(val itemId: String) : CombatAction()

    /** Bỏ chạy */
    object Flee : CombatAction()
}

// ═══════════════════════════════════════════════════════════════
// DỄ (Easy) — Hành động ngẫu nhiên, ít dùng kỹ năng, không phòng thủ
// ═══════════════════════════════════════════════════════════════
class EasyBotStrategy : CombatStrategy {
    override fun chooseAction(bot: PlayerCharacter, enemies: List<Any>, state: Any): CombatAction {
        // 80% tấn công thường, 15% dùng skill (nếu có), 5% bỏ chạy
        val roll = Random.nextFloat()
        return when {
            roll < 0.80f -> {
                CombatAction.Attack(targetIndex = Random.nextInt(maxOf(1, enemies.size)))
            }
            roll < 0.95f && bot.skills.isNotEmpty() -> {
                // Chọn skill ngẫu nhiên, kiểm tra MP
                val affordableSkills = bot.skills.filter {
                    it.type == SkillType.ACTIVE && it.mpCost <= bot.stats.currentMp
                }
                if (affordableSkills.isNotEmpty()) {
                    val skill = affordableSkills.random()
                    CombatAction.UseSkill(skill.id, targetIndex = Random.nextInt(maxOf(1, enemies.size)))
                } else {
                    CombatAction.Attack(targetIndex = Random.nextInt(maxOf(1, enemies.size)))
                }
            }
            else -> {
                // Hiếm khi bỏ chạy
                CombatAction.Attack(targetIndex = Random.nextInt(maxOf(1, enemies.size)))
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// TRUNG BÌNH (Normal) — Dùng skill khi có MP, hồi máu khi HP < 30%,
// nhắm kẻ yếu nhất
// ═══════════════════════════════════════════════════════════════
class NormalBotStrategy : CombatStrategy {
    override fun chooseAction(bot: PlayerCharacter, enemies: List<Any>, state: Any): CombatAction {
        val hpPercent = bot.stats.currentHp.toFloat() / bot.stats.maxHp.toFloat()

        // Ưu tiên 1: Hồi máu khi HP < 30%
        if (hpPercent < 0.3f) {
            val healSkill = bot.skills.firstOrNull { skill ->
                skill.type == SkillType.ACTIVE &&
                    skill.targetType == TargetType.SELF &&
                    skill.damageMultiplier == 0f &&
                    skill.mpCost <= bot.stats.currentMp
            }
            if (healSkill != null) {
                return CombatAction.UseSkill(healSkill.id, targetIndex = 0)
            }
        }

        // Ưu tiên 2: Dùng skill tấn công khi có MP
        val attackSkills = bot.skills.filter { skill ->
            skill.type == SkillType.ACTIVE &&
                skill.damageMultiplier > 0f &&
                skill.mpCost <= bot.stats.currentMp
        }
        if (attackSkills.isNotEmpty() && Random.nextFloat() < 0.6f) {
            val skill = attackSkills.maxByOrNull { it.damageMultiplier } ?: attackSkills.random()
            // Nhắm mục tiêu yếu nhất — mặc định index 0 vì không truy cập trực tiếp enemy stats
            return CombatAction.UseSkill(skill.id, targetIndex = 0)
        }

        // Mặc định: Tấn công thường
        return CombatAction.Attack(targetIndex = 0)
    }
}

// ═══════════════════════════════════════════════════════════════
// KHÓ (Hard) — Chơi tối ưu: tính toán skill hiệu quả nhất,
// phòng thủ khi HP thấp, buff/debuff chiến lược
// ═══════════════════════════════════════════════════════════════
class HardBotStrategy : CombatStrategy {
    override fun chooseAction(bot: PlayerCharacter, enemies: List<Any>, state: Any): CombatAction {
        val hpPercent = bot.stats.currentHp.toFloat() / bot.stats.maxHp.toFloat()
        val mpPercent = bot.stats.currentMp.toFloat() / bot.stats.maxMp.toFloat()

        // ── Tình huống 1: HP rất thấp (< 20%) → Phòng thủ hoặc hồi máu ──
        if (hpPercent < 0.2f) {
            // Thử hồi máu trước
            val healSkill = findHealSkill(bot)
            if (healSkill != null) {
                return CombatAction.UseSkill(healSkill.id, targetIndex = 0)
            }
            // Không có skill hồi → phòng thủ để sống sót
            return CombatAction.Defend
        }

        // ── Tình huống 2: HP < 40% → hồi máu nếu có ──
        if (hpPercent < 0.4f) {
            val healSkill = findHealSkill(bot)
            if (healSkill != null) {
                return CombatAction.UseSkill(healSkill.id, targetIndex = 0)
            }
        }

        // ── Tình huống 3: Buff bản thân nếu chưa (đầu trận / MP dồi dào) ──
        if (mpPercent > 0.6f) {
            val buffSkill = bot.skills.firstOrNull { skill ->
                skill.type == SkillType.ACTIVE &&
                    skill.targetType == TargetType.SELF &&
                    skill.damageMultiplier == 0f &&
                    skill.mpCost <= bot.stats.currentMp &&
                    skill.cooldown >= 3 // Only consider significant buffs
            }
            if (buffSkill != null && Random.nextFloat() < 0.4f) {
                return CombatAction.UseSkill(buffSkill.id, targetIndex = 0)
            }
        }

        // ── Tình huống 4: Tấn công bằng skill hiệu quả nhất ──
        val bestSkill = findBestDamageSkill(bot)
        if (bestSkill != null) {
            val targetIndex = findBestTarget(enemies)
            return CombatAction.UseSkill(bestSkill.id, targetIndex = targetIndex)
        }

        // ── Tình huống 5: Debuff kẻ thù nếu có skill phù hợp ──
        val debuffSkill = bot.skills.firstOrNull { skill ->
            skill.type == SkillType.ACTIVE &&
                (skill.targetType == TargetType.SINGLE_ENEMY || skill.targetType == TargetType.ALL_ENEMIES) &&
                skill.damageMultiplier < 0.5f &&
                skill.mpCost <= bot.stats.currentMp
        }
        if (debuffSkill != null && Random.nextFloat() < 0.5f) {
            return CombatAction.UseSkill(debuffSkill.id, targetIndex = findBestTarget(enemies))
        }

        // ── Mặc định: Tấn công thường vào mục tiêu yếu nhất ──
        return CombatAction.Attack(targetIndex = findBestTarget(enemies))
    }

    /**
     * Tìm skill hồi máu tốt nhất (target = SELF, damageMultiplier = 0, có đủ MP).
     */
    private fun findHealSkill(bot: PlayerCharacter): Skill? {
        return bot.skills
            .filter { skill ->
                skill.type == SkillType.ACTIVE &&
                    skill.targetType == TargetType.SELF &&
                    skill.damageMultiplier == 0f &&
                    skill.mpCost <= bot.stats.currentMp
            }
            .minByOrNull { it.mpCost } // Dùng heal rẻ nhất khi cần thiết
    }

    /**
     * Tìm skill tấn công hiệu quả nhất (damage / MP cost ratio).
     */
    private fun findBestDamageSkill(bot: PlayerCharacter): Skill? {
        return bot.skills
            .filter { skill ->
                skill.type == SkillType.ACTIVE &&
                    skill.damageMultiplier > 0f &&
                    skill.mpCost <= bot.stats.currentMp
            }
            .maxByOrNull { skill ->
                // Efficiency = damage * multiplier / MP cost
                // AoE skills get a 1.5x bonus in efficiency
                val aoeBonus = if (skill.targetType == TargetType.ALL_ENEMIES) 1.5f else 1.0f
                (skill.damageMultiplier * aoeBonus) / maxOf(1, skill.mpCost).toFloat()
            }
    }

    /**
     * Tìm mục tiêu tốt nhất (index thấp nhất — giả định được sắp xếp theo HP).
     * Trong thực tế, CombatEngine sẽ truyền danh sách kẻ thù theo thứ tự.
     */
    private fun findBestTarget(enemies: List<Any>): Int {
        // Target index 0 = mục tiêu yếu nhất (convention)
        return if (enemies.isEmpty()) 0 else 0
    }
}

// ═══════════════════════════════════════════════════════════════
// Factory / Utility
// ═══════════════════════════════════════════════════════════════

/** Enum độ khó */
enum class BotDifficulty {
    EASY, NORMAL, HARD
}

/** Tạo strategy theo độ khó */
fun createBotStrategy(difficulty: BotDifficulty): CombatStrategy = when (difficulty) {
    BotDifficulty.EASY -> EasyBotStrategy()
    BotDifficulty.NORMAL -> NormalBotStrategy()
    BotDifficulty.HARD -> HardBotStrategy()
}
