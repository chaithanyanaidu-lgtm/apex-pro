import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-bg text-apex-text selection:bg-apex-accent selection:text-bg">
            <Sidebar />
            <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-9 min-h-screen overflow-y-auto pt-16 lg:pt-9">
                {children}
            </main>
        </div>
    )
}
