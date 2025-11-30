import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit, Trash2, AlertCircle, FileText, RefreshCw, WifiOff, Search, Calendar, Image as ImageIcon } from 'lucide-react';

import { useIncidents } from '../hooks/useIncident';
import  { Incident } from '../db/types/Incident';

import Footer from '../components/Footer';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';

import { IncidentFormModal } from '../components/modal/IncidentFormModal.tsx';
import { IncidentEditModal } from '../components/modal/IncidentEditModal';
import { IncidentViewDetailsModal } from '../components/modal/IncidentViewDetailsModal';
export default function IncidentsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
    const [viewingIncident, setViewingIncident] = useState<Incident | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { incidents, loading, deleted } = useIncidents();

    const getIncidentSyncBadge = (synced: boolean) => {
        return synced
            ? <span className='px-2.5 py-1 bg-emerald-500/10 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200 flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></span>
                Synced
            </span>
            : <span className='px-2.5 py-1 bg-amber-500/10 text-amber-700 text-xs font-medium rounded-full border border-amber-200 flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 bg-amber-500 rounded-full'></span>
                Local
            </span>;
    }

    const formatDate = (timestamp: number) => {
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
    }

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    }

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    }

    const handleEditIncident = (incident: Incident) => {
        setEditingIncident(incident);
        setIsEditModalOpen(true);
    }   

    const handleViewIncident = (incident: Incident) => {
        setViewingIncident(incident);
        setIsViewModalOpen(true);
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingIncident(null);
    }

    const handleDeleteIncident = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this incident/report?')) {
            try {
                await deleted(id);
                // Only show success message, no error alert if it succeeds
                console.log('Incident deleted successfully');
            } catch (error) {
                console.error('Error deleting incident:', error);
                // Only show alert if there's an actual error
                if (error instanceof Error) {
                    alert(`Failed to delete: ${error.message}`);
                } else {
                    alert('Failed to delete. Please try again.');
                }
            }
        }
    }

    console.log("Filtered Incidents: ", incidents);

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Offline Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2 shadow-sm">
                <div className="p-1.5 bg-amber-100 rounded-full">
                    <WifiOff className='w-4 h-4 text-amber-700' />
                </div>
                <span className="text-amber-800 font-medium text-sm">Offline Mode - changes are queued for sync</span>
            </div>

            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-8 py-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Incidents & Reports</h2>
                            <p className="text-sm text-gray-500">
                                {incidents.length} {incidents.length === 1 ? 'item' : 'items'} found
                                {searchQuery && ` matching "${searchQuery}"`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                <WifiOff className='w-4 h-4 text-gray-600' />
                                <span className="text-sm font-medium text-gray-700">Offline</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative max-w-md">
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                type="text"
                                placeholder='Search incidents and reports...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400'
                            />
                        </div>
                    </div>
                  
                </div>
            </div>

            {/* Incidents List */}
            <div className="overflow-auto flex-1 px-8 py-6">
                {loading ? (
                    <LoadingSpinner 
                        loadItem='Incident'/>
                ) : incidents.length === 0 ? (
                    <div className="text-center py-16 max-w-md mx-auto">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className='w-10 h-10 text-gray-400' />
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-gray-700 mb-2">
                            No {incidents.length === 0 ? 'incidents or reports' : incidents + 's'} found
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            {searchQuery ? 'Try adjusting your search query' : 'Get started by creating your first incident or report'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleOpenCreateModal}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg">
                                Create First Incident/Report
                            </button>
                        )}
                    </div>
                    ) : (
                    <div className="space-y-4 max-w-6xl mx-auto">
                        {incidents.map((incident) => (
                            <div
                                key={incident.id}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 hover:border-gray-300 group">
                                <div className="flex gap-5">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100 border border-red-200`}>
                                        <AlertCircle className='w-8 h-8 text-red-600' />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {incident.title}
                                                </h3>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold 
                                                           'bg-red-100 text-red-700 border border-red-200'
                                                    `}>
                                                        Incident
                                                    </span>
                                                    {getIncidentSyncBadge(incident.synced)}
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={() => handleEditIncident(incident)}
                                                    className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                                    title="Edit">
                                                    <Edit className='w-5 h-5' />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteIncident(incident.id)}
                                                    className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                                                    title="Delete">
                                                    <Trash2 className='w-5 h-5' />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                                            {incident.description}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-gray-100 rounded">
                                                    <MapPin className='w-3.5 h-3.5 text-gray-600' />
                                                </div>
                                                <span className="font-medium">
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-gray-100 rounded">
                                                    <Calendar className='w-3.5 h-3.5 text-gray-600' />
                                                </div>
                                                <span>Updated {formatDate(incident.updatedAt)}</span>
                                            </div>
                                        </div>

                                        {incident.photos && incident.photos.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg inline-flex">
                                                <ImageIcon className='w-4 h-4 text-gray-500' />
                                                <span className="font-medium">{incident.photos.length}</span>
                                                <span>photo{incident.photos.length > 1 ? 's' : ''} attached</span>
                                            </div>
                                        )}

                                        <div className="">
                                            <button onClick={() => handleViewIncident(incident)} className='rounded-[120px] border p-2'>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="text-center py-8 text-gray-400 text-sm">
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-px bg-gray-300 flex-1 max-w-xs"></div>
                                <span>End of list</span>
                                <div className="h-px bg-gray-300 flex-1 max-w-xs"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="h-[98px] bg-white border-t border-gray-200 flex items-center justify-end px-8 shadow-sm">
                <Footer />
            </div>

            {/* Add Button */}
            <button
                onClick={handleOpenCreateModal}
                className="fixed top-34 right-8 bg-blue-600 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 font-semibold hover:scale-105 z-30 group">
                <Plus className='w-5 h-5 group-hover:rotate-90 transition-transform duration-200' />
                <span>Add Incident Report</span>
            </button>

            {/* Create Modal */}
            <IncidentFormModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
            />

            {/* Edit Modal */}
            {isEditModalOpen && (
                <IncidentEditModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    incident={editingIncident}
                />
            )}

            {isViewModalOpen && (
                <IncidentViewDetailsModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    incident={viewingIncident}
                />
            )}
        </div>
    );
}

// Export for use in other components
export { IncidentsPage };