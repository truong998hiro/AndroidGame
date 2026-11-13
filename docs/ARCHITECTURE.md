# ARCHITECTURE — Becoming A Legend (Text-based RPG)

## Overview
Text-based RPG with turn-based combat, 7 worlds system, Rune evolution.
Two modes: **Offline** (bot opponents) and **Online** (Firebase multiplayer).

Package: `com.becomingalegend.game`

---

## Package Structure

```
com.becomingalegend.game/
├── GameApplication.kt
├── model/                    ← Data models (ALL shared types)
│   ├── World.kt              ← Enum of 7 worlds + world data
│   ├── CharacterClass.kt     ← Classes per world + evolution tree
│   ├── PlayerCharacter.kt    ← Player character state
│   ├── Stats.kt              ← Combat stats (HP, ATK, DEF, SPD, etc.)
│   ├── Rune.kt               ← Rune types + combination rules
│   ├── Skill.kt              ← Active/passive skills
│   ├── Item.kt               ← Equipment + consumables
│   ├── Enemy.kt              ← Enemy/boss definitions
│   └── GameState.kt          ← Overall save state
├── engine/                   ← Game logic (NO UI)
│   ├── GameEngine.kt         ← Main state machine
│   ├── CombatEngine.kt       ← Turn-based combat resolver
│   ├── StoryEngine.kt        ← Story scene/dialogue driver
│   ├── RuneSystem.kt         ← Rune fusion + awakening
│   ├── LootSystem.kt         ← Drop tables, rewards
│   └── WorldExplorer.kt      ← Exploration/zone navigation
├── ui/                       ← ALL UI code
│   ├── MainMenuActivity.kt
│   ├── CharacterCreationActivity.kt
│   ├── GameActivity.kt       ← Main game screen (story + exploration)
│   ├── CombatActivity.kt     ← Combat screen
│   ├── PvpArenaActivity.kt   ← PvP lobby + battle
│   ├── InventoryFragment.kt
│   ├── CharacterSheetFragment.kt
│   ├── adapter/
│   │   └── StoryLogAdapter.kt ← RecyclerView adapter for story text
│   └── widget/
│       └── TypewriterTextView.kt ← Typewriter-effect text
├── data/                     ← Data persistence
│   ├── GameRepository.kt     ← Interface (offline/online impl)
│   ├── local/
│   │   ├── LocalGameRepository.kt
│   │   ├── AppDatabase.kt    ← Room database
│   │   └── dao/
│   │       ├── PlayerDao.kt
│   │       └── GameStateDao.kt
│   └── remote/
│       ├── FirebaseGameRepository.kt
│       ├── FirebaseAuthManager.kt
│       ├── MatchmakingService.kt
│       └── OnlineCombatSync.kt
├── offline/                  ← Bot AI
│   ├── BotPlayer.kt          ← Generate bot character
│   ├── BotCombatAI.kt        ← Bot combat strategy
│   └── BotNameGenerator.kt   ← Random name generator
├── ads/                      ← AdMob (already exists)
│   └── AdManager.kt
└── util/
    └── Constants.kt
```

---

## Key Model Definitions

### World (enum)
```kotlin
enum class World(val displayName: String, val description: String) {
    TECHNOLOGY("Công Nghệ Thế Giới", "Kỷ nguyên Cyberpunk..."),
    CULTIVATION("Thế Giới Tu Tiên", "Đại lục tu tiên..."),
    MUTANT("Thế Giới Dị Nhân", "Hậu tận thế..."),
    DIVINE("Thế Giới Chư Thần", "Vương quốc trên mây..."),
    ENERGY("Năng Lượng Thế Giới", "Thế giới nguyên thủy..."),
    ELDRITCH("Quỷ Dị Thế Giới", "Thế giới bóng tối..."),
    SPIRIT("Tinh Thần Thế Giới", "Cõi mộng cảnh...");
}
```

### Stats
```kotlin
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
    var spiritualPower: Int = 0   // Tinh Thần Lực
)
```

