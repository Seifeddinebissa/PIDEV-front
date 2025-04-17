// src/app/back-office/create-meet/create-meet.component.ts
import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';

interface JitsiMeetExternalAPIOptions {
  roomName: string;
  width?: string | number;
  height?: string | number;
  parentNode: HTMLElement | null;
  userInfo?: { displayName?: string; email?: string };
  configOverwrite?: any;
  interfaceConfigOverwrite?: any;
  password?: string;
}

interface MeetingLink {
  id: number;
  courseName: string;
  link: string;
  createdAt: string;
  scheduledAt: string;
  password?: string;
  active: boolean; // Changement de status à active pour correspondre au backend
}

declare class JitsiMeetExternalAPI {
  constructor(domain: string, options: JitsiMeetExternalAPIOptions);
  executeCommand(command: string, value?: string): void;
  dispose(): void;
}

@Component({
  selector: 'app-create-meet',
  templateUrl: './create-meet.component.html',
  styleUrls: ['./create-meet.component.css']
})
export class CreateMeetComponent implements OnInit {
  courseName: string = '';
  meetLink: string = '';
  errorMessage: string = '';
  scheduledAt: string = '';
  password: string = '';
  meetingId: number | null = null;

  meetings: MeetingLink[] = [];
  selectedMeeting: MeetingLink | null = null;
  editMode: boolean = false;

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadMeetings();
    // Rafraîchir la liste toutes les 60 secondes pour refléter les changements de statut
    setInterval(() => this.loadMeetings(), 60000);
  }

  generateLink(): void {
    if (this.courseName && this.scheduledAt) {
      this.coursesService.generateMeetLink(this.courseName, this.scheduledAt, this.password).subscribe({
        next: (data) => {
          this.meetLink = data.link;
          this.meetingId = data.id;
          this.courseName = ''; // Réinitialiser les champs après création
          this.scheduledAt = '';
          this.password = '';
          this.loadMeetings(); // Rafraîchir la liste
        },
        error: (err) => this.errorMessage = 'Erreur lors de la création : ' + err.message
      });
    } else {
      this.errorMessage = 'Veuillez remplir le nom du cours et la date planifiée.';
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.meetLink);
    alert('Lien copié dans le presse-papiers !');
  }

  startMeeting(): void {
    if (this.meetLink) {
      const domain = 'meet.jit.si';
      const roomName = this.meetLink.split('/').pop();
      const options: JitsiMeetExternalAPIOptions = {
        roomName: roomName || '',
        width: '100%',
        height: 500,
        parentNode: document.querySelector('#meet-container'),
        userInfo: { displayName: 'Professeur' },
        password: this.password
      };
      if (typeof JitsiMeetExternalAPI !== 'undefined') {
        const api = new JitsiMeetExternalAPI(domain, options);
        if (this.password) api.executeCommand('password', this.password);
      } else {
        this.errorMessage = 'Erreur : Jitsi Meet n’est pas disponible.';
      }
    }
  }

  loadMeetings(): void {
    this.coursesService.getAllMeetingLinks().subscribe({
      next: (data) => {
        this.meetings = data;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des réunions : ' + err.message;
      }
    });
  }

  deactivateMeeting(id: number): void {
    this.coursesService.deactivateMeetingLink(id).subscribe({
      next: () => {
        this.meetings = this.meetings.map(meeting =>
          meeting.id === id ? { ...meeting, active: false } : meeting
        );
        this.errorMessage = 'Réunion désactivée avec succès.';
        setTimeout(() => this.errorMessage = '', 3000);
      },
      error: (err) => this.errorMessage = 'Erreur lors de la désactivation : ' + err.message
    });
  }

  deleteMeeting(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réunion ?')) {
      this.coursesService.deleteMeetingLink(id).subscribe({
        next: () => {
          this.meetings = this.meetings.filter(meeting => meeting.id !== id);
          this.errorMessage = 'Réunion supprimée avec succès.';
          setTimeout(() => this.errorMessage = '', 3000);
        },
        error: (err) => this.errorMessage = 'Erreur lors de la suppression : ' + err.message
      });
    }
  }

  startEdit(meeting: MeetingLink): void {
    this.selectedMeeting = { ...meeting };
    this.editMode = true;
  }

  cancelEdit(): void {
    this.selectedMeeting = null;
    this.editMode = false;
  }

  saveEdit(): void {
    if (this.selectedMeeting) {
      // Validation simple
      if (!this.selectedMeeting.courseName) {
        this.errorMessage = 'Le nom du cours est requis.';
        return;
      }
      if (!this.selectedMeeting.scheduledAt) {
        this.errorMessage = 'La date planifiée est requise.';
        return;
      }

      this.coursesService.updateMeetingLink(
        this.selectedMeeting.id,
        this.selectedMeeting.courseName,
        this.selectedMeeting.scheduledAt,
        this.selectedMeeting.password || '',
        this.selectedMeeting.active
      ).subscribe({
        next: (updated) => {
          this.meetings = this.meetings.map(meeting =>
            meeting.id === updated.id ? updated : meeting
          );
          this.errorMessage = 'Réunion modifiée avec succès.';
          setTimeout(() => this.errorMessage = '', 3000);
          this.cancelEdit();
        },
        error: (err) => this.errorMessage = 'Erreur lors de la modification : ' + err.message
      });
    }
  }
}