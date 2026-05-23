import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import Map from './pages/Map';

export default function App() {
	return (
		<BrowserRouter>
			{/* Navigation */}
			{/* <nav className='flex flex-row gap-2'>
				<Link to="/">Home</Link>
				<Link to="/about">About</Link>
				<Link to="/contact">Contact</Link>
			</nav> */}

			{/* Routes */}
			<Routes>
				<Route path="/" element={<Map />} />
			</Routes>
		</BrowserRouter>
	)
}
