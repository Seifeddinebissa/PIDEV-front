import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {
  course: any = null;
  photoPreview: string = '';
  errorMessage: string = '';
  selectedPdfUrl: string | null = null;
  @ViewChild('fullscreenContainer') fullscreenContainer!: ElementRef;
  selectedCourseId: number | null = null;
  existingQuizzes: any[] = [];
  isFullScreen: boolean = false;

  constructor(
    private quizService: QuizService,
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const idCours = this.route.snapshot.paramMap.get('id');
    if (idCours) {
      console.log('ID du cours détecté :', idCours);
      this.selectedCourseId = +idCours;
      this.loadCourse(this.selectedCourseId);
      this.loadQuizzes();
    } else {
      this.errorMessage = 'Aucun ID de cours détecté.';
      console.error('ID non trouvé dans l\'URL');
    }
    document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this.onFullScreenChange.bind(this));
  }

  loadCourse(idCours: number): void {
    this.coursesService.getCoursById(idCours).subscribe({
      next: (data) => {
        this.course = data;
        this.photoPreview = this.course.image || '';
      },
      error: (error) => {
        console.error('Erreur lors du chargement du cours:', error);
        this.errorMessage = 'Impossible de charger le cours.';
      }
    });
  }

  openPdf(pdfUrl: string): void {
    this.selectedPdfUrl = pdfUrl;
    console.log('PDF sélectionné :', this.selectedPdfUrl);
  }

  getPdfTitle(pdfUrl: string): string {
    if (!pdfUrl) return 'Untitled PDF';
    const fileName = pdfUrl.split('/').pop();
    const cleanName = fileName?.split('_').slice(1).join('_') || fileName;
    return cleanName?.replace('.pdf', '') || 'Untitled PDF';
  }

  toggleFullScreen(): void {
    const container = this.fullscreenContainer.nativeElement as HTMLElement;
    const isFullScreen = document.fullscreenElement || (document as any).webkitFullscreenElement;
    if (!isFullScreen) {
      const requestFullScreen = container.requestFullscreen || (container as any).webkitRequestFullscreen;
      if (requestFullScreen) {
        requestFullScreen.call(container).then(() => {
          this.isFullScreen = true;
          console.log('Plein écran activé');
        }).catch((err: any) => {
          console.error('Erreur lors de l\'activation du plein écran :', err);
        });
      }
    }
  }

  exitFullScreen(): void {
    const isFullScreen = document.fullscreenElement || (document as any).webkitFullscreenElement;
    if (isFullScreen) {
      const exitFullScreen = document.exitFullscreen || (document as any).webkitExitFullscreen;
      if (exitFullScreen) {
        exitFullScreen.call(document).then(() => {
          this.isFullScreen = false;
          console.log('Sortie du plein écran');
        }).catch((err: any) => {
          console.error('Erreur lors de la sortie du plein écran :', err);
        });
      }
    }
  }

  onFullScreenChange(): void {
    const isFullScreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
    this.isFullScreen = isFullScreen;
    console.log('État plein écran changé :', this.isFullScreen);
  }

  downloadPdf(): void {
    if (this.selectedPdfUrl) {
      // Typage explicite pour garantir que selectedPdfUrl est une string ici
      const pdfUrl: string = this.selectedPdfUrl;
      this.http.get(pdfUrl, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.getPdfTitle(pdfUrl) + '.pdf'; // Pas d'erreur car pdfUrl est string
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log('Téléchargement du PDF réussi :', pdfUrl);
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement du PDF :', error);
        }
      });
    } else {
      console.error('Aucun PDF sélectionné pour le téléchargement');
    }
  }

  loadQuizzes(): void {
    if (this.selectedCourseId) {
      this.quizService.getQuizzesByCourse(this.selectedCourseId).subscribe({
        next: (quizzes) => {
          this.existingQuizzes = quizzes;
          console.log('Quizzes chargés :', this.existingQuizzes);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des quizzes: ' + error.message;
        }
      });
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('fullscreenchange', this.onFullScreenChange.bind(this));
    document.removeEventListener('webkitfullscreenchange', this.onFullScreenChange.bind(this));
  }
}