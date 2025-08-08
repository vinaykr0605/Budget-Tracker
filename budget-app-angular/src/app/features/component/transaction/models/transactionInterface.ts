export interface TransactionInterface {
    id: number;
    type: string;
    category: string;
    amount: number;
    createdDate: Date;
    updatedDate: Date;
}
