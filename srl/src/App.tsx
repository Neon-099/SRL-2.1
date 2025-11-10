import './App.css'
import {ply1, gainExp, calculateDamage, getReward} from './components/Xp.tsx';

function App() {

  type Chrter = {   //TYPE INFERENCE 
    id?: number, //it automtically determines the type bsed on assigned values
    name: string,
    level: number,
    isOnline: boolean,
    inventory: string[]
  };

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
  const player : Chrter = {name: "Test", level: 10, isOnline: true, inventory: ["sword", "shield"]};


  let hex : number = 0xf00d; //HEXADECIMAL  
  let binary : number = 0b1010 //BINARY


  const symb1 : symbol = Symbol('mysql');
  const symb2 : symbol = Symbol('mysql');
  // console.log('symbol: ', symb2 === symb2);

  const unk : unknown = 10;
  const anys : any = 'nme';

  const uniqueKey: symbol = Symbol ('description');  
  const obj = {
    [uniqueKey]: 'This is a unique property'
  };
  //NEED TO ACCESS USING SYMBOL REFERENCE\
  // console.log(obj[uniqueKey]); // "This is a unique property"
  
  // console.log(uniqueKey); // "This is a unique property"

  //NEVER 
  type Shape = "circle" | "square" | "triangle" | "rectangle"; // new type added!

  function getArea(shape: Shape) {
    switch (shape) {
      case "circle":
        return "area of circle";
      case "square":
        return "area of square";
      case "triangle":
        return "area of triangle";
      default:
        //const _exhaustiveCheck: never = shape; 
        // ❌ ERROR: Type '"rectangle"' is not assignable to type 'never'
        //return _exhaustiveCheck;
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

function ShowQuestLog(): void {
    console.log("Quest log");
    Quest.forEach(q => {
        console.log(`${q.id} . ${q.title} [${q.status}] - ${q.xp} XP`);
    });
}

addQuest("Rescue Villager", 230);
completeQuestById(2);
ShowQuestLog();
console.log("Completed", getCompletedQuest());

  return (
    <>  
      <div className=''>
        <h2>{ply1.name}</h2>
        <p>Experience: {gainExp(ply1.level)}</p>
        <p>Damage: {calculateDamage(ply1.level, ply1.isCritical)}</p>
        <p>Reward: {getReward('bronze')}</p>
      </div>
    </>
  )
}

export default App
