import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { authGuard } from './guards/auth.guard';
import { GoalsComponent } from './pages/goals/goals.component';
import { WorkoutsComponent } from './pages/workouts/workouts.component';
import { MealsComponent } from './pages/meals/meals.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { SchedulesComponent } from './pages/schedules/schedules.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: UserProfileComponent },
  {
  path: 'profile', component: UserProfileComponent,
  canActivate: [authGuard]
},
{ path: 'goals', component: GoalsComponent, canActivate: [authGuard] },
{
  path: 'workouts',
  component: WorkoutsComponent,
  canActivate: [authGuard]
},
{
  path: 'meals',
  component: MealsComponent,
  canActivate: [authGuard]
},
{
  path: 'sessions',
  component: SessionsComponent,
  canActivate: [authGuard]
},
{
  path: 'schedules',
  component: SchedulesComponent,
  canActivate: [authGuard]
},
{
  path: 'analytics',
  component: AnalyticsComponent,
  canActivate: [authGuard]
}

];
