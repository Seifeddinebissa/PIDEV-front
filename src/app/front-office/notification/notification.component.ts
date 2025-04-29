import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../back-office/services/notification.service';
import { Notification } from '../../back-office/models/Notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  error = false;
  
  constructor(private notificationService: NotificationService) { }
  
  ngOnInit(): void { this.loadNotifications(); }
  
  loadNotifications(): void {
    this.loading = true;
    this.error = false;
    
    // For demonstration purposes, showing all notifications (userId = 0)
    // In a real app, you would filter by the logged-in user's ID
    this.notificationService.getAllNotifications().subscribe({
      next: (data) => {
        this.notifications = data;  
        // Sort notifications: unread first, then by date (newest first)
        this.notifications.sort((a, b) => {
          if (a.status !== b.status) {
            return a.status ? 1 : -1; // false (unread) comes first
 } 
          // Then sort by date (newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  markAsRead(notification: Notification): void {
    notification.status = true;
    this.notificationService.updateNotification(notification.idNotification!, notification).subscribe({
      next: () => {
        console.log('Notification marked as read');
      },
      error: (err) => {
        console.error('Error marking notification as read:', err);
        notification.status = false; // Revert UI state on error
      }
    });
  } 
  deleteNotification(idNotification: number): void {
    this.notificationService.deleteNotification(idNotification).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.idNotification !== idNotification);
      },
      error: (err) => {
        console.error('Error deleting notification:', err);
      }
    });
  }
} 