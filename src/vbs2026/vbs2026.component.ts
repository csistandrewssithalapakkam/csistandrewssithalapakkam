import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const VBS_SONGS = [
  { id: 'DQVNXu_PPVc', label: 'Song 1' },
  { id: 'Hkgna8q4Y8I', label: 'Song 2' },
  { id: 'xy8Cv4RUV64', label: 'Song 3' },
  { id: 'me5Jlz_LI5E', label: 'Song 4' },
  { id: 'qRlZqnTYmGk', label: 'Song 5' },
  { id: 'aM1KMorSSa4', label: 'Song 6' },
  { id: 'QFgHMCNPPnc', label: 'Song 7' },
  { id: 'awlN7Z_gDQ0', label: 'Song 8' },
  { id: 'od6FGV8UsXY', label: 'Song 9' },
  { id: 'A-uQt3xnp90', label: 'Song 10' },
  { id: 'nN51iHZ0KQI', label: 'Song 11' },
];

const PRAYER_POINTS = [
  { icon: '✝️', text: 'Pray that every child experiences the love of Jesus Christ this VBS week.' },
  { icon: '📖', text: 'Pray for teachers and helpers to share God\'s Word with clarity, joy, and love.' },
  { icon: '💛', text: 'Pray for children to understand and accept salvation through Jesus Christ.' },
  { icon: '🕊️', text: 'Pray for the Holy Spirit to touch each young heart in a special way.' },
  { icon: '⭐', text: 'Pray for children to memorize God\'s Word and carry it throughout their lives.' },
  { icon: '🏠', text: 'Pray for families of VBS children to be drawn closer to God and the church.' },
  { icon: '🙏', text: 'Pray for safety, good health, and joy for all participants every day.' },
  { icon: '🌱', text: 'Pray for seeds sown this week to bear fruit that lasts for eternity.' },
];

const SCHEDULE = [
  { time: '8:30 – 9:00',   activity: 'Teachers\' Devotion',                          note: '',                                      icon: '🙏', color: 'bg-violet-600' },
  { time: '9:00 – 9:45',   activity: 'General Devotion',                             note: 'Action Songs',                          icon: '🎵', color: 'bg-pink-500'   },
  { time: '9:45 – 10:15',  activity: 'Story Telling & Memory Verse',                 note: 'Lesson related · All grades',           icon: '📖', color: 'bg-indigo-500' },
  { time: '10:15 – 10:30', activity: 'Class Separation',                             note: 'Groups arranged by grade',              icon: '👥', color: 'bg-blue-500'   },
  { time: '10:30 – 11:00', activity: 'Snacks Break',                                 note: '',                                      icon: '🍎', color: 'bg-orange-400' },
  { time: '11:00 – 12:15', activity: 'Classes Conducted',                            note: 'Grade-wise sessions',                   icon: '🎨', color: 'bg-teal-500'   },
  { time: '12:15 – 12:30', activity: 'General Devotion',                             note: '',                                      icon: '🎶', color: 'bg-purple-500' },
  { time: '12:30 – 1:00',  activity: 'Lunch Break',                                  note: 'Beginner & Primary',                    icon: '🍽️', color: 'bg-amber-500'  },
  { time: '12:30 – 1:00',  activity: 'Missionary Story',                             note: 'Junior · Inter · Senior',               icon: '🌍', color: 'bg-emerald-600'},
  { time: 'After 1:00',    activity: 'Lunch Break',                                  note: 'Junior · Inter · Senior',               icon: '🍽️', color: 'bg-amber-400'  },
];

