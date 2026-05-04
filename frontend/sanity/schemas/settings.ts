export default {
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'brandName', title: 'Brand Name', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'contactEmail', title: 'Contact Email', type: 'string' },
    { name: 'contactPhone', title: 'Contact Phone/WhatsApp', type: 'string' },
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'eyebrow', title: 'Eyebrow Text', type: 'string' },
        { name: 'headline', title: 'Headline', type: 'string' },
        { name: 'subheadline', title: 'Subheadline', type: 'text' },
        { name: 'primaryCta', title: 'Primary CTA', type: 'string' },
        { name: 'secondaryCta', title: 'Secondary CTA', type: 'string' },
        { name: 'heroImage', title: 'Hero Image', type: 'image' },
      ]
    }
  ]
}
