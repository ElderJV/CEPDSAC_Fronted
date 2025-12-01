import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Users, BookOpen, DollarSign, Activity, TrendingUp, Calendar } from 'lucide-angular';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);

  @ViewChild('lineChartCanvas', { static: false }) lineChartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChartCanvas', { static: false }) doughnutChartCanvas?: ElementRef<HTMLCanvasElement>;

  private lineChart?: Chart;
  private doughnutChart?: Chart;

  stats = signal<DashboardStats | null>(null);
  isLoading = signal(true);
  today = new Date();

  // Icons
  readonly UsersIcon = Users;
  readonly BookIcon = BookOpen;
  readonly DollarIcon = DollarSign;
  readonly ActivityIcon = Activity;
  readonly TrendingIcon = TrendingUp;
  readonly CalendarIcon = Calendar;

  // Chart Config
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos Mensuales (S/.)',
        fill: true,
        tension: 0.4,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        pointBackgroundColor: '#0d6efd',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0d6efd'
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        displayColors: false,
        callbacks: {
          label: (context) => {
            if (context.parsed.y !== null) {
              return `S/. ${context.parsed.y.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          callback: (value) => `S/. ${value}`
        }
      }
    }
  };

  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Pendiente', 'En Proceso', 'Pagado', 'Cancelado'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#ffc107', '#0dcaf0', '#198754', '#dc3545'],
        hoverBackgroundColor: ['#ffcd39', '#3dd5f3', '#20c997', '#e35d6a'],
        hoverOffset: 4
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    cutout: '75%'
  };

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    // Charts will be initialized after data loads
  }

  initCharts() {
    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      console.log('Initializing charts...');
      console.log('Line canvas:', this.lineChartCanvas);
      console.log('Doughnut canvas:', this.doughnutChartCanvas);
      
      // Initialize Line Chart
      if (this.lineChartCanvas && !this.lineChart) {
        console.log('Creating line chart with data:', this.lineChartData);
        this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
          type: 'line',
          data: this.lineChartData,
          options: this.lineChartOptions
        });
        console.log('Line chart created:', this.lineChart);
      }

      // Initialize Doughnut Chart
      if (this.doughnutChartCanvas && !this.doughnutChart) {
        console.log('Creating doughnut chart with data:', this.doughnutChartData);
        this.doughnutChart = new Chart(this.doughnutChartCanvas.nativeElement, {
          type: 'doughnut',
          data: this.doughnutChartData,
          options: this.doughnutChartOptions
        });
        console.log('Doughnut chart created:', this.doughnutChart);
      }
    }, 100);
  }

  loadStats() {
    this.isLoading.set(true);
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.isLoading.set(false);
        // Initialize charts after data is loaded and view is ready
        this.updateCharts(data);
      },
      error: (err) => {
        console.error('Error loading dashboard stats', err);
        this.isLoading.set(false);
      }
    });
  }

  updateCharts(data: DashboardStats) {
    // Update data first
    if (data.ingresosPorMes && data.ingresosPorMes.length > 0) {
      this.lineChartData.labels = data.ingresosPorMes.map(d => this.formatMonth(d.mes));
      this.lineChartData.datasets[0].data = data.ingresosPorMes.map(d => d.total);
    }

    if (data.matriculasPorEstado) {
      this.doughnutChartData.datasets[0].data = [
        data.matriculasPorEstado['PENDIENTE'] || 0,
        data.matriculasPorEstado['EN_PROCESO'] || 0,
        data.matriculasPorEstado['PAGADO'] || 0,
        data.matriculasPorEstado['CANCELADO'] || 0
      ];
    }

    // Initialize or update charts
    if (this.lineChart) {
      this.lineChart.update();
    } else {
      this.initCharts();
    }

    if (this.doughnutChart && this.lineChart) {
      this.doughnutChart.update();
    }
  }

  formatMonth(yyyyMm: string): string {
    const [year, month] = yyyyMm.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  }

  ngOnDestroy() {
    // Clean up charts
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }
  }
}
