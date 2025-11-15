import { motion, AnimatePresence, scale } from 'framer-motion';

import { useState, type FormEvent } from "react";
import { useQuest } from "../../contexts/QuestContext"



interface QuestModalProps {
    isOpen: boolean,
    onClose: () => void
}

export const QuestFormModal = ({ isOpen, onClose }: QuestModalProps ) => {
    
    const { addQuest } = useQuest();

    const [form, setForm] = useState({
        title: '',
        description: '',
        categoryId: '',
        xp: 10
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;   
        setForm(prev => ({ ...prev, [name]: name === 'xp' ? Number(value) : value}))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
    
        if(!form.title || !form.categoryId) return;

        addQuest({
            id: '1',
            title: form.title,
            description: form.description,
            categoryId: form.categoryId,
            xp: form.xp,
            status: "todo"
        });


        onClose();
    }   

    return (

        <div>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            className='fixed inset-0 bg-black/60 background-blur-md z-40'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                        />

                        {/*MODAL */}
                        <motion.div className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md
                            -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/40
                            shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                                initial = {{ scale: 0.7, opacity: 0, y:20  }}
                                animate= {{ scale: 1, opacity: 1, y:0}}
                                exit={{ scale: 0.7, opacity: 0, y:20}}>
                                <h2 className="text-xl font-bold text-white b-4">
                                    Create New Quest
                                </h2>

                                <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="" className="text-gray-300 text-sm">Title</label>
                                        <input type="text" className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white"
                                            value={form.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div> 

                                    <div>
                                        <label htmlFor="" className="text-gray-300 text-sm">Description</label>
                                        <textarea 
                                            className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows={3}
                                        />
                                    </div>   

                                    <div>
                                        <label htmlFor="" className="text-gray-300 text-sm">Title</label>
                                        <select
                                            className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white"
                                            value={form.categoryId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="life">Life</option>
                                            <option value="health">Health</option>
                                            <option value="learning">Learning</option>
                                            <option value="Work">Work</option>
                                        </select>
                                    </div>  

                                    <div>
                                        <label className="text-gray-300 text-sm">Experience</label>
                                        <input 
                                            className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white"
                                            type="number"
                                            value={form.xp}
                                            onChange={handleChange}
                                            min={1}
                                            max={5}
                                            required
                                        />
                                    </div>  

                                    <div className='flex justify-end gap-2 mt-2'>
                                        <button
                                            className='px-4 py-2 rounded-lg text-gray-300 bg-white/10 hover:bg-white/20'
                                            onClick={onClose}
                                            type='button'>
                                                Close
                                        </button>
                                        <button
                                            className='px-4 py-2 rounded-lg text-gray-300 bg-white/10 hover:bg-white/20'
                                            type='submit'>
                                                Submit
                                        </button>
                                    </div>
                                </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>

    )
}