### PlayerCharacter
```kotlin
data class PlayerCharacter(
    val id: String,
    var name: String,
    var world: World,
    var characterClass: CharacterClass,
    var level: Int = 1,
    var exp: Long = 0,
    var stats: Stats = Stats(),
    var skills: MutableList<Skill> = mutableListOf(),
    var runes: MutableList<Rune> = mutableListOf(),
    var inventory: MutableList<Item> = mutableListOf(),
    var equipment: MutableMap<EquipSlot, Item> = mutableMapOf(),
    var awakeningLevel: Int = 0,
    var currentZone: String = "",
    var gold: Long = 0
)
```

### CharacterClass
```kotlin
data class CharacterClass(
    val id: String,
    val name: String,
    val world: World,
    val tier: ClassTier,           // BASIC, AWAKENED_1, AWAKENED_2
    val baseStats: Stats,
    val skills: List<Skill>,
    val description: String,
    val evolutionPaths: List<String> // IDs of next-tier classes
)

enum class ClassTier { BASIC, AWAKENED_1, AWAKENED_2, ULTIMATE }
```

### Rune
```kotlin
data class Rune(
    val id: String,
    val name: String,
    val world: World,              // Which world this rune belongs to
    val rarity: Rarity,
    val statBonus: Stats,          // Direct stat bonuses
    val powerMultiplier: Float,    // Damage multiplier
    val cooldownReduction: Float,  // CDR
    val description: String
)

enum class Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC }
```

### Skill
```kotlin
data class Skill(
    val id: String,
    val name: String,
    val description: String,
    val type: SkillType,           // ACTIVE or PASSIVE
    val damageMultiplier: Float,
    val mpCost: Int,
    val cooldown: Int,             // turns
    val targetType: TargetType,    // SELF, SINGLE_ENEMY, ALL_ENEMIES, ALLY
    val effects: List<StatusEffect>
)

enum class SkillType { ACTIVE, PASSIVE }
enum class TargetType { SELF, SINGLE_ENEMY, ALL_ENEMIES, SINGLE_ALLY, ALL_ALLIES }
```

### Item
```kotlin
data class Item(
    val id: String,
    val name: String,
    val type: ItemType,
    val rarity: Rarity,
    val statBonus: Stats?,
    val equipSlot: EquipSlot?,
    val description: String,
    val stackable: Boolean = false,
    var quantity: Int = 1
)

enum class ItemType { WEAPON, ARMOR, ACCESSORY, CONSUMABLE, MATERIAL, QUEST_ITEM }
enum class EquipSlot { WEAPON, HEAD, BODY, LEGS, ACCESSORY_1, ACCESSORY_2 }
```

### Enemy
```kotlin
data class Enemy(
    val id: String,
    val name: String,
    val world: World?,            // null = Void monster
    val level: Int,
    val stats: Stats,
    val skills: List<Skill>,
    val lootTable: List<LootDrop>,
    val expReward: Long,
    val goldReward: Long,
    val isBoss: Boolean = false,
    val description: String
)

data class LootDrop(
    val itemId: String,
    val dropRate: Float,          // 0.0 to 1.0
    val minQuantity: Int = 1,
    val maxQuantity: Int = 1
)
```

### GameState
```kotlin
data class GameState(
    val playerId: String,
    var player: PlayerCharacter,
    var currentChapter: Int = 1,
    var currentScene: String = "intro",
    var storyFlags: MutableMap<String, Boolean> = mutableMapOf(),
    var unlockedWorlds: MutableSet<World> = mutableSetOf(),
    var pvpRank: Int = 0,
    var pvpWins: Int = 0,
    var pvpLosses: Int = 0,
    var isOnlineMode: Boolean = false,
    var lastSaveTimestamp: Long = System.currentTimeMillis()
)
```

---

## Combat Engine Spec

Turn-based. Order by Speed stat.

```
States: COMBAT_START → TURN_START → CHOOSE_ACTION → EXECUTE_ACTION →
        CHECK_STATUS_EFFECTS → CHECK_WIN_CONDITION → TURN_END →
        (loop to TURN_START or → COMBAT_END)

Actions: ATTACK, SKILL(id), DEFEND, USE_ITEM(id), FLEE

Damage formula:
  baseDmg = attacker.attack * skillMultiplier
  defense = defender.defense * (1 - armorPen)
  finalDmg = max(1, baseDmg - defense) * critMultiplier * runeBonus
```

