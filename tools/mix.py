#!/usr/bin/env python3
"""mix.py: the only way a video's audio is mixed (owner's rule, references/specs.md section 6).

  Music bed: gated RMS set to the voice's gated RMS - 19 dB, the level under the owner's eight model videos
             (measured in their pauses: -17.8 to -19.7 dB, median -18.9).
  SFX:       gated RMS at the voice - 6 dB or less, capped so no 50 ms of effects is louder than the narration's loud
             syllables (the 95th percentile of its 50 ms levels): no hit pokes out over the narration.
  Whole mix: one linear gain to about -15 LUFS, then a peak limiter at -1.5 dBFS. No ducking, no compression.
  The voice itself is never touched (no edit, no re-time): it only shares the whole-mix gain.

usage: python3 mix.py <P> [--lufs -15]
  in:  P/voice/voice.wav, P/voice/bed.wav, P/voice/sfx.wav (render.mjs writes the last two)
  out: P/voice/mix.wav, P/mix.js (window.MIX_AUDIO, so the preview plays the final mix), a level report.
       Exit 1 if a rule can't be met (no voice, no music bed).
       python3 mix.py --test   checks the gated-RMS meter on synthetic signals.

Gated RMS: mean square over 400 ms blocks (100 ms hop), blocks under -70 dBFS dropped, then blocks more than 10 dB
under the mean of the rest dropped (the loudness-meter gate, without K-weighting); the RMS of what's left.
"""
import array, base64, math, operator, os, re, subprocess, sys

SR = 48000
BED = 10 ** (-19 / 20)  # -19 dB: the music bed under the model videos (owner, 2026-11-14)
HALF = 10 ** (-6 / 20)  # -6 dB, "50 %": the most the effects may sit at


def db(x):
    return 20 * math.log10(x) if x > 0 else -math.inf


def read(path):  # interleaved stereo float32 at 48 kHz
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    a = array.array('f'); a.frombytes(raw)
    return a


def mean_squares(a, frames):  # mean square of each `frames`-long chunk, both channels
    m = 2 * frames
    return [sum(map(operator.mul, a[i:i + m], a[i:i + m])) / m for i in range(0, len(a) - m + 1, m)]