@Component({
  selector: 'app-vbs2026',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  template: `
    <div class="vbs-page">
      <!-- Nav bar -->
      <nav class="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <a routerLink="/" class="flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold transition-colors">
          <mat-icon style="font-size:18px;width:18px;height:18px">home</mat-icon> Home
        </a>
        <div class="text-amber-300 text-xs font-bold uppercase tracking-widest">VBS 2026</div>
      </nav>

      <!-- ===== HERO ===== -->
      <section class="relative z-10 text-center px-4 pt-4 pb-12">
        <div class="floating-star star-1">★</div>
        <div class="floating-star star-2">★</div>
        <div class="floating-star star-3">★</div>
        <div class="floating-star star-4">★</div>
        <div class="floating-star star-5">★</div>
        <div class="floating-star star-6">★</div>
        <div class="floating-star star-7">★</div>
        <div class="floating-star star-8">★</div>

        <div class="inline-block mb-3">
          <span class="vbs-tag">C.S.I. St. Andrew's Church · Sithalapakkam</span>
        </div>

        <h1 class="vbs-main-title">VBS 2026</h1>
        <p class="vbs-tamil-title">இயேசுவிடம் வாருங்கள்</p>
        <p class="vbs-en-title">COME TO JESUS</p>

        <div class="poster-wrapper mx-auto mt-8 mb-6">
          <!-- Left stars: scattered positions -->
          <span class="poster-star ps-1">★</span>
          <span class="poster-star ps-2">★</span>
          <span class="poster-star ps-3">★</span>
          <div class="poster-container">
            <img
              src="https://drive.google.com/thumbnail?id=1bIpTXV4ovSLUfj3hrmDJS95UoXs2BK_P&sz=w1600"
              alt="VBS 2026 Come to Jesus"
              class="poster-img"
            />
          </div>
          <!-- Right stars: scattered positions -->
          <span class="poster-star ps-4">★</span>
          <span class="poster-star ps-5">★</span>
          <span class="poster-star ps-6">★</span>
        </div>

        <div class="flex flex-wrap justify-center gap-4 mt-8">
          <div class="info-card">
            <span class="info-icon">📅</span>
            <div>
              <div class="info-label">Date</div>
              <div class="info-value">25 Apr – 02 May 2026</div>
            </div>
          </div>
          <div class="info-card">
            <span class="info-icon">⏰</span>
            <div>
              <div class="info-label">Time</div>
              <div class="info-value">9:00 AM – 1:00 PM</div>
            </div>
          </div>
          <div class="info-card">
            <span class="info-icon">📍</span>
            <div>
              <div class="info-label">Venue</div>
              <div class="info-value">C.S.I. St Andrew's Church<br>TNHB Colony, Sithalapakkam<br>Chennai – 600 126</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== DECORATIVE IMAGES ===== -->
      <section class="relative z-10 max-w-5xl mx-auto px-4 pb-12">
        <div class="section-header">
          <span class="section-badge">🎉</span>
          <h2 class="section-title">VBS 2026 Highlights</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div class="deco-card">
            <img src="https://drive.google.com/thumbnail?id=1bIpTXV4ovSLUfj3hrmDJS95UoXs2BK_P&sz=w800" alt="Come to Jesus" class="deco-img" />
            <p class="deco-label">Come to Jesus</p>
          </div>
          <div class="deco-card">
            <img src="https://drive.google.com/thumbnail?id=1jiRd5SgoYpIaCQHwKfO9_8crvpiOisJU&sz=w800" alt="VBS Crown" class="deco-img" />
            <p class="deco-label">Crown</p>
          </div>
          <div class="deco-card">
            <img src="https://drive.google.com/thumbnail?id=1x_2HFwJ4eJ8Hol3XM7bXWdrCQepsZPAG&sz=w800" alt="Photo Prop" class="deco-img" />
            <p class="deco-label">Photo Prop</p>
          </div>
          <div class="deco-card">
            <img src="https://drive.google.com/thumbnail?id=1wQ4Ky8hCWvcpXetNesNwrp_kRLw_Uz2y&sz=w800" alt="VBS Clock" class="deco-img" />
            <p class="deco-label">VBS Clock</p>
          </div>
        </div>
      </section>

      <!-- ===== VBS 2026 SONGS ===== -->
      <section class="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        <div class="section-header">
          <span class="section-badge">🎵</span>
          <h2 class="section-title">VBS 2026 Songs</h2>
          <p class="section-sub">Click any song to watch and sing along!</p>
        </div>
        <div class="songs-grid mt-8">
          @for (song of songs; track song.id; let i = $index) {
            <div class="song-card" (click)="openVideo(song.id)">
              <div class="song-thumb-wrap">
                <img
                  [src]="'https://img.youtube.com/vi/' + song.id + '/mqdefault.jpg'"
                  [alt]="song.label"
                  class="song-thumb"
                />
                <div class="song-play-overlay">
                  <div class="song-play-btn">▶</div>
                </div>
              </div>
              <div class="song-footer">
                <span class="song-num">{{ i + 1 }}</span>
                <span class="song-label">{{ videoTitles()[song.id] || song.label }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ===== PRAYER POINTS ===== -->
      <section class="relative z-10 max-w-4xl mx-auto px-4 pb-16">
        <div class="section-header">
          <span class="section-badge">🙏</span>
          <h2 class="section-title">Prayer Points</h2>
          <p class="section-sub">Join us in prayer for VBS 2026</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          @for (p of prayerPoints; track $index; let i = $index) {
            <div class="prayer-card" [style.animation-delay]="(i * 0.07) + 's'">
              <span class="prayer-icon">{{ p.icon }}</span>
              <p class="prayer-text">{{ p.text }}</p>
            </div>
          }
        </div>
      </section>

      <!-- ===== SCHEDULE ===== -->
      <section class="relative z-10 max-w-2xl mx-auto px-4 pb-20">
        <div class="section-header">
          <span class="section-badge">📋</span>
          <h2 class="section-title">VBS 2026 Schedule</h2>
          <p class="section-sub">25 April – 02 May · Morning Programme</p>
        </div>
        <div class="timeline mt-8">
          @for (s of schedule; track $index) {
            <div class="timeline-item">
              <div class="timeline-dot {{ s.color }}">{{ s.icon }}</div>
              <div class="timeline-content">
                <div class="timeline-left">
                  <span class="timeline-time">{{ s.time }}</span>
                </div>
                <div class="timeline-right">
                  <span class="timeline-activity">{{ s.activity }}</span>
                  @if (s.note) {
                    <span class="timeline-note">{{ s.note }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ===== FOOTER ===== -->
      <footer class="relative z-10 text-center py-8 px-4 border-t border-white/10">
        <p class="text-white/50 text-sm">C.S.I. St. Andrew's Church · TNHB Colony, Sithalapakkam, Chennai 600 126</p>
        <p class="text-amber-300/60 text-xs mt-1">VBS 2026 · Come to Jesus · இயேசுவிடம் வாருங்கள்</p>
      </footer>
    </div>

    <!-- ===== VIDEO POPUP ===== -->
    @if (activeVideoId()) {
      <div class="video-popup-backdrop" (click)="closeVideo()">
        <div class="video-popup-box" (click)="$event.stopPropagation()">
          <button class="video-close-btn" (click)="closeVideo()">✕</button>
          <iframe
            [src]="safeVideoUrl()"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
            class="video-iframe"
          ></iframe>
        </div>
      </div>
    }
  `,
  styles: [`
    .vbs-page {
      min-height: 100vh;
      background: linear-gradient(180deg, #1e0040 0%, #2d0060 40%, #1a003a 100%);
      position: relative;
      overflow-x: hidden;
      font-family: 'Segoe UI', sans-serif;
    }

    .floating-star {
      position: absolute;
      color: rgba(255, 220, 100, 0.6);
      pointer-events: none;
      animation: floatStar 4s ease-in-out infinite;
      font-size: 20px;
    }
    .star-1 { top: 8%;  left: 5%;   animation-delay: 0s;   font-size: 24px; }
    .star-2 { top: 15%; right: 8%;  animation-delay: 0.8s; font-size: 16px; }
    .star-3 { top: 5%;  left: 45%;  animation-delay: 1.5s; font-size: 20px; }
    .star-4 { top: 20%; left: 20%;  animation-delay: 2.2s; font-size: 18px; color: rgba(255,180,200,0.7); }
    .star-5 { top: 12%; right: 25%; animation-delay: 0.4s; font-size: 14px; }
    .star-6 { top: 25%; right: 5%;  animation-delay: 1.1s; font-size: 22px; color: rgba(255,220,100,0.8); }
    .star-7 { top: 3%;  left: 25%;  animation-delay: 1.8s; font-size: 18px; color: rgba(200,220,255,0.85); }
    .star-8 { top: 18%; left: 60%;  animation-delay: 0.6s; font-size: 14px; color: rgba(255,180,200,0.75); }

    @keyframes floatStar {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
      50%       { transform: translateY(-14px) rotate(20deg); opacity: 1; }
    }

    .vbs-tag {
      display: inline-block;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.8);
      padding: 4px 16px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .vbs-main-title {
      font-size: clamp(3rem, 10vw, 6rem);
      font-weight: 900;
      color: #fbbf24;
      text-shadow: 0 0 30px rgba(251,191,36,0.6), 0 4px 12px rgba(0,0,0,0.5);
      letter-spacing: 0.05em;
      animation: bouncePulse 2.5s ease-in-out infinite;
      margin: 0;
      line-height: 1.1;
    }
    @keyframes bouncePulse {
      0%, 100% { transform: scale(1); }
      50%       { transform: scale(1.04); }
    }

    .vbs-tamil-title {
      font-size: clamp(1.4rem, 5vw, 2.5rem);
      font-weight: 800;
      color: #e879f9;
      text-shadow: 0 0 20px rgba(232,121,249,0.5);
      margin: 6px 0 2px;
    }
    .vbs-en-title {
      font-size: clamp(1.1rem, 4vw, 1.8rem);
      font-weight: 900;
      color: #fff;
      letter-spacing: 0.25em;
      opacity: 0.9;
      margin: 0;
    }

    .poster-wrapper {
      position: relative;
      max-width: 860px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 80px;
    }
    .poster-container {
      max-width: 700px;
      width: 100%;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 0 60px rgba(251,191,36,0.3), 0 24px 48px rgba(0,0,0,0.5);
      border: 3px solid rgba(251,191,36,0.4);
    }
    .poster-img { width: 100%; display: block; }

    .poster-star {
      position: absolute;
      line-height: 1;
      user-select: none;
      pointer-events: none;
      animation: floatStar 4s ease-in-out infinite;
    }
    /* Left side — scattered across different heights and depths */
    .ps-1 { left: 2%;  top: 10%; font-size: 30px; color: rgba(255,220,100,0.95); animation-delay: 0s;   animation-duration: 3.8s; }
    .ps-2 { left: 10%; top: 55%; font-size: 20px; color: rgba(255,180,200,0.85); animation-delay: 1.2s; animation-duration: 4.5s; }
    .ps-3 { left: 1%;  top: 82%; font-size: 24px; color: rgba(200,220,255,0.9);  animation-delay: 2.0s; animation-duration: 5.0s; }
    /* Right side — scattered across different heights and depths */
    .ps-4 { right: 2%;  top: 20%; font-size: 26px; color: rgba(200,220,255,0.95); animation-delay: 0.6s; animation-duration: 4.2s; }
    .ps-5 { right: 10%; top: 62%; font-size: 18px; color: rgba(255,220,100,0.9);  animation-delay: 1.7s; animation-duration: 3.5s; }
    .ps-6 { right: 1%;  top: 88%; font-size: 22px; color: rgba(255,180,200,0.8);  animation-delay: 0.3s; animation-duration: 4.8s; }

    .info-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      backdrop-filter: blur(8px);
      border-radius: 20px;
      padding: 16px 20px;
      color: white;
      text-align: left;
      min-width: 180px;
    }
    .info-icon  { font-size: 28px; flex-shrink: 0; }
    .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-bottom: 2px; }
    .info-value { font-size: 14px; font-weight: 700; color: #fbbf24; line-height: 1.4; }

    .section-header { text-align: center; }
    .section-badge  { font-size: 36px; display: block; margin-bottom: 6px; }
    .section-title  { font-size: clamp(1.5rem, 5vw, 2.2rem); font-weight: 900; color: #fbbf24; text-shadow: 0 0 20px rgba(251,191,36,0.4); margin: 0; }
    .section-sub    { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 4px; }

    .deco-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .deco-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
    .deco-img {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 12px;
      object-fit: contain;
      object-position: center;
      display: block;
      margin: 0 auto;
    }
    .deco-label { color: white; font-weight: 700; font-size: 13px; margin-top: 8px; }

    /* Songs grid */
    .songs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    @media (min-width: 640px)  { .songs-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 1024px) { .songs-grid { grid-template-columns: repeat(4, 1fr); } }

    .song-card {
      border-radius: 16px;
      overflow: hidden;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .song-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }

    .song-thumb-wrap {
      position: relative;
      aspect-ratio: 16/9;
      overflow: hidden;
    }
    .song-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s;
    }
    .song-card:hover .song-thumb { transform: scale(1.06); }

    .song-play-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.25);
      transition: background 0.2s;
    }
    .song-card:hover .song-play-overlay { background: rgba(0,0,0,0.1); }
    .song-play-btn {
      width: 44px;
      height: 44px;
      background: rgba(220,38,38,0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
      padding-left: 4px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      transition: transform 0.2s;
    }
    .song-card:hover .song-play-btn { transform: scale(1.15); }

    .song-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
    }
    .song-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(251,191,36,0.2);
      border: 1px solid rgba(251,191,36,0.4);
      color: #fbbf24;
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .song-label { color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; }

    /* Prayer cards */
    .prayer-card {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px;
      padding: 14px 16px;
      animation: fadeSlideIn 0.5s ease both;
    }
    .prayer-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
    .prayer-text { color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.5; font-weight: 500; margin: 0; }

    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Timeline */
    .timeline { position: relative; }
    .timeline::before {
      content: '';
      position: absolute;
      left: 22px;
      top: 0; bottom: 0;
      width: 2px;
      background: linear-gradient(to bottom, #fbbf24, #e879f9, #818cf8);
      border-radius: 2px;
    }
    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 12px;
      position: relative;
    }
    .timeline-dot {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .timeline-content {
      flex: 1;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 10px 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .timeline-left  { flex-shrink: 0; min-width: 90px; }
    .timeline-right { flex: 1; }
    .timeline-time     { color: #fbbf24; font-weight: 800; font-size: 12px; display: block; }
    .timeline-activity { color: rgba(255,255,255,0.9); font-weight: 700; font-size: 14px; display: block; }
    .timeline-note     { color: rgba(255,255,255,0.45); font-size: 11px; font-style: italic; display: block; margin-top: 2px; }

    /* Video popup */
    .video-popup-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.88);
      backdrop-filter: blur(6px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .video-popup-box {
      position: relative;
      width: 100%;
      max-width: 860px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 32px 64px rgba(0,0,0,0.6);
      background: #000;
      animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.9); }
      to   { opacity: 1; transform: scale(1); }
    }
    .video-close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10;
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      color: white;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .video-close-btn:hover { background: rgba(255,255,255,0.3); }
    .video-iframe {
      width: 100%;
      aspect-ratio: 16 / 9;
      display: block;
      border: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vbs2026Component implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  readonly songs = VBS_SONGS;
  readonly prayerPoints = PRAYER_POINTS;
  readonly schedule = SCHEDULE;

  activeVideoId = signal<string | null>(null);
  videoTitles = signal<Record<string, string>>({});

  ngOnInit() {
    VBS_SONGS.forEach(song => {
      this.http.get<{ title: string }>(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${song.id}&format=json`
      ).subscribe({
        next: res => this.videoTitles.update(t => ({ ...t, [song.id]: res.title })),
        error: ()  => this.videoTitles.update(t => ({ ...t, [song.id]: song.label })),
      });
    });
  }

  openVideo(id: string) {
    this.activeVideoId.set(id);
  }

  closeVideo() {
    this.activeVideoId.set(null);
  }

  safeVideoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.activeVideoId()}?autoplay=1&rel=0`
    );
  }
}
