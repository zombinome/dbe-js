interface IAttackInfo {
    name: string;
    source: string;
    effect: string;
    accuracy: number;
}

interface IUnitTypeInfo {
    id: string;
    title: string;
    description: string;
    large: boolean;
    baseExperience: number[];
    baseHealth: number;
    armour: number;
    immunities: string[];
    shields: string[];
    baseAttack1: IAttackInfo;
    baseAttack2: IAttackInfo;
    actions: number;
    attacksTarget: string;
    initiative: number;
    baseMovement: number;
}

interface IUnitActionResult {

}

interface ITurnResult {
    roundComplete: boolean;
    battleComplete: boolean;
    winner: string;
    actionResults: IUnitActionResult[];
}