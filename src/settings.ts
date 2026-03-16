import type { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin'

export const settingsSchema: SettingSchemaDesc[] = [
  {
    key: 'apiToken',
    type: 'string',
    title: 'Readwise API Token',
    description:
      'Your Readwise access token. Find it at https://readwise.io/access_token',
    default: '',
  },
  {
    key: 'lastSyncTimestamp',
    type: 'string',
    title: 'Last Sync Timestamp',
    description: 'Internal — managed by the plugin. Do not edit manually.',
    default: '',
  },
]
