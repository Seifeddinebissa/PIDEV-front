import { Component ,OnInit ,ViewChild, ElementRef} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  @ViewChild('pdfIframe') pdfIframe!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private service: CoursesService
  ) { }
  ngOnInit(): void {
    const idCours = this.route.snapshot.paramMap.get('id');
    if (idCours) {
      console.log('ID du cours détecté :', idCours);
      this.loadCourse(+idCours);
    } else {
      this.errorMessage = 'Aucun ID de cours détecté.';
      console.error('ID non trouvé dans l\'URL');
    }
  }


  loadCourse(idCours: number): void {
    this.service.getCoursById(idCours).subscribe({
      next: (data) => {
        this.course= data;
        console.log('URL de l\'image récupérée depuis le backend :', this.course.image);
        this.photoPreview = this.course.image || '';
        console.log('PhotoPreview définie :', this.photoPreview);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du cours:', error);
        this.errorMessage = 'Impossible de charger le cours.';
      }
    });

    }


    openPdf(pdfUrl: string): void {
      this.selectedPdfUrl = pdfUrl; // Définit le PDF à afficher
      console.log('PDF sélectionné :', this.selectedPdfUrl);
    }

    getPdfTitle(pdfUrl: string): string {
      if (!pdfUrl) return 'Untitled PDF';
      const fileName = pdfUrl.split('/').pop(); // Extrait le nom du fichier (ex. "1740515233099_file.pdf")
      const cleanName = fileName?.split('_').slice(1).join('_') || fileName; // Supprime le timestamp
      return cleanName?.replace('.pdf', '') || 'Untitled PDF'; // Supprime l'extension
    }


    toggleFullScreen(): void {
      const iframe = this.pdfIframe.nativeElement as HTMLIFrameElement;
      if (!document.fullscreenElement) {
        // Activer le plein écran
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        }
      } else {
        // Quitter le plein écran
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
}
