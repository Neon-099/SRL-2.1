import {useState, useMemo} from 'react';

import { CheckSquare, Search, Grid, MapPin, Settings, RefreshCw, Wifi, WifiOff, Plus, AlertCircle, Calendar, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import Footer from '../components/Footer';
import type { Incident } from '../db/types/Incident';
import { useIncidents } from '../hooks/useIncident';
import { AlertCircle as AlertCircleIcon, FileText, Edit, Trash2 } from 'lucide-react';

import { IncidentEditModal} from '../components/modal/IncidentEditModal.tsx'

import IncidentsPage from './IncidentsPage.tsx';
import TasksPage from './TasksPage.tsx';

export default function Dashboard (){

    const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All')
    const [activeView, setActiveView] = useState<'tasks' | 'incidents' | 'dashboard'>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [incidentFilter, setIncidentFilter] = useState<'all' | 'incident' | 'report' >('all');
    const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
    const { incidents, deleted, loading: incidentsLoading } = useIncidents();
    const { tasks: realTasks, loading: tasksLoading } = useTasks();

    // Calculate statistics
    const stats = useMemo(() => {
        const totalTasks = realTasks.length;
        const totalIncidents = incidents.length;
        const pendingTasks = realTasks.filter(t =>  t.status === 'Pending').length;
        const inProgressTasks = realTasks.filter(t => t.status === 'In Progress').length;
        const completedTasks = realTasks.filter(t =>  t.status === 'Completed').length;
        const syncedTasks = realTasks.filter(t => t.synced).length;
        const localTasks = totalTasks - syncedTasks;
        const syncedIncidents = incidents.filter(i => i.synced).length;
        const localIncidents = totalIncidents - syncedIncidents;
        
        return {
            totalTasks,
            totalIncidents,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            syncedTasks,
            localTasks,
            syncedIncidents,
            localIncidents,
            totalPending: pendingTasks + inProgressTasks
        };
    }, [realTasks, incidents]);

    const filteredTask = activeTab === 'All' 
        ? realTasks
        : realTasks.filter(task => {
            const status = task.status?.toLowerCase();
            if (activeTab === 'Pending') return status === 'Pending';
            if (activeTab === 'In Progress') return status === 'In-Progress' || status === 'In-Progress';
            if (activeTab === 'Completed') return status === 'Completed';
            return true;
        });

    const filteredIncidents = incidentFilter === 'all'
        ? incidents 
        : incidents.filter(incident => incident.entity === incidentFilter);    

    const getSyncBadge = (synced: boolean) => {
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

    const getStatusBadge = (status: string) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'completed') {
            return <span className='px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200'>
                Completed
            </span>;
        }
        if (statusLower === 'in progress' || statusLower === 'in-progress') {
            return <span className='px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200'>
                In Progress
            </span>;
        }
        return <span className='px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200'>
            Pending
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

    const handleOpenModal = () => {
        setEditingIncident(null);
        setIsModalOpen(true);
    }

    const handleEditIncident = (incident: Incident) => {
        setEditingIncident(incident);
        setIsEditModalOpen(true);
    }

    const handleDeleteIncident = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this incident/report?')) {
            await deleted(id);
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingIncident(null);
    }

    return (
        <div className="flex h-screen bg-gray-200 min-h-[900px]">
            <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Field Ops tracker</h1>
                </div>

                <div className="px-4 mb-4">
                    <div className="relative">
                        <Search className='absolute left-3 top-1/4 transform-translate-y-12 text-gray-400 w-5 h-5' />
                        <input
                            type="text"
                            placeholder='Search...'
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                </div>

                <nav className="flex-1 px-4">
                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mg-1
                                ${ activeView === 'dashboard' 
                                    ? 'text-blue-600 bg-blue-50' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}>
                            <Grid className='w-5 h-5' />
                            <span>Dashboard</span>
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button
                            onClick={() => setActiveView('tasks')}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mg-1
                                ${ activeView === 'tasks' 
                                    ? 'text-blue-600 bg-blue-50' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}>
                            <CheckSquare className='w-5 h-5' />
                            <span>Task List</span>
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button
                            onClick={() => setActiveView('incidents')}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg mg-1 ${
                                activeView === 'incidents' 
                                    ? 'text-blue-600 bg-blue-50' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}>
                            <MapPin className='w-5 h-5' />
                            <span>Incidents</span>
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mg-1">
                            <RefreshCw className='w-5 h-5' />
                            <span>Sync Status</span>
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mg-1">
                            <Settings className='w-5 h-5' />
                            <span>Settings</span>
                        </button>
                    </div>
                </nav>

                <div className="sticky p-4 border-t border-gray-200 ">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sync</span>
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded flex items-center gap-1">Pending</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Queue</span>
                        <span className="text-sm text-gray-900 font-medium">3 Items</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded font-medium">Offline</span>
                    </div>
                </div>
            </div>

            {/*MAIN CONTENT*/}
            {activeView === 'dashboard' && (
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
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                                    <p className="text-sm text-gray-500">Monitor your tasks and incidents at a glance</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                        <WifiOff className='w-4 h-4 text-gray-600' />
                                        <span className="text-sm font-medium text-gray-700">Offline</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Total Tasks Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <CheckSquare className='w-6 h-6 text-blue-600' />
                                    </div>
                                    <TrendingUp className='w-5 h-5 text-gray-400' />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalTasks}</h3>
                                <p className="text-sm text-gray-500">Total Tasks</p>
                            </div>

                            {/* Total Incidents Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-red-100 rounded-xl">
                                        <AlertCircle className='w-6 h-6 text-red-600' />
                                    </div>
                                    <TrendingUp className='w-5 h-5 text-gray-400' />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalIncidents}</h3>
                                <p className="text-sm text-gray-500">Total Incidents</p>
                            </div>

                            {/* Pending Tasks Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-amber-100 rounded-xl">
                                        <Clock className='w-6 h-6 text-amber-600' />
                                    </div>
                                    <TrendingUp className='w-5 h-5 text-gray-400' />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalPending}</h3>
                                <p className="text-sm text-gray-500">Pending Tasks</p>
                            </div>

                            {/* Completed Tasks Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-emerald-100 rounded-xl">
                                        <CheckCircle2 className='w-6 h-6 text-emerald-600' />
                                    </div>
                                    <TrendingUp className='w-5 h-5 text-gray-400' />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completedTasks}</h3>
                                <p className="text-sm text-gray-500">Completed Tasks</p>
                            </div>
                        </div>

                        {/* Sync Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Tasks Sync Status</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                <span className="text-sm font-medium text-gray-700">{stats.syncedTasks} Synced</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                                <span className="text-sm font-medium text-gray-700">{stats.localTasks} Local</span>
                                            </div>
                                        </div>
                                    </div>
                                    <RefreshCw className='w-5 h-5 text-gray-400' />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Incidents Sync Status</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                <span className="text-sm font-medium text-gray-700">{stats.syncedIncidents} Synced</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                                <span className="text-sm font-medium text-gray-700">{stats.localIncidents} Local</span>
                                            </div>
                                        </div>
                                    </div>
                                    <RefreshCw className='w-5 h-5 text-gray-400' />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div className="flex-1 flex flex-col">
                        {/* Tabs */}
                        <div className="bg-white border-b border-gray-200 px-8 shadow-sm">
                            <div className="flex gap-2">
                                {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 font-medium transition-colors relative ${
                                            activeTab === tab 
                                                ? 'text-blue-600' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}>
                                        {tab}
                                        {activeTab === tab && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="overflow-auto flex-1 px-8 py-6">
                            {tasksLoading ? (
                                <div className="text-center py-16">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="mt-4 text-gray-500">Loading tasks...</p>
                                </div>
                            ) : filteredTask.length === 0 ? (
                                <div className="text-center py-16 max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckSquare className='w-10 h-10 text-gray-400' />
                                    </div>
                                    <p className="text-xl font-semibold text-gray-700 mb-2">No tasks found</p>
                                    <p className="text-sm text-gray-500">
                                        {activeTab === 'All' 
                                            ? 'Get started by creating your first task' 
                                            : `No ${activeTab.toLowerCase()} tasks found`}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-w-6xl mx-auto">
                                    {filteredTask.map((task) => (
                                        <div
                                            key={task.id}
                                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 hover:border-gray-300 group">
                                            <div className="flex gap-5">
                                                {/* Icon */}
                                                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                                                    <CheckSquare className='w-8 h-8 text-blue-600' />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                                {task.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {getStatusBadge(task.status || 'Pending')}
                                                                {getSyncBadge(task.synced || false)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {task.description && (
                                                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}

                                                     <div className="flex items-center gap-6 text-sm text-gray-500 mb-3 flex-wrap">
                                                        {task.location && (
                                                            <div className="flex items-center gap-2">
                                                                <div className="p-1.5 bg-gray-100 rounded">
                                                                    <MapPin className='w-3.5 h-3.5 text-gray-600' />
                                                                </div>
                                                                <span className="font-medium">
                                                                    {typeof task.location === 'object' 
                                                                        ? `${task.location.lat.toFixed(6)}, ${task.location.lng.toFixed(6)}`
                                                                        : task.location}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1.5 bg-gray-100 rounded">
                                                                <Calendar className='w-3.5 h-3.5 text-gray-600' />
                                                            </div>
                                                            <span>Updated {formatDate(task.updatedAt)}</span>
                                                        </div>
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
                    </div>

                    {/* Footer */}
                    <div className="h-[98px] bg-white border-t border-gray-200 flex items-center justify-end px-8 shadow-sm">
                        <Footer />
                    </div>
                </div>  
            )}

            {activeView === 'incidents' && (
                <IncidentsPage />
            )}

            {activeView === 'tasks' && (
                <TasksPage />
            )}

        </div>
    )
}