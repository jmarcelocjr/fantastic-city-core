import { Observable } from "rxjs";

export interface User {
    id: number;
}

export interface Wallet {
    user_id: number;
    token: string;
    balance: number;
}

interface Transfer {
    from: Wallet;
    to: Wallet;
    value: number;
    description: string;
}

interface Transaction {
    from: Wallet;
    to: Wallet;
    value: number;
    description: string;
}

interface WalletList {
    wallets: Wallet[];
}

interface Response {
    success: boolean;
    message: string;
}

export interface ImmuWalletService {
    registerWallet(wallet: Wallet): Observable<Response>;
    getWallets(user: User): Observable<WalletList>;
    getWallet(wallet: Wallet): Observable<Wallet>;
    transfer(transfer: Transfer): Observable<Response>;
    getTransactions(wallet: Wallet): Transaction;
}