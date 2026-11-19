package com.becomingalegend.game.model

/**
 * Chỉ số nhân vật cơ bản dùng trong chiến đấu và phát triển.
 *
 * - HP (Sinh Lực): Máu nhân vật
 * - MP (Pháp Lực): Năng lượng dùng kỹ năng
 * - ATK (Tấn Công): Sát thương vật lý/phép cơ bản
 * - DEF (Phòng Thủ): Giảm sát thương nhận vào
 * - SPD (Tốc Độ): Quyết định thứ tự hành động
 * - CritRate (Tỷ Lệ Bạo Kích): Xác suất đánh chí mạng
 * - CritDmg (Sát Thương Bạo Kích): Hệ số nhân khi bạo kích
 * - SpiritualPower (Tinh Thần Lực): Sức mạnh tinh thần, cần cho kỹ năng cao cấp
 */
data class Stats(
    var maxHp: Int = 100,
    var currentHp: Int = 100,
    var maxMp: Int = 50,
    var currentMp: Int = 50,
    var attack: Int = 10,
    var defense: Int = 5,
    var speed: Int = 10,
    var critRate: Float = 0.05f,
    var critDamage: Float = 1.5f,
    var spiritualPower: Int = 0
) {
    /** Kiểm tra nhân vật còn sống */
    fun isAlive(): Boolean = currentHp > 0

    /** Hồi HP, không vượt quá maxHp */
    fun healHp(amount: Int) {
        currentHp = (currentHp + amount).coerceAtMost(maxHp)
    }

    /** Nhận sát thương, HP không giảm dưới 0 */
    fun takeDamage(amount: Int) {
        currentHp = (currentHp - amount).coerceAtLeast(0)
    }

    /** Tiêu hao MP */
    fun consumeMp(amount: Int): Boolean {
        return if (currentMp >= amount) {
            currentMp -= amount
            true
        } else {
            false
        }
    }

    /** Hồi MP, không vượt quá maxMp */
    fun restoreMp(amount: Int) {
        currentMp = (currentMp + amount).coerceAtMost(maxMp)
    }

    /** Cộng dồn stat bonus (từ Rune, trang bị, v.v.) */
    operator fun plus(other: Stats): Stats = Stats(
        maxHp = this.maxHp + other.maxHp,
        currentHp = this.currentHp + other.currentHp,
        maxMp = this.maxMp + other.maxMp,
        currentMp = this.currentMp + other.currentMp,
        attack = this.attack + other.attack,
        defense = this.defense + other.defense,
        speed = this.speed + other.speed,
        critRate = this.critRate + other.critRate,
        critDamage = this.critDamage + other.critDamage,
        spiritualPower = this.spiritualPower + other.spiritualPower
    )

    /** Tạo bản sao đã hồi đầy HP/MP */
    fun fullRestore(): Stats = copy(currentHp = maxHp, currentMp = maxMp)

    companion object {
        /** Stat rỗng, dùng làm base cho bonus */
        val ZERO = Stats(
            maxHp = 0, currentHp = 0,
            maxMp = 0, currentMp = 0,
            attack = 0, defense = 0, speed = 0,
            critRate = 0f, critDamage = 0f,
            spiritualPower = 0
        )
    }
}
