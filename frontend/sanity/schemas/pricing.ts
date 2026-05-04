export default {
  name: 'pricing',
  title: 'Pricing Plan',
  type: 'document',
  fields: [
    { name: 'name', title: 'Plan Name', type: 'string' },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'currency', title: 'Currency', type: 'string', initialValue: 'USD' },
    { name: 'billingNote', title: 'Billing Note (e.g. / project)', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] },
    { name: 'popular', title: 'Most Popular', type: 'boolean', initialValue: false },
    { name: 'ctaLabel', title: 'CTA Button Label', type: 'string', initialValue: 'Book Now' },
  ]
}
