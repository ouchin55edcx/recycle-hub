import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-0 right-0 p-4 z-50 w-full md:max-w-sm">
      <div *ngIf="toastService.toast$ | async as toast"
           [@slideIn]
           class="flex items-center w-full p-4 rounded-lg shadow-lg border-l-4 mb-4"
           [ngClass]="{
             'bg-red-50 border-red-500': toast.type === 'error',
             'bg-green-50 border-green-500': toast.type === 'success',
             'bg-blue-50 border-blue-500': toast.type === 'info'
           }">
        <!-- Icon -->
        <div class="flex-shrink-0 mr-3">
          <ng-container [ngSwitch]="toast.type">
            <!-- Success Icon -->
            <svg *ngSwitchCase="'success'" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <!-- Error Icon -->
            <svg *ngSwitchCase="'error'" class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <!-- Info Icon -->
            <svg *ngSwitchCase="'info'" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </ng-container>
        </div>

        <!-- Message -->
        <div class="flex-1 mr-2" [ngClass]="{
          'text-red-800': toast.type === 'error',
          'text-green-800': toast.type === 'success',
          'text-blue-800': toast.type === 'info'
        }">
          {{ toast.message }}
        </div>

        <!-- Close Button -->
        <button 
          (click)="toastService.hide()"
          class="flex-shrink-0 ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors"
          [ngClass]="{
            'text-red-600 hover:bg-red-100': toast.type === 'error',
            'text-green-600 hover:bg-green-100': toast.type === 'success',
            'text-blue-600 hover:bg-blue-100': toast.type === 'info'
          }">
          <span class="sr-only">Close</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
} 