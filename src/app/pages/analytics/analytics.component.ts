import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsSummary } from '../../services/analytics.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  @ViewChild('countsBar') countsBar!: ElementRef<HTMLCanvasElement>;
  @ViewChild('caloriesPie') caloriesPie!: ElementRef<HTMLCanvasElement>;

  loading = false;
  message = '';
  summary?: AnalyticsSummary;

  private barChart?: Chart;
  private pieChart?: Chart;

  // PRODUCTION – always use logged-in user's ID
  private userId = Number(localStorage.getItem('userId'));

  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
    // If no userId → session expired
    if (!this.userId) {
      this.message = "Session expired. Please login again.";
      return;
    }

    this.fetch();
  }

  ngOnDestroy(): void {
    this.barChart?.destroy();
    this.pieChart?.destroy();
  }

  fetch() {
    this.loading = true;
    this.analytics.getSummary(this.userId).subscribe({
      next: (res) => {
        this.summary = res;
        this.loading = false;
        this.renderCharts();
      },
      error: () => {
        this.message = 'Failed to load analytics';
        this.loading = false;
      }
    });
  }

  private renderCharts() {
    if (!this.summary) return;

    // Destroy old charts
    this.barChart?.destroy();
    this.pieChart?.destroy();

    // Bar chart
    this.barChart = new Chart(this.countsBar.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: ['Workouts', 'Sessions', 'Meals'],
        datasets: [{
          label: 'Count',
          data: [
            this.summary.workoutsCount,
            this.summary.sessionsCount,
            this.summary.mealsCount
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: `Activity Counts (${this.summary.rangeStart} → ${this.summary.rangeEnd})`
          }
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });

    // Doughnut chart
    this.pieChart = new Chart(this.caloriesPie.nativeElement.getContext('2d')!, {
      type: 'doughnut',
      data: {
        labels: ['Workout Calories Burned', 'Meal Calories Consumed'],
        datasets: [{
          label: 'Calories',
          data: [
            this.summary.workoutCalories,
            this.summary.mealsCalories
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Calories Balance' }
        }
      }
    });
  }
}
