import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { QuizService } from '../shared/services/quiz.service';
import { Quiz, QuizStatus, UserInfo } from '../shared/models/quiz.model';

@Component({
  selector: 'app-quiz-list',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-16 relative">
          <div class="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-widest mb-4">
            Faith & Knowledge
          </div>
          <div class="absolute top-0 right-0">
            <button mat-stroked-button color="primary" routerLink="/" class="rounded-xl">
              <mat-icon>home</mat-icon> Home
            </button>
          </div>
          <h1 class="text-5xl font-black text-slate-900 mb-4 tracking-tight">CSI St. Andrew's Church Quiz Portal</h1>
          <p class="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Test your knowledge, explore the scriptures, and grow deeper in your faith journey.
          </p>

          @if (currentUser(); as user) {
            <div class="mt-8 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
              <div class="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {{ user.name[0] }}
              </div>
              <span class="text-slate-700 font-medium">Welcome back, <strong class="text-indigo-600">{{ user.name }}</strong>!</span>
              <button mat-stroked-button color="warn" class="rounded-xl ml-2 text-xs py-0 h-8 line-height-1"
                      (click)="changeUser()">
                Change User
              </button>
            </div>
          }
        </div>

        <!-- Quiz Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (quiz of quizzes(); track quiz.id) {
              <mat-card class="quiz-card group overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-white"
                        [class.opacity-75]="!quiz.active || quiz.is_freezed">
                <div class="h-3 w-full transition-transform duration-500 group-hover:scale-x-110"
                     [ngClass]="(!quiz.active || quiz.is_freezed) ? 'bg-slate-300' : 'bg-gradient-to-r from-indigo-500 to-purple-600'"></div>

                <mat-card-header class="p-8 pb-0">
                  <div class="flex justify-between items-start w-full mb-4">
                    <span class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      {{ quiz.type }}
                    </span>
                    @if (shouldShowLeaderboard(quiz) && leaderboards()[quiz.id]?.length) {
                      <button class="leaderboard-hint-btn flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
                              (click)="openLeaderboard(quiz.id); $event.stopPropagation()">
                        <mat-icon class="text-amber-500" style="font-size:16px;width:16px;height:16px">emoji_events</mat-icon>
                        Top 10
                      </button>
                    } @else {
                      <mat-icon class="text-slate-200 group-hover:text-indigo-400 transition-colors duration-500">auto_awesome</mat-icon>
                    }
                  </div>
                  <mat-card-title class="text-2xl font-black text-slate-800 leading-tight transition-colors"
                                  [class.group-hover:text-indigo-600]="quiz.active && !quiz.is_freezed">
                    {{ quiz.title }}
                  </mat-card-title>
                </mat-card-header>

                <mat-card-content class="p-8 pt-4 flex-grow">
                  <p class="text-slate-500 mb-8 line-clamp-2 leading-relaxed italic">
                    {{ quiz.description || 'Embark on a spiritual journey through this comprehensive quiz.' }}
                  </p>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-all duration-500 overflow-hidden">
                      <span class="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 truncate">Total Points</span>
                      <span class="text-xl font-black text-slate-700 truncate" [title]="getTotalPoints(quiz) + ' Points'">{{ getTotalPoints(quiz) }}</span>
                    </div>
                    <div class="flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-500 overflow-hidden"
                         [ngClass]="(!quiz.active || quiz.is_freezed) ? 'bg-slate-100/50' : 'group-hover:bg-purple-50/50 group-hover:border-purple-100'">
                      <span class="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 truncate">Status</span>
                      @if (quiz.active && !quiz.is_freezed) {
                        <span class="text-sm font-bold text-green-600 flex items-center gap-1 truncate">
                          <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"></span>
                          Active
                        </span>
                      } @else {
                        <span class="text-sm font-bold text-slate-500 flex items-center gap-1 truncate">
                          <span class="h-2 w-2 rounded-full bg-slate-400 flex-shrink-0"></span>
                          Freeze
                        </span>
                      }
                    </div>
                  </div>

                  @if (quiz.end_date) {
                    <div class="mt-4 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                      <mat-icon class="scale-75">event_busy</mat-icon>
                      Ends on: {{ quiz.end_date | date:'mediumDate' }}
                    </div>
                  }
                </mat-card-content>

                <mat-card-actions class="p-8 pt-0">
                  <button mat-flat-button color="primary"
                          [disabled]="(!quiz.active || quiz.is_freezed) && submissionStatuses()[quiz.id] !== 'submitted'"
                          class="w-full py-7 rounded-2xl text-lg font-black transition-all duration-300 transform group-hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
                          [ngClass]="(!quiz.active || quiz.is_freezed) ? 'shadow-slate-100' : 'shadow-indigo-100 hover:shadow-indigo-200'"
                          [routerLink]="['/quiz', quiz.id]">
                    @if ((!quiz.active || quiz.is_freezed) && submissionStatuses()[quiz.id] !== 'submitted') {
                      <span class="inline-flex items-center justify-center gap-2">Currently Frozen</span>
                    } @else if (submissionStatuses()[quiz.id] === 'submitted') {
                      <span class="inline-flex items-center justify-center gap-2">View Results <mat-icon>fact_check</mat-icon></span>
                    } @else if (submissionStatuses()[quiz.id] === 'saved') {
                      <span class="inline-flex items-center justify-center gap-2">Resume Quiz <mat-icon>play_circle</mat-icon></span>
                    } @else {
                      <span class="inline-flex items-center justify-center gap-2">Start Journey <mat-icon>east</mat-icon></span>
                    }
                  </button>
                </mat-card-actions>
              </mat-card>
          } @empty {
            <div class="col-span-full py-24 text-center bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 border-dashed">
              <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <mat-icon style="height:48px;width:48px;font-size:48px">upcoming</mat-icon>
              </div>
              <h2 class="text-2xl font-black text-slate-400 tracking-tight">No Active Quizzes</h2>
              <p class="text-slate-400 mt-2">New spiritual challenges are arriving soon.</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Leaderboard Popup -->
    @if (activeLeaderboardQuizId(); as quizId) {
      <div class="leaderboard-backdrop" (click)="closeLeaderboard()">
        <div class="leaderboard-popup" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="lb-header">
            <div class="lb-trophy-ring">
              <mat-icon style="font-size:32px;width:32px;height:32px;color:#fff">emoji_events</mat-icon>
            </div>
            <div class="flex-1">
              <div class="text-white font-black text-lg leading-tight">{{ getQuizTitle(quizId) }}</div>
              <div class="text-indigo-200 text-xs mt-0.5">Hall of Fame · Top 10 Participants</div>
            </div>
            <button class="lb-close-btn" (click)="closeLeaderboard()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- List -->
          <ol class="lb-list">
            @for (name of leaderboards()[quizId]; track $index; let i = $index) {
              <li class="lb-item" [class.lb-gold]="i === 0" [class.lb-silver]="i === 1" [class.lb-bronze]="i === 2">
                <span class="lb-rank" [class.lb-rank-gold]="i === 0" [class.lb-rank-silver]="i === 1" [class.lb-rank-bronze]="i === 2" [class.lb-rank-default]="i > 2">
                  {{ i + 1 }}
                </span>
                <span class="lb-name">{{ name }}</span>
              </li>
            }
          </ol>

          <div class="lb-footer">
            <button mat-stroked-button (click)="closeLeaderboard()" class="w-full rounded-xl">Close</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
    .quiz-card {
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    ::ng-deep .mat-mdc-button > .mdc-button__label,
    ::ng-deep .mat-mdc-unelevated-button > .mdc-button__label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    /* Leaderboard popup */
    .leaderboard-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: fadeIn 0.2s ease;
    }
    .leaderboard-popup {
      background: #fff;
      border-radius: 24px;
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 32px 64px rgba(0,0,0,0.25);
      animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .lb-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 20px 20px 24px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
    }
    .lb-trophy-ring {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .lb-close-btn {
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .lb-close-btn:hover { background: rgba(255,255,255,0.25); }
    .lb-list {
      list-style: none;
      margin: 0;
      padding: 12px 16px;
      overflow-y: auto;
      flex: 1;
    }
    .lb-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 12px;
      border-radius: 14px;
      margin-bottom: 6px;
      background: #f8fafc;
      transition: transform 0.15s;
    }
    .lb-item:hover { transform: translateX(4px); }
    .lb-gold  { background: #fffbeb; }
    .lb-silver { background: #f8fafc; }
    .lb-bronze { background: #fff7ed; }
    .lb-rank {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      flex-shrink: 0;
    }
    .lb-rank-gold   { background: #fef3c7; }
    .lb-rank-silver { background: #e2e8f0; }
    .lb-rank-bronze { background: #ffedd5; }
    .lb-rank-default { background: #f1f5f9; color: #64748b; font-size: 13px; }
    .lb-name {
      font-weight: 700;
      color: #1e293b;
      font-size: 15px;
    }
    .lb-footer {
      padding: 12px 16px 20px;
      border-top: 1px solid #f1f5f9;
    }
    @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95) } to { opacity: 1; transform: translateY(0) scale(1) } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizListComponent implements OnInit {
  private quizService = inject(QuizService);
  quizzes = this.quizService.quizzes;
  currentUser = signal<UserInfo | null>(null);

  submissionStatuses = signal<Record<string, QuizStatus>>({});
  leaderboards = signal<Record<string, string[]>>({});
  activeLeaderboardQuizId = signal<string | null>(null);

  ngOnInit() {
    this.quizService.loadQuizzes().subscribe(quizzes => {
      this.checkSubmissions(quizzes);
      this.loadLeaderboards(quizzes);
    });

    const cachedUser = localStorage.getItem('quiz_user_info');
    if (cachedUser) {
      try {
        this.currentUser.set(JSON.parse(cachedUser));
      } catch (e) {}
    }
  }

  changeUser() {
    localStorage.removeItem('quiz_user_info');
    this.currentUser.set(null);
    this.submissionStatuses.set({});
  }

  openLeaderboard(quizId: string) {
    this.activeLeaderboardQuizId.set(quizId);
  }

  closeLeaderboard() {
    this.activeLeaderboardQuizId.set(null);
  }

  getQuizTitle(quizId: string): string {
    return this.quizzes().find(q => q.id === quizId)?.title ?? '';
  }

  shouldShowLeaderboard(quiz: Quiz): boolean {
    if (quiz.is_freezed) return true;
    if (quiz.end_date) return new Date(quiz.end_date) < new Date();
    return false;
  }

  getTotalPoints(quiz: Quiz): number {
    if (!quiz || !quiz.sections) return 0;
    return quiz.sections.reduce((acc, section) => {
      return acc + (section.questions?.reduce((qAcc, q) => qAcc + q.points, 0) || 0);
    }, 0);
  }

  private loadLeaderboards(quizzes: Quiz[]) {
    quizzes.forEach(quiz => {
      if (!quiz.id) return;
      this.quizService.getQuizSubmissions(quiz.id).subscribe(res => {
        if (!res.success || !res.data) return;
        const names = res.data
          .filter((s: any) => s.status === 'submitted')
          .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
          .slice(0, 10)
          .map((s: any) => s.user_name || 'Anonymous');
        this.leaderboards.update(lb => ({ ...lb, [quiz.id]: names }));
      });
    });
  }

  private checkSubmissions(quizzes: Quiz[]) {
    const user = this.currentUser();
    const userId = user?.subscriptionId || user?.mobile;
    if (!userId || !quizzes || quizzes.length === 0) return;

    quizzes.forEach(quiz => {
      if (!quiz.id) return;
      this.quizService.getSavedAnswers(quiz.id, userId).subscribe(res => {
        if (res.success && res.data?.status) {
          this.submissionStatuses.update(statuses => ({
            ...statuses,
            [quiz.id]: res.data!.status as QuizStatus
          }));
        }
      });
    });
  }
}
