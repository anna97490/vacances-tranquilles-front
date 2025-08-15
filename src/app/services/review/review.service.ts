import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReviewCreateRequest {
  note: number;
  commentaire: string;
  reservationId: number;
  reviewerId: number;
  reviewedId: number;
}

export interface Review {
  id: number;
  note: number;
  commentaire: string;
  reservationId: number;
  reviewerId: number;
  reviewedId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  createReview(review: ReviewCreateRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  getReviewsByProviderId(providerId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/provider/${providerId}`);
  }

  getReviewsWrittenByUser(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/writer`);
  }

  getReviewsReceivedByUser(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/received`);
  }
}
