import type { ItemDefinition } from '../types';

function buildItems(welcomeId: string): ItemDefinition[] {
  return [
    {
      id: 'news',
      href: '/items/news.xml',
      title: 'Follow news pages',
      usage: 'regular',
      sequenceNumber: 1,
      phase: 'registration',
      author: 'Susan',
    },
    {
      id: welcomeId,
      href: `/items/${welcomeId}.xml`,
      title: 'Welcome',
      usage: 'info',
      sequenceNumber: 2,
      phase: 'feed',
    },
    {
      id: 'tangare',
      href: '/items/tangare.xml',
      title: 'Bird from Brazil',
      usage: 'regular',
      sequenceNumber: 3,
      phase: 'feed',
      author: 'Camil',
    },
    {
      id: 'workflow',
      href: '/items/workflow.xml',
      title: 'Workflow tool',
      usage: 'regular',
      sequenceNumber: 4,
      phase: 'feed',
      author: 'Tom',
    },
    {
      id: 'funny-video',
      href: '/items/funny-video.xml',
      title: 'Funny video poll',
      usage: 'regular',
      sequenceNumber: 5,
      phase: 'feed',
      author: 'Tom',
    },
    {
      id: 'tie',
      href: '/items/tie.xml',
      title: 'Photo story — tie a knot',
      usage: 'regular',
      sequenceNumber: 6,
      phase: 'feed',
      author: 'Susan',
    },
  ];
}

export const ITEMS_BY_ENV = {
  spacebook: buildItems('welcome-spacebook'),
  spacegram: buildItems('welcome-spacegram'),
} as const;

export const TEST_URL_BY_ENV = {
  spacebook: '/packages/spacebook/assessment-test.xml',
  spacegram: '/packages/spacegram/assessment-test.xml',
} as const;

export function testPlayerItems(environment: keyof typeof ITEMS_BY_ENV) {
  return ITEMS_BY_ENV[environment].map((item) => ({
    identifier: item.id,
    title: item.title,
    usage: item.usage,
  }));
}

export const REGISTRATION_STEPS = [
  'Account',
  'Preferences',
  'Profile picture',
  'Groups',
  'Pages',
] as const;

export const FRIENDS = ['Bahia', 'Camil', 'Tom', 'Anne', 'Novan'] as const;