def loud_syllables(a):  # the narration's 95th-percentile 50 ms level (silence left out)
    w = sorted(x for x in mean_squares(a, SR // 20) if x > 10 ** (-70 / 10))
    return math.sqrt(w[int(len(w) * 0.95)]) if w else 0.0


def gated_rms(a):
    hop = mean_squares(a, SR // 10)
    blocks = [sum(hop[i:i + 4]) / 4 for i in range(len(hop) - 3)]
    blocks = [b for b in blocks if b > 10 ** (-70 / 10)]
    if not blocks:
        return 0.0
    rel = sum(blocks) / len(blocks) * 10 ** (-10 / 10)
    blocks = [b for b in blocks if b > rel]
    return math.sqrt(sum(blocks) / len(blocks))


def loudest_50ms(a):  # (rms, time in s) of the loudest 50 ms
    w = mean_squares(a, SR // 20)
    if not w:
        return 0.0, 0.0
    i = max(range(len(w)), key=w.__getitem__)
    return math.sqrt(w[i]), i * 0.05


def ff(*args, **kw):
    return subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-y', *args], capture_output=True, text=True, **kw)


def test():
    tone = array.array('f', [0.5 * math.sin(2 * math.pi * 440 * n / SR) for n in range(SR) for _ in (0, 1)])
    quiet = array.array('f', [0.0] * (2 * SR))
    r = gated_rms(tone + quiet)  # a second of tone, a second of silence: the gate ignores the silence
    assert abs(db(r) - db(0.5 / math.sqrt(2))) < 1.0, db(r)
    assert gated_rms(quiet) == 0.0
    peak, t = loudest_50ms(quiet + tone)
    assert abs(t - 1.0) < 0.06 and abs(peak - 0.5 / math.sqrt(2)) < 0.01, (peak, t)
    print('mix.py self-test OK')


def main():
    if '--test' in sys.argv:
        return test()
    P = os.path.abspath(sys.argv[1])
    lufs = float(sys.argv[sys.argv.index('--lufs') + 1]) if '--lufs' in sys.argv else -15.0
    V = lambda f: os.path.join(P, 'voice', f)
    for f in ('voice.wav', 'bed.wav', 'sfx.wav'):
        if not os.path.exists(V(f)):
            sys.exit(f'mix.py: missing {V(f)} (voice.mjs makes voice.wav; render.mjs --audio makes bed.wav and sfx.wav)')
    voice, bed, sfx = read(V('voice.wav')), read(V('bed.wav')), read(V('sfx.wav'))
    v, b, s = gated_rms(voice), gated_rms(bed), gated_rms(sfx)
    if v == 0:
        sys.exit('mix.py: the voice is silent')
    if b == 0:
        sys.exit('mix.py: no music bed: add k.music(...) under the whole piece in sound(k) (references/build.md, Sound)')
    g_bed = v * BED / b
    s_peak, s_at = loudest_50ms(sfx)
    v_loud = loud_syllables(voice)
    g_sfx = min(v * HALF / s, v_loud / s_peak) if s else 0.0  # 50 % or less, and no hit over the narration's loud syllables

    stems = ('[0:a]aformat=sample_rates=48000:channel_layouts=stereo[v];'
             f'[1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={g_bed:.6f}[b];'
             f'[2:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={g_sfx:.6f}[s];'
             '[v][b][s]amix=inputs=3:duration=longest:normalize=0')
    ins = ['-i', V('voice.wav'), '-i', V('bed.wav'), '-i', V('sfx.wav')]
    meter = ff(*ins, '-filter_complex', stems + ',ebur128', '-f', 'null', '-').stderr
    found = re.findall(r'I:\s*(-?[\d.]+) LUFS', meter)
    if not found:
        sys.exit('mix.py: could not measure the mix loudness:\n' + meter[-400:])
    gain = lufs - float(found[-1])  # the one linear gain on the whole mix
    limit = 10 ** (-1.5 / 20)       # then only a peak limiter (no auto level, delay compensated)
    out = ff(*ins, '-filter_complex', stems + f',volume={gain:.3f}dB,alimiter=limit={limit:.4f}:level=0:latency=1',
             '-c:a', 'pcm_s24le', V('mix.wav'))
    if out.returncode:
        sys.exit('mix.py: ffmpeg failed:\n' + out.stderr[-400:])
    mp3 = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', V('mix.wav'), '-b:a', '160k', '-f', 'mp3', '-'],
                         capture_output=True, check=True).stdout
    with open(os.path.join(P, 'mix.js'), 'w') as f:
        f.write(f'window.MIX_AUDIO = "{base64.b64encode(mp3).decode()}";\n')

    rel = lambda x: f'{db(x) - db(v):+.1f} dB'
    print(f'voice      gated RMS {db(v):.1f} dBFS (reference)')
    print(f'music bed  {rel(b * g_bed)} to the voice (rule -19.0)')
    if s:
        print(f'sfx        {rel(s * g_sfx)} to the voice (rule -6.0 or slightly less); loudest 50 ms {rel(s_peak * g_sfx)} at {s_at:.2f} s (cap {rel(v_loud)}, the loud syllables)')
        if db(s * g_sfx) - db(v) < -9:
            print(f'  note: the hit at {s_at:.2f} s holds every effect down; even it out in sound(k) so the rest can sit at -6 dB')
    else:
        print('sfx        none (no effects in sound(k))')
    print(f'whole mix  {gain:+.1f} dB linear to {lufs:.0f} LUFS, then a peak limiter at -1.5 dBFS -> {V("mix.wav")}')


if __name__ == '__main__':
    main()
