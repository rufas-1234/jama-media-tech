export const company = {
  name: 'Jama Tech LTD',
  location: 'Rock City, Juba, South Sudan',
  email: 'jamatech.ltd@gmail.com',
  phone: '+211 921 769 369',
  description: 'A South Sudanese social enterprise working across environmental sustainability, digital transformation and essential supply chain logistics.',
  vision: 'To be South Sudan’s leading social enterprise in driving sustainable community development, empowering organizations through cutting-edge technology, eco-friendly resource management, and dependable supply chain logistics.',
  mission: 'To drive sustainable growth and resilience across South Sudan by delivering reliable supply chain solutions, eco-friendly recycling innovations, and robust digital infrastructure—empowering communities, businesses, and development partners to thrive in a connected world.',
};
export const companyDirection = 'Bring practical technology, dependable supply and responsible resource use together to strengthen how organisations and communities operate.';
export const companyOperatingModel = 'We begin with the partner’s operating context, agree a practical scope, coordinate the right capabilities and communicate delivery clearly from start to close-out.';
export const services = [
  {
    slug: 'food-and-nfis', number: '01', short: 'Supply & logistics', title: 'Food & Non-Food Items Supply',
    description: 'Dependable procurement and distribution. Essential supplies, delivered with care.',
    introduction: 'End-to-end procurement and supply chain management for humanitarian response, community development and institutional operations.',
    image: 'photo-1586528116311-ad8dd3c8310d', alt: 'An organised warehouse with storage racks and distribution equipment',
    capabilities: ['Food commodity procurement', 'Grains, pulses and fortified foods', 'Dry food rations and quality testing', 'Hygiene, shelter and dignity kits', 'WASH supplies and household items', 'Warehousing, logistics and distribution'],
    audience: 'Humanitarian organisations, procurement teams, government institutions and private enterprises.',
  },
  {
    slug: 'plastic-recycling', number: '02', short: 'Recycling & circular economy', title: 'Plastic Waste Recycling',
    description: 'Rethinking waste as a resource. Closing the loop for a cleaner environment.',
    introduction: 'Plastic waste processing and resource recovery that support a circular economy and help protect local ecosystems.',
    image: 'photo-1532996122724-e3c354a0b15b', alt: 'Colour-coded containers used for separating recyclable materials',
    capabilities: ['Plastic waste processing', 'Bottle crushing', 'Mechanical processing and compaction', 'Resource recovery', 'Recyclable raw materials', 'Circular economy and environmental conservation'],
    audience: 'Environmental organisations, institutions, local businesses and community partners.',
  },
  {
    slug: 'ict-consultancy', number: '03', short: 'ICT & digital solutions', title: 'ICT Consultancy & Digital Solutions',
    description: 'Practical technology. Smarter workflows. Stronger organisational capability.',
    introduction: 'Strategic advice, technical support and capacity building to help organisations modernise their operations and digital workflows.',
    image: 'photo-1497366811353-6870744d04b2', alt: 'A contemporary workspace with computers and shared working areas',
    capabilities: ['ICT advisory and IT infrastructure', 'Procurement systems and workflow digitalisation', 'Data security and system administration', 'Technical training', 'Digital media production and drone operations', 'Data collection'],
    audience: 'NGOs, educational institutions, government departments and growing businesses.',
  },
  {
    slug: 'internet-and-web-development', number: '04', short: 'Connectivity & web', title: 'Internet Infrastructure & Web Development',
    description: 'From reliable networks to thoughtful websites. Connecting you to what’s next.',
    introduction: 'Physical networks and purposeful digital experiences that help organisations work, communicate and grow in a connected world.',
    image: 'photo-1558494949-ef010cbdcc31', alt: 'Network infrastructure inside a server room',
    capabilities: ['LAN/WAN installation', 'Satellite connectivity', 'Internet infrastructure and network maintenance', 'Website development', 'Web portals and digital assets', 'Brand asset creation'],
    audience: 'Offices, project sites, institutions and businesses building their digital presence.',
  },
];
export const values = [
  ['Integrity & Transparency', 'Clear accountability, ethical standards and honest communication across every relationship.'],
  ['Innovation & Excellence', 'Practical technology and considered approaches to meaningful operational challenges.'],
  ['Environmental Stewardship', 'Responsible resource management that protects ecosystems for future generations.'],
  ['Community Empowerment', 'Building local skills, creating opportunities and supporting community development.'],
  ['Reliability & Resilience', 'A commitment to consistent service in complex operating environments.'],
];
export const leadershipRoles = [
  'Board of Directors', 'Managing Director / CEO', 'Director of ICT & Digital Solutions',
  'Director of Operations & Supply Chain Management', 'Director of Finance & Administration',
  'Lead Systems & Infrastructure Engineer', 'Software & Web Development Lead',
  'Digital Media & Drone Operations Lead', 'Supply Chain & Procurement Manager',
  'Recycling & Circular Economy Manager', 'Logistics & Fleet Manager', 'PR & Marketing Executive',
];
export const projectCategories = ['ICT Infrastructure', 'Web Development', 'Supply Chain', 'Food & NFIs', 'Recycling', 'Digital Media', 'Community Initiatives'];
export const enquiryCategories = ['Food and NFIs', 'Plastic Recycling', 'ICT Consultancy', 'Internet Infrastructure', 'Web Development', 'Partnership', 'Other'];
export const photo = (id: string, width = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
export const imageSource = (value: string, width = 1400) => value.startsWith('http') || value.startsWith('/') ? value : photo(value, width);