export default {
  name: 'team',
  title: 'Team Member',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'socialLinks', title: 'Social Links', type: 'array', of: [
      {
        type: 'object',
        fields: [
          { name: 'label', title: 'Platform (e.g. LinkedIn)', type: 'string' },
          { name: 'url', title: 'URL', type: 'url' }
        ]
      }
    ]}
  ]
}
