import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  isEditMode = false;
  transactionId: number | null = null;

  availableCategories: string[] = [];
  incomeCategories: string[] = ['Salary', 'Freelance', 'Investment', 'Bonus'];
  expenseCategories: string[] = ['Groceries', 'Entertainment', 'Health', 'Food', 'Shopping', 'Utilities'];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      type: ['Expense', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      createdDate: [this.formatDate(new Date()), Validators.required],
    });
  }

  ngOnInit(): void {
    // Determine mode and ID from the route snapshot
    this.transactionId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.transactionId;

    if (this.isEditMode) {
      this.transactionService.getById(this.transactionId).subscribe((transaction) => {
        if (transaction) {
          this.transactionForm.patchValue({
            ...transaction,
            createdDate: this.formatDate(transaction.createdDate)
          });
          this.updateCategories(); // Update categories based on fetched type
        }
      });
    } else {
      this.updateCategories(); // Set initial categories for 'add' mode
    }

    // Listen for changes on the 'type' dropdown
    this.transactionForm.get('type')?.valueChanges.subscribe(() => {
      this.updateCategories(true); // Reset category when type changes
    });
  }

  updateCategories(resetCategory: boolean = false): void {
    const type = this.transactionForm.get('type')?.value;
    this.availableCategories = type === 'Income' ? this.incomeCategories : this.expenseCategories;
    if (resetCategory) {
      this.transactionForm.get('category')?.setValue('');
    }
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const formValue = this.transactionForm.value;
    const operation$ = this.isEditMode && this.transactionId
      ? this.transactionService.update(this.transactionId, formValue)
      : this.transactionService.create(formValue);

    operation$.subscribe(() => {
      this.router.navigate(['/transactions']);
    });
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }

  // Helper functions for date formatting
  formatDate(date: string | Date): string {
    const d = new Date(date);
    // Adjust for timezone offset to get the correct local date
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }

  getTodayDate(): string {
    return this.formatDate(new Date());
  }
}
