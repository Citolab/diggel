export type EnvironmentId = 'spacebook' | 'spacegram';

export interface EnvironmentConfig {
  id: EnvironmentId;
  label: string;
  /** CSS class / data-environment value */
  theme: EnvironmentId;
  primary: string;
  primaryLight: string;
  bodyBg: string;
  navbarClass: string;
  layout: 'facebook' | 'instagram';
  susanDisplayName: string;
  susanProfilePic: string;
  profileCover?: string;
  icon: string;
  splashEn: string;
  logoPicker: string;
  assetBase: string;
}

export const ENVIRONMENTS: Record<EnvironmentId, EnvironmentConfig> = {
  spacebook: {
    id: 'spacebook',
    label: 'SPACEBOOK',
    theme: 'spacebook',
    primary: '#428beb',
    primaryLight: '#5a9bef',
    bodyBg: '#f3f3f3',
    navbarClass: 'env-navbar--light',
    layout: 'facebook',
    susanDisplayName: 'Susan',
    susanProfilePic: '/assets/spacebook/profile-pics/naam.png',
    profileCover: '/assets/spacebook/spacebook/background-profile.jpg',
    icon: '/assets/spacebook/identity/icon-spacebook-rocket.svg',
    splashEn: '/assets/spacebook/identity/splashscreen-spacebook-en.svg',
    logoPicker: '/assets/diggel/omgevingen/logo-spacebook.svg',
    assetBase: '/assets/spacebook',
  },
  spacegram: {
    id: 'spacegram',
    label: 'SPACEGRAM',
    theme: 'spacegram',
    primary: '#d65db1',
    primaryLight: '#e87fc4',
    bodyBg: '#f8f9fa',
    navbarClass: 'env-navbar--light',
    layout: 'instagram',
    susanDisplayName: 'Susie Frusie',
    susanProfilePic: '/assets/spacegram/profile-pics/profile-empty.png',
    icon: '/assets/spacegram/identity/icon-spacegram-satellite.svg',
    splashEn: '/assets/spacegram/identity/splashscreen-spacegram-en.svg',
    logoPicker: '/assets/diggel/omgevingen/logo-spacegram.svg',
    assetBase: '/assets/spacegram',
  },
};

/**
 * The active environment config, resolved from `<html data-environment>` (set by
 * EnvironmentProvider). Lets framework-agnostic web components read env-specific
 * data — e.g. the responder persona — without a React context.
 */
export function currentEnvironmentConfig(): EnvironmentConfig {
  const id =
    typeof document !== 'undefined'
      ? (document.documentElement.dataset.environment as
          | EnvironmentId
          | undefined)
      : undefined;
  return (id && ENVIRONMENTS[id]) || ENVIRONMENTS.spacebook;
}

export function assetUrl(env: EnvironmentConfig, path: string): string {
  const clean = path.replace(/^\//, '').replace(/^assets\//, '');
  return `${env.assetBase}/${clean}`;
}

export function friendAvatarUrl(env: EnvironmentConfig, name: string): string {
  return `${env.assetBase}/profile-pics-feed/${name}.png`;
}
