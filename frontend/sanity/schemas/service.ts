export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'sampleImage', title: 'Sample Image', type: 'image', options: { hotspot: true } },
    { name: 'deliverables', title: 'Deliverables', type: 'array', of: [{ type: 'string' }] },
  ]
}
