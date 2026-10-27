"""DSP helpers for every Inner Devil Films mix (from LUST, 27 Oct 2026): loading and decoding, a phase-vocoder pitch
shift, reverb, synthesized hits, BS.1770 loudness and a true-peak limiter. 48 kHz stereo float throughout.
Needs numpy, scipy and soundfile (bin/cloud-setup.sh installs them) and ffmpeg for decoding the ElevenLabs mp3s."""
import os
import shutil
import subprocess
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
rng = np.random.default_rng(7)


def load(path):
    x, sr = sf.read(path, dtype='float32', always_2d=True)
    assert sr == SR, (path, sr)
    return x if x.shape[1] == 2 else np.repeat(x, 2, axis=1)


def ffmpeg():
    for c in (os.environ.get('FFMPEG'), shutil.which('ffmpeg'), os.path.expanduser('~/.cache/cp/bin/ffmpeg')):
        if c and os.path.exists(c):
            return c
    raise SystemExit('mixlib: ffmpeg is missing')


def src(film_dir, name):
    """a sound of the film by name, 'music_SCORE' or 'sfx_smash': audio/wav/<name>.wav, decoded from
    audio/<music|sfx|takes>/<id>.mp3 the first time (the wavs are git-ignored; the mp3s are the sources)"""
    wav = os.path.join(film_dir, 'audio', 'wav', name + '.wav')
    if not os.path.exists(wav):
        sub, ident = name.split('_', 1)
        mp3 = os.path.join(film_dir, 'audio', sub, ident + '.mp3')
        os.makedirs(os.path.dirname(wav), exist_ok=True)
        subprocess.run([ffmpeg(), '-v', 'error', '-y', '-i', mp3, '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', wav], check=True)
    return load(wav)


def master(x, target=-14.0, ceiling=-2.0):
    """loudness to target LUFS, then a true-peak ceiling (AAC adds about half a dB, so -2 dBTP keeps the upload under -1)"""
    x = x * db(target - lufs(x)); x = limit(x, ceiling)
    x = x * db(target - lufs(x)); return limit(x, ceiling)


def write(path, x):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    sf.write(path, x.astype(np.float32), SR, subtype='PCM_24')


def db(v):
    return 10 ** (v / 20)


def mono(x):
    return x.mean(axis=1) if x.ndim == 2 else x


def stereo(m, pan=0.0):
    return np.stack([m * np.sqrt((1 - pan) / 2) * np.sqrt(2), m * np.sqrt((1 + pan) / 2) * np.sqrt(2)], axis=1)


def fade(x, fi=0.005, fo=0.005):
    x = x.copy(); n = len(x)
    a, b = min(n, int(fi * SR)), min(n, int(fo * SR))
    if a: x[:a] *= np.linspace(0, 1, a)[:, None] if x.ndim == 2 else np.linspace(0, 1, a)
    if b: x[n - b:] *= np.linspace(1, 0, b)[:, None] if x.ndim == 2 else np.linspace(1, 0, b)
    return x


def filt(x, kind, f, order=2):
    sos = signal.butter(order, f, btype=kind, fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


# ---------- pitch: phase vocoder stretch, then resample back to length ----------
def _stft(x, n, hop):
    x = np.pad(x, (n, n)); win = np.hanning(n)
    return np.array([np.fft.rfft(win * x[i:i + n]) for i in range(0, len(x) - n, hop)])


def _istft(S, n, hop, length):
    win = np.hanning(n); out = np.zeros(hop * len(S) + n); ws = np.zeros_like(out)
    for k, spec in enumerate(S):
        out[k * hop:k * hop + n] += win * np.fft.irfft(spec, n); ws[k * hop:k * hop + n] += win ** 2
    return (out / np.maximum(ws, 1e-6))[n:n + length]


def stretch(x, rate, n=2048, hop=256):
    """rate > 1 plays faster (shorter), pitch unchanged"""
    S = _stft(x, n, hop); omega = 2 * np.pi * hop * np.arange(S.shape[1]) / n
    phase = np.angle(S[0]); out = []
    for s in np.arange(0, len(S) - 1, rate):
        i = int(s); f = s - i
        out.append(((1 - f) * np.abs(S[i]) + f * np.abs(S[i + 1])) * np.exp(1j * phase))
        d = np.angle(S[i + 1]) - np.angle(S[i]) - omega
        phase = phase + omega + d - 2 * np.pi * np.round(d / (2 * np.pi))
    return _istft(np.array(out), n, hop, int(len(x) / rate))


def pitch(x, semis):
    f = 2 ** (semis / 12)
    return signal.resample(stretch(x, 1 / f), len(x))


def reverb(x, secs=1.4, wet=0.3, dark=3500):
    n = int(secs * SR); t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t * 6.9 / secs)
    ir = filt(ir, 'low', dark); ir /= np.sqrt((ir ** 2).sum())
    w = signal.fftconvolve(x, ir)
    dry = np.pad(x, (0, len(w) - len(x)))
    return (1 - wet) * dry + wet * w * 0.9


def demon(x, depth=1.0):
    """the kind voice turned into its real one: lower, doubled an octave down, gritty, in a dark room"""
    x = mono(x)
    y = pitch(x, -4 * depth) + db(-12) * pitch(x, -12) * depth + db(-9) * x   # enough of the original keeps the words clear
    y = np.tanh(1.6 * y) / np.tanh(1.6)
    y = filt(filt(y, 'high', 60), 'low', 7500)
    return reverb(y, 1.5, 0.24, 3200)


