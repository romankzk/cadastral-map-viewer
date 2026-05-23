import { Outlet } from 'react-router-dom'
import './App.css'

export default function App() {
	return (
		<div className="w-full h-screen flex flex-col bg-slate-50 overflow-hidden">
			{/* Main workspace container */}
			<main className="flex-1 relative w-full h-full">
				<Outlet />
			</main>
		</div>
	)
}
