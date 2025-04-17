import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { WebSocketService } from '../services/web-socket-service.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';

// Interface pour JitsiMeetExternalAPI (inchangée)
export interface JitsiMeetExternalAPIOptions {
  roomName: string;
  width?: string | number;
  height?: string | number;
  parentNode: HTMLElement | null;
  userInfo?: { displayName?: string; email?: string };
  configOverwrite?: any;
  interfaceConfigOverwrite?: any;
  password?: string;
}

declare class JitsiMeetExternalAPI {
  constructor(domain: string, options: JitsiMeetExternalAPIOptions);
  executeCommand(command: string, value?: string): void;
  dispose(): void;
}

interface MeetingLink {
  id: number;
  courseName: string;
  link: string;
  createdAt: string;
  scheduledAt: string;
  password?: string;
  active: boolean;
}

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  meetingLinks: MeetingLink[] = [];
  errorMessage: string = '';
  enteredPasswords: { [key: number]: string } = {};
  private wsSubscription: Subscription | null = null;
  private intervalSubscription: Subscription | null = null; // Subscription pour le minuteur

  constructor(
    private coursesService: CoursesService,
    private webSocketService: WebSocketService,
    private toastr: ToastrService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.toastr.success('Toastr fonctionne !');
    this.loadMeetingLinks();
    this.subscribeToWebSocket();
    this.startMeetingTimeCheck(); // Lancer la vérification périodique
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe(); // Nettoyer le minuteur
    }
    this.webSocketService.disconnect();
  }

  joinMeeting(meeting: MeetingLink): void {
    if (!meeting.active) {
      this.errorMessage = `La réunion ${meeting.courseName} n’est pas active.`;
      return;
    }

    const enteredPassword = this.enteredPasswords[meeting.id] || '';
    const storedPassword = meeting.password || '';

    if (storedPassword && enteredPassword !== storedPassword) {
      this.errorMessage = `Mot de passe incorrect pour ${meeting.courseName}.`;
      return;
    }

    const domain = 'meet.jit.si';
    const roomName = meeting.link.split('/').pop() || '';
    const options: JitsiMeetExternalAPIOptions = {
      roomName,
      width: '100%',
      height: 500,
      parentNode: document.querySelector('#meet-container'),
      userInfo: { displayName: 'Étudiant' },
      password: enteredPassword
    };

    if (typeof JitsiMeetExternalAPI !== 'undefined') {
      const api = new JitsiMeetExternalAPI(domain, options);
      if (enteredPassword) {
        api.executeCommand('password', enteredPassword);
      }
    } else {
      this.errorMessage = 'Erreur : L’API Jitsi Meet n’est pas disponible.';
      console.error('JitsiMeetExternalAPI n’est pas défini.');
    }
  }

  updatePassword(meetingId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.enteredPasswords[meetingId] = target.value || '';
  }

  private loadMeetingLinks(): void {
    this.coursesService.getUpcomingMeetingLinks().subscribe({
      next: (links: MeetingLink[]) => {
        this.meetingLinks = links || [];
        this.errorMessage = this.meetingLinks.length === 0 ? 'Aucune réunion à venir trouvée.' : '';
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réunions:', err);
        this.errorMessage = 'Erreur lors de la récupération des réunions.';
      }
    });
  }

  private subscribeToWebSocket(): void {
    this.wsSubscription = this.webSocketService.getMessages().subscribe({
      next: (message: MeetingLink) => {
        console.log('📦 Message WebSocket reçu dans le composant:', message);
        this.ngZone.run(() => { // Assurer que les mises à jour se font dans la zone Angular
          const existingMeeting = this.meetingLinks.find(m => m.id === message.id);
          if (existingMeeting) {
            this.meetingLinks = this.meetingLinks.map(m =>
              m.id === message.id ? { ...m, ...message } : m
            );
            if (!existingMeeting.active && message.active) {
              // Notification lorsque le meeting devient actif via WebSocket
              this.toastr.success(`La réunion ${message.courseName} est maintenant active !`, 'Réunion active', {
                timeOut: 10000
              });
            }
          } else if (new Date(message.scheduledAt) > new Date()) {
            this.meetingLinks.push(message);
            this.toastr.info(`Nouvelle réunion planifiée : ${message.courseName}`);
          }
          this.meetingLinks = this.meetingLinks
            .filter(m => new Date(m.scheduledAt) > new Date())
            .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
          this.errorMessage = this.meetingLinks.length === 0 ? 'Aucune réunion à venir trouvée.' : '';
        });
      },
      error: (err) => {
        console.error('Erreur WebSocket:', err);
        this.toastr.error('Erreur de connexion WebSocket');
      }
    });
  }

  private startMeetingTimeCheck(): void {
    // Vérifier toutes les 60 secondes si une réunion doit devenir active
    this.intervalSubscription = interval(60000).subscribe(() => {
      this.ngZone.run(() => {
        const now = new Date();
        this.meetingLinks.forEach(meeting => {
          const scheduledTime = new Date(meeting.scheduledAt);
          // Vérifier si l'heure actuelle est proche de l'heure prévue (dans une fenêtre de 1 minute)
          if (
            Math.abs(now.getTime() - scheduledTime.getTime()) < 60000 &&
            meeting.active &&
            !this.hasNotified(meeting.id) // Vérifier si la notification n'a pas déjà été envoyée
          ) {
            this.toastr.success(
              `La réunion ${meeting.courseName} commence maintenant !`,
              'Réunion active',
              { timeOut: 10000 }
            );
            this.markAsNotified(meeting.id); // Marquer comme notifié
          }
        });
      });
    });
  }

  // Gestion des notifications pour éviter les doublons
  private notifiedMeetings: Set<number> = new Set();

  private hasNotified(meetingId: number): boolean {
    return this.notifiedMeetings.has(meetingId);
  }

  private markAsNotified(meetingId: number): void {
    this.notifiedMeetings.add(meetingId);
  }
}