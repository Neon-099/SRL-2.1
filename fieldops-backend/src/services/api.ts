const API_URL = 'https://localhost:5500'

export async function apiSyncQueue(queue: any[]){
    const res = await fetch(`${API_URL}.sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify( {queue})
    });

    if(!res.ok){
        throw new Error(`API error ${res.statusText}`);
    }
    return res.json();
}