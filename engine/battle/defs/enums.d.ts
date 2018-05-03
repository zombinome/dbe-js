interface IAttackEffect {
    damage: string;
    poison: string;
    paralysis: string;
    transformation: string;
    destroyArmour: string;
    summon: string;
    fear: string;
    decreaseLevel: string;
    healing: string;
    cure: string;
}

interface IAttackSource {
    weapon: string;
    air: string;
    earth: string;
    fire: string;
    water: string;
    life: string;
    death: string;
    mind: string;
}

interface IAttackTargeting {
    nearest: string;
    anyone: string;
    everyone: string;
}

interface IItemType {
    elixir: string;
    sphere: string;
    talisman: string;
    banner: string;
    book: string;
    boots: string;
    artifact: string;
    jewelry: string;
    rod: string;
    scroll: string;
}