

const weapon = Symbol("weapon");
    
//INTERFACE TYPES (can be  reuse multiple obj)  
interface Players  {
    id: number   // : (type annotations) 
    name: string
    level: number
    [weapon] ?: string
    isCritical: boolean   
    isOnline: boolean
};

export const ply1 : Players = {
    id: 1,
    name: 'Emman',
    level: 20,
    [weapon]: "sword", //SYMBOL
    isCritical: true,  
    isOnline: true,
  }

//If string, convert to number before adding to player XP.
    //XP CONVERTER
export function gainExp(Xp: number | string): number {
    let convert = typeof Xp === 'string' ? parseInt(Xp) : Xp;
    const result = convert + 12;
    return result;
}

export function calculateDamage(base: number, critical ?: boolean): number {
    let isCritical = critical ? true : false;
    const damage = base * (isCritical ? 2 : 1);
    return damage; 
}

//LITERAL TYPES
type reward = "bronze" | 'silver' | 'gold';  

export function getReward(chestType: reward) {
    switch(chestType){
        case 'bronze': 
            return 'bronze';
        case 'silver':
            return 'silver';
        case 'gold':
            return 'gold';
        default:
            const check : never = chestType;
            return check;
    }   
}

type QuestStatus =  'Pending' |  'Completed' | 'Failed'

interface Quests {
    id: number,
    title: string ,
    status: QuestStatus,
    xp: number; 
}

let Quest : Quests[] = [
    { id: 1, title: "Train in the Forest", status: 'Pending', xp: 100 },
    { id: 2, title: "Defeat the Goblin", status: 'Pending', xp: 250 },
]; 
function addQuest(title : string, xp: number){
    const id = Quest.length > 0 ? Quest[Quest.length - 1].id + 1 : 1;
    const newQuest: Quests = {id, title, xp, status: 'Pending'};
    Quest.push(newQuest);
}

function completeQuestById(id: number) {
    Quest = Quest.map(q => q.id === id ? {...q, status: 'Completed'} : q);
}   

function getCompletedQuest(): Quests[] {
    return Quest.filter(q => q.status === 'Completed');
}

export function ShowQuestLog(): void {
    console.log("Quest log");
    Quest.forEach(q => {
        console.log(`${q.id} . ${q.title} [${q.status}] - ${q.xp} XP`);
    });
}
