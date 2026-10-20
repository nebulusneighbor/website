// Long-form project pages, rendered at /research/<slug>/.
// Keyed by the `slug` of each project in projects.js.
// Sources: the papers in src/assets/papers, the dissertation ("Computer-Supported Music
// Improvisation", 2024), the creative portfolio, and the GitHub repositories.
//
// Fields (all optional)
//   period, context   Shown in the facts panel
//   summary           Lead paragraph (omit if it would only repeat the card description)
//   sections          [{ heading, paragraphs: [], list: [] }]
//   findings          Bullet list of key results
//   tools             Technologies used
//   video             { youtube: '<id>' } or { vimeo: '<id>' }, plus title
//   gallery           [{ file: 'projects/<name>.webp', caption }]
//   code              [{ label, url }]
//   pubs              Extra publication ids (the card's `pub` is always included)
//   related           Slugs of related projects

const GH = 'https://github.com/nebulusneighbor';

export default {
  // ===================================================================== 2025–2026
  crowdforge: {
    period: '2025–2026',
    context: 'MUSMET project (EU EIC Pathfinder), with the University of Trento',
    summary:
      'CrowdForge is a live set for guitarist, DJ, and audience. From their phones, audience members vote on tempo, genre, the guitarist’s tone, and the virtual band. Their votes steer a generative AI arranger and a mixed reality stage in real time, so the performers cede creative control and turn audience-induced chaos back into music.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'Traditional live music is largely one-directional, with minimal interaction between audience and performers. Technology-mediated audience participation (TMAP) lets audiences influence a performance, but balancing interaction with meaningful agency is hard. AI-generated music and mixed reality (MR) open new audio and visual ways to participate, yet little is known about how these modalities shape the audience’s sense of agency, collaboration, and engagement, or how they complement one another.',
        ],
      },
      {
        heading: 'The performance system',
        paragraphs: [
          'Audience selections are aggregated into one collective configuration covering musical character, tempo, instrumentation, dancer movement, virtual performers, and stage environment. The audio parameters drive a fine-tuned language model that generates multitrack MIDI (using the REMI-z tokenization from our NeurIPS work), played live alongside a guitarist and DJ. The visual selections configure an MR stage populated by virtual musicians and dancers, viewed through Meta Quest 3 headsets and on projection.',
        ],
      },
      {
        heading: 'The concert study',
        paragraphs: [
          'We ran a mixed-methods concert study comparing three interaction conditions: audio only, visual only, and combined audio-visual control.',
        ],
      },
    ],
    findings: [
      'Observability, not the number of controls, is the primary driver of audience agency.',
      'Audio control raised the audience’s sense of agency with large effects. Visual interaction gave easily observable feedback, while AI audio parameters offered macro-structural control over the music.',
      'Audiences used the generative AI controls to test musical boundaries, creating a productive adversarial tension between crowd and musicians.',
      'That tension pushed creative limits, deepened engagement, and produced moments of musical coherence when the performers resolved audience-induced challenges.',
    ],
    tools: ['Fine-tuned language model (REMI-z multitrack MIDI)', 'Ableton Live', 'Python / OSC', 'Unity', 'Meta Quest 3', 'Web-based voting'],
    video: { youtube: 'nbGJMI_i9CU', title: 'CrowdForge performance video' },
    gallery: [
      { file: 'projects/crowdforge-space.webp', caption: 'The CrowdForge performance space, with the guitarist, DJ, and projected mixed reality stage.' },
      { file: 'projects/crowdforge-audience.webp', caption: 'Audience members voting from their phones during the concert.' },
      { file: 'projects/crowdforge-ui.webp', caption: '(A) The audience voting interface and (B) the projected aggregator showing the crowd’s collective choices.' },
      { file: 'projects/crowdforge-stage.webp', caption: 'The mixed reality stage with virtual musicians and dancers configured by the audience.' },
    ],
    code: [{ label: 'AIMAP (AI-Mediated Audience Participation)', url: `${GH}/AIMAP` }],
    related: ['automatic-arrangement', 'mr-daw', 'rhythmic-conversations', 'stringesthesia'],
  },

  'embodied-symbol-systems': {
    context: 'NSF DRK-12–funded study with Lei Yuan',
    summary:
      'How do the visual features of a notation shape the loop between seeing a symbol, perceiving what it means, and acting on an instrument? This study tests how color and symbol-to-instrument mappings affect how complete beginners learn to play from notation.',
    sections: [
      {
        heading: 'The question',
        paragraphs: [
          'Traditional Western notation has remained largely unchanged for centuries, yet there is little empirical evidence about how well it supports learning compared with alternatives. Learning an instrument is a dual task: understanding the symbol and translating it into a motor action. Embodied Symbol Systems examines how visual features in notation, such as color and matching cues on the instrument, shape that symbol-perception-action loop.',
        ],
      },
      {
        heading: 'The study',
        paragraphs: [
          'Grown out of Jam Tabs and the colored-notation experiments in my dissertation, this NSF-funded study with Lei Yuan had ninety adults with no piano experience learn to play from notation under different visual conditions. The paper is currently under review.',
        ],
      },
    ],
    related: ['learning-to-read-music', 'jam-tabs', 'notation-plugins'],
  },

  'stroke-songwriting': {
    period: '2024–2026',
    context: 'National University of Singapore',
    summary:
      'Music therapy can support recovery after stroke. This project co-designs AI-assisted songwriting technologies with multiple stakeholders in stroke care, so that the tools fit real rehabilitation practice.',
    sections: [
      {
        heading: 'Approach',
        paragraphs: [
          'As a postdoctoral fellow at the National University of Singapore, I worked on AI and music in music therapy. This line of work begins with qualitative research: interviewing stakeholders about how music therapy is used in stroke recovery, what barriers they face, and where technology could help. These findings then inform the design of AI-assisted songwriting tools for rehabilitation.',
          'A qualitative study of stakeholder views is under review, and a paper on AI-enabled music therapy for stroke rehabilitation is in preparation.',
        ],
      },
    ],
    pubs: ['ai-music-therapy-stroke'],
    related: ['livepoem', 'automatic-arrangement'],
  },

  'automatic-arrangement': {
    period: '2024–2025',
    context: 'Sound and Music Computing Lab, National University of Singapore',
    summary:
      'Music arrangement adapts a piece for a new set of instruments, such as rewriting it for a band, reducing it for solo piano, or adding a drum part. We built a single framework that lets one pre-trained symbolic music model handle all of these scenarios, outperforming task-specific state-of-the-art models.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Arrangement takes many forms: reinterpretation for different instruments, simplification for solo performance, and additive generation of new tracks. They share a common structure, generating new tracks conditioned on existing ones under content and instrument constraints. But prior work treated each task separately, with specialized architectures that lack cross-task generality and can’t draw on the musical knowledge in large pre-trained symbolic models.',
        ],
      },
      {
        heading: 'Our approach',
        paragraphs: [
          'At the core is a segment-level reconstruction objective over token-level disentangled content and style. This allows flexible any-to-any instrumentation transformations at inference time, without parallel training data, so a single generative model adapts to each task through lightweight fine-tuning.',
          'To support track-wise modeling we introduced REMI-z, a structured tokenization scheme for multitrack symbolic music. It produces shorter, lower-complexity sequences, enables instrument-level control, and reduces note-level perplexity in unconditional generation as well.',
        ],
      },
    ],
    findings: [
      'Outperforms task-specific state-of-the-art models on band arrangement, piano reduction, and drum arrangement, in both objective metrics and perceptual evaluations.',
      'Achieves this with a small model and modest-scale pre-training.',
      'REMI-z later powered the generative arranger in the CrowdForge performance.',
    ],
    related: ['crowdforge', 'livepoem'],
  },

  'mr-daw': {
    period: '2024–2025',
    context: 'MUSMET project (EU EIC Pathfinder), with the University of Trento',
    summary:
      'MR-DAW is a shared recording studio in mixed reality. Musicians in different places control one digital audio workstation (DAW) while moving freely with their own instruments, looping together through physical foot pedals instead of a desk and a mouse.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'DAWs are central to modern music production, but they tether musicians to a desk and get in the way of natural interaction with their instrument. Remote collaboration is also still hard: existing tools are hampered by network latency and asynchronous file sharing. We asked whether mixed reality could remove these barriers and support real-time, remote musical collaboration.',
        ],
      },
      {
        heading: 'The design probe',
        paragraphs: [
          'MR-DAW lets multiple, geographically dispersed musicians control a single shared DAW instance. Each player wears a Meta Quest 3 headset showing a spatial panel of eight loop tracks (red for recording, green for playback, blue for selection), session controls that mirror the foot pedal, and a debug window. A Python server controls Ableton Live, and each remote musician uses a physical foot pedal for hands-free collaborative looping.',
          'We used qualitative and speculative design methods. Twenty musicians from Taiwan and the United States, working in 10 pairs, described how they use DAWs today in semi-structured interviews, used the system together, and imagined the collaborative studios they want next.',
        ],
      },
    ],
    findings: [
      'Mixed reality affords unencumbered musical interaction: musicians stayed with their instruments rather than at a computer.',
      'Familiar, hands-free foot-pedal looping merged naturally with a shared virtual session.',
      'The study offers a speculative outlook on remote, collaborative DAWs in the Musical Metaverse.',
    ],
    tools: ['Meta Quest 3', 'Unity', 'Ableton Live 12 with Python control', 'Max', 'Arduino foot pedals', 'OSC'],
    gallery: [
      { file: 'projects/mr-daw-players.webp', caption: '(A) A violinist recording with a foot pedal; (B) the spatial track panel overlaid on a piano; (C) a second player at a remote keyboard.' },
      { file: 'projects/mr-daw-setup.webp', caption: 'Each musician’s setup: headset, microphone, foot pedal, audio interface, and the Python/Ableton server.' },
      { file: 'projects/mr-daw-system.webp', caption: 'Real-time system architecture linking two Quest 3 players to a single Ableton Live session.' },
    ],
    related: ['crowdforge', 'xr-jam', 'ar-drum-circle'],
  },

  livepoem: {
    period: '2024–2025',
    context: 'National University of Singapore; funded by the Singapore Ministry of Education',
    summary:
      'LivePoem generates musical storyboards (illustrated storyboards with AI-composed background music) to help learners understand classical Chinese poetry. In a study with 25 learners, the storyboards kept the learning outcomes of textbooks while making learning more engaging and enjoyable.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'Textbook reading dominates classical poetry education in Chinese-speaking communities, but extensive text-based learning can lead to boredom and disengagement. Research in the learning sciences suggests that audiovisual media, such as music, pictures, and video, can support language skills, comprehension, and imagery.',
        ],
      },
      {
        heading: 'The system',
        paragraphs: [
          'LivePoem uses a pretrained diffusion model to generate storyboard images and a Transformer-based, prosody-aware poem-to-melody generator to compose the music. Both were validated with standard objective metrics.',
          'In a within-subjects study, 25 non-native Chinese learners compared textbook reading with musical storyboards. We measured learning with standardized reading comprehension tests and measured experience with the Self-Assessment Manikin and a thematic analysis of open-ended feedback.',
        ],
      },
    ],
    findings: [
      'Musical storyboards retained the learning outcomes of textbooks.',
      'Learners found the storyboards significantly more pleasant and engaging.',
      'We recommend combining traditional textbooks with multimedia materials in Chinese poetry teaching.',
    ],
    related: ['automatic-arrangement', 'stroke-songwriting'],
  },

  // ===================================================================== Music cognition & notation
  'learning-to-read-music': {
    context: 'Dissertation research, CU Boulder',
    summary:
      'Traditional music notation is the backbone of Western music education, yet its effectiveness has rarely been tested empirically. Using psychological methods and eye tracking, I investigated how popular learning aids, colored notation and stickers on piano keys, affect how beginners learn to play.',
    sections: [
      {
        heading: 'Background',
        paragraphs: [
          'Learning an instrument is a dual cognitive task: understanding what a symbol means and translating it into a motor action. Color in notation and stickers on keys are widely used in beginner method books, but their effects on learning have rarely been measured. Drawing on theories of procedural learning, structural mapping, statistical learning, and guided visual search, I hypothesized that color would reduce the load of recognizing notes and that matching stickers would strengthen the mapping from notation to keys.',
        ],
      },
      {
        heading: 'The experiment',
        paragraphs: [
          'In a between-subjects 2×2 factorial design (color vs. black-and-white notation, with vs. without key stickers), adults with no musical training played 80 seven-note sequences on a piano keyboard. The sequences were drawn at controlled levels of difficulty using transition entropy, a measure of how predictable each note-to-note step is. We recorded accuracy and trial time in PsychoPy, and used Pupil Labs Invisible mobile eye tracking to count how often participants looked at their hands.',
        ],
      },
    ],
    findings: [
      'In the first 85 participants, colored notation sped up trials considerably (≈10 s vs. ≈14 s per sequence).',
      'Color combined with matching colored stickers produced the highest accuracy (94%) and the fastest trials (≈7.8 s).',
      'Stickers paired with traditional notation lowered accuracy. Reinforcing a poor representation with symbol mapping can make performance worse.',
      'Visual aids work best as a coordinated system, not as isolated additions.',
    ],
    tools: ['PsychoPy', 'Pupil Labs Invisible eye tracker', 'MIDI keyboard', 'Python', 'Datavyu'],
    gallery: [
      { file: 'projects/reading-music-task.webp', caption: 'The task: colored notation on screen and a MIDI keyboard with matching colors.' },
      { file: 'projects/reading-music-conditions.webp', caption: 'The 2×2 design: color vs. no color notation, with and without key stickers.' },
      { file: 'projects/reading-music-melody.webp', caption: 'An example trial containing all seven colors.' },
      { file: 'projects/reading-music-results.webp', caption: 'Average trial time by condition. All color conditions were significantly faster.' },
    ],
    code: [{ label: 'Color_Music_Exp (PsychoPy experiment)', url: `${GH}/Color_Music_Exp` }],
    pubs: ['dissertation'],
    related: ['embodied-symbol-systems', 'jam-tabs', 'notation-plugins'],
  },

  'jam-tabs': {
    period: '2020–2026',
    context: 'CU Boulder; later extended in an NSF DRK-12 study',
    summary:
      'Jam Tabs is a color-based notation for novice improvisers. LED cubes show the chord progression in color, matched to colored bars on the piano keyboard, so each symbol maps directly onto an action and beginners can join a jam session.',
    sections: [
      {
        heading: 'Why improvisation needs a new notation',
        paragraphs: [
          'Improvising musicians usually share a lead sheet, a compact chart of the chord progression. To use one, a player must know what the symbols mean, where those notes are on their instrument, and some musical vocabulary. At 60 BPM with a chord change every bar, a novice pianist would have to find a new note on an unfamiliar keyboard every four seconds. Without prior knowledge, that’s impossible. Jam Tabs aims to give novices exactly the information a jam session needs, and no more.',
        ],
      },
      {
        heading: 'Design',
        list: [
          'Seven colors in rainbow order represent the seven chords of a major key, which gives the colors an inherent order.',
          'Each LED cube is one bar of music. A moving light on the cube’s edge counts the beats, showing the time signature.',
          'Notes outside the key (sharps and flats) are shown by splitting a cube between the two neighboring colors, much like accidentals in standard notation.',
          'Vinyl or LED piano bars in the same colors sit behind the keys, so color associations are almost instantaneous and can be moved for key changes.',
          'The cubes are visible from any angle, so a whole group can follow one shared notation.',
        ],
      },
    ],
    findings: [
      'Novice pianists followed chord progressions note for note using color, while improvising creatively.',
      'Players handled keys with many sharps (e.g., E major) as easily as C major.',
      'The system was used in groups of up to 25 people.',
      'Jam Tabs grew into an NSF-funded study of notation with Lei Yuan (see Embodied Symbol Systems).',
    ],
    tools: ['Addressable LED (NeoPixel) cubes', 'Colored piano bars', 'MIDI keyboards', 'Backing tracks'],
    gallery: [
      { file: 'projects/jam-tabs-cube.webp', caption: 'An LED cube and the matching colored keyboard.' },
      { file: 'projects/jam-tabs-colors.webp', caption: 'Seven colors mapped to the chords of a major key (I–vii).' },
      { file: 'projects/jam-tabs-prototype.webp', caption: 'The LED cube hardware prototype.' },
      { file: 'projects/jam-tabs-pianobar.webp', caption: 'Colored piano bar placed behind the keys of a digital piano.' },
    ],
    pubs: ['dissertation'],
    related: ['learning-to-read-music', 'embodied-symbol-systems', 'jam-station'],
  },

  'jam-station': {
    period: '2020–2021',
    context: 'ATLAS Institute, CU Boulder; exhibited at Maker Made Colorado (2020)',
    summary:
      'The Jam Station is a collaborative instrument built so that people of any skill level can make music with strangers. Four players face a tower of chimes, drums, and lights. Sensors and real-time algorithms measure how well the group plays together, and a progress bar fills as they lock in. A full bar wins the game and sets off a light show.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'Western improvisation teaching is usually designed for people who intend to become skilled musicians, so many novices never experience music’s collaborative potential. Collaborative musical experiences (CMEs) in museums and public spaces invite everyone to play. The Jam Station explores what happens when a CME is gamified and judges performance solely on collaboration, not on musical skill or aesthetics.',
        ],
      },
      {
        heading: 'Design',
        list: [
          'Instruments are limited to three notes (C, E, G), forming a major triad that always sounds harmonious. Each note is shown as a color (red, yellow, blue).',
          'A central display shows each instrument’s notes in real time, so everyone can see what the others are playing.',
          'Collaboration algorithms in Pure Data detect event synchronicity, synchronous rhythm, synchronous pitch, subdivision matching, and repeated melodies.',
          'A progress bar of rising white lights climbs while players collaborate and falls when they don’t. Reaching the top triggers a rainbow "win state" that lasts only as long as the group keeps playing together, so the game ends only when the players decide to stop.',
        ],
      },
    ],
    tools: ['Piezoelectric sensors', 'Pure Data', 'Arduino', 'MIDI-reactive LEDs'],
    video: { youtube: 'dzYpDfZknmI', title: 'The Jam Station video' },
    gallery: [
      { file: 'projects/jam-station-main.webp', caption: 'The Jam Station: four instruments facing a central tower display.' },
      { file: 'projects/jam-station-chimes.webp', caption: 'Chimes tuned to a major triad.' },
      { file: 'projects/jam-station-drums.webp', caption: 'Color-coded drums with embedded piezo sensors.' },
      { file: 'projects/jam-station-win.webp', caption: 'The rainbow "win state" when the group collaborates.' },
    ],
    pubs: ['dissertation'],
    related: ['jam-tabs', 'tangible-musical-objects', 'soljamm-workshops'],
  },

  'notation-plugins': {
    period: 'Ongoing',
    summary:
      'I build plugins that manipulate music notation software to aid reading and to support pedagogical techniques in music. This work sits alongside my research on how notation shapes learning.',
    related: ['learning-to-read-music', 'jam-tabs', 'embodied-symbol-systems'],
  },

  'musical-scales': {
    summary:
      'How many musical scales are there? Using combinatorics, this project counts the unique scale rotations possible in the 12-tone system, building on work in music combinatorics by Miller and others.',
    sections: [
      {
        heading: 'The idea',
        paragraphs: [
          'A scale can be seen as a pattern of chosen positions among the 12 pitch classes. Rotating a pattern gives its modes. For example, Dorian and Ionian are rotations of the same pattern, while the major scale and harmonic minor scale are genuinely different. The tool counts the truly unique patterns for scales of 0 to 12 notes and identifies known scales among them.',
        ],
      },
      {
        heading: 'What the code does',
        list: [
          'Generates every permutation of 0–12 notes in 12 positions and tabulates the number of unique rotations.',
          'Prints all unique 7-note scales, flags known ones (major, harmonic minor, and others), and renders them as labeled images.',
          'Visualizes all possible overlaps between scales of any size.',
        ],
      },
    ],
    tools: ['Python', 'Combinatorics', 'Data visualization'],
    code: [{ label: 'pitch-permutations', url: `${GH}/pitch-permutations` }],
    related: ['hacking-daws', 'notation-plugins'],
  },

  'hacking-daws': {
    period: 'Ongoing',
    summary:
      'I build custom functions in Ableton Live and connect it to Python and other programs. These techniques power many of my research systems and performances, and I have taught them in courses.',
    sections: [
      {
        heading: 'Where it’s used',
        list: [
          'AI-driven virtual musicians: Python models generate MIDI that flows into Ableton through virtual ports and Max for Live (Virtual AI Jam, XR Jam).',
          'Audience performance: Ableton controlled from Python and OSC in Rhythmic Conversations and CrowdForge.',
          'Mixed reality: a Python server driving a shared Ableton session in MR-DAW.',
          'Quantum Music: quantum circuits built with IBM’s Qiskit writing phrases into Ableton through AbletonOSC.',
          'Teaching: I have taught these techniques in courses and music technology workshops.',
        ],
      },
    ],
    tools: ['Ableton Live', 'Max for Live', 'Python', 'OSC / AbletonOSC', 'MIDI'],
    code: [
      { label: 'ML-Ableton', url: `${GH}/ML-Ableton` },
      { label: 'qMusic (quantum randomization for Ableton)', url: `${GH}/qMusic` },
    ],
    gallery: [{ file: 'projects/quantum-music-live.webp', caption: 'Quantum Music: Qiskit code driving a live Ableton session.' }],
    related: ['virtual-ai-jam', 'mr-daw', 'crowdforge'],
  },

  // ===================================================================== AI & XR musicianship
  'networking-ai-virtual-musicians': {
    period: '2021–2023',
    context: 'Funded by Ericsson Research ($65,000 grant I proposed and wrote)',
    summary:
      'AI-driven virtual musicians (AIVMs) are more than backing tracks: they are companions in making music. This project networks AIVMs into online jam sessions, so remote human musicians and AI bandmates can play together in augmented reality.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'Networked music boomed during the COVID-19 pandemic, letting musicians meet regardless of geography. Research has focused on audio and, more recently, on video, point clouds, and avatars. Some platforms can generate accompaniment, but none let players invite AI-driven musicians into a live, networked jam alongside other people.',
        ],
      },
      {
        heading: 'The system',
        list: [
          'Unity with Nreal AR glasses embodies players and AIVMs as avatars. The glasses’ cameras track hands so musical gestures can be shared.',
          'Photon networking synchronizes hand tracking and the AI avatar’s gestures.',
          'JackTrip carries near-instantaneous audio between players up to roughly 1,000 km apart.',
          'An AI pipeline of LSTM networks trained on the Magenta Groove MIDI dataset generates music, routed through Ableton Live and Max for Live.',
        ],
      },
    ],
    findings: [
      'At a public showcase, nearly 200 people saw the system and about 15 played with a networked virtual drummer.',
      'Players generally felt their partner’s presence, stayed task-focused, and enjoyed the experience (6.25 of 7).',
      'Feedback pointed to beat-transition timing and responsiveness as the next technical priorities.',
    ],
    tools: ['Unity', 'Nreal AR glasses', 'Photon Engine', 'JackTrip', 'Python / LSTM (Magenta Groove)', 'Ableton Live', 'Max for Live'],
    video: { youtube: 'zVqqqqriIpI', title: 'AI guitarist video' },
    gallery: [
      { file: 'projects/networking-aivm-teaser.webp', caption: 'A guitarist jamming with an AI-driven virtual guitarist and a remote drummer.' },
      { file: 'projects/networking-aivm-guitar.webp', caption: 'Playing guitar with an AI-driven virtual guitarist.' },
      { file: 'projects/networking-aivm-system.webp', caption: 'The XR Jam system setup: MIDI instruments, Nreal glasses, JackTrip, and a haptic mat.' },
    ],
    code: [{ label: 'XRJAM-ML', url: `${GH}/XRJAM-ML` }],
    pubs: ['networking-virtual-ai-musicians'],
    related: ['xr-jam', 'virtual-ai-jam', 'ar-drum-circle'],
  },

  'xr-jam': {
    period: '2021–2024',
    context: 'Funded by Ericsson Research',
    summary:
      'XR Jam is a system for playing music in extended reality with AI-driven virtual musicians and remote players. To our knowledge, it was the first system to network human musicians together with AI-driven virtual musicians. It also explores haptic feedback for sensing where sounds come from.',
    sections: [
      {
        heading: 'The system',
        paragraphs: [
          'Built on an XR framework, XR Jam enables new forms of interaction, including object manipulation and social drumming with AI-driven virtual musicians (AIVMs) and remote players. Avatar-based interfaces help players overcome social inhibitions. A haptic floor mat conveys the direction of sounds to support spatial awareness.',
        ],
      },
    ],
    findings: [
      'Pilot studies suggested haptics can aid spatial localization of sounds, though front and back directions remained hard to tell apart.',
      'The system promotes musical interaction, social engagement, and spatial orientation. Synchronization and player experience need further refinement.',
      'Playing as avatars made musicians less self-conscious and more willing to improvise.',
    ],
    tools: ['Unity', 'Ableton', 'Max', 'Python', 'JackTrip', 'Raspberry Pi', 'MIDI guitars and drums', 'Hand tracking', 'Haptic floor mat'],
    gallery: [
      { file: 'projects/xr-jam-system.webp', caption: 'Jamming with AI-driven virtual musicians in XR Jam.' },
      { file: 'projects/xr-jam-setup.webp', caption: 'Player setup: headphones, JackTrip server, Raspberry Pi and router, audio interface.' },
      { file: 'projects/xr-jam-haptic.webp', caption: 'The haptic floor mat used to convey the direction of sounds.' },
      { file: 'projects/xr-jam-ismar.webp', caption: 'Musicians playing with virtual bandmates.' },
    ],
    code: [{ label: 'XRJAM-ML', url: `${GH}/XRJAM-ML` }],
    pubs: ['networking-virtual-ai-musicians'],
    related: ['networking-ai-virtual-musicians', 'virtual-ai-jam', 'ar-drum-circle'],
  },

  'virtual-ai-jam': {
    period: '2022–2023',
    context: 'CU Boulder, with Ericsson Research',
    summary:
      'Virtual AI Jam is an animated, AI-driven virtual musician you can improvise with on an ordinary laptop. Instead of building costly robots, it gives AI musicianship a visual body, and it was refined through interviews with musicians.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'AI systems that interact with human musicians often lack any visual representation, or require building robots that play acoustic instruments. Visual representations can reveal performance expression, open new ways to collaborate, and support teaching. A virtual, animated musician makes this far more accessible and affordable.',
        ],
      },
      {
        heading: 'The pipeline',
        paragraphs: [
          'A player’s MIDI notes are recorded locally (Ableton Live with Max for Live) and used as input to music generation models. The generated output plays through a virtual port that triggers sound samples in Ableton and animations in Unity. We shared the system publicly with a code repository so others can build on it.',
        ],
      },
    ],
    findings: [
      'Semi-structured interviews and thematic analysis informed successive improvements to the system.',
      'Many musicians preferred AI improvisation systems they could explicitly control over free-form improvisation with fully autonomous virtual musicians.',
    ],
    tools: ['Ableton Live', 'Max for Live', 'Python / Magenta', 'Unity', 'Foot pedal control'],
    gallery: [
      { file: 'projects/virtual-ai-jam-aivm.webp', caption: 'The animated AI-driven virtual drummer and guitarist.' },
      { file: 'projects/virtual-ai-jam-flow.webp', caption: 'Signal flow: player MIDI, local recording, generation, then sound in Ableton and animation in Unity.' },
      { file: 'projects/virtual-ai-jam-mocap.webp', caption: 'Musicians playing with the virtual musicians.' },
    ],
    code: [{ label: 'XRJAM-ML', url: `${GH}/XRJAM-ML` }, { label: 'ML-Ableton', url: `${GH}/ML-Ableton` }],
    related: ['xr-jam', 'rhythmic-conversations', 'brain-jam'],
  },

  'brain-jam': {
    context: 'ATLAS Institute and Institute of Cognitive Science, CU Boulder',
    summary:
      'BrAIn Jam is an AI drummer that listens to the brain. Expert drummers improvised with an embodied AI drummer while functional near-infrared spectroscopy (fNIRS) recorded their brain activity. Individualized models classified each player’s response in real time, and the AI changed its playing whenever the drummer’s brain signaled low rhythmic predictability.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'Improvising musicians exchange subtle cues that many intuit but that are hard to translate into computer musicianship. AI musicians traditionally "listen and react" via MIDI, audio, or video, which adds latency and ignores the embodied cues humans rely on. Using musical information from the brain had been explored only in limited contexts.',
        ],
      },
      {
        heading: 'The study',
        paragraphs: [
          'The study had two phases. First, we trained individualized machine learning models on fNIRS data collected during a controlled experiment. Then we used those models to inform an embodied AI-driven virtual drummer in real-time improvised drumming collaboration. The fNIRS cap recorded 34 channels across prefrontal and temporoparietal cortex, and a real-time pipeline preprocessed and classified the signal to adjust the AI’s rhythm.',
        ],
      },
    ],
    findings: [
      'We formalized rhythmic predictability as a quantifiable metric combining neural and machine learning data.',
      'Improvising with embodied AI significantly activated the temporoparietal junction (TPJ) and regions associated with cognitive workload. The activation depended on whether beats were random or musical.',
      'Random Forest models outperformed other models (including LSTM and SVM) at classifying the data, which makes them promising for real-time adaptive systems.',
      'Individual preferences matter: some musicians valued the AI’s adaptiveness while others preferred consistency.',
      'BrAIn Jam is the neural engine behind the Stringesthesia performance.',
    ],
    tools: ['fNIRS (NIRSport 2, Aurora)', 'MATLAB', 'Python classifiers', 'Magenta drum generation', 'Ableton Live', 'Unity'],
    video: { youtube: 'zDaNU9SzwdQ', title: 'BrAIn Jam video' },
    gallery: [
      { file: 'projects/brain-jam-teaser.webp', caption: 'A drummer wearing an fNIRS cap improvises with the AI-driven virtual drummer.' },
      { file: 'projects/brain-jam-setup.webp', caption: 'Setup: fNIRS device, player input, AI virtual musician display, and data collection backend.' },
      { file: 'projects/brain-jam-drummer.webp', caption: 'The embodied AI-driven virtual drummer.' },
      { file: 'projects/brain-jam-system.webp', caption: 'System pipeline for post-hoc analysis and real-time classification.' },
    ],
    code: [
      { label: 'BrAIn-Jam (fNIRS classification + best practices)', url: `${GH}/BrAIn-Jam` },
      { label: 'BrAIn-Jam-data-analyze', url: `${GH}/BrAIn-Jam-data-analyze` },
    ],
    related: ['stringesthesia', 'virtual-ai-jam', 'rhythmic-conversations'],
  },

  stringesthesia: {
    period: '2022–2023',
    context: 'Performed at the ATLAS Black Box Theater, CU Boulder (about 115 in attendance)',
    summary:
      'Stringesthesia is an improvised performance in which the performer’s brain decides how much of the music the audience controls. fNIRS, decoded in real time, reads the guitarist’s sense of "trust" in the audience and projects it as a glowing orb. As trust grows, more stations light up among the seats for playing drums and choosing the chords the guitarist must play.',
    sections: [
      {
        heading: 'Trust and musical agency',
        paragraphs: [
          'Interactive performances must decide how much musical agency, meaning control over the musical content, to give the audience versus the performer. Trust is central to that balance, and bio-sensing can make internal states visible. fNIRS offers better spatial resolution than EEG and had been little explored in creative musical settings.',
        ],
      },
      {
        heading: 'The performance',
        list: [
          'A NIRSport 2 measured 50 channels over the temporoparietal junction, frontopolar area, dorsolateral prefrontal cortex, and medial prefrontal cortex, streamed through Lab Streaming Layer to MATLAB.',
          'Trust was shown as the diameter of an orb of particles behind the performer: small when trust was low, large when high.',
          'Six color controllers let audience members choose chords. Colors in spectral order mapped to the major-key chords I, ii, iii, IV, V, and vi, which the performer had memorized.',
          'Six rhythmic instrument stations were miked to drive reactive visuals. Unity VFX Graph, MadMapper, and five projectors created the environment.',
          'The 2 h 15 min concert was split into 14 sets of 2–9 minutes, with rests so the blood-oxygen signal could return to baseline.',
        ],
      },
    ],
    findings: [
      'Audience members reported feeling connected to each other and to the performer, combining "the production quality of larger concerts" with "the intimacy of small performances".',
      'When trust was low and fewer stations were active, the performer had more musical freedom, revealing a trade-off between audience interaction and artistic control.',
      'Some listeners found the trust visualization too abstract, which suggests clearer explanation in future performances.',
      'The neural control loop held up despite the motion and noise of a real stage.',
    ],
    tools: ['fNIRS (NIRSport 2, Aurora)', 'Lab Streaming Layer', 'MATLAB', 'Python', 'Ableton Live', 'Max', 'Unity VFX Graph', 'MadMapper', 'Dante', 'Custom networked controllers'],
    video: { youtube: 'J8pW7RkiABg', title: 'Stringesthesia performance video' },
    gallery: [
      { file: 'projects/stringesthesia-overhead.webp', caption: 'Overhead views of the performance space and projections.' },
      { file: 'projects/stringesthesia-station.webp', caption: 'Audience members playing at an instrument station.' },
      { file: 'projects/stringesthesia-fnirs.webp', caption: 'The guitarist performing while wearing the fNIRS device.' },
      { file: 'projects/stringesthesia-orb.webp', caption: 'The trust orb: a larger diameter meant higher trust.' },
      { file: 'projects/stringesthesia-controller.webp', caption: 'Audience color/chord controllers, reset (left) and with a color selected (right).' },
    ],
    pubs: ['stringesthesia-nime', 'stringesthesia-fnirs-poster'],
    related: ['brain-jam', 'rhythmic-conversations', 'crowdforge'],
  },

  'jamming-with-jimmy-page': {
    period: '2022',
    context: 'Research internship, Ericsson Research, Santa Clara, CA',
    summary:
      'During my internship at Ericsson Research, I investigated neural network architectures for musical interaction. I designed and tested an augmented reality application for networked improvisation with an AI-driven musician.',
    sections: [
      {
        heading: 'Context',
        paragraphs: [
          'This work was part of my Ericsson-funded research on networked jamming with human and AI musicians in extended reality.',
        ],
      },
    ],
    related: ['networking-ai-virtual-musicians', 'xr-jam', 'virtual-ai-jam'],
  },

  'computer-supported-musical-improvisation': {
    period: '2019–2024',
    context: 'Ph.D. dissertation, University of Colorado Boulder',
    summary:
      'My doctoral research asks how technology can support musical improvisation, the social musical play practiced across cultures throughout human history. It identifies technology’s role in improvisation, the investigations well positioned to support it, and builds and evaluates systems that push the boundaries of technology and improvisation.',
    sections: [
      {
        heading: 'Framework',
        paragraphs: [
          'I organize the work around four areas that support improvisation and the communication of musical ideas between players: sensing, processing, representing, and networking musical information.',
        ],
      },
      {
        heading: 'Four parts of the dissertation',
        list: [
          'Expanding the circle of musicians: colored notation, Jam Tabs, and the Jam Station.',
          'Jamming at a distance: AR Drum Circle, network latency perception, limited field of view with holograms, and XR Jam.',
          'Jamming with computers: personified intelligent music tools, networked AI-driven virtual musicians, Virtual AI Jam, and BrAIn Jam.',
          'Incorporating the audience: Rhythmic Conversations and Stringesthesia.',
        ],
      },
    ],
    pubs: ['dissertation', 'augmented-personification'],
    related: ['jam-tabs', 'ar-drum-circle', 'brain-jam', 'stringesthesia'],
  },

  // ===================================================================== Networked music in AR
  'ar-drum-circle': {
    period: '2020–2022',
    context: 'Funded by Ericsson Research ($60,000 grant I proposed and wrote)',
    summary:
      'AR Drum Circle is an augmented reality platform for drumming together remotely. Players see each other as avatars in their own space and hear each other over latency-optimized audio, recovering some of the joy and co-presence of an in-person drum circle.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'Remote collaboration tools typically lack real-time video, spatial information, and per-player volume control, all of which matter in drum circles. Amid the pandemic, networked musical collaboration grew in popularity, but most networks can’t support the near-instantaneous transmission real-time jamming needs.',
        ],
      },
      {
        heading: 'Investigations',
        list: [
          'An in-depth survey of drumming communication with expert drummers.',
          'Observation and analysis of 20 videos of live drum circles.',
          'A case study of pairs of remotely located participants using AR Drum Circle, with a head-mounted AR display and JackTrip audio.',
          'A comparison case study using a popular conferencing application (Zoom).',
        ],
      },
    ],
    findings: [
      'Much communicative information, such as facial expressions, hand tracking, and eye contact, is lost when using AR alone.',
      'AR Drum Circle made players less self-conscious and more willing to participate while improvising with others.',
      'It retained a sense of co-presence and increased comfort in shared remote experiences.',
    ],
    tools: ['Head-mounted AR display', 'JackTrip', 'MIDI drums'],
    gallery: [
      { file: 'projects/ar-drum-circle-teaser.webp', caption: 'Drumming with a remote player rendered as an avatar.' },
      { file: 'projects/ar-drum-circle-system.webp', caption: 'System overview: two locations connected through the cloud, each with a local player and an avatar of the remote player.' },
      { file: 'projects/ar-drum-circle-avatars.webp', caption: 'Avatar designs and the AR experience.' },
    ],
    pubs: ['how-late-is-too-late'],
    related: ['how-late-is-too-late', 'limited-field-of-view', 'xr-jam'],
  },

  'how-late-is-too-late': {
    period: '2021–2022',
    context: 'Funded by Ericsson Research',
    summary:
      'Real-time networked music needs near-instantaneous transmission, and visuals travel slower than audio. How much delay between a remote musician’s sound and their avatar’s animation can players notice, and how much can they tolerate? We measured it in augmented reality.',
    sections: [
      {
        heading: 'The study',
        paragraphs: [
          'Twenty-four participants played a hand drum with a prerecorded remote musician rendered as an avatar in AR. Across multiple trials we varied the audio-visual latency, from no delay up to 1,200 ms, during both mimicking and improvising tasks. We analyzed participants’ subjective responses together with the recorded musical data from each session.',
        ],
      },
    ],
    findings: [
      'The minimum noticeable delay was between 160 ms and 320 ms.',
      'Delay between sound and avatar animation became less tolerable at 320 ms but was never completely intolerable, even at 1,200 ms.',
      'Delays in AR visuals were more tolerable than those reported for video streams. Network latency is not the main roadblock to meaningful remote collaboration, and immersive visuals help even when slightly delayed.',
    ],
    gallery: [
      { file: 'projects/how-late-teaser.webp', caption: '(A) The setup: a participant with AR glasses and a MIDI drum plays with a remote musician’s avatar. (B) The sound-animation latency threshold.' },
      { file: 'projects/how-late-setup.webp', caption: 'Study setup with AR glasses and hand drum.' },
      { file: 'projects/how-late-results.webp', caption: 'Delay scores across latency levels for the mimic and improvise tasks.' },
    ],
    pubs: ['how-late-is-too-late'],
    related: ['ar-drum-circle', 'limited-field-of-view', 'holojam'],
  },

  'limited-field-of-view': {
    period: '2022–2025',
    context: 'Funded by Ericsson Research and the National Science Foundation (IIS-2040489)',
    summary:
      'AR glasses narrow what musicians can see, and musicians rely on glances, gestures, and eye contact to coordinate. We studied how a limited field of view (FOV) affects jamming with avatars, and designed "Mini Musicians", small avatars that appear in view when bandmates are out of sight.',
    sections: [
      {
        heading: 'Three studies',
        list: [
          'Observing live jam sessions with five experienced musicians, first normally and then wearing goggles that restrict vision to 52°. Musicians looked at each other 62 times in the control session but only 27 times with restricted vision.',
          'A pilot comparing holograms (no FOV limit) with AR glasses, with and without blue-sphere notifications.',
          'A within-subjects study with 19 participants comparing HoloJam holograms, standard AR glasses (52° FOV), and AR with Mini Musicians notifications.',
        ],
      },
      {
        heading: 'Why Mini Musicians',
        paragraphs: [
          'In interviews, musicians said that with a limited FOV they sometimes forgot certain players were present. Three of them asked for mini versions of the avatars, "like in Mario Kart". We built exactly that: a second, wider virtual camera rendered small, semi-transparent avatars of out-of-view bandmates.',
        ],
      },
    ],
    findings: [
      'A limited FOV significantly reduces musicians’ ability to communicate, affecting both the music and the experience.',
      'The unrestricted HoloJam setup gave the highest co-presence, the quickest gesture recognition, and the greatest enjoyment.',
      'Mini Musicians reduced reaction time with AR glasses and maintained enjoyment.',
      'Notifications did not significantly increase co-presence, likely because they were distracting.',
    ],
    gallery: [
      { file: 'projects/limited-fov-teaser.webp', caption: '(A) The hologram setup using the Pepper’s ghost illusion; (B–D) AR glasses conditions with and without notifications.' },
      { file: 'projects/limited-fov-jamsession.webp', caption: 'Observing jam sessions with goggles that limit the field of view to 52°.' },
    ],
    code: [{ label: 'HolojamAnalysis', url: `${GH}/HolojamAnalysis` }],
    pubs: ['fov-avatar-awareness', 'limited-fov-jamming-xr'],
    related: ['holojam', 'ar-drum-circle', 'how-late-is-too-late'],
  },

  holojam: {
    period: '2022–2023',
    context: 'ATLAS Institute, CU Boulder. Research project with published papers, also shown as a public expo demo',
    summary:
      'HoloJam is a holographic jam space. Using the Pepper’s ghost illusion, animated drummers and bandmates appear as holograms that players can see without any headset, giving an unrestricted view of AI-driven virtual musicians.',
    sections: [
      {
        heading: 'How it works',
        paragraphs: [
          'A transparent acrylic board angled at 45° reflects a television image to create holograms. The installation runs on a single laptop. Avatars animated in Unity (models and animations from Mixamo, driven by a reactive rig) play drums, bass, guitar, and keys in response to the music, and players join on a MIDI drum pad.',
          'HoloJam served as the no-field-of-view-limit condition in our studies of AR glasses, where it gave the highest co-presence, the fastest gesture recognition, and the greatest enjoyment.',
        ],
      },
      {
        heading: 'Public demos',
        paragraphs: [
          'Beyond the research studies, HoloJam was exhibited as a public demo at ATLAS Institute expos at CU Boulder in 2022 and 2023. The papers that came out of the project were published from 2023 to 2025. Visitors stepped up to the drum pad and jammed with the holographic bandmates, no headset required.',
        ],
      },
    ],
    tools: ['Pepper’s ghost holograms', 'Unity', 'Mixamo avatars', 'MIDI drum pad'],
    video: { youtube: 'e_u2cq1R2pQ', title: 'HoloJam video' },
    gallery: [
      { file: 'projects/holojam-conditions.webp', caption: 'HoloJam (right) compared with AR glasses with and without Mini Musicians.' },
      { file: 'projects/holojam-avatars.webp', caption: 'Avatar bandmates: bassist, guitarist, and keyboard player.' },
    ],
    code: [{ label: 'HolojamAnalysis', url: `${GH}/HolojamAnalysis` }],
    pubs: ['limited-fov-musical-collaboration', 'limited-fov-jamming-xr', 'fov-avatar-awareness'],
    related: ['limited-field-of-view', 'rhythmic-conversations', 'virtual-ai-jam'],
  },

  'rhythmic-conversations': {
    period: '2023',
    context: 'Performed in Brighton, UK (AIMC 2023 algorave) and at CU Boulder',
    summary:
      'Rhythmic Conversations is an audience-interactive performance with improvising AI drummers. Audience members play drum pads placed among the seats. AI-driven virtual percussionists "listen" and answer with new parts, and I improvise on guitar with all of them.',
    sections: [
      {
        heading: 'Motivation',
        paragraphs: [
          'Most performances are a one-way flow from performer to audience. AI-driven virtual musicians can let audiences actively take part and steer the music, even without expertise on a physical instrument. Each pad is audible only to the person playing it, so anyone can join without fear of being judged.',
        ],
      },
      {
        heading: 'The system',
        paragraphs: [
          'A Python package bridges Ableton Live and the AI. Drum beats from the audience are ingested in real time and fed to neural network and Transformer models trained on Google Magenta’s Groove dataset, which generate complementary, stylistically coherent beats. Performers can then manipulate tempo and sound clips. The setup needs only a laptop, scales to any number of players and instruments, and can be extended in Max or Python.',
        ],
      },
      {
        heading: 'Where it’s been performed',
        list: [
          'Exhibitions: visitors drum with the AI or pick up another instrument and jam.',
          'Formal stage performance at Grusin Music Hall, CU Boulder, with the virtual drummer projected on screen.',
          'An algorave at St Mary’s Church, Brighton, UK, as part of AI Music Creativity 2023.',
        ],
      },
    ],
    tools: ['Virtual AI drummer', 'Magenta Groove models', 'Ableton Live', 'Max', 'Python', 'Unity', 'MadMapper', 'OSC'],
    video: { youtube: 'y97t7pM85Lw', title: 'Rhythmic Conversations performance video' },
    gallery: [
      { file: 'projects/rhythmic-conversations-brighton.webp', caption: 'Performing at an algorave in St Mary’s Church, Brighton, UK.' },
      { file: 'projects/rhythmic-conversations-stage.webp', caption: 'Grusin Music Hall, CU Boulder, with the virtual AI drummer projected on screen.' },
      { file: 'projects/rhythmic-conversations-drummer.webp', caption: 'An audience member playing a drum pad with the AI drummer.' },
      { file: 'projects/rhythmic-conversations-expo.webp', caption: 'Exhibition visitors jamming with the virtual AI drummer.' },
    ],
    related: ['stringesthesia', 'virtual-ai-jam', 'crowdforge'],
  },

  // ===================================================================== Instruments & making
  'modular-guitar': {
    summary: 'A modular, reconfigurable guitar designed for play and performance, letting the instrument’s components be rearranged to explore new ways of playing.',
    related: ['string-sheath', 'tangible-musical-objects', 'gtar-apps'],
  },

  'string-sheath': {
    related: ['modular-guitar', 'tangible-musical-objects'],
  },

  'tangible-musical-objects': {
    related: ['jam-station', 'modular-guitar', 'string-sheath'],
  },

  'gtar-apps': {
    summary: 'I designed and built applications for the gTar, a smart guitar with LED-lit frets that guide players to notes.',
    related: ['jam-tabs', 'learning-to-read-music', 'modular-guitar'],
  },

  'soljamm-workshops': {
    period: '2015–2019',
    context: 'SolJAMM LLC (Founder)',
    summary:
      'Through SolJAMM I designed and led technology-enhanced jamming workshops, including one for more than 50 high school students. More broadly, I directed R&D on augmented instruments for learning and taught thousands of students guitar, voice, piano, bass, ukulele, drums, and music technology.',
    sections: [
      {
        heading: 'Context',
        paragraphs: [
          'SolJAMM contracted with the National University of Singapore, Studios Education, the University of Colorado, and Bowdoin College, among others. Workshops such as "SolJAMMin’ at HPHS" (Highland Park, IL, 2019) brought group improvisation and music technology to students.',
        ],
      },
    ],
    links: [{ label: 'soljamm.com', url: 'https://soljamm.com' }],
    related: ['jam-tabs', 'jam-station'],
  },

  // ===================================================================== Other research
  'smart-cities': {
    period: '2021',
    summary:
      'An authored book chapter on the future of user interfaces in smart cities, published in Springer’s Handbook of Smart Cities.',
    related: ['ar-drum-circle'],
  },

  'linguist-vs-machine': {
    period: '2020',
    context: 'SIGMORPHON 2020 Shared Task, University of Colorado',
    summary:
      'Can linguists writing grammars by hand beat neural networks at learning word inflection? As part of a large team, I helped develop 25+ finite-state morphological grammars and compared the effort and accuracy against sequence-to-sequence models.',
    sections: [
      {
        heading: 'Approach',
        paragraphs: [
          'Each grammar combined a lexicon-based model with a "guesser" for unseen words, built as a cascade of finite-state transducers. We also built tools to help linguists triage difficult morphophonological phenomena and hypothesize inflectional class membership.',
        ],
      },
    ],
    findings: [
      'Surpassing neural models’ accuracy required significant development effort by trained linguists.',
      'The paper weighs the cost/benefit of hand-written grammars, which is especially relevant for low-resource languages.',
    ],
    related: ['automatic-arrangement'],
  },

  foxp3: {
    context: 'Southern Illinois University School of Medicine (PI: Buffy Ellsworth)',
    summary:
      'Before music technology, I worked in developmental neurobiology and endocrinology. This study investigated the role of the forkhead transcription factor FOXP3 in male fertility in mice.',
    related: ['foxd1', 'hippocampal-connectivity-motor-learning'],
  },

  foxd1: {
    context: 'Southern Illinois University School of Medicine (PI: Buffy Ellsworth)',
    summary:
      'The pituitary gland regulates growth, reproduction, metabolism, and stress responses. This study found that the transcription factor Foxd1 is required, indirectly, for normal luteinizing hormone expression and cartilage formation around the developing mouse pituitary.',
    findings: [
      'Foxd1 is not expressed in the developing pituitary itself, but in the surrounding mesenchyme, an essential source of signals for pituitary development.',
      'Loss of Foxd1 causes the anterior pituitary to protrude through the developing cartilage plate and increases pituitary cell proliferation.',
      'Foxd1-null mice show significantly decreased Lhb expression at e18.5 without a change in gonadotrope cell number or LHX3 expression.',
    ],
    related: ['foxp3'],
  },

  'hippocampal-connectivity-motor-learning': {
    context: 'NorthShore University HealthSystem (PI: Douglas Burman); data analyst',
    summary:
      'Is the hippocampus involved in movement only when memory is at play? Using fMRI, this study examined hippocampal connectivity with sensorimotor cortex during paced finger movements with and without a memory component.',
    sections: [
      {
        heading: 'Method',
        paragraphs: [
          'fMRI activity was recorded from thirteen right-handed participants during sequence learning (with a memory component) and repetitive tapping (without one). Connectivity was identified from psychophysiological interactions with hippocampal activity.',
        ],
      },
    ],
    findings: [
      'Hippocampal connectivity was observed during both tasks, even though motor learning occurred only in sequence learning.',
      'Positive connectivity appeared in sensorimotor cortex on the same side as the moving hand, while negative connectivity was prominent in whichever hemisphere was most active.',
      'The hippocampus is implicated in volitional finger movements even without motor learning or recall.',
    ],
    related: ['hippocampal-connectivity-selectivity', 'music-rehearsal-perceptual-span'],
  },

  'music-rehearsal-perceptual-span': {
    context: 'NorthShore University HealthSystem (PI: Douglas Burman); data analyst',
    summary:
      'Skilled musicians read scores more efficiently, but does rehearsal itself widen how much of a score a musician can take in at a glance? This study measured the "perceptual span" for musical notation across repeated rehearsals.',
    findings: [
      'Skilled musicians initially showed a slightly larger span for challenging passages (5 notes vs. 4).',
      'Spans grew incrementally in both groups, and skill differences disappeared by 20 rehearsals (a span of 11 notes).',
      'Improvements in perceptual span correlated with performance speed, suggesting perceptual learning drives early gains in rehearsal.',
    ],
    links: [{ label: 'DOI: 10.1525/mp.2009.26.4.303', url: 'https://doi.org/10.1525/mp.2009.26.4.303' }],
    related: ['learning-to-read-music', 'hippocampal-connectivity-motor-learning'],
  },

  'hippocampal-connectivity-selectivity': {
    context: 'NorthShore University HealthSystem (PI: Douglas Burman); data analyst',
    summary:
      'Does hippocampal connectivity with motor cortex show the spatial and temporal selectivity needed for cognitive control of movement? This fMRI study examined connectivity during individual finger movements.',
    findings: [
      'At each finger’s sensorimotor representation, hippocampal connectivity was greatest when that finger was moving (temporal selectivity).',
      'Seeds associated with each finger differed in connectivity to adjacent finger representations (spatial selectivity).',
    ],
    related: ['hippocampal-connectivity-motor-learning'],
  },
};
