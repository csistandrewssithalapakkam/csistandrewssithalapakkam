import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, firstValueFrom } from 'rxjs';
// Fix: Corrected the import path for RxJS operators to resolve the type error. This is consistent with other files in the project.
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

// Interface for the public-facing API response
export interface ApiMissionaryStory {
  id: number;
  title_english?: string;
  title_tamil?: string;
  short_story_english?: string;
  short_story_tamil?: string;
  detailed_story_english?: string;
  detailed_story_tamil?: string;
  image_url?: string;
  is_active?: number; // 0 or 1
}

export interface MissionaryStory {
  id: number;
  titleEnglish?: string;
  titleTamil?: string;
  shortStoryEnglish?: string; // max 1000 chars
  shortStoryTamil?: string; // max 1000 chars
  detailedStoryEnglish?: string;
  detailedStoryTamil?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface NewMissionaryStoryPayload {
  titleEnglish: string;
  titleTamil: string;
  shortStoryEnglish: string;
  shortStoryTamil: string;
  detailedStoryEnglish: string;
  detailedStoryTamil: string;
  imageBase64: string;
}

@Injectable({
  providedIn: 'root',
})
export class MissionaryService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/missionary-stories`;
  private readonly activeStoryApiUrl = `${this.apiUrl}/active`;

  // --- State for Admin Panel ---
  private adminStoriesState = signal<{ stories: MissionaryStory[]; loading: boolean; error: string | null; }>({
    stories: [],
    loading: false,
    error: null,
  });

  // Public computed signals for admin components
  stories = computed(() => this.adminStoriesState().stories);
  adminLoading = computed(() => this.adminStoriesState().loading);
  adminError = computed(() => this.adminStoriesState().error);

  // --- State for Public-Facing Active Story ---
  private activeStoryState = signal<{ story: MissionaryStory | null; loading: boolean; error: string | null; }>({
    story: null,
    loading: true,
    error: null,
  });

  activeStory = computed(() => this.activeStoryState().story);
  loading = computed(() => this.activeStoryState().loading);
  error = computed(() => this.activeStoryState().error);

  constructor() {
    this.loadActiveStory(); // For public page
    this.loadAllStories(); // For admin page
  }

  loadAllStories() {
    this.adminStoriesState.set({ stories: [], loading: true, error: null });

    this.http.get<ApiMissionaryStory[]>(this.apiUrl).pipe(
      // Fix: Explicitly type the response to resolve 'unknown' type error.
      map((response: ApiMissionaryStory[]) => response.map(apiStory => this.mapToMissionaryStory(apiStory))),
      catchError(error => {
        console.error('Failed to fetch all missionary stories', error);
        this.adminStoriesState.update(s => ({ ...s, error: 'Could not load missionary stories.' }));
        return of([]);
      })
    ).subscribe(stories => {
      this.adminStoriesState.set({ stories, loading: false, error: this.adminStoriesState().error });
    });
  }

  loadActiveStory() {
    this.activeStoryState.set({ story: null, loading: true, error: null });

    // Fix: Specify a more accurate type for the HTTP GET request to handle potential response shapes.
    this.http.get<ApiMissionaryStory[] | ApiMissionaryStory>(this.activeStoryApiUrl).pipe(
      // Fix: Explicitly type the response to resolve 'unknown' type error inside the map operator.
      map((response: ApiMissionaryStory[] | ApiMissionaryStory) => {
        let storyData: ApiMissionaryStory | null = null;
        if (Array.isArray(response) && response.length > 0) {
          storyData = response[0];
        } else if (response && typeof response === 'object' && !Array.isArray(response)) {
          storyData = response;
        }
        return storyData ? this.mapToMissionaryStory(storyData) : null;
      }),
      catchError(error => {
        console.error('Failed to fetch active missionary story', error);
        this.activeStoryState.update(s => ({ ...s, error: 'Could not load the missionary story.' }));
        return of(null);
      })
    ).subscribe(story => {
      this.activeStoryState.set({ story, loading: false, error: this.activeStoryState().error });
    });
  }

  createStory(storyData: NewMissionaryStoryPayload): Promise<any> {
    return firstValueFrom(this.http.post(this.apiUrl, storyData));
  }

  updateStory(id: number, payload: Partial<NewMissionaryStoryPayload>): Promise<any> {
    const url = `${this.apiUrl}/${id}`;
    return firstValueFrom(this.http.put(url, payload));
  }

  activateStory(id: number): Promise<any> {
    const url = `${this.apiUrl}/${id}/active`;
    // Fix: Explicitly set the response type to 'any' to prevent incorrect type inference on the request body.
    return firstValueFrom(this.http.put<any>(url, {}));
  }

  private mapToMissionaryStory(apiStory: ApiMissionaryStory): MissionaryStory {
    return {
      id: apiStory.id,
      titleEnglish: apiStory.title_english,
      titleTamil: apiStory.title_tamil,
      shortStoryEnglish: apiStory.short_story_english,
      shortStoryTamil: apiStory.short_story_tamil,
      detailedStoryEnglish: apiStory.detailed_story_english,
      detailedStoryTamil: apiStory.detailed_story_tamil,
      imageUrl: apiStory.image_url,
      isActive: !!apiStory.is_active,
    };
  }
}
