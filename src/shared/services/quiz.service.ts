import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz, QuizSubmission, QuizSubmissionResult, QuizStats } from '../models/quiz.model';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/quizzes`;

  quizzes = signal<Quiz[]>([]);

  private mapQuiz(q: any): Quiz {
    return {
      ...q,
      id: q.quiz_id?.toString() || q.id?.toString() || '',
      active: q.is_active === 1 || q.is_active === true || q.active === true,
      is_freezed: q.is_freezed === 1 || q.is_freezed === true,
      sections: (q.sections || []).map((s: any) => ({
        ...s,
        id: s.section_id?.toString() || s.id?.toString() || '',
        questions: (s.questions || []).map((quest: any) => ({
          ...quest,
          id: quest.question_id?.toString() || quest.id?.toString() || '',
          imageUrl: quest.imageUrl || quest.image_url || '',
          imageAnswerType: quest.imageAnswerType || quest.image_answer_type || quest.answer_type || 'radio'
        }))
      }))
    };
  }

  loadQuizzes(): Observable<Quiz[]> {
    return this.http.get<{ success: boolean, data: any[] }>(this.apiUrl).pipe(
      // We map all quizzes, not filtering by is_active, so we can show 'Freeze' status
      map(res => (res.data || []).map(q => this.mapQuiz(q))),
      tap(quizzes => this.quizzes.set(quizzes))
    );
  }

  getQuiz(id: string): Observable<Quiz> {
    return this.http.get<{ success: boolean, data: any }>(`${this.apiUrl}/${id}`).pipe(
      map(res => this.mapQuiz(res.data))
    );
  }

  /** Fetches a quiz for end users using the public endpoint: api/quizzes/{type}?quizId={id} */
  getQuizForUser(type: string, quizId: string): Observable<Quiz> {
    return this.http.get<{ success: boolean, data: any }>(`${this.apiUrl}/${encodeURIComponent(type)}`, {
      params: { quizId }
    }).pipe(
      map(res => this.mapQuiz(res.data))
    );
  }

  createQuiz(quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<{ success: boolean, data: any }>(this.apiUrl, quiz).pipe(
      map(res => this.mapQuiz(res.data)),
      tap(newQuiz => this.quizzes.update(qs => [...qs, newQuiz]))
    );
  }

  updateQuiz(id: string, quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<{ success: boolean, data: any }>(`${this.apiUrl}/${id}`, quiz).pipe(
      map(res => this.mapQuiz(res.data)),
      tap(updatedQuiz => this.quizzes.update(qs => qs.map(q => q.id === id ? updatedQuiz : q)))
    );
  }

  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.quizzes.update(qs => qs.filter(q => q.id !== id)))
    );
  }

  freezeQuiz(id: string): Observable<{ success: boolean, message?: string }> {
    return this.http.post<{ success: boolean, message?: string }>(`${this.apiUrl}/${id}/freeze`, {}).pipe(
      tap(res => {
        if (res.success) {
          // Update the localized store so the UI reflects the frozen state
          this.quizzes.update(qs => qs.map(q => q.id === id ? { ...q, is_freezed: true } : q));
        }
      }),
      catchError(err => of({ success: false, message: err?.error?.message || 'Failed to freeze quiz' }))
    );
  }

  /** Save in-progress quiz answers: POST api/quiz-submissions */
  saveQuizAnswers(submission: QuizSubmission): Observable<{ success: boolean; data?: any; message?: string }> {
    return this.http.post<{ success: boolean; data?: any; message?: string }>(
      `${this.apiUrl.replace('/quizzes', '/quiz-submissions')}`,
      submission
    ).pipe(
      catchError(err => of({ success: false, message: err?.error?.message || 'Failed to save progress.' }))
    );
  }

  /** Submit completed quiz: POST api/quiz-submissions/submit */
  submitQuiz(submission: QuizSubmission): Observable<{ success: boolean; data?: QuizSubmissionResult; message?: string }> {
    return this.http.post<{ success: boolean; data?: QuizSubmissionResult; message?: string }>(
      `${this.apiUrl.replace('/quizzes', '/quiz-submissions/submit')}`,
      submission
    ).pipe(
      catchError(err => of({ success: false, message: err?.error?.message || 'Failed to submit quiz.' }))
    );
  }

  /** Get previously saved or submitted answers: GET api/quiz-submissions?quizId=&userId= */
  getSavedAnswers(quizId: string, userId: string): Observable<{ success: boolean; data?: QuizSubmissionResult; message?: string }> {
    return this.http.get<{ success: boolean; data?: QuizSubmissionResult; message?: string }>(
      `${this.apiUrl.replace('/quizzes', '/quiz-submissions')}`,
      { params: { quizId, userId } }
    ).pipe(
      catchError(() => of({ success: false }))
    );
  }

  /** Get statistics for a quiz: GET api/quizzes/{id}/stats */
  getQuizStats(id: string): Observable<{ success: boolean; data: QuizStats }> {
    return this.http.get<{ success: boolean; data: QuizStats }>(`${this.apiUrl}/${id}/stats`).pipe(
      catchError(() => of({
        success: true,
        data: { attended: 0, submitted: 0, saved: 0 } // Fallback
      }))
    );
  }

  /** Get all submissions for a quiz (Admin): GET api/quiz-submissions?quizId={id} */
  getQuizSubmissions(quizId: string): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(
      `${this.apiUrl.replace('/quizzes', '/quiz-submissions')}`,
      { params: { quizId } }
    ).pipe(
      catchError(() => of({ success: false, data: [] }))
    );
  }

  /** Register a quiz user: POST api/quizzes/register */
  registerUser(userInfo: any): Observable<{ success: boolean; data?: any; message?: string }> {
    return this.http.post<{ success: boolean; data?: any; message?: string }>(
      `${this.apiUrl}/register`,
      userInfo
    ).pipe(
      catchError(err => of({ success: false, message: err?.error?.message || 'Registration failed.' }))
    );
  }
}
