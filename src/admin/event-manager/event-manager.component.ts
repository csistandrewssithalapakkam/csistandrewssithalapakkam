import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { EventsService, ChurchEvent } from '../../events/events.service';

@Component({
  selector: 'app-event-manager',
  imports: [ReactiveFormsModule, DatePipe, NgOptimizedImage],
  templateUrl: './event-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManagerComponent {
  private fb = inject(FormBuilder);
  eventsService = inject(EventsService);

  isModalVisible = signal(false);
  editingEvent = signal<ChurchEvent | null>(null);
  
  private today = new Date();

  eventForm = this.fb.group({
    title: ['', Validators.required],
    date: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', [Validators.pattern('https?://.+')]],
  });
  
  upcomingEvents = computed(() => {
    this.today.setHours(0, 0, 0, 0);
    return this.eventsService.events()
      .filter(event => new Date(event.date) >= this.today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  pastEvents = computed(() => {
    this.today.setHours(0, 0, 0, 0);
    return this.eventsService.events()
      .filter(event => new Date(event.date) < this.today)
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
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventsService.deleteEvent(id);
    }
  }
}
