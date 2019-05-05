var pdfSoundAudio = new Audio();

function playPdfSound(stamp)
{
    const soundId = stamp.dataset['annotationId'].replace('R','');
    pdfSoundAudio.src = `audios/${soundId}.mp3`;
    pdfSoundAudio.play();
}