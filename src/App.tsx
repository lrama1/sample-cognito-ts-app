import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';


function App() {
  console.log('App.tsx');
    const [token, setToken] = useState<string | null>(null);
    const [data, setData] = useState({ message: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    async function fetchData() {
        /* 
        the endpoint url is found in the API Gateway-><your api name>->stages (pick a stage).
        It is labeled as "Invoke URL".
        */
        const apiUrl = 'https://0sli81p085.execute-api.us-east-1.amazonaws.com/staging';

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'An error occurred');
            } else {
                setError('An error occurred');
            }
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div>
            <h1>Data from APIx</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <div>
                {data.message}
            </div>
            <Login setToken={(token: string | null) => setToken(token)} />
        </div>
    );
}

export default App;
