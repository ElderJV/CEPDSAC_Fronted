import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  MetricsService,
  MetricsResponse,
} from '../../../core/services/metrics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../admin/admin-styles.css', './dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private metricsService = inject(MetricsService);
  metrics: MetricsResponse | null = null;
  loading = false;
  error: string | null = null;
  private sub: Subscription | null = null;

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.loading = true;
    this.error = null;
    this.sub = this.metricsService.getMetrics().subscribe({
      next: (m) => {
        this.metrics = m;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar métricas';
        console.error('Metrics load error', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
