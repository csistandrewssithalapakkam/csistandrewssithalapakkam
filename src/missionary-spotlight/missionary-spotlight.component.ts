import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-missionary-spotlight',
  imports: [NgOptimizedImage],
  templateUrl: './missionary-spotlight.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionarySpotlightComponent {}
