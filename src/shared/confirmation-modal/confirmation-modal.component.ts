import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent {
  title = input.required<string>();
  message = input.required<string>();

  confirmAction = output<void>();
  closeModal = output<void>();

  onConfirm() {
    this.confirmAction.emit();
  }

  onClose() {
    this.closeModal.emit();
  }
}
