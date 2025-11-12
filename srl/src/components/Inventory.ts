
import { useState } from "react";

//<> generic type of variable
//ANGLE BRACKET   <Explicitly type>
export function getFirst<T>(arr: T[]): T | undefined {
    return arr[3];
}

interface InventoryItem<T> {
    id: number,
    name: string,
    data: T
};

interface Weapons {
    damage: number,
    rarity: string
};

// export const sword : InventoryItem<Weapons> = {
//     id: 1,
//     name: "Kaubinshin",
//     data: {
//         damage: 10,
//         rarity: "legendary"
//     }
// }

export function upgradeItem<T>(item: T, upgrade: Partial<T>): T {
    return { ...item, ...upgrade };
}

const sword = { name: 'Kagibunshin', damage: 30};
export const upgradedSword = upgradeItem(sword, {damage: 10});





