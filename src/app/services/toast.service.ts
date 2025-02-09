import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'error' | 'success' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();
  private timeout: any;

  private show(toast: Toast) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.toastSubject.next(toast);
    this.timeout = setTimeout(() => {
      this.hide();
    }, toast.duration || 3000);
  }

  showError(message: string, duration = 3000) {
    this.show({ message, type: 'error', duration });
  }

  showSuccess(message: string, duration = 3000) {
    this.show({ message, type: 'success', duration });
  }

  showInfo(message: string, duration = 3000) {
    this.show({ message, type: 'info', duration });
  }

  hide() {
    this.toastSubject.next(null);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
} 