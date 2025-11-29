import { AnimatePresence, motion } from 'framer-motion';
import type { Incident } from '../../db/types/Incident';
import { AlertCircle, FileText, MapPin, Calendar, Image as ImageIcon, X, Clock } from 'lucide-react';


interface IncidentViewDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    incident: Incident | null;
}

export const IncidentViewDetailsModal = ({ isOpen, onClose, incident }: IncidentViewDetailsModalProps) => {
    if (!incident) return null;

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatRelativeDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

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
                            className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-2xl
                                -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className={`px-6 py-4 border-b ${
                                incident.entity === 'incident' 
                                    ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' 
                                    : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-lg ${
                                            incident.entity === 'incident'
                                                ? 'bg-red-200'
                                                : 'bg-blue-200'
                                        }`}>
                                            {incident.entity === 'incident' ? (
                                                <AlertCircle className='w-6 h-6 text-red-700' />
                                            ) : (
                                                <FileText className='w-6 h-6 text-blue-700' />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {incident.title}
                                            </h2>
                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block ${
                                                incident.entity === 'incident'
                                                    ? 'bg-red-200 text-red-800'
                                                    : 'bg-blue-200 text-blue-800'
                                            }`}>
                                                {incident.entity === 'incident' ? 'Incident' : 'Report'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                        title="Close">
                                        <X className='w-5 h-5 text-gray-600' />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {incident.description}
                                    </p>
                                </div>

                                {/* Location */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h3>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className='w-5 h-5 text-gray-500' />
                                        <span className="font-mono text-sm">
                                            {incident.location.lat.toFixed(6)}, {incident.location.lng.toFixed(6)}
                                        </span>
                                    </div>
                                </div>

                                {/* Photos */}
                                {incident.photos && incident.photos.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Photos</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {incident.photos.map((photo, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={photo}
                                                        alt={`Photo ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                                                        }}
                                                    />
                                                    <a
                                                        href={photo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                        <ImageIcon className='w-6 h-6 text-white' />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Created</h3>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Clock className='w-4 h-4 text-gray-500' />
                                            <div>
                                                <p className="text-sm">{formatDate(incident.createdAt)}</p>
                                                <p className="text-xs text-gray-500">{formatRelativeDate(incident.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Last Updated</h3>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Calendar className='w-4 h-4 text-gray-500' />
                                            <div>
                                                <p className="text-sm">{formatDate(incident.updatedAt)}</p>
                                                <p className="text-xs text-gray-500">{formatRelativeDate(incident.updatedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sync Status */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-500 uppercase">Sync Status</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            incident.synced
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}>
                                            {incident.synced ? 'Synced' : 'Local'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};