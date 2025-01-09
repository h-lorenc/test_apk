import axios from 'axios';

const API_URL = 'https://api.baselinker.com/connector.php';
const API_TOKEN = '1000723-1003910-29IHD6XCT3JDHY7Q2YKM9JFKZOBK662E9IL97UY1XXF26KFD1NV1B92TMQU0J6CG';

export class BaseLinkerService {
    async getNewOrders() {
        try {
            console.log('Wysyłanie zapytania do BaseLinker API...');
            const response = await axios.post(API_URL, {
                method: 'getOrders',
                parameters: {
                    date_from: Math.floor(Date.now() / 1000) - 86400, // ostatnie 24h
                    status_id: 1, // nowe zamówienia
                    get_unread_only: true
                }
            }, {
                headers: {
                    'X-BLToken': API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Odpowiedź z API:', response.data);

            if (response.data.status === 'SUCCESS') {
                return response.data.orders || [];
            }
            return [];
        } catch (error) {
            console.error('Błąd podczas pobierania zamówień:', error);
            return [];
        }
    }
}