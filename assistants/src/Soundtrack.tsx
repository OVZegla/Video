import React from 'react';
import {Audio, staticFile} from 'remotion';

// Original soundtrack synthesised by scripts/synth-audio.mjs (no third-party
// music): an instrumental bed plus UI sound design placed on the cues of
// src/cues.json.
export const Soundtrack: React.FC = () => <Audio src={staticFile('audio/soundtrack.wav')} />;
