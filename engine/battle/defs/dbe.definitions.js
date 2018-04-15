/** @typedef {object} UnitInfo
 * @property typeId {string}
 * @property name {string}
 * @property description {string}
 * @property level {number}
 * @property experience {number}
 * @property maxExperience {number}
 * @property health {number}
 * @property maxHealth {number}
 * @property armour {number}
 * @property immunities {string[]}
 * @property shields {string[]}
 * @property attack1 {AttackInfo} First attack, if attack misses, 2nd attack is not applied
 * @property attack2 {AttackInfo}
 * @property actions {number} count of actions in unit turn (1 or 2)
 * @property attackTarget {string}
 * @property initiative {number}
 * @property large {boolean}
 * @property position {number}
 */

/** @typedef {object} AttackInfo
 * @property name {string}
 * @property source {string}
 * @property effect {string}
 * @property accuracy {number}
 */

/** @typedef {object} UnitType
 * @property id {string}
 * @property title {string}
 * @property description {string}
 * @property large {boolean}
 * @property baseExperience {number[]}
 * @property baseHealth {number}
 * @property armour {number}
 * @property immunities {string[]}
 * @property shields {string[]}
 * @property baseAttack1 {AttackInfo}
 * @property baseAttack2 {AttackInfo}
 * @property actions {number}
 * @property attacksTarget {string}
 * @property initiative {number}
 * @property baseMovement {number}
 */

/** @typedef {object} LeaderInfo
 * @property leadership {number}
 * @property traits {string[]}
 * @property equipment {*}
 * @property movement {number}
 * @property maxMovement {number} maxMovement = (baseMovement + level - 1) * (unit.hasTrait('scout') ? 1.2 : 1) * (unit.hasTrait('pathFinder') ? 1.25 : 1) * (1 + unit.getArtifactsMovementBonus())
 */

/** @typedef {object} Unit
 * @property type {UnitType}
 * @property stats {UnitInfo}
 * @property leaderInfo {LeaderInfo}
 */

/** @typedef {object} Party
 * @property units {Unit[]}
 * @property leader {UnitInfo}
 * @property inventory {Array}
 */

/** @typedef {object} TurnResult
 * @property {boolean} roundComplete
 * @property {boolean} battleComplete
 * @property {string} [winner=null]
 * @property {UnitActionResult[]} actionResults
 */

/** @typedef {UnitActionResult}
 *
 */