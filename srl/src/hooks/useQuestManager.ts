import { useEffect, useState  } from "react";
import { type Quest } from '../types/quest.ts'
import { v4 as uuid } from 'uuid'
import { dbGetAllQuest } from "../utils/questDB.ts";





export const useQuestManager = () => {
    const [quests, setQuests] = useState<Quest[]>([])

    console.log("UUID", uuid())
    
    useEffect(() => {
        (async () => {
            const dbQuests = await dbGetAllQuest();
            setQuests(dbQuests);
        })();
    }, []);



    const addQuest = (quest: Omit<Quest, "createdAt" | "updatedAt">) => {
       const newQuest: Quest = {
        ...quest,
        createdAt: Date.now(),
        updatedAt: Date.now(),
       };
        setQuests(prev => [...prev, newQuest]);   
    }

    const updateQuest = (id: string, updates: Partial<Quest>) => {
        setQuests(prev => 
        prev.map(q => 
            q.id === id ? {...q,  updates, updatedAt: Date.now()}: q
        )
       )
    }

    const deleteQuest = (id: string) => {   
        setQuests(prev => prev.filter(q => q.id !== id));
    }

    const getQuestsByCategory = (categoryId: string) => {
        return quests.filter(q => q.categoryId === categoryId);
    }

    return {
        quests,
        addQuest,
        updateQuest,
        deleteQuest,
        getQuestsByCategory
    };
}