import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-gray-900">WalmartPrep Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1">Walmart Readiness Score</h3>
                        <p className="text-5xl font-bold text-blue-600">72<span className="text-2xl text-gray-400">/100</span></p>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">You are getting closer! Keep it up.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1">Questions Solved</h3>
                        <p className="text-5xl font-bold text-green-600">45<span className="text-2xl text-gray-400">/120</span></p>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full mt-4">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '37.5%' }}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-gray-500 font-medium mb-1">Current Streak</h3>
                        <p className="text-5xl font-bold text-orange-500">12 <span className="text-2xl text-gray-400">Days</span></p>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">Your longest streak is 14 days.</p>
                </div>
            </div>

            <div className="flex space-x-4 mt-8">
                <Link href="/dsa" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                    Go to DSA Sheet
                </Link>
                <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                    Start Interview Simulation
                </button>
            </div>
        </div>
    );
}
