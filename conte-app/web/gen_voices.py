"""Génère assets/audio/<id>.mp3 pour chaque réplique (voix neuronales FR Microsoft Edge).
Narrateur : voix enfantine pétillante ; loup : grosse voix ; cochons : voix aiguë."""
import asyncio, json, sys, pathlib
import edge_tts

VOICES = {
    'narrateur': ('fr-FR-EloiseNeural', '+0%', '+8Hz'),
    'loup':      ('fr-FR-HenriNeural', '-6%', '-18Hz'),
    'cochon':    ('fr-FR-EloiseNeural', '+12%', '+45Hz'),
}
lines = json.load(open(sys.argv[1], encoding='utf-8'))
out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)

async def one(l):
    v, rate, pitch = VOICES.get(l['voice'], VOICES['narrateur'])
    for attempt in range(4):
        try:
            await edge_tts.Communicate(l['text'], v, rate=rate, pitch=pitch).save(str(out / f"{l['id']}.mp3"))
            print('ok', l['voice'], l['text'][:50]); return
        except Exception as e:
            print('retry', attempt, e); await asyncio.sleep(2 + attempt * 3)
    raise SystemExit('échec ' + l['text'])

async def main():
    for l in lines: await one(l)
asyncio.run(main())
