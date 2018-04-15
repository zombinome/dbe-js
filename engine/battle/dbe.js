import AttackEffect from './enums/AttackEffect.js';
import AttackSource from './enums/AttackSource.js';
import AttackTargeting from './enums/AttackTargeting.js';
import ItemType from './enums/ItemType.js';

'use strict';

/** @public */
export class UnitInfo {
    constructor(data) {
        this.typeId = data.typeId;
    }
}

export class Battle {
    constructor(attackers, defenders) {
        this._round = 0;
        this._queue = buildQueue(attackers, defenders);
        if (!!Battle.randomizeUnitQueue) {
            this._queue = Battle.randomizeUnitQueue(this._queue);
        }

        this.attackers = attackers;
        this.defenders = defenders;
    }

    /**
     * Returns queue of units to act
     * @returns {UnitInfo[]}
     */
    getUnitsQueue() {
        return this._queue;
    }

    replaceUnitsQueue(newQueue) {
        // add some validation
        this._queue = newQueue;
    }

    unitDoes(action) {

    }

    static randomizeUnitQueue(queue) {
        // TODO: do some randomization stuff here
        return queue;
    }
}

function buildQueue(attackers, defenders) {
    return [].concat(attackers, defenders)
        .filter(unit => unit.health > 0)
        .sort((a, b) => a.initiative > b.initiative ? 1 : (a.initiative < b.initiative ? -1 : 0));
}

// Что важно знать о бое?
// * Текущий раунд.
// * Очередность хода войск в текущем раунде (на N-раундов вперед?)
// В начале хода:
// Боевая единица, которая ходит сейчас
// Список доступных целей (если применимо)
// Далее, требуется сообщить: действие боевой единицы (если атака, то кого атакует).
// Движок проверяет возможность выполнить указанное действие
// В итоге, требуется получить результат хода (смерть, наложение спец. статуса, получение урона, лечение,
// снятие спец. статуса, полиморф и т.п.)

// возможные действия: атака, ожидание, защита, побег с поля боя, использование предмета (для героя)