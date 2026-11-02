// AI Music Resources page (ported from torinhopkins.com/ai-music-resources).
// These are the take-home supplements for my classes, workshops, and public demos,
// so the list is pruned and added to as the field changes.
//
// Each item gets a `level` showing how easy it is for a workshop participant to pick up;
// a group's `level` is the default for its items.
//   easy      Runs in the browser or a free app: no install, no code
//   moderate  Needs an install, a DAW, a MIDI device, or a guided notebook
//   advanced  Needs coding, Python/conda environments, or a GPU
//   reading   A paper or article to read rather than a tool to use

const GH = 'https://github.com/nebulusneighbor';

export const levels = {
  easy: 'Easy: in the browser or a free app, no code',
  moderate: 'Moderate: needs an install, a DAW, a MIDI device, or a guided notebook',
  advanced: 'Advanced: needs coding, Python environments, or a GPU',
  reading: 'Reading: a paper or article, not a tool',
};

// Music education and creative tools, listed on the Research page.
const SJ = 'https://soljamm.com';

export const educationTools = [
  {
    heading: 'SolJAMM apps',
    intro: 'Free, in the browser, nothing to install.',
    level: 'easy',
    items: [
      { name: 'Fret Sudoku', note: 'Some notes are on the neck; place the rest. Levels from open position to the whole neck.', url: `${SJ}/fretdoku/` },
      { name: 'Ear trainer', note: 'Intervals, scale degrees, chord functions, and cadences, answered in color.', url: `${SJ}/ear/` },
      { name: 'Fret Notes', note: 'Name the note at any fret, or find every place a note lives, on guitar, bass, or ukulele.', url: `${SJ}/fret-notes/` },
      { name: 'Fretboard', note: 'Any scale, in any key, on guitar, bass, ukulele, or piano, in color.', url: `${SJ}/fretboard/` },
      { name: 'Scale finder', note: 'Find scales from notes or chords, or browse all 352 patterns.', url: `${SJ}/scales/` },
      { name: 'Chord Builder', note: 'How any chord is built, then practice building and naming chords.', url: `${SJ}/chord-builder/` },
      { name: 'Chord colors', note: 'Every chord in a key as stacked colors, memorized in an eleven-level game.', url: `${SJ}/chords/` },
      { name: 'Jam tracks', note: 'Solo over backing tracks with the chord colors in time.', url: `${SJ}/tracks/` },
      { name: 'Jam board', note: 'Loop a progression on a big screen so a whole group can jam. Great for workshops.', url: `${SJ}/jam/` },
      { name: 'Practice room', note: 'Colored tab, notation, and fretboard for etudes or your own MIDI files. Loop and slow down.', url: `${SJ}/app/` },
      { name: 'Tab editor', note: 'Write exercises as tab and notation, hear them, and share them.', url: `${SJ}/notation/`, level: 'moderate' },
    ],
  },
  {
    heading: 'Code',
    intro: 'Open-source tools to download and run.',
    items: [
      { name: 'Flappy Keys', note: 'A silly game: keep a ball in the air by playing your MIDI keyboard. Needs Python and any MIDI keyboard.', url: `${GH}/flappy_keys`, level: 'moderate' },
      { name: 'Pitch Permutations', note: 'Every possible scale in 12 tones, with pictures. Browse the images, or run the Python to make your own.', url: `${GH}/pitch-permutations`, level: 'moderate' },
      { name: 'qMusic: quantum randomness for Ableton', note: 'Chords and melodies chosen by a simulated quantum circuit (Qiskit) and sent to Ableton over OSC.', url: `${GH}/qMusic`, level: 'advanced' },
    ],
  },
];

