import { surpriseMePrompts } from '../constant';
import FileSaver from 'file-saver';

export function getRandomPrompt(prompt) {
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];
    if (randomPrompt === prompt) return getRandomPrompt(prompt);
    return randomPrompt;
}

export async function downloadImage(_id, photo) {
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}

export async function deleteImage(_id, photo) {
    try {
    const response = await fetch('http://localhost:8080/api/v1/post', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id, photo }),
      });

      await response.json();
    }
    catch (error) {
        alert(error)
    } finally {
        location.reload();
    }
}