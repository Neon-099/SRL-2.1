import {useState} from 'react';

import { CheckSquare, Search, Grid, MapPin, Settings, RefreshCw, WifiOff } from 'lucide-react';


interface Task {
    id: number,
    title: string
    description: string
    location: string
    updated: string
    status: 'Pending' | 'In Progress' | 'Completed'
    syncStatus: 'synced' | 'local' | 'pending'
    hasMap?: boolean
}

export default function Dashboard (){

    const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All')

    const tasks: Task[] = [
        {
            id: 1,
            title: "Inspect HVAC Unit A",
            description: 'Routine Inspection and temperature calibration for Unit A',
            location: 'North Ville',
            updated: 'Updated 12mins ago',
            status: 'Pending',
            syncStatus: 'local',
            hasMap: false
        },
        {
            id: 2,
            title: "Inspect HVAC Unit A",
            description: 'Routine Inspection and temperature calibration for Unit A',
            location: 'North Ville',
            updated: 'Updated 12mins ago',
            status: 'Pending',
            syncStatus: 'synced',
            hasMap: false
        },
        {
            id: 3,
            title: "Inspect HVAC Unit A",
            description: 'Routine Inspection and temperature calibration for Unit A',
            location: 'North Ville',
            updated: 'Updated 12mins ago',
            status: 'Pending',
            syncStatus: 'local',
            hasMap: false
        },{
            id: 4,
            title: "Inspect HVAC Unit A",
            description: 'Routine Inspection and temperature calibration for Unit A',
            location: 'North Ville',
            updated: 'Updated 12mins ago',
            status: 'Pending',
            syncStatus: 'local',
            hasMap: false
        },{
            id: 5,
            title: "Inspect HVAC Unit A",
            description: 'Routine Inspection and temperature calibration for Unit A',
            location: 'North Ville',
            updated: 'Updated 12mins ago',
            status: 'Pending',
            syncStatus: 'local',
            hasMap: false
        },{
            id: 6,
            title: "Inspect HVAC Unit A",
            description: 'Routine Inspection and temperature calibration for Unit A',
            location: 'North Ville',
            updated: 'Updated 12mins ago',
            status: 'Pending',
            syncStatus: 'local',
            hasMap: false
        }
    ];

    const filteredTask = activeTab === 'All' 
        ? tasks
        : tasks.filter(tasks => tasks.status === activeTab);
        
    const getSyncBadge = (syncStatus: string, status: string) => {
        switch (syncStatus) {
            case 'synced':
                return <span className='px-3 py-1 bg-green-600 text-white text-sm rounded flex items-center gap-1'>Synced </span>;
            case 'local' :
                return <span className='px-3 py-1 bg-orange-400 text-white text-sm rounded flex items-center gap-1'>Local </span>
            case 'pending' :
                return <span className='px-3 py-1 bg-blue-400 text-white text-sm rounded flex items-center gap-1'>Pending </span>
        }
    }

    return (
        <div className="flex-h screen bg-gray-200">
            <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Field Ops tracker</h1>
                </div>

                <div className="px-4 mb-4">
                    <div className="relative">
                        <Search className='absolute left-3 top-1/2 transform-translate-y-12 text-gray-400 w-5 h-5'/>
                        <input 
                            type="text"
                            placeholder='Search...'
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                    </div>
                </div>

                <nav className="flex-1 px-4">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <Grid className='w-5 h-5'/>
                        <span>Dashboard</span>
                    </button>

                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mg-1">
                            <CheckSquare className='w-5 h-5'/>
                            <span>Task List</span>
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mg-1">
                            <MapPin className='w-5 h-5'/>
                            <span>Incidents</span>
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mg-1">
                            <RefreshCw className='w-5 h-5'/>
                            <span>Sync Status</span>
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg mb-1">
                        <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mg-1">
                            <Settings className='w-5 h-5'/>
                            <span>Settings</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sync</span>
                        <span className="px-2py-1bg-orange-500text-white text-xs rounded flex items-center gap-1">Pending</span>
                    </div> 
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Queue</span>
                        <span className="text-sm text-gray-900font-medium">3 Items</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded font-medium">Offline</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="bg-orange-100 border-l-4 border-orange-500 px-6 py-3 flex items-center gap-2">
                    <WifiOff className='w-5 h-5'/>
                    <span className="text-orange-700font-medium">Offline Mode - changes are queued</span>
                </div>
                {/*HEADER*/}
                <div className="bg-white border-b border-gray-900 px-8 py-6 justify-between items-center">Tasks
                    <WifiOff className='w-5 h-5'/>
                    <span className="font-medium">Status: Offline</span>
                </div>
            </div>  

            {/*TABS*/}
            <div className="bg-white border-b border-gray-200 px-8">
                <div className="flex gap-2">
                    {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((tab) => (
                        <button
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === tab ? 'text-blue-600': 'text-gray-600 hover:text-gray-600'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/*TASKS LIST*/}
            <div className="flex-1 over-flow-auto px-8 py-6">
                <div className="space-y-4 max-w-7xl">
                    {filteredTask.map((task) => (
                        <div
                            key={task.id} 
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                {task.hasMap ? (
                                    <div className="w-20 h-20 bg-gray-200 rounded bg-gray-200 flex-shrink-0">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded"></div>
                                    </div>
                                ): (
                                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                        <MapPin className='w-8 h-8'/>
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flexjustify-betweenitems-startmb-2">
                                        <h3 className="text-lgfont-semiboldtext-gray-900">{task.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-medium ${task.status === 'Completed' 
                                                ? 'text-gray-600' 
                                                : task.status === 'In Progress' 
                                                    ? 'text-blue-600'
                                                    : 'text-orange-600'}`}>
                                                {task.status}
                                            </span>

                                            {getSyncBadge(task.syncStatus, task.status)}
                                        </div>
                                    </div>

                                    <p className="text-gray-600mb-3">{task.description}</p>
                                    <div className="flexitems-centergap-4text-smtext-gray-500">
                                        <div className="flexitems-centergap-4">
                                            <MapPin className='w-4 h-4'/>
                                            <span>{task.location}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <RefreshCw className='w-4 h-4'/>
                                            <span>{task.updated}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="text-center py-8 text-gray-500">
                        End of list
                    </div>
                </div>
            </div>
        </div>
    )

}