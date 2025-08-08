import { Component, OnInit, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TransactionService } from './services/transaction.service';
import { TransactionInterface } from './models/transactionInterface'; import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactions: Signal<TransactionInterface[]>;
  totalIncome: Signal<number>;
  totalExpenses: Signal<number>;
  netBalance: Signal<number>;
  errorMessage: string = '';

  constructor(private transactionService: TransactionService, private router: Router) {
    this.transactions = this.transactionService.transactions;

    this.totalIncome = computed(() =>
      this.transactions()
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0)
    );

    this.totalExpenses = computed(() =>
      this.transactions()
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0)
    );

    this.netBalance = computed(() => this.totalIncome() - this.totalExpenses());
  }

  ngOnInit(): void {
    this.transactionService.getAll().subscribe({
      next: () => {
        this.errorMessage = '';
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to load transactions', error);
        this.errorMessage = 'Could not load transactions. Please try again later.';
      }
    });
  }

  addTransaction(): void {
    this.router.navigate(['/add-transaction']);
  }

  editTransaction(id: number): void {
    this.router.navigate(['/edit-transaction', id]);
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.delete(id).subscribe({
        error: (err) => console.error('Failed to delete transaction', err)
      });
    }
  }
}
