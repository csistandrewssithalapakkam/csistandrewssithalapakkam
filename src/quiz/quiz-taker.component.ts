import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuizService } from '../shared/services/quiz.service';
import { Quiz, QuizQuestion, QuestionType, UserInfo, QuizStatus, QuizSubmissionResult } from '../shared/models/quiz.model';
import { TokenService } from '../shared/services/token.service';
import { LaunchPopupService } from '../shared/launch-popup/launch-popup.service';

@Component({
  selector: 'app-quiz-taker',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './quiz-taker.html',
  styleUrl: './quiz-taker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizTakerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizService = inject(QuizService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private tokenService = inject(TokenService);
  private launchPopupService = inject(LaunchPopupService);

  quiz = signal<Quiz | null>(null);
  currentQuestionIndex = signal(0);
  userAnswers = signal<{ [key: string]: any }>({});
  isFinished = signal(false);
  score = signal(0);

  // User Registration State
  currentUser = signal<UserInfo | null>(null);
  quizStarted = signal(false);
  isLoadingHistory = signal(false);

  // Leave confirmation popup
  showLeavePopup = signal(false);

  // Save / Submit state
  quizStatus = signal<QuizStatus>('none');
  isSaving = signal(false);
  isSubmitting = signal(false);
  submitResult = signal<QuizSubmissionResult | null>(null);
  showResultPopup = signal(false);
  feedbackText = signal('');

  // Leaderboard (names only, sorted by score desc)
  topNames = signal<string[]>([]);

  userForm = this.fb.group({
    name: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
    subscriptionId: [''],
    address1: [''],
    address2: [''],
    city: [''],
    pincode: ['']
  });

  /** Flat list of every question across all sections — keeps the taker UI simple. */
  allQuestions = computed(() => {
    const q = this.quiz();
    if (!q) return [];
    return (q.sections || []).flatMap(s => s.questions || []);
  });

  currentQuestion = computed(() => {
    return this.allQuestions()[this.currentQuestionIndex()] ?? null;
  });

  progress = computed(() => {
    const total = this.allQuestions().length;
    if (!total) return 0;
    return ((this.currentQuestionIndex() + 1) / total) * 100;
  });

  /** User ID used for API calls (subscriptionId preferred, fallback to mobile) */
  private getUserId(): string {
    const user = this.currentUser();
    return user?.subscriptionId || user?.mobile || '';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const cached = this.quizService.quizzes().find(q => q.id === id);
      if (cached?.type) {
        this.quizService.getQuizForUser(cached.type, id).subscribe(quiz => {
          this.quiz.set(quiz);
          this.loadSavedAnswers();
          this.loadLeaderboard(id);
        });
      } else {
        this.quizService.loadQuizzes().subscribe(quizzes => {
          const found = quizzes.find(q => q.id === id);
          if (found?.type) {
            this.quizService.getQuizForUser(found.type, id).subscribe(quiz => {
              this.quiz.set(quiz);
              this.loadSavedAnswers();
              this.loadLeaderboard(id);
            });
          } else {
            this.quizService.getQuiz(id).subscribe(quiz => {
              this.quiz.set(quiz);
              this.loadSavedAnswers();
              this.loadLeaderboard(id);
            });
          }
        });
      }
    }

    // Show launch popup if applicable
    this.launchPopupService.showIfNeeded();

    // Load user from cache
    const cachedUser = localStorage.getItem('quiz_user_info');
    if (cachedUser) {
      try {
        this.currentUser.set(JSON.parse(cachedUser));
      } catch (e) {
        localStorage.removeItem('quiz_user_info');
      }
    }
  }

  private loadLeaderboard(quizId: string) {
    this.quizService.getQuizSubmissions(quizId).subscribe(res => {
      if (!res.success || !res.data) return;
      const names = res.data
        .filter((s: any) => s.status === 'submitted')
        .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
        .slice(0, 10)
        .map((s: any) => s.user_name || 'Anonymous');
      this.topNames.set(names);
    });
  }

  /** Load saved or submitted answers from API after quiz and user are both known. */
  private loadSavedAnswers() {
    const quiz = this.quiz();
    const user = this.currentUser();
    if (!quiz || !user) return;
    const userId = this.getUserId();
    if (!userId) return;

    this.isLoadingHistory.set(true);
    this.quizService.getSavedAnswers(quiz.id, userId).subscribe(res => {
      this.isLoadingHistory.set(false);
      if (!res.success || !res.data) return;
      const data = res.data;

      if (data.status === 'submitted') {
        // Show read-only result view directly
        this.quizStatus.set('submitted');
        this.submitResult.set(data);
        this.score.set(data.score ?? 0);

        // Auto-fill userAnswers from API result for review
        const answers: { [key: string]: any } = {};
        (data.answers || []).forEach(a => {
          answers[a.question_id] = a.user_answer ?? (a as any).answer;
        });
        this.userAnswers.set(answers);
        this.isFinished.set(true);
        this.quizStarted.set(true);

      } else if (data.status === 'saved') {
        // Auto-fill in-progress answers
        this.quizStatus.set('saved');
        const answers: { [key: string]: any } = {};
        (data.answers || []).forEach((a: any) => {
          answers[a.question_id] = a.answer;
        });
        this.userAnswers.set(answers);
      }
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      const userInfo = this.userForm.value as UserInfo;
      localStorage.setItem('quiz_user_info', JSON.stringify(userInfo));
      this.currentUser.set(userInfo);

      // Register user via API
      this.quizService.registerUser(userInfo).subscribe(res => {
        if (res.success && res.data) {
          // The backend might return access_token directly on res, or res.data.access_token
          const token = res.data.access_token || (res as any).access_token || res.data.token || (res as any).token;
          const refresh = res.data.refresh_token || (res as any).refresh_token || '';
          if (token) {
            this.tokenService.setQuizTakerTokens(token, refresh);
          }
          this.snackBar.open('✅ Registration successful!', 'Close', { duration: 3000, panelClass: ['snack-success'] });
        } else {
          this.snackBar.open(`⚠️ ${res.message || 'Registration failed.'}`, 'Close', { duration: 4000 });
        }
      });

      // Load any saved answers for this user
      this.loadSavedAnswers();
    }
  }

  /** Back button handler — warn about unsaved changes */
  goBack() {
    // If quiz is already submitted or user hasn't started, go directly
    if (this.quizStatus() === 'submitted' || !this.quizStarted() || Object.keys(this.userAnswers()).length === 0) {
      this.router.navigate(['/quiz']);
      return;
    }
    this.showLeavePopup.set(true);
  }

  /** Save progress then navigate away */
  saveAndLeave() {
    this.showLeavePopup.set(false);
    const quiz = this.quiz();
    if (!quiz || !this.currentUser()) {
      this.router.navigate(['/quiz']);
      return;
    }
    this.isSaving.set(true);
    const payload = this.buildPayload('saved');
    this.quizService.saveQuizAnswers(payload).subscribe(res => {
      this.isSaving.set(false);
      if (res.success) {
        this.snackBar.open('✅ Progress saved!', 'Close', { duration: 2000, panelClass: ['snack-success'] });
      }
      this.router.navigate(['/quiz']);
    });
  }

  /** Leave without saving */
  leaveWithoutSaving() {
    this.showLeavePopup.set(false);
    this.router.navigate(['/quiz']);
  }

  changeUser() {
    localStorage.removeItem('quiz_user_info');
    this.currentUser.set(null);
    this.userForm.reset();
    this.quizStatus.set('none');
    this.userAnswers.set({});
    this.isFinished.set(false);
  }

  startQuiz() {
    this.quizStarted.set(true);
    this.currentQuestionIndex.set(0);
    if (this.quizStatus() !== 'saved') {
      this.isFinished.set(false);
      this.userAnswers.set({});
    }
  }

  /** Build the submission payload from current state */
  private buildPayload(status: 'saved' | 'submitted', feedback?: string) {
    const quiz = this.quiz()!;
    const answers = this.userAnswers();
    return {
      quiz_id: quiz.id,
      user_id: this.getUserId(),
      status,
      answers: this.allQuestions().map(q => ({
        question_id: q.id!,
        answer: answers[q.id!] ?? null
      })),
      ...(feedback ? { feedback } : {})
    };
  }

  /** Save in-progress answers */
  saveAnswers() {
    const quiz = this.quiz();
    if (!quiz || !this.currentUser()) {
      this.snackBar.open('Please register before saving.', 'Close', { duration: 3000 });
      return;
    }
    this.isSaving.set(true);
    const payload = this.buildPayload('saved');

    this.quizService.saveQuizAnswers(payload).subscribe(res => {
      this.isSaving.set(false);
      if (res.success) {
        this.quizStatus.set('saved');
        this.snackBar.open('✅ Progress saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snack-success']
        });
      } else {
        this.snackBar.open(`❌ ${res.message || 'Could not save progress. Try again.'}`, 'Close', {
          duration: 4000,
          panelClass: ['snack-error']
        });
      }
    });
  }

  /** Helper to check if a specific question has been answered */
  isAnswered(questionId: string): boolean {
    const ans = this.userAnswers()[questionId];
    if (ans === undefined || ans === null || ans === '') return false;
    if (Array.isArray(ans) && ans.length === 0) return false;
    if (typeof ans === 'object' && Object.keys(ans).length === 0) return false;
    return true;
  }

  /** Show the confirmation popup for missed questions */
  showMissedQuestionsPopup = signal(false);
  missedQuestionNumbers = signal<number[]>([]);

  /** Submit the quiz and show result popup */
  submitQuiz() {
    const quiz = this.quiz();
    if (!quiz || !this.currentUser()) return;

    // Check for missed questions
    const unansweredIndices = this.allQuestions()
      .map((q, index) => ({ id: q.id!, index }))
      .filter(q => !this.isAnswered(q.id))
      .map(q => q.index + 1);

    if (unansweredIndices.length > 0) {
      this.missedQuestionNumbers.set(unansweredIndices);
      this.showMissedQuestionsPopup.set(true);
      return;
    }
    this.proceedWithSubmit();
  }

  /** User confirmed submission despite missed questions */
  confirmSubmitAnyway() {
    this.showMissedQuestionsPopup.set(false);
    this.proceedWithSubmit();
  }

  /** Cancel submission */
  cancelSubmit() {
    this.showMissedQuestionsPopup.set(false);
  }

  private proceedWithSubmit() {

    this.isSubmitting.set(true);
    const payload = this.buildPayload('submitted', this.feedbackText());

    this.quizService.submitQuiz(payload).subscribe(res => {
      this.isSubmitting.set(false);
      if (res.success && res.data) {
        this.quizStatus.set('submitted');
        this.submitResult.set(res.data);
        this.score.set(res.data.score ?? 0);
        this.showResultPopup.set(true);
        this.isFinished.set(true);
      } else {
        this.snackBar.open(`❌ ${res.message || 'Submission failed. Try again.'}`, 'Close', {
          duration: 4000,
          panelClass: ['snack-error']
        });
      }
    });
  }

  onAnswerChange(answer: any) {
    const q = this.currentQuestion();
    if (q) {
      this.userAnswers.update(answers => ({
        ...answers,
        [q.id!]: answer
      }));
    }
  }

  onMultiSelectChange(option: string, checked: boolean) {
    const q = this.currentQuestion();
    if (q) {
      const current: string[] = this.userAnswers()[q.id!] || [];
      const next = checked ? [...current, option] : current.filter((o: string) => o !== option);
      this.onAnswerChange(next);
    }
  }

  getMatchAnswer(questionId: string, matchIndex: number): string {
    const answers = this.userAnswers()[questionId];
    if (!answers || !Array.isArray(answers)) return '';
    return answers[matchIndex] || '';
  }

  onMatchChange(questionId: string, matchIndex: number, value: string, totalPairs: number) {
    const current: string[] = this.userAnswers()[questionId] || new Array(totalPairs).fill('');
    const updated = [...current];
    updated[matchIndex] = value;
    this.userAnswers.update(answers => ({ ...answers, [questionId]: updated }));
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.allQuestions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    } else {
      this.finishQuiz();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  /** Local scoring (for offline/fallback only — API score takes precedence) */
  finishQuiz() {
    if (!this.quiz()) return;
    let totalScore = 0;
    this.allQuestions().forEach(question => {
      const userAnswer = this.userAnswers()[question.id!];
      if (this.checkAnswer(question, userAnswer)) totalScore += question.points;
    });
    this.score.set(totalScore);
    this.isFinished.set(true);
  }

  checkAnswer(question: QuizQuestion, userAnswer: any): boolean {
    if (!userAnswer) return false;
    switch (question.type) {
      case QuestionType.SingleSelect:
      case QuestionType.TrueFalse:
      case QuestionType.FillInTheBlanks:
      case QuestionType.ImageQuestion:
        return userAnswer.toString().toLowerCase().trim() === question.answer.toString().toLowerCase().trim();
      case QuestionType.MultiSelect: {
        const ua = Array.isArray(userAnswer) ? userAnswer : userAnswer.split(',').map((s: string) => s.trim());
        const ca = question.answer.split(',').map((s: string) => s.trim().toLowerCase());
        return ua.length === ca.length && ua.every((v: string) => ca.includes(v.toLowerCase()));
      }
      case QuestionType.Matches:
        if (!Array.isArray(userAnswer) || !question.matches) return false;
        return question.matches.every((pair, i) =>
          (userAnswer[i] || '').trim().toLowerCase() === pair.right.trim().toLowerCase()
        );
      default:
        return false;
    }
  }

  /** Get submission answer result for read-only review */
  getAnswerResult(questionId: string) {
    const result = this.submitResult();
    if (!result?.answers) return null;
    return result.answers.find(a => String(a.question_id) === String(questionId)) ?? null;
  }

  getTotalPoints() {
    return this.allQuestions().reduce((acc, q) => acc + q.points, 0);
  }

  isLastQuestion() {
    return this.currentQuestionIndex() === this.allQuestions().length - 1;
  }
}