### CombatEngine interface
```kotlin
interface CombatEngine {
    fun startCombat(player: PlayerCharacter, enemies: List<Enemy>): CombatState
    fun executePlayerAction(state: CombatState, action: CombatAction): CombatResult
    fun executeEnemyTurn(state: CombatState): CombatResult
    fun checkWinCondition(state: CombatState): CombatOutcome?
}
```

---

## Story Engine Spec

Scenes are defined as data. Each scene has text + choices.

```kotlin
data class StoryScene(
    val id: String,
    val text: String,
    val choices: List<StoryChoice>,
    val onEnter: ((GameState) -> Unit)? = null
)

data class StoryChoice(
    val text: String,
    val nextSceneId: String,
    val condition: ((GameState) -> Boolean)? = null,  // Show only if true
    val onSelect: ((GameState) -> Unit)? = null        // Side effects
)
```

---

## Data Layer — Repository Pattern

```kotlin
interface GameRepository {
    suspend fun saveGame(state: GameState)
    suspend fun loadGame(playerId: String): GameState?
    suspend fun deleteGame(playerId: String)
    suspend fun getLeaderboard(limit: Int): List<LeaderboardEntry>
}
```

- **LocalGameRepository** — Room DB, fully offline
- **FirebaseGameRepository** — Firestore for save, Realtime DB for PvP sync

---

## Offline Mode — Bot AI

```kotlin
interface CombatStrategy {
    fun chooseAction(bot: PlayerCharacter, enemies: List<Any>, state: CombatState): CombatAction
}

class EasyBotStrategy : CombatStrategy     // Random actions
class NormalBotStrategy : CombatStrategy   // Basic priority (heal < 30% HP, attack strongest)
class HardBotStrategy : CombatStrategy     // Optimal play, uses skills efficiently
```

Bot players generated with random:
- World + class
- Level matching player ± 2
- Random name (Vietnamese + Fantasy)
- Random rune loadout

---

## Online Mode — Firebase

### Auth
- Firebase Auth with Google Sign-In
- Anonymous auth as fallback

### Data Storage
- **Firestore**: Player profiles, save data, leaderboard
- **Realtime Database**: PvP combat state sync (turn-by-turn)

### Matchmaking
```
1. Player joins queue → writes to /matchmaking/{rank_bucket}/{playerId}
2. Cloud Function matches 2 players → creates /battles/{battleId}
3. Both clients listen to /battles/{battleId}
4. Each turn: write action → opponent reads → resolve
5. Winner gets Runes + EXP
```

### Firestore Structure
```
/players/{uid}/
    profile: { name, world, class, level, pvpRank }
    saveData: { ...GameState }

/leaderboard/
    {uid}: { name, pvpRank, wins, level }

/battles/{battleId}/
    status: "waiting" | "active" | "finished"
    player1: { uid, character }
    player2: { uid, character }
    turns: [ { playerId, action, result } ]
    winner: uid
```

---

## Gradle Dependencies Needed

### Already included:
- AndroidX, Material, AdMob, Play Billing, Coroutines

### Need to add for offline:
- `androidx.room:room-runtime` + `room-ktx` + `room-compiler` (KSP)
- `com.google.code.gson:gson`

### Need to add for online:
- `com.google.firebase:firebase-bom`
- `com.google.firebase:firebase-auth-ktx`
- `com.google.firebase:firebase-firestore-ktx`
- `com.google.firebase:firebase-database-ktx`
- `com.google.android.gms:play-services-auth`
- `com.google.firebase:firebase-analytics-ktx`

### settings.gradle.kts needs:
- Google services plugin

---

## UI Layouts needed

All layouts go in `res/layout/`:
- `activity_main_menu.xml` — Logo + Play/Continue/Settings buttons
- `activity_character_creation.xml` — World picker + class picker + name input
- `activity_game.xml` — Story text (RecyclerView) + action buttons
- `activity_combat.xml` — Enemy info + player info + action buttons + combat log
- `activity_pvp_arena.xml` — Matchmaking + opponent info
- `fragment_inventory.xml` — Item grid
- `fragment_character_sheet.xml` — Stats + equipment + runes
- `item_story_log.xml` — Single story text item
- `item_combat_log.xml` — Single combat log item
- `item_choice_button.xml` — Story choice button
