export interface ToastEvent {
    title: string;
    message: string;
    varient: 'primary' | 'danger' | 'success';
    timeout: number;
}

export interface LoaderEvent {
    message?: string;
    show: boolean;
    timeout?: number;
}
