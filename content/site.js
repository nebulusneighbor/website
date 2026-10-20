// Site-wide settings, bio, and social links.
// Edit this file to update your name, tagline, intro, or profile links.

export default {
  name: 'Torin Hopkins',
  honorific: 'Torin Hopkins, PhD',
  // Canonical URL used for SEO (sitemap, canonical tags, Open Graph).
  // Change this if you host somewhere other than torinhopkins.com.
  url: 'https://www.torinhopkins.com',
  lang: 'en',
  locale: 'en_US',

  title: 'Torin Hopkins, PhD | Research in Music, Computing, and Neuroscience',
  description:
    'Torin Hopkins, PhD is an interdisciplinary researcher, educator, and performer working at the intersection of AI, human-computer interaction, extended reality, neuroscience, psychology, and music.',
  keywords: [
    'Torin Hopkins', 'music technology', 'AI music', 'human-computer interaction', 'HCI',
    'extended reality', 'XR', 'augmented reality', 'brain-computer interfaces', 'fNIRS',
    'neuroscience', 'cognitive science', 'networked music performance', 'music improvisation',
    'AI-driven virtual musicians', 'music therapy', 'NIME',
  ],

  tagline: 'Research in Music, Computing, and Neuroscience',
  credentialLine: 'Triple Ph.D. · University of Colorado Boulder',
  fieldsLine: ['Neuroscience', 'Cognitive Science', 'Creative Technology & Design'],
  intro:
    "I am an interdisciplinary researcher, educator, and performer at the intersection of AI, HCI, XR, Neuroscience, Psychology, and Music. I design technology that makes musical experiences more participatory and inclusive, from brain-computer interfaces and AI-driven virtual musicians to collaborative systems for real-time performance. I've also taught thousands of students, ages 3 to 96.",

  interests: [
    'Artificial Intelligence', 'Human-Computer Interaction', 'Extended Reality', 'Brain-Computer Interfaces',
    'Neuroscience', 'Music Cognition', 'Networked Music', 'Music & Health', 'Performance',
  ],

  // Other ways people search for you; helps Google tie them to this site.
  alternateNames: ['Dr. Torin Hopkins', 'Torin Hopkins PhD'],

  // Google Analytics 4 measurement ID (set to '' to turn analytics off)
  googleAnalytics: 'G-J2S29LDSKR',

  // Search-engine ownership verification (the content="..." value from each tool).
  // Google Search Console: Add property → URL prefix → HTML tag.
  // Bing Webmaster Tools: Add site → HTML Meta Tag (or import from Search Console).
  googleSiteVerification: '',
  bingSiteVerification: '',

  // Contact email, reversed then base64-encoded so it isn't readable in this public repo.
  // To change it: node -e "console.log(btoa([...'you@example.com'].reverse().join('')))"
  emailEncoded: 'bW9jLmxpYW1nQHNuaWtwb0huaXJvVA==',
  cvPdf: '/assets/papers/Torin_Hopkins_CV.pdf',
  photo: '/assets/img/profile.webp',
  ogImage: '/assets/img/og-card.jpg',

  jobMarket: 'I am currently applying to academic positions. Please reach out if you have questions or would like to collaborate!',

  // Profiles shown as icons and used for SEO (schema.org "sameAs").
  // Add ResearchGate here when you have the URL.
  social: [
    { id: 'github', label: 'GitHub', url: 'https://github.com/nebulusneighbor' },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/torin-hopkins-35259578/' },
    { id: 'orcid', label: 'ORCID', url: 'https://orcid.org/0000-0001-7359-2906' },
    { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/channel/UCfnYlpToe1CZ81qKk9voz6Q' },
    { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/torin_hopkins/' },
    { id: 'x', label: 'X (Twitter)', url: 'https://twitter.com/TorinHopkins' },
    { id: 'scholar', label: 'Google Scholar', url: 'https://scholar.google.com/citations?user=CBqY5KQAAAAJ' },
  ],

  affiliations: [
    { name: 'University of Colorado Boulder', url: 'https://www.colorado.edu' },
    { name: 'National University of Singapore', url: 'https://www.nus.edu.sg' },
  ],
};
