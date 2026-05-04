export default {
  name: 'portfolio',
  title: 'Portfolio Item',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'category', title: 'Category', type: 'string', options: {
        list: ["AI Photography", "Lifestyle", "E-commerce", "Branding", "Video"]
    }},
    { name: 'clientType', title: 'Client Type', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'beforeImage', title: 'Before Image', type: 'image' },
    { name: 'afterImage', title: 'After Image', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false },
  ]
}
