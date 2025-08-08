import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { TransactionInterface } from '../models/transactionInterface';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private apiUrl = `${environment.apiUrl}/Transaction`;

    transactions = signal<TransactionInterface[]>([]);

    constructor(private http: HttpClient) { }

    getAll(): Observable<TransactionInterface[]> {
        return this.http.get<TransactionInterface[]>(this.apiUrl).pipe(
            tap(data => this.transactions.set(data))
        );
    }

    getById(id: number): Observable<TransactionInterface> {
        return this.http.get<TransactionInterface>(`${this.apiUrl}/${id}`);
    }

    create(transaction: Omit<TransactionInterface, 'id' | 'createdDate' | 'updatedDate'>): Observable<TransactionInterface> {
        return this.http.post<TransactionInterface>(this.apiUrl, transaction).pipe(
            tap(newTransaction => {
                this.transactions.update(current => [...current, newTransaction]);
            })
        );
    }

    update(id: number, transaction: Partial<TransactionInterface>): Observable<TransactionInterface> {
        return this.http.put<TransactionInterface>(`${this.apiUrl}/${id}`, transaction).pipe(
            tap(updatedTransaction => {
                this.transactions.update(current =>
                    current.map(t => t.id === id ? updatedTransaction : t)
                );
            })
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this.transactions.update(current => current.filter(t => t.id !== id));
            })
        );
    }
}