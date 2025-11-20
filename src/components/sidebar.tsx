export default function Sidebar() {
    return (
        <aside className="h-screen w-64 bg-white border-r border-gray-400 text-black flex flex-col">
            {/* Sidebar header */}
            { /* logo area */}
            {/* "div" because it is boxes (less critical) than critical side ("aside") information*/}
            <div className ="px-6 py-5">
                <h1 className="text-xl font-semibold text-gray-900">UnitNode</h1>
            </div>

            {/* Navigation (pages) */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100">
                    Properties
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-sm hover:bg-gray-100">
                    Settings
                </a>
            </nav>
        </aside>
    )
}