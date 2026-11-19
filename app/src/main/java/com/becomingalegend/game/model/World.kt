package com.becomingalegend.game.model

/**
 * 7 Thế Giới trong vũ trụ "Becoming A Legend".
 * Mỗi thế giới vận hành theo bộ quy tắc riêng biệt,
 * sinh ra từ sự kiện Đại Phân Liệt thuở hồng hoang.
 */
enum class World(
    val displayName: String,
    val description: String,
    val themeColor: Long
) {
    TECHNOLOGY(
        displayName = "Công Nghệ Thế Giới",
        description = "Kỷ nguyên Cyberpunk tương lai. Tài nguyên cạn kiệt, bị thống trị bởi các Siêu Tập Đoàn. " +
                "Hoàn toàn vắng bóng linh khí hay phép thuật. Sức mạnh đến từ công nghệ và vũ khí.",
        themeColor = 0xFF00BFFF // Cyan
    ),
    CULTIVATION(
        displayName = "Thế Giới Tu Tiên",
        description = "Đại lục mênh mông với vô số Tông Môn, Thánh Địa. " +
                "Người dân tuân theo thứ bậc Cảnh Giới khắt khe. Cá lớn nuốt cá bé là quy luật bất biến.",
        themeColor = 0xFF8B5CF6 // Purple
    ),
    MUTANT(
        displayName = "Thế Giới Dị Nhân",
        description = "Hậu tận thế, hành tinh bị ô nhiễm nặng nề. " +
                "Chuỗi gen sinh vật bị bẻ cong tạo ra các Dị năng siêu nhiên.",
        themeColor = 0xFF10B981 // Green
    ),
    DIVINE(
        displayName = "Thế Giới Chư Thần",
        description = "Vương quốc lơ lửng trên chín tầng mây, rực rỡ và uy nghiêm. " +
                "Quyền lực dựa trên Tín Ngưỡng. Các thần hệ không ngừng gây chiến giành giật tín đồ.",
        themeColor = 0xFFFBBF24 // Gold
    ),
    ENERGY(
        displayName = "Năng Lượng Thế Giới",
        description = "Thế giới nguyên thủy, hoang sơ, không có nền văn minh loài người. " +
                "Chỉ có bão nguyên tố khổng lồ và các Cự Thú Năng Lượng.",
        themeColor = 0xFFEF4444 // Red
    ),
    ELDRITCH(
        displayName = "Quỷ Dị Thế Giới",
        description = "Thế giới bóng tối, sương mù và sự vặn vẹo. Bầu trời màu huyết dụ. " +
                "Mọi thứ vận hành theo những Quy Tắc Sinh Tồn quái gở.",
        themeColor = 0xFF6B21A8 // Dark Purple
    ),
    SPIRIT(
        displayName = "Tinh Thần Thế Giới",
        description = "Cõi mộng cảnh, nơi hội tụ ý niệm, ký ức và linh hồn từ 6 thế giới kia. " +
                "Không có không gian vật lý cố định, cảnh vật biến đổi theo tâm trí.",
        themeColor = 0xFFE0E7FF // Light Lavender
    );

    companion object {
        /** Lấy thế giới theo tên hiển thị */
        fun fromDisplayName(name: String): World? =
            entries.find { it.displayName == name }
    }
}
