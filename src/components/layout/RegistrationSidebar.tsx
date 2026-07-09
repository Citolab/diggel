import { REGISTRATION_STEPS } from '../../data/items';

interface RegistrationSidebarProps {
  activeStep?: number;
}

export function RegistrationSidebar({ activeStep = 4 }: RegistrationSidebarProps) {
  return (
    <aside className="registration-sidebar">
      {REGISTRATION_STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === activeStep;
        return (
          <div
            key={step}
            className={`registration-sidebar__step ${isActive ? 'registration-sidebar__step--active' : ''}`}
          >
            <span
              className={`registration-sidebar__badge ${isActive ? 'registration-sidebar__badge--active' : ''}`}
            >
              {stepNumber}
            </span>
            {step}
          </div>
        );
      })}
    </aside>
  );
}
