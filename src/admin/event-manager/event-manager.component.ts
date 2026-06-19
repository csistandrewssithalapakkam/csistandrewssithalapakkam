import { PermissionService } from '../permission.service';
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventsService, ChurchEvent } from '../../events/events.service';
import { ImagePreviewComponent } from '../../image-preview/image-preview.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-event-manager',
  imports: [ReactiveFormsModule, DatePipe, ImagePreviewComponent, ConfirmationModalComponent],
  templateUrl: './event-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManagerComponent {
  protected permissionService = inject(PermissionService);
  private fb: FormBuilder = inject(FormBuilder);
  eventsService = inject(EventsService);

  isModalVisible = signal(false);
  editingEvent = signal<ChurchEvent | null>(null);
  selectedImageForPreview = signal<{ images: string[]; index: number } | null>(null);
  
  // New signals for confirmation
  isConfirmModalVisible = signal(false);
  confirmAction = signal<{ eventId: number } | null>(null);

  eventForm = this.fb.group({
    title: ['', Validators.required],
    date: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', [Validators.pattern('https?://.+')]],
  });
  
  upcomingEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.eventsService.events()
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  pastEvents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.eventsService.events()
      .filter(event => new Date(event.date) < today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  openModal(event: ChurchEvent | null = null) {
    this.editingEvent.set(event);
    if (event) {
      // Format date for input[type=date]
      const dateString = new Date(event.date).toISOString().substring(0, 10);
      this.eventForm.patchValue({
        ...event,
        date: dateString,
      });
    } else {
      this.eventForm.reset();
    }
    this.isModalVisible.set(true);
  }

  closeModal() {
    this.isModalVisible.set(false);
    this.editingEvent.set(null);
    this.eventForm.reset();
  }

  saveEvent() {
    if (this.eventForm.invalid) {
      return;
    }
    const formValue = this.eventForm.getRawValue();
    const eventData = {
      title: formValue.title!,
      // Adjust for timezone offset before creating Date object
      date: new Date(new Date(formValue.date!).valueOf() + new Date().getTimezoneOffset() * 60 * 1000),
      description: formValue.description!,
      image: formValue.image || undefined,
    };

    if (this.editingEvent()) {
      this.eventsService.updateEvent({ ...eventData, id: this.editingEvent()!.id });
    } else {
      this.eventsService.addEvent(eventData);
    }
    this.closeModal();
  }
  
  deleteEvent(id: number) {
    this.confirmAction.set({ eventId: id });
    this.isConfirmModalVisible.set(true);
  }

  handleConfirmAction() {
    const action = this.confirmAction();
    if (action) {
      this.eventsService.deleteEvent(action.eventId);
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.isConfirmModalVisible.set(false);
    this.confirmAction.set(null);
  }

  openImagePreview(clickedEvent: ChurchEvent, eventList: ChurchEvent[]) {
    if (!clickedEvent.image) return;
    
    const imagesWithUrls = eventList.filter(e => e.image);
    const images = imagesWithUrls.map(e => e.image!);
    const index = imagesWithUrls.findIndex(e => e.id === clickedEvent.id);

    if (index > -1) {
      this.selectedImageForPreview.set({ images, index });
    }
  }

  closeImagePreview() {
    this.selectedImageForPreview.set(null);
  }
}
