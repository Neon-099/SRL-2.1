import { useState, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { useTasks } from "../../hooks/useTasks";
import type { Task } from "../../db/types/Task";

interface TaskEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

export const TaskEditModal = ({ isOpen, onClose, task }: TaskEditModalProps) => {
    const [selectedType, setSelectedType] = useState<'' | 'task' | null>(null);
    const { update } = useTasks();

    const [form, setForm] = useState({
        title: '',
        description: '',
        locationLat: '',
        locationLng: '',
        attachment: [] as string[],
    });

    // Populate form when incident changes or modal opens
    useEffect(() => {
        if (task && isOpen) {
            setSelectedType(task.entity);
            setForm({
                title: task.title,
                description: task.description,
                locationLat: task.location.lat.toString(),
                locationLng: task.location.lng.toString(),
                attachment: [] as string[]
            });
        }
    }, [task, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); //PREVENT EVENT BUBBLING

        if (!form.title || !form.description || !form.locationLat || !form.locationLng ||  !task) {
            return;
        }

        const location = {
            lat: parseFloat(form.locationLat),
            lng: parseFloat(form.locationLng),
        };

        if (isNaN(location.lat) || isNaN(location.lng)) {
            alert('Please enter valid coordinates');
            return;
        }

        try {
            await update(task.id, {
                entity: 'task',
                title: form.title,
                description: form.description,
                location,
                attachments: form.attachment.length > 0 ? form.attachment : undefined,
            });

            onClose();
        } catch (error) {
            console.error('Error updating incident/report:', error);
            alert('Failed to update. Please try again.');
        }
    };

    if (!task) {
        return null;
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

                        {/* MODAL */}
                        <motion.div
                            className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md
                                -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/40
                                shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                            initial={{ scale: 0.7, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.7, opacity: 0, y: 20 }}
                        >
                                // Form Screen
                                <div>
                                    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                                        <div>
                                            <label htmlFor="title" className="text-gray-300 text-sm">
                                                Title <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white
                                                    focus:outline-none focus:border-purple-500/60"
                                                value={form.title}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter title"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="text-gray-300 text-sm">
                                                Description <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white
                                                    focus:outline-none focus:border-purple-500/60"
                                                value={form.description}
                                                onChange={handleChange}
                                                rows={4}
                                                required
                                                placeholder="Enter description"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="locationLat" className="text-gray-300 text-sm">
                                                    Latitude <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    id="locationLat"
                                                    name="locationLat"
                                                    step="any"
                                                    className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white
                                                        focus:outline-none focus:border-purple-500/60"
                                                    value={form.locationLat}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="0.0000"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="locationLng" className="text-gray-300 text-sm">
                                                    Longitude <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    id="locationLng"
                                                    name="locationLng"
                                                    step="any"
                                                    className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white
                                                        focus:outline-none focus:border-purple-500/60"
                                                    value={form.locationLng}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="0.0000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="photos" className="text-gray-300 text-sm">
                                                Photo URLs (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                id="photos"
                                                name="photos"
                                                className="w-full mt-1 p-2 rounded-md bg-black/40 border border-purple-500/40 text-white
                                                    focus:outline-none focus:border-purple-500/60"
                                                value={form.attachment.join(', ')}
                                                placeholder="url1, url2, url3"
                                                onChange={(e) => {
                                                    const urls = e.target.value
                                                        .split(',')
                                                        .map(url => url.trim())
                                                        .filter(url => url.length > 0);
                                                    setForm(prev => ({ ...prev, photos: urls }));
                                                }}
                                            />
                                        </div>

                                        <div className='flex justify-end gap-2 mt-2'>
                                            <button
                                                className='px-4 py-2 rounded-lg text-gray-300 bg-white/10 hover:bg-white/20 transition-colors'
                                                onClick={onClose}
                                                type='button'
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className='px-4 py-2 rounded-lg text-white bg-purple-500/40 hover:bg-purple-500/60 
                                                    border border-purple-500/40 transition-colors'
                                                type='submit'
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </form>
                                </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};