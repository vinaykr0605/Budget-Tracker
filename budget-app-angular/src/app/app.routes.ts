import { Routes } from '@angular/router';
import { authGuard } from './core/authguards/auth.guard';
import { publicGuard } from './core/authguards/public.guard';

export const routes: Routes = [
    {
        path: 'login',
        // Update the import path to use the '.component' suffix
        loadComponent: () => import('./features/component/signup-login/signup-login.component').then(m => m.SignupLoginComponent),
        canActivate: [publicGuard],
        data: { isLoginMode: true }
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/component/signup-login/signup-login.component').then(m => m.SignupLoginComponent),
        canActivate: [publicGuard],
        data: { isLoginMode: false }
    },
    {
        path: 'transactions',
        loadComponent: () => import('./features/component/transaction/transaction.component').then(m => m.TransactionComponent),
        canActivate: [authGuard]
    },
    {
        path: 'add-transaction',
        loadComponent: () => import('./features/component/transaction/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
        canActivate: [authGuard]
    },
    {
        path: 'edit-transaction/:id',
        loadComponent: () => import('./features/component/transaction/transaction-form/transaction-form.component').then(m => m.TransactionFormComponent),
        canActivate: [authGuard]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
