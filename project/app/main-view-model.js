import { Observable } from '@nativescript/core';
import { BaseLinkerService } from './services/baselinker-service';
import { LocalNotifications } from '@nativescript/local-notifications';

export function createViewModel() {
    const viewModel = new Observable();
    const baseLinkerService = new BaseLinkerService();

    // Inicjalizacja właściwości
    viewModel.set('orders', []);
    viewModel.set('isLoading', false);

    viewModel.refreshOrders = async function() {
        try {
            this.set('isLoading', true);
            console.log('Pobieranie zamówień...');
            const newOrders = await baseLinkerService.getNewOrders();
            console.log('Pobrano zamówień:', newOrders.length);
            
            if (newOrders.length > 0) {
                this.set('orders', newOrders);
                
                // Powiadomienie o nowych zamówieniach
                LocalNotifications.schedule([{
                    id: Date.now(),
                    title: 'Nowe zamówienia!',
                    body: `Otrzymano ${newOrders.length} nowych zamówień`,
                    badge: newOrders.length
                }]).catch(error => console.error('Błąd powiadomień:', error));
            }
        } catch (error) {
            console.error('Błąd podczas odświeżania:', error);
        } finally {
            this.set('isLoading', false);
        }
    };

    // Pierwsze pobranie przy starcie
    viewModel.refreshOrders();

    // Sprawdzaj nowe zamówienia co 5 minut
    setInterval(() => {
        viewModel.refreshOrders();
    }, 5 * 60 * 1000);

    return viewModel;
}