def kind(x):
    x = filt(mono(x), 'high', 80)
    return reverb(x, 0.6, 0.12, 6000)


# ---------- synthesized sound effects (mono) ----------
def tsec(d):
    return np.arange(int(d * SR)) / SR


def thump(f0=55, d=0.6, drop=0.5):
    t = tsec(d); f = f0 * (1 + drop * np.exp(-t * 18))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) + 0.25 * filt(rng.standard_normal(len(t)), 'low', 900) * np.exp(-t * 40)


def heartbeat():
    b = np.zeros(int(0.9 * SR)); a = thump(48, 0.35, 0.3) * 0.9; c = thump(44, 0.35, 0.3) * 0.6
    b[:len(a)] += a; s = int(0.24 * SR); b[s:s + len(c)] += c[:len(b) - s]
    return b


def ping(f1=1320, f2=1760, d=0.32):
    t = tsec(d); half = len(t) // 2
    y = np.sin(2 * np.pi * f1 * t) * (t < d / 2) + np.sin(2 * np.pi * f2 * t) * (t >= d / 2)
    return y * np.exp(-((t % (d / 2)) * 14)) * 0.35


def whoosh(d=0.3, lo=400, hi=4000):
    n = rng.standard_normal(int(d * SR)); t = tsec(d)
    y = filt(filt(n, 'high', lo), 'low', hi) * np.sin(np.pi * t / d) ** 2
    return y * 0.5


def glitch(d=0.4):
    n = int(d * SR); y = np.zeros(n); i = 0
    while i < n:
        L = int(rng.integers(200, 2400)); seg = rng.standard_normal(L) if rng.random() < .6 else np.sign(np.sin(np.arange(L) * rng.uniform(.05, .4)))
        y[i:i + L] += (np.round(seg[:max(0, min(L, n - i))] * 4) / 4) * rng.uniform(.2, .7); i += L + int(rng.integers(0, 1600))
    return filt(y, 'high', 300) * 0.5


def click(d=0.03, f=3000):
    t = tsec(d); return np.sin(2 * np.pi * f * t) * np.exp(-t * 300) * 0.4


def tick():
    y = click(0.04, 2200) * 0.6; y[:int(.02 * SR)] += click(0.02, 5200) * 0.3
    return y


def drip():
    t = tsec(0.25); f = 1500 * np.exp(-t * 6) + 500
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 22) * 0.22


def bed(d, lo=40, hi=400, level=1.0):
    return filt(filt(rng.standard_normal(int(d * SR)), 'high', lo), 'low', hi) * level


def steps(d, rate=4.8):
    y = np.zeros(int(d * SR))
    for k in range(int(d * rate)):
        s = int(k / rate * SR + rng.integers(-400, 400)); g = filt(rng.standard_normal(int(.07 * SR)), 'band', [500, 3500])
        g *= np.exp(-tsec(.07) * 60) * (0.7 + 0.3 * rng.random())
        if 0 <= s < len(y) - len(g): y[s:s + len(g)] += g
    return y * 0.5


def boom(d=2.5):
    t = tsec(d); f = 42 * (1 + 0.8 * np.exp(-t * 10))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6) + 0.4 * filt(rng.standard_normal(len(t)), 'low', 1800) * np.exp(-t * 9)
    return reverb(y, 2.0, 0.35, 2500)[:len(t) + int(SR)]


def drone(d=5, f=36.7):
    t = tsec(d)
    y = sum(np.sin(2 * np.pi * f * k * t + k) / k for k in (1, 2, 3)) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.3 * t))
    return filt(y, 'low', 300) * 0.5


def varispeed(x, r0, r1):
    """play through x while the speed slides from r0 to r1 (a warping tape)"""
    m = mono(x); rates = np.linspace(r0, r1, len(m)); pos = np.cumsum(rates); pos = pos[pos < len(m) - 1]
    return np.interp(pos, np.arange(len(m)), m)


# ---------- loudness (ITU-R BS.1770) and a true-peak limiter ----------
def lufs(x):
    k = signal.lfilter([1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585], x, axis=0)
    k = signal.lfilter([1.0, -2.0, 1.0], [1, -1.99004745483398, 0.99007225036621], k, axis=0)
    blk, hop = int(.4 * SR), int(.1 * SR)
    z = np.array([(k[i:i + blk] ** 2).mean(axis=0).sum() for i in range(0, len(k) - blk, hop)])
    l = -0.691 + 10 * np.log10(np.maximum(z, 1e-12)); z = z[l > -70]
    rel = -0.691 + 10 * np.log10(z.mean()) - 10
    z = z[-0.691 + 10 * np.log10(z) > rel]
    return -0.691 + 10 * np.log10(z.mean())


def true_peak(x):
    return 20 * np.log10(np.abs(signal.resample_poly(x, 4, 1, axis=0)).max() + 1e-12)


def limit(x, ceiling_db=-1.5):
    """true-peak limiter: hold the needed reduction around each (4x oversampled) peak, smooth it, then clip as a safety"""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    c = db(ceiling_db)
    up = np.abs(signal.resample_poly(x, 4, 1, axis=0)).max(axis=1).reshape(-1, 4).max(axis=1)[:len(x)]
    w = int(.01 * SR)
    g = uniform_filter1d(minimum_filter1d(np.minimum(1, c / np.maximum(up, 1e-9)), 2 * w), w)
    return np.clip(x * g[:, None], -c, c)