export default [
  {
    heading: 'My Tools and Code',
    intro: 'Open-source AI music tools from my own research, used in workshops and demos.',
    items: [
      { name: 'ML-Ableton: AI soloist in Ableton Live', note: 'Ableton Live sets and a Max for Live device for jamming with a machine-learning soloist. The free Ableton trial works.', url: `${GH}/ML-Ableton`, level: 'moderate' },
      { name: 'XRJam ML: AI drummer and soloist for virtual avatars', note: 'Magenta models that play drums and pentatonic solos for the virtual band in XR Jam, via Ableton and Max for Live.', url: `${GH}/XRJAM-ML`, level: 'advanced' },
      { name: 'AIMAP: the CrowdForge audience-participation system', note: 'Generative multitrack MIDI steered by audience votes. Needs a trained model; contact me for one.', url: `${GH}/AIMAP`, level: 'advanced' },
      { name: 'Icarus: an agent-native DAW for Linux', note: 'An early-prototype open DAW where people, controllers, and AI agents share the same controls. Linux and a Rust build.', url: `${GH}/icarus`, level: 'advanced' },
    ],
  },
  {
    heading: 'Generative AI and Other Tools',
    level: 'easy',
    items: [
      { name: 'Suno', url: 'https://suno.ai/' },
      { name: 'Songr', url: 'https://www.songr.ai/' },
      { name: 'MusicGen (Hugging Face)', url: 'https://huggingface.co/spaces/facebook/MusicGen' },
      { name: 'Google MusicFX DJ', url: 'https://labs.google/fx/tools/music-fx-dj' },
      { name: 'Riffusion', url: 'https://www.riffusion.com/' },
      { name: 'Beatoven', url: 'https://www.beatoven.ai/' },
      { name: 'Loudly', url: 'https://www.loudly.com/' },
      { name: 'Magenta', url: 'https://magenta.tensorflow.org/', level: 'moderate' },
      { name: 'BandLab', url: 'https://www.bandlab.com/' },
      { name: 'Boomy', url: 'https://boomy.com/' },
      { name: 'Soundraw', url: 'https://soundraw.io/' },
      { name: 'Moises.ai', url: 'https://moises.ai/' },
      { name: 'ATLAS / Playbeat', url: 'https://algonaut.audio/', level: 'moderate' },
      { name: 'MuseNet / Jukebox', url: 'https://openai.com/research/musenet', level: 'reading' },
      { name: 'Mubert', url: 'https://mubert.com/' },
      { name: 'AIVA', url: 'https://www.aiva.ai/' },
      { name: 'Splash Pro', url: 'https://pro.splashmusic.com/' },
      { name: 'MusicLM / MusicFX', url: 'https://labs.google/fx/tools/music-fx' },
      { name: 'Udio', url: 'https://www.udio.com/' },
      { name: 'Stable Audio', url: 'https://stableaudio.com/' },
      { name: 'ElevenLabs Music', url: 'https://elevenlabs.io/music' },
    ],
  },
  {
    heading: 'Code-Based Open Source',
    level: 'advanced',
    items: [
      { name: 'Google TensorFlow: Music generation tutorial (Jupyter)', url: 'https://www.tensorflow.org/tutorials/audio/music_generation', level: 'moderate' },
      { name: 'Google Magenta Studio plugins for Ableton Live', url: 'https://magenta.tensorflow.org/studio/ableton-live/', level: 'moderate' },
      { name: 'Magenta Colab notebook', url: 'https://colab.research.google.com/drive/1fxGqfg96RBUvGxZ1XXN07s3DthrKUl4-?usp=sharing', level: 'moderate' },
      { name: 'Meta AudioCraft (code, papers)', url: 'https://github.com/facebookresearch/audiocraft' },
      { name: 'Meta AudioCraft (online)', url: 'https://audiocraft.metademolab.com/', level: 'easy' },
      { name: 'Meta MusicGen docs (code)', url: 'https://github.com/facebookresearch/audiocraft/blob/main/docs/MUSICGEN.md' },
      { name: 'ACE-Step 1.5 (local song generation)', url: 'https://github.com/ace-step/ACE-Step-1.5' },
      { name: 'YuE (lyrics-to-song)', url: 'https://github.com/multimodal-art-projection/YuE' },
      { name: 'HeartMuLa (music foundation models)', url: 'https://github.com/HeartMuLa/heartlib' },
      { name: 'DiffRhythm (full-song diffusion)', url: 'https://github.com/ASLP-lab/DiffRhythm' },
      { name: 'Stable Audio Open (weights)', url: 'https://huggingface.co/stabilityai/stable-audio-open-1.0' },
      { name: 'Magenta RealTime (live generation)', url: 'https://github.com/magenta/magenta-realtime' },
    ],
  },
  {
    heading: 'Symbolic Models',
    level: 'reading',
    items: [
      { name: 'Folk-RNN, MusicVAE', url: 'https://ar5iv.labs.arxiv.org/html/2410.20515v1' },
      { name: 'Music Transformer', url: 'https://magenta.tensorflow.org/music-transformer' },
      { name: 'MuseGAN', url: 'https://github.com/salu133445/musegan', level: 'advanced' },
      { name: 'DeepBach', url: 'https://samgoree.github.io/2017/01/29/DeepBach.html' },
      { name: 'Coconet', url: 'https://dash.harvard.edu/server/api/core/bitstreams/62df48f2-5641-405f-ae6d-1fa9cdbfb925/content' },
      { name: 'Museformer, SongMASS, MusicBERT (Microsoft Muzic)', url: 'https://github.com/microsoft/muzic', level: 'advanced' },
      { name: 'PopMAG', url: 'https://www.slideshare.net/ivaderivader/popmag-pop-music-accompaniment-generation' },
      { name: 'MuseCoco', url: 'https://arxiv.org/abs/2306.00110' },
      { name: 'GETMusic', url: 'https://arxiv.org/abs/2305.10841' },
      { name: 'Anticipatory Music Transformer', url: 'https://github.com/jthickstun/anticipation', level: 'advanced' },
      { name: 'Aria (EleutherAI piano model)', url: 'https://github.com/EleutherAI/aria', level: 'advanced' },
    ],
  },
  {
    heading: 'Audio Generation',
    level: 'reading',
    items: [
      { name: 'WaveNet', url: 'https://arxiv.org/abs/1609.03499' },
      { name: 'SampleRNN', url: 'https://sander.ai/2020/03/24/audio-generation.html' },
      { name: 'GANSynth', url: 'https://magenta.tensorflow.org/gansynth' },
      { name: 'DDSP', url: 'https://magenta.tensorflow.org/ddsp' },
      { name: 'DiffWave', url: 'https://arxiv.org/abs/2009.09761' },
      { name: 'AudioGen', url: 'https://arxiv.org/abs/2209.15352' },
      { name: 'Awesome AI Music Generation (long list)', url: 'https://github.com/Curated-Awesome-Lists/awesome-ai-music-generation' },
    ],
  },
  {
    heading: 'Transcription',
    level: 'reading',
    items: [
      { name: 'Onsets and Frames', url: 'https://magenta.tensorflow.org/onsets-frames' },
      { name: 'MT3', url: 'https://openreview.net/forum?id=iMSjopcOn0p' },
      { name: 'Basic Pitch (Spotify, audio-to-MIDI)', url: 'https://basicpitch.spotify.com/', level: 'easy' },
    ],
  },
  {
    heading: 'Tagging & Classification',
    level: 'reading',
    items: [
      { name: 'musicnn', url: 'https://www.upf.edu/web/mtg/blog/-/asset_publisher/pYSKGP3RLdWn/content/musicnn-an-open-source-deep-learning-based-music-tagger' },
      { name: 'PANNs', url: 'https://arxiv.org/abs/1912.10211' },
      { name: 'Tagging Transformer', url: 'https://mac.kaist.ac.kr/~juhan/gct634/Slides/KAIST_May_20_2024_Scalable_Music_Representation_Learning.pdf' },
      { name: 'CLAP', url: 'https://medium.com/axinc-ai/clap-feature-extraction-model-for-searching-audio-from-text-dcfd4c93756e' },
      { name: 'MERT', url: 'https://huggingface.co/m-a-p/MERT-v1-330M', level: 'advanced' },
    ],
  },
  {
    heading: 'Source Separation',
    level: 'advanced',
    items: [
      { name: 'Spleeter', url: 'https://www.theoj.org/joss-papers/joss.02154/10.21105.joss.02154.pdf', level: 'reading' },
      { name: 'Open-Unmix', url: 'https://sigsep.github.io/open-unmix/' },
      { name: 'Demucs', url: 'https://github.com/facebookresearch/demucs' },
      { name: 'BS-RoFormer', url: 'https://github.com/lucidrains/BS-RoFormer' },
      { name: 'Ultimate Vocal Remover', url: 'https://github.com/Anjok07/ultimatevocalremovergui', level: 'moderate' },
    ],
  },
  {
    heading: 'Singing Synthesis',
    level: 'reading',
    items: [
      { name: 'HiFiSinger', url: 'https://arxiv.org/abs/2009.01776' },
      { name: 'DiffSinger', url: 'https://arxiv.org/abs/2105.02446' },
    ],
  },
  {
    heading: 'Datasets',
    level: 'advanced',
    items: [
      { name: 'Lakh MIDI Dataset', url: 'https://colinraffel.com/projects/lmd/' },
      { name: 'MAESTRO (piano audio + MIDI)', url: 'https://magenta.tensorflow.org/datasets/maestro' },
      { name: 'Groove MIDI Dataset (drums)', url: 'https://magenta.tensorflow.org/datasets/groove' },
      { name: 'NSynth', url: 'https://magenta.tensorflow.org/datasets/nsynth' },
      { name: 'GiantMIDI-Piano', url: 'https://github.com/bytedance/GiantMIDI-Piano' },
      { name: 'Aria-MIDI', url: 'https://huggingface.co/datasets/loubb/aria-midi' },
      { name: 'GigaMIDI', url: 'https://huggingface.co/datasets/Metacreation/GigaMIDI' },
      { name: 'POP909', url: 'https://github.com/music-x-lab/POP909-Dataset' },
      { name: 'Slakh2100 (multitrack)', url: 'http://www.slakh.com/' },
      { name: 'MUSDB18 (source separation)', url: 'https://sigsep.github.io/datasets/musdb.html' },
      { name: 'Free Music Archive (FMA)', url: 'https://github.com/mdeff/fma' },
      { name: 'MTG-Jamendo', url: 'https://github.com/MTG/mtg-jamendo-dataset' },
      { name: 'MusicCaps (text–music pairs)', url: 'https://www.kaggle.com/datasets/googleai/musiccaps' },
      { name: 'Song Describer Dataset', url: 'https://github.com/mulab-mir/song-describer-dataset' },
    ],
  },
  {
    heading: 'Python Libraries',
    level: 'advanced',
    items: [
      { name: 'librosa (audio analysis)', url: 'https://librosa.org/' },
      { name: 'Essentia', url: 'https://essentia.upf.edu/' },
      { name: 'music21 (symbolic analysis)', url: 'https://web.mit.edu/music21/' },
      { name: 'pretty_midi', url: 'https://github.com/craffel/pretty-midi' },
      { name: 'MidiTok (MIDI tokenization)', url: 'https://github.com/Natooz/MidiTok' },
      { name: 'mirdata (dataset loaders)', url: 'https://github.com/mir-dataset-loaders/mirdata' },
    ],
  },
];
