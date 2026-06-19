import { Component, ChangeDetectionStrategy, inject, OnInit, signal, ChangeDetectorRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuizService } from '../../shared/services/quiz.service';
import { QuizType, QuestionType, Quiz, QuizStats, QuizLeaderboardEntry } from '../../shared/models/quiz.model';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-quiz-manager',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './quiz-manager.html',
  styleUrl: './quiz-manager.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizManagerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private quizService = inject(QuizService);
  private cdr = inject(ChangeDetectorRef);

  private generateId() {
    return Math.random().toString(36).substring(2, 11);
  }

  quizTypes = Object.values(QuizType);
  QuestionType = QuestionType;
  questionTypes = Object.values(QuestionType);

  quizzes = this.quizService.quizzes;
  viewMode = signal<'list' | 'edit' | 'dashboard'>('list');
  isEditing = computed(() => this.viewMode() === 'edit'); // Keep compatible or refactor
  isLoading = signal(false);
  currentQuizId = signal<string | null>(null);
  previewJson = signal<string | null>(null);

  // Dashboard signals
  selectedQuizForStats = signal<Quiz | null>(null);
  statsData = signal<QuizStats | null>(null);
  leaderboard = signal<QuizLeaderboardEntry[]>([]);

  getQuizTotalQuestions(quiz: Quiz): number {
    return (quiz.sections || []).reduce((acc, s) => acc + (s.questions?.length || 0), 0);
  }

  getQuizTotalPoints(quiz: Quiz): number {
    return (quiz.sections || []).reduce((acc, s) => {
      const sp = (s.questions || []).reduce((qacc, q) => qacc + (Number(q.points) || 0), 0);
      return acc + sp;
    }, 0);
  }

  quizForm: FormGroup = this.fb.group({
    id: [null],
    quiz_id: [null],
    title: ['', Validators.required],
    description: [''],
    type: [QuizType.General, Validators.required],
    active: [true],
    end_date: [''],
    sections: this.fb.array([])
  });

  // ── Sections ──────────────────────────────────────────────

  get sections() {
    return this.quizForm.get('sections') as FormArray;
  }

  addSection(id: string | null = null, section_id: string | number | null = null) {
    const sectionGroup = this.fb.group({
      id: [id],
      section_id: [section_id],
      title: ['', Validators.required],
      description: [''],
      questions: this.fb.array([])
    });
    this.sections.push(sectionGroup);
  }

  removeSection(sIndex: number) {
    this.sections.removeAt(sIndex);
  }

  getSectionQuestions(sIndex: number) {
    return this.sections.at(sIndex).get('questions') as FormArray;
  }

  /** Returns the sum of points for all questions in a section. */
  getSectionTotalPoints(sIndex: number): number {
    const qs = this.getSectionQuestions(sIndex);
    return qs.controls.reduce((sum, q) => sum + (Number(q.get('points')?.value) || 0), 0);
  }

  // ── Questions ─────────────────────────────────────────────

  /** Inserts a new question at the TOP (index 0) of the section. */
  addQuestion(sIndex: number, id: string | null = null, question_id: string | number | null = null) {
    const questionGroup = this.fb.group({
      id: [id],
      question_id: [question_id],
      uid: [this.generateId()], // For unique tracking and names
      text: ['', Validators.required],
      type: [QuestionType.SingleSelect, Validators.required],
      points: [1, [Validators.required, Validators.min(1)]],
      options: this.fb.array([]),
      matches: this.fb.array([]),
      answer: ['', Validators.required],
      imageUrl: [''],
      imageAnswerType: ['radio']
    });
    const questions = this.getSectionQuestions(sIndex);
    if (id || question_id) {
      questions.push(questionGroup);
    } else {
      questions.insert(0, questionGroup);
    }

    // Initialize options for the default SingleSelect type if it's a new question
    if (!id && !question_id) {
      this.addOption(sIndex, 0); // Always 0 since it was inserted at 0
      this.addOption(sIndex, 0);
    }
    this.cdr.markForCheck();
  }

  removeQuestion(sIndex: number, qIndex: number) {
    this.getSectionQuestions(sIndex).removeAt(qIndex);
  }

  // ── Options ───────────────────────────────────────────────

  getOptions(sIndex: number, qIndex: number) {
    return this.getSectionQuestions(sIndex).at(qIndex).get('options') as FormArray;
  }

  addOption(sIndex: number, qIndex: number, value: string = '') {
    const question = this.getSectionQuestions(sIndex).at(qIndex);
    const ctrl = this.fb.control(value, Validators.required);
    this.getOptions(sIndex, qIndex).push(ctrl);

    // Sync answer if this option is renamed
    let lastValue = value;
    ctrl.valueChanges.subscribe(newValue => {
      this.syncAnswerOnRename(question, lastValue, newValue);
      lastValue = newValue;
      this.cdr.markForCheck();
    });
  }

  removeOption(sIndex: number, qIndex: number, oIndex: number) {
    const options = this.getOptions(sIndex, qIndex);
    const removedValue = options.at(oIndex).value;
    const question = this.getSectionQuestions(sIndex).at(qIndex);

    options.removeAt(oIndex);

    // Cleanup answer if the removed option was selected
    this.syncAnswerOnDelete(question, removedValue);
  }

  private syncAnswerOnRename(question: AbstractControl, oldVal: string, newVal: string) {
    const type = question.get('type')?.value;
    const answerCtrl = question.get('answer');
    if (!answerCtrl) return;

    if (type === QuestionType.SingleSelect || type === QuestionType.TrueFalse) {
      if (answerCtrl.value === oldVal || (!oldVal && answerCtrl.value === "")) {
        answerCtrl.setValue(newVal);
      }
    } else if (type === QuestionType.MultiSelect) {
      const current = answerCtrl.value || '';
      const selected = current.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
      const updated = selected.map((s: string) => (s === (oldVal || '').trim() ? (newVal || '').trim() : s));
      answerCtrl.setValue(updated.join(', '));
    }
    this.cdr.markForCheck();
  }

  private syncAnswerOnDelete(question: AbstractControl, removedVal: string) {
    const type = question.get('type')?.value;
    const answerCtrl = question.get('answer');
    if (!answerCtrl || !removedVal) return;

    if (type === QuestionType.SingleSelect) {
      if (answerCtrl.value === removedVal) {
        answerCtrl.setValue('');
      }
    } else if (type === QuestionType.MultiSelect) {
      const current = answerCtrl.value || '';
      let selected = current.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
      selected = selected.filter((s: string) => s !== removedVal.trim());
      answerCtrl.setValue(selected.join(', '));
    }
    this.cdr.markForCheck();
  }

  // ── Matches ───────────────────────────────────────────────

  getMatches(sIndex: number, qIndex: number) {
    return this.getSectionQuestions(sIndex).at(qIndex).get('matches') as FormArray;
  }

  addMatch(sIndex: number, qIndex: number, left: string = '', right: string = '') {
    this.getMatches(sIndex, qIndex).push(this.fb.group({
      left: [left, Validators.required],
      right: [right, Validators.required]
    }));
  }

  removeMatch(sIndex: number, qIndex: number, mIndex: number) {
    this.getMatches(sIndex, qIndex).removeAt(mIndex);
  }

  // ── Question type change ───────────────────────────────────

  onQuestionTypeChange(sIndex: number, qIndex: number) {
    const question = this.getSectionQuestions(sIndex).at(qIndex);
    const type = question.get('type')?.value;
    const answerCtrl = question.get('answer');

    // Ensure arrays exist before clearing
    if (!question.get('options')) {
      (question as FormGroup).addControl('options', this.fb.array([]));
    }
    if (!question.get('matches')) {
      (question as FormGroup).addControl('matches', this.fb.array([]));
    }

    (question.get('options') as FormArray).clear();
    (question.get('matches') as FormArray).clear();

    if (type === QuestionType.SingleSelect || type === QuestionType.MultiSelect) {
      answerCtrl?.setValidators([Validators.required]);
      answerCtrl?.setValue('');
      this.addOption(sIndex, qIndex);
      this.addOption(sIndex, qIndex);
    } else if (type === QuestionType.Matches) {
      answerCtrl?.clearValidators();
      answerCtrl?.setValue('matches');
      this.addMatch(sIndex, qIndex);
    } else if (type === QuestionType.TrueFalse) {
      answerCtrl?.setValidators([Validators.required]);
      answerCtrl?.setValue('true');
    } else if (type === QuestionType.ImageQuestion) {
      question.get('imageAnswerType')?.setValue('radio');
      answerCtrl?.setValidators([Validators.required]);
      answerCtrl?.setValue('');
      this.addOption(sIndex, qIndex);
      this.addOption(sIndex, qIndex);
    } else {
      answerCtrl?.setValidators([Validators.required]);
      answerCtrl?.setValue('');
    }
    answerCtrl?.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  onImageAnswerTypeChange(sIndex: number, qIndex: number) {
    const question = this.getSectionQuestions(sIndex).at(qIndex);
    const answerType = question.get('imageAnswerType')?.value;
    const answerCtrl = question.get('answer');
    (question.get('options') as FormArray).clear();
    answerCtrl?.setValue('');
    if (answerType === 'radio') {
      this.addOption(sIndex, qIndex);
      this.addOption(sIndex, qIndex);
    }
    answerCtrl?.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  isOptionType(question: AbstractControl): boolean {
    const type = question.get('type')?.value;
    if (type === QuestionType.ImageQuestion) {
      return question.get('imageAnswerType')?.value === 'radio';
    }
    return type === QuestionType.SingleSelect || type === QuestionType.MultiSelect;
  }

  isMatchType(question: AbstractControl): boolean {
    return question.get('type')?.value === QuestionType.Matches;
  }

  isImageType(question: AbstractControl): boolean {
    return question.get('type')?.value === QuestionType.ImageQuestion;
  }

  onImageFileSelected(sIndex: number, qIndex: number, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const question = this.getSectionQuestions(sIndex).at(qIndex);
      question.get('imageUrl')?.setValue(reader.result as string);
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  // ── Multi-select Helpers ──────────────────────────────────

  isMultiSelectChecked(question: AbstractControl, optionValue: string): boolean {
    const current = question.get('answer')?.value || '';
    const selected = current.split(',').map((s: string) => s.trim());
    return selected.includes(optionValue.trim()) && optionValue.trim() !== '';
  }

  toggleMultiSelectAnswer(question: AbstractControl, optionValue: string, checked: boolean) {
    if (!optionValue.trim()) return;
    const ctrl = question.get('answer');
    const current = ctrl?.value || '';
    let selected = current.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');

    if (checked) {
      if (!selected.includes(optionValue.trim())) {
        selected.push(optionValue.trim());
      }
    } else {
      selected = selected.filter((s: string) => s !== optionValue.trim());
    }

    ctrl?.setValue(selected.join(', '));
    ctrl?.updateValueAndValidity();
    ctrl?.markAsTouched();
    this.cdr.markForCheck();
  }

  // ── Lifecycle ─────────────────────────────────────────────

  ngOnInit() {
    this.isLoading.set(true);
    this.quizService.loadQuizzes().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  // ── Dashboard ───────────────────────────────────────────

  showDashboard(quiz: Quiz) {
    this.viewMode.set('dashboard');
    this.selectedQuizForStats.set(quiz);
    this.loadDashboardData(quiz.id);
  }

  loadDashboardData(quizId: string) {
    this.isLoading.set(true);

    // Fetch Stats
    this.quizService.getQuizStats(quizId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.statsData.set(res.data);
        } else {
          this.statsData.set({ attended: 0, submitted: 0, saved: 0, averageScore: 0 });
        }
      },
      error: () => this.statsData.set({ attended: 0, submitted: 0, saved: 0, averageScore: 0 })
    });

    // Fetch Submissions and process for leaderboard
    this.quizService.getQuizSubmissions(quizId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const processed = this.processLeaderboard(res.data);
          this.leaderboard.set(processed);
        } else {
          this.leaderboard.set([]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.leaderboard.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private processLeaderboard(submissions: any[]): QuizLeaderboardEntry[] {
    return submissions
      .filter(s => s.status === 'submitted')
      .map(s => ({
        userName: s.user_name || 'Anonymous',
        mobile: s.user_id,
        score: s.score || 0,
        submittedAt: s.submitted_at || s.created_at || ''
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }

  getScoreDistribution(): { label: string, count: number }[] {
    const scores = this.leaderboard().map(e => e.score);
    const quiz = this.selectedQuizForStats();
    if (scores.length === 0 || !quiz) return [];

    // Calculate total possible points
    const totalPoints = quiz.sections.reduce((acc, section) =>
      acc + section.questions.reduce((qAcc, q) => qAcc + (q.points || 0), 0)
      , 0);

    if (totalPoints <= 0) return [];

    // Range size is 10% of total marks
    const rangeSize = Math.max(Math.ceil(totalPoints / 10), 1);
    const buckets: { label: string, min: number, max: number }[] = [];

    // 1. Perfect Score Bucket (Always separate)
    buckets.push({ label: `${totalPoints}`, min: totalPoints, max: 10000 });

    // 2. Dynamic Ranges (Up to 10 more buckets)
    for (let i = 0; i < 10; i++) {
      const max = totalPoints - (i * rangeSize) - 1;
      const min = Math.max(totalPoints - ((i + 1) * rangeSize), 0);

      if (max < 0) break;

      // Ensure we don't include the perfect score in these ranges
      if (max >= totalPoints) continue;

      const label = min === max ? `${max}` : `${min}-${max}`;
      buckets.push({ label, min, max });
    }

    return buckets.map(b => ({
      label: b.label,
      count: scores.filter(s => s >= b.min && s <= b.max).length
    }));
  }

  // ── Edit / Cancel ─────────────────────────────────────────

  editQuiz(quiz: Quiz) {
    this.viewMode.set('edit');
    this.currentQuizId.set(quiz.id);

    this.quizForm.patchValue({
      id: quiz.id,
      quiz_id: quiz.quiz_id,
      title: quiz.title,
      description: quiz.description,
      type: quiz.type,
      active: quiz.active,
      end_date: quiz.end_date || ''
    });

    this.sections.clear();
    (quiz.sections || []).forEach((s, sIndex) => {
      this.addSection(s.id || null, s.section_id);

      const sectionGroup = this.sections.at(sIndex);
      sectionGroup.patchValue({
        title: s.title,
        description: s.description || ''
      });

      const questionsArray = sectionGroup.get('questions') as FormArray;

      (s.questions || []).forEach((q, qIndex) => {
        const isMatches = q.type === QuestionType.Matches;
        this.addQuestion(sIndex, q.id || null, q.question_id);

        const questionGroup = questionsArray.at(qIndex);
        questionGroup.patchValue({
          uid: q.uid || this.generateId(),
          text: q.text,
          type: q.type,
          points: q.points,
          answer: isMatches ? 'matches' : q.answer,
          imageUrl: q.imageUrl || '',
          imageAnswerType: q.imageAnswerType || 'radio'
        });

        if (isMatches) {
          questionGroup.get('answer')?.clearValidators();
        }

        // Add options/matches via helper methods to ensure sync subscriptions
        (q.options || []).forEach(opt => this.addOption(sIndex, qIndex, opt));
        (q.matches || []).forEach(m => this.addMatch(sIndex, qIndex, m.left, m.right));
      });
    });
  }

  cancelEdit() {
    this.viewMode.set('list');
    this.currentQuizId.set(null);
    this.selectedQuizForStats.set(null);
    this.quizForm.reset({ type: QuizType.General, active: true, end_date: '' });
    this.sections.clear();
  }

  // ── Save ──────────────────────────────────────────────────

  private buildPayload() {
    const rawData = this.quizForm.getRawValue();

    const cleanId = (id: any) => {
      if (id === null || id === undefined || id === '') return undefined;
      const num = Number(id);
      return isNaN(num) ? id : num;
    };

    const sections = (rawData.sections || []).map((s: any) => ({
      ...s,
      id: cleanId(s.id),
      section_id: cleanId(s.section_id),
      questions: (s.questions || []).map((q: any) => {
        const baseQ = {
          ...q,
          id: cleanId(q.id),
          question_id: cleanId(q.question_id)
        };

        if (q.type === QuestionType.Matches) {
          return { ...baseQ, answer: null, options: [] };
        }
        if (q.type === QuestionType.SingleSelect || q.type === QuestionType.MultiSelect) {
          return { ...baseQ, matches: [] };
        }
        if (q.type === QuestionType.ImageQuestion) {
          return q.imageAnswerType === 'text'
            ? { ...baseQ, options: [], matches: [] }
            : { ...baseQ, matches: [] };
        }
        return { ...baseQ, options: [], matches: [] };
      })
    }));

    return {
      ...rawData,
      id: cleanId(rawData.id),
      quiz_id: cleanId(rawData.quiz_id),
      sections
    };
  }

  saveQuiz() {
    if (this.quizForm.invalid) {
      this.showFormErrors();
      return;
    }
    const quizData = this.buildPayload();

    if (this.isEditing() && this.currentQuizId()) {
      this.quizService.updateQuiz(this.currentQuizId()!, quizData).subscribe(() => {
        this.cancelEdit();
      });
    } else {
      this.quizService.createQuiz(quizData).subscribe(() => {
        this.cancelEdit();
      });
    }
  }

  private showFormErrors() {
    const errors: string[] = [];
    const controls = this.quizForm.controls;

    if (controls['title'].errors?.['required']) errors.push('Quiz Title is required');
    if (controls['type'].errors?.['required']) errors.push('Quiz Type is required');

    const sections = this.sections;
    sections.controls.forEach((s, sIdx) => {
      const sName = s.get('title')?.value || `Section ${sIdx + 1}`;
      if (s.get('title')?.errors?.['required']) errors.push(`${sName}: Title is required`);

      const questions = this.getSectionQuestions(sIdx);
      questions.controls.forEach((q, qIdx) => {
        const qNum = questions.length - qIdx;
        const qName = `Q${qNum} in ${sName}`;
        if (q.get('text')?.errors?.['required']) errors.push(`${qName}: Question text is required`);
        if (q.get('points')?.errors?.['required'] || q.get('points')?.errors?.['min']) {
          errors.push(`${qName}: Valid points (min 1) required`);
        }
        if (q.get('answer')?.errors?.['required']) errors.push(`${qName}: Correct answer must be selected`);

        const qType = q.get('type')?.value;
        if (qType === QuestionType.SingleSelect || qType === QuestionType.MultiSelect) {
          const options = this.getOptions(sIdx, qIdx);
          if (options.length < 2) errors.push(`${qName}: At least 2 options required`);
          options.controls.forEach((opt, oIdx) => {
            if (opt.errors?.['required']) errors.push(`${qName}: Option ${oIdx + 1} cannot be empty`);
          });
        }
        if (qType === QuestionType.ImageQuestion) {
          if (!q.get('imageUrl')?.value) errors.push(`${qName}: Image URL is required`);
          if (q.get('imageAnswerType')?.value === 'radio') {
            const options = this.getOptions(sIdx, qIdx);
            if (options.length < 2) errors.push(`${qName}: At least 2 options required`);
            options.controls.forEach((opt, oIdx) => {
              if (opt.errors?.['required']) errors.push(`${qName}: Option ${oIdx + 1} cannot be empty`);
            });
          }
        }
      });
    });

    if (errors.length > 0) {
      alert('Please fix the following issues before saving:\n\n• ' + errors.join('\n• '));
    }
  }

  // ── JSON Preview ──────────────────────────────────────────

  showJsonPreview() {
    this.previewJson.set(JSON.stringify(this.buildPayload(), null, 2));
  }

  closeJsonPreview() {
    this.previewJson.set(null);
  }

  // ── Actions ───────────────────────────────────────────────

  freezeQuiz(quiz: Quiz) {
    if (confirm(`Are you sure you want to freeze "${quiz.title}"? This will prevent any further submissions.`)) {
      this.quizService.freezeQuiz(quiz.id).subscribe({
        next: (res) => {
          if (res.success) {
            alert('Quiz frozen successfully.');
            // Reload to ensure all data is in sync
            this.ngOnInit();
          } else {
            alert(res.message || 'Failed to freeze quiz.');
          }
        },
        error: () => alert('An error occurred while freezing the quiz.')
      });
    }
  }

  deleteQuiz(id: string) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService.deleteQuiz(id).subscribe();
    }
  }
}
