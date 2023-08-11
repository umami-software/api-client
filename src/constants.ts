export const USER_FILTER_TYPES = {
  all: 'All',
  username: 'Username',
} as const;

export const WEBSITE_FILTER_TYPES = { all: 'All', name: 'Name', domain: 'Domain' } as const;

export const TEAM_FILTER_TYPES = { all: 'All', name: 'Name', 'user:username': 'Owner' } as const;

export const REPORT_FILTER_TYPES = {
  all: 'All',
  name: 'Name',
  description: 'Description',
  type: 'Type',
  'user:username': 'Username',
  'website:name': 'Website Name',
  'website:domain': 'Website Domain',
} as const;
