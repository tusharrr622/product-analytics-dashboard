import CombinedChart from './charts/CombinedCharts';
import '../stylesheets/Dashboard.css'

const Dashboard = ({ onLogout }) => {
    return (
        <>
            <div className='dasboard-header'>
                <h1>Product Analytics Dasboard</h1>
                <button className='logout' onClick={onLogout}>Logout</button>
            </div>
            <CombinedChart />
        </>
    )
}


export default Dashboard;
