import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';

export interface FellowshipGroup {
  name: string;
  imageUrl: string;
  description: string[];
  inCharge: string;
}

export interface FellowshipPost {
  id: number;
  fellowshipName: string;
  title: string;
  date: Date;
  content: string; // HTML content from the rich text editor
}

@Injectable({
  providedIn: 'root',
})
export class FellowshipService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/posts`;

  fellowshipGroups = signal<FellowshipGroup[]>([
    {
      name: 'Choir',
      imageUrl: 'https://drive.google.com/thumbnail?id=11m02RjNuqoo8jVRhmJi1Ic6nblJJaULM&sz=w2000',
      description: [
        'St. Andrew\u2019s boasts a rich tradition of worship and prayer. Music plays a profoundly significant role within our sacred walls. Soul-stirring melodies, bring comfort to the depths of worshippers\u2019 hearts, drawing people from all corners to join in joyful praise.',
        'Their harmonious voices elevate prayer and create a spiritual atmosphere. Additionally, during Lent and Advent, the Choir presents seasonal sacred music, adding to the richness of our worship experience.',
        'Beyond our Choir, we extend a warm invitation to all, together, we celebrate the beauty of music and its power to uplift our souls.',
      ],
      inCharge: '',
    },
    {
      name: 'Sunday School',
      imageUrl: 'https://drive.google.com/thumbnail?id=1wGslMLd9lwm6le3UPvH4cyA9vBdQge6N&sz=w2000',
      description: [
        'At St. Andrew\u2019s Church, Sunday School is more than just education it\u2019s a tool that helps our students develop a closer relationship with God through their connections with one another.',
        'Our Sunday School caters to children aged four through 12th grade. It provides an ideal environment for children to worship God and learn from the scriptures. The Sunday School curriculum is framed by the Diocese of Madras and the age-appropriate classes are led by dedicated and well-trained teachers. They meet every Sunday at 10:45am.',
      ],
      inCharge: '',
    },
    {
      name: 'Women\u2019s Fellowship',
      imageUrl: 'https://drive.google.com/thumbnail?id=1rit6BYvqZy6QJrWyBQkCxWOXBoQxmyaA&sz=w2000',
      description: [
        'The Women\u2019s Fellowship plays a vital role in our Andrew\u2019s Church. The Women\u2019s Fellowship meets regularly for prayer, fellowship, and Bible study. Specifically, they gather every Saturday 10.00a.m. These meetings provide a space for fellowship and prayer.',
        'The members of the Women\u2019s Fellowship actively support the various ministries through their prayers and active involvement. Throughout the year, the Women\u2019s Fellowship organizes get - together and retreats. These events allow women to share experiences, strengthen their bonds, and provide mutual support.',
      ],
      inCharge: '',
    },
    {
      name: 'Men\u2019s Fellowship',
      imageUrl: 'https://drive.google.com/thumbnail?id=13WjWEcU9r4lUqUOkUCM5PdB3YJeOWO9h&sz=w2000',
      description: [
        'The men\u2019s Fellowship plays a vital role in our Andrew\u2019s Church. The men\u2019s fellowship meets regularly for prayer, fellowship, and Bible study. Specifically, they gather every Sunday 10.45a.m. These meetings provide a space for fellowship and prayer. These allow to share experiences, strengthen their bonds, and provide mutual support.',
        'The Men\u2019s Fellowship actively seeks new ways to witness to the Gospel of Jesus Christ and contribute to the Church ministries.',
      ],
      inCharge: '',
    },
    {
      name: 'Youth Fellowship',
      imageUrl: 'https://drive.google.com/thumbnail?id=19-nGOGCy0w8CfulyjEa7TmWiVXrZHka1&sz=w2000',
      description: [
        'The young people of St. Andrew\u2019s infuse vibrant energy, creativity, and enthusiasm into our church community. The Youth Fellowship meets every Sunday for prayer, discussions, and fellowship on 10.45am.',
        'It\u2019s a space where young minds come together to grow spiritually and connect.',
      ],
      inCharge: '',
    },
    {
      name: 'Young Couples Fellowship',
      imageUrl: 'https://drive.google.com/thumbnail?id=1StYxiNBqh_WJjiqfwJRJq1eAi9Ji0GRU&sz=w2000',
      description: [
        'Fellowship meets every Sunday for prayer, discussions, and fellowship on 10.45am. Couples Fellowship, a time dedicated to strengthening bonds and fostering deeper connections with God and each other. It is a joyful occasion where couples come together to share their experiences, support one another, and grow in their faith. Through meaningful conversations, inspiring Bible teachings, and delightful activities, the fellowship aims to cultivate a sense of community and provide a nurturing environment for marriages to thrive.',
      ],
      inCharge: '',
    },
    {
      name: 'Friend\u2019s Prayer Group',
      imageUrl: 'https://drive.google.com/thumbnail?id=1_xRaKuKSi57e2P5ojgjsUkBQe4YkSWO9&sz=w2000',
      description: [
        'The Friend\u2019s Prayer Group\u2019s mission is to nurture the spiritual development of the fellowship members. the group convenes for prayer every Wednesday 9:30 p.m. through G-Meet.',
      ],
      inCharge: '',
    },
  ]);

  posts = signal<FellowshipPost[]>([]);

  // GET /api/posts with X-Fellowship-Name header (public, no auth)
  // Subscribes internally — safe to call from effect()
  loadPosts(fellowshipName: string): void {
    // We must URL-encode the fellowshipName because HTTP headers only support ISO-8859-1 characters.
    // The browser's native fetch will throw an error if we pass the smart quote ("’") directly.
    const headers = new HttpHeaders({ 'X-Fellowship-Name': encodeURIComponent(fellowshipName) });
    this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError(err => {
        console.error('Error fetching posts:', err);
        return of([]);
      })
    ).subscribe(res => {
      const data = res?.data || res || [];
      const mapped: FellowshipPost[] = (Array.isArray(data) ? data : []).map((p: any) => ({
        id: p.id,
        fellowshipName: p.fellowshipName || p.fellowship_name || fellowshipName,
        title: p.title,
        date: new Date(p.date || p.created_at || p.createdAt || Date.now()),
        content: p.content || '',
      }));
      this.posts.set(mapped);
    });
  }

  // POST /api/posts (admin token attached by interceptor)
  createPost(postData: { fellowshipName: string; title: string; content: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData);
  }

  // PUT /api/posts/:id (admin token attached by interceptor)
  updatePost(id: number, postData: { fellowshipName: string; title: string; content: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, postData);
  }

  // PUT /api/posts/:id/inactive (admin token attached by interceptor)
  deactivatePost(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/inactive`, {});
  }
}
