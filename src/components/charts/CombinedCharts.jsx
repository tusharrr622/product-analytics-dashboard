import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import '../../stylesheets/CombinedChart.css';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    Tooltip,
    Legend,
    Title,
    PointElement,
    LineElement,
} from 'chart.js';

// Register the components
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    Tooltip,
    Legend,
    Title,
    PointElement,
    LineElement
);

function CombinedChart() {
    const location = useLocation();

    const [selectedGender, setSelectedGender] = useState(Cookies.get('selectedGender') || "Male");
    const [selectedAge, setSelectedAge] = useState(Cookies.get('selectedAge') || "15-25");
    const [startDate, setStartDate] = useState(Cookies.get('startDate') ? new Date(Cookies.get('startDate')) : null);
    const [endDate, setEndDate] = useState(Cookies.get('endDate') ? new Date(Cookies.get('endDate')) : null);

    // Fetch data
    const [rawData, setRawData] = useState([]);

    useEffect(() => {

        fetch('https://sheetdb.io/api/v1/5v0zrpc5mpt43')
            .then((response) => response.json())
            .then((data) => {
                const formattedData = data.map((entry) => ({
                    day: entry.Day,
                    age: entry.Age,
                    gender: entry.Gender,
                    A: parseInt(entry.A, 10) || 0,
                    B: parseInt(entry.B, 10) || 0,
                    C: parseInt(entry.C, 10) || 0,
                    D: parseInt(entry.D, 10) || 0,
                    E: parseInt(entry.E, 10) || 0,
                    F: parseInt(entry.F, 10) || 0,
                }));
                setRawData(formattedData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


    useEffect(() => {
        Cookies.set('selectedGender', selectedGender, { expires: 7 });
        Cookies.set('selectedAge', selectedAge, { expires: 7 });
        if (startDate) Cookies.set('startDate', startDate.toISOString(), { expires: 7 });
        if (endDate) Cookies.set('endDate', endDate.toISOString(), { expires: 7 });
    }, [selectedGender, selectedAge, startDate, endDate]);


    // Fetch and parse URL parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const gender = params.get('gender');
        const age = params.get('age');
        const start = params.get('startDate');
        const end = params.get('endDate');

        if (gender) setSelectedGender(gender);
        if (age) setSelectedAge(age);
        if (start) setStartDate(new Date(start));
        if (end) setEndDate(new Date(end));
    }, [location.search]);


    // Function to generate a shareable link
    const generateShareableLink = () => {
        const query = new URLSearchParams({
            gender: selectedGender,
            age: selectedAge,
            startDate: startDate ? startDate.toISOString() : '',
            endDate: endDate ? endDate.toISOString() : ''
        }).toString();
        const shareableLink = `${window.location.origin}${window.location.pathname}?${query}`;
        navigator.clipboard.writeText(shareableLink); // Copy the link to clipboard
        alert('Shareable link copied to clipboard!');
    };

    

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    //Filter Data According to Gender, Age, Date Range Picker
    const filteredData = rawData.filter((item) => {
        const itemDate = parseDate(item.day);
        const isAfterStartDate = !startDate || itemDate >= startDate;
        const isBeforeEndDate = !endDate || itemDate <= endDate;

        return (
            item.gender === selectedGender &&
            item.age === selectedAge &&
            isAfterStartDate &&
            isBeforeEndDate
        );
    });

    const labels = ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E', 'Feature F'];

    // Prepare data for horizontal bar chart
    const chartDataBar = {
        labels: labels,
        datasets: [
            {
                label: 'Values',
                data: labels.map(feature =>
                    filteredData.reduce((sum, item) => sum + item[feature.charAt(0)], 0)
                ),
                backgroundColor: [
                    "rgb(75, 192, 192)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                    "rgb(153, 102, 255)",
                    "rgb(255, 159, 64)",
                    "rgb(201, 203, 207)",
                ],
            },
        ],
    };

    // Prepare data for line chart
    const lineLabels = Array.from(new Set(filteredData.map((item) => item.day)));
    const chartDataLine = {
        labels: lineLabels,
        datasets: [
            {
                label: "Feature A",
                data: lineLabels.map(day => filteredData.find(item => item.day === day)?.A || 0),
                borderColor: "rgb(75, 192, 192)",
                fill: false,
            },
            {
                label: "Feature B",
                data: lineLabels.map(day => filteredData.find(item => item.day === day)?.B || 0),
                borderColor: "rgb(54, 162, 235)",
                fill: false,
            },
            {
                label: "Feature C",
                data: lineLabels.map(day => filteredData.find(item => item.day === day)?.C || 0),
                borderColor: "rgb(255, 205, 86)",
                fill: false,
            },
            {
                label: "Feature D",
                data: lineLabels.map(day => filteredData.find(item => item.day === day)?.D || 0),
                borderColor: "rgb(153, 102, 255)",
                fill: false,
            },
            {
                label: "Feature E",
                data: lineLabels.map(day => filteredData.find(item => item.day === day)?.E || 0),
                borderColor: "rgb(255, 159, 64)",
                fill: false,
            },
            {
                label: "Feature F",
                data: lineLabels.map(day => filteredData.find(item => item.day === day)?.F || 0),
                borderColor: "rgb(201, 203, 207)",
                fill: false,
            },
        ],
    };

    const chartOptionsBar = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Features',
                },
            },
        },
    };

    const chartOptionsLine = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Days',
                },
            },
        },
    };

    return (
        <div>

            <div style={{ marginBottom: "20px", display: 'block', flexDirection: 'column' }} className='filter-container'>
                <div style={{ display: 'flex', alignItems: 'center' }} className='filter-container-2' >
                    <label>
                        Gender :&nbsp;
                        <select
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                    <label style={{ marginLeft: "20px" }}>
                        Age Group :&nbsp;
                        <select
                            value={selectedAge}
                            onChange={(e) => setSelectedAge(e.target.value)}
                        >
                            <option value="15-25">15-25</option>
                            <option value=">25">&gt;25</option>
                        </select>
                    </label>
                </div>
                <div style={{ marginTop: "20px", display: 'flex', alignItems: 'center' }}>
                    <label>Date Range:</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Start Date"
                            dateFormat="dd-MM-yyyy"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            placeholderText="End Date"
                            dateFormat="dd-MM-yyyy"

                        />
                    </div>

                </div>
                <button className='preferences' onClick={generateShareableLink}>
                    Generate Shareable Link
                </button>
                <button className='preferences' onClick={() => {
                    Cookies.remove('selectedGender');
                    Cookies.remove('selectedAge');
                    Cookies.remove('startDate');
                    Cookies.remove('endDate');
                    window.location.reload(); // Reload the page after clearing cookies
                }}>
                    Clear Preferences
                </button>
            </div>

            {/* Charts   */}
            <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', margin: '50px 0' }}>

                <div className="chart-container" style={{ height: '500px', width: '600px' }}>

                    {filteredData.length > 0 ? (
                        <Line data={chartDataLine} options={chartOptionsLine} />
                    ) : (
                        <p>No data available for selected filters.</p>
                    )}

                </div>

                <div className="chart-container" style={{ height: '500px', width: '600px', marginTop: '20px' }}>

                    {filteredData.length > 0 ? (
                        <Bar data={chartDataBar} options={chartOptionsBar} />
                    ) : (
                        <p>No data available for selected filters.</p>
                    )}

                </div>
            </div>
        </div>
    );
}

export default CombinedChart;
