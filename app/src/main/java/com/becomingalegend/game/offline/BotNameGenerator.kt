package com.becomingalegend.game.offline

import kotlin.random.Random

/**
 * Tạo tên ngẫu nhiên kiểu fantasy Việt Nam cho bot.
 * Kết hợp tiền tố + trung tố + hậu tố (tuỳ chọn) và danh hiệu.
 */
object BotNameGenerator {

    // ── Tiền tố (Prefix) ──
    private val prefixes = listOf(
        "Thiên", "Long", "Hắc", "Bạch", "Hỏa", "Băng",
        "Lôi", "Phong", "Vân", "Huyết", "Kim", "Mộc",
        "Thủy", "Thổ", "Diệm", "Hàn", "Quang", "Ám",
        "Linh", "Ma", "Thiết", "Ngọc", "Tử", "Hồng",
        "Thanh", "Lam", "Bích", "Hoàng", "Xích", "Cổ"
    )

    // ── Trung tố (Middle) ──
    private val middles = listOf(
        "Vân", "Phong", "Kiếm", "Lôi", "Dương", "Nguyệt",
        "Tinh", "Hồn", "Tâm", "Vũ", "Hạo", "Minh",
        "Sát", "Chiến", "Vương", "Đế", "Liên", "Lan",
        "Mai", "Hoa", "Diệp", "Hàn", "Dạ", "Thiên",
        "Nhật", "Nguyệt", "Sương", "Tuyết", "Lệ", "Yến"
    )

    // ── Hậu tố (Suffix — optional) ──
    private val suffixes = listOf(
        "Nhi", "Tử", "Nương", "Hiệp", "Khách", "Sĩ",
        "Ca", "Nữ", "Đồng", "Gia", "Thần", "Quân",
        "Hầu", "Công", "Phi", "Hậu", "Đạo", "Tôn",
        "", "", "", "", ""  // empty = no suffix, making it ~30% chance
    )

    // ── Danh hiệu (Titles) ──
    private val titles = listOf(
        "Kiếm Thánh", "Ma Vương", "Chiến Thần", "Huyết Đế",
        "Long Hoàng", "Phượng Vũ", "Tiên Tôn", "Quỷ Đạo",
        "Hỏa Đế", "Băng Nữ Hoàng", "Lôi Đế", "Phong Thần",
        "Bất Diệt Vương", "Thiên Ma", "Vạn Kiếm Quy Tông",
        "Huyền Thiên Đạo Tổ", "Cửu U Ma Tôn", "Thái Cổ Thần Vương",
        "Vô Danh Kiếm Khách", "Hồng Hoang Cổ Đế", "Tuyệt Thế Kiếm Tiên",
        "Hắc Ám Chi Tử", "Quang Minh Sứ Giả", "Thần Hỏa Luyện Ngục",
        "Thiên Lôi Chiến Tướng", "Vạn Cổ Đệ Nhất", "Huyết Nguyệt Tà Quân",
        "Tử Diệm Ma Thần", "Kim Long Chiến Đế", "Ngọc Hoàng Thượng Đế",
        "Cổ Phong Kiếm Đế", "Thanh Liên Kiếm Tiên", "Hàn Băng Nữ Đế",
        "Bạch Cốt Đại Thánh", "Hoàng Kim Thần Long", "Xích Diệm Ma Hoàng",
        "Linh Hồn Thu Hoạch Giả", "Bóng Tối Vĩnh Hằng", "Tuyệt Thế Vũ Thần",
        "Vô Song Chiến Tướng", "Thiên Cơ Đạo Nhân", "Ám Ảnh Chi Vương",
        "Hỗn Nguyên Đại Đế", "Phá Thiên Chiến Thần", "Bất Tử Tà Vương",
        "Vạn Pháp Quy Nhất", "Thái Thượng Lão Quân", "Cửu Thiên Huyền Đế",
        "Thần Binh Thiên Tướng", "Diệt Thế Ma Tôn"
    )

    /**
     * Tạo một tên ngẫu nhiên, ví dụ: "Hắc Phong Tử", "Thiên Kiếm".
     */
    fun generateName(): String {
        val prefix = prefixes.random()
        val middle = middles.random()
        val suffix = suffixes.random()
        return if (suffix.isNotEmpty()) "$prefix $middle $suffix" else "$prefix $middle"
    }

    /**
     * Tạo một danh hiệu ngẫu nhiên, ví dụ: "Kiếm Thánh".
     */
    fun generateTitle(): String = titles.random()

    /**
     * Tạo tên đầy đủ kèm danh hiệu (50% chance), ví dụ:
     * "Hắc Phong Tử — Kiếm Thánh" hoặc chỉ "Hắc Phong Tử".
     */
    fun generateFullName(): String {
        val name = generateName()
        return if (Random.nextFloat() < 0.5f) {
            "$name — ${generateTitle()}"
        } else {
            name
        }
    }

    /**
     * Tạo tên hiển thị ngắn gọn cho bot (không có danh hiệu).
     */
    fun generateDisplayName(): String = generateName()
}
