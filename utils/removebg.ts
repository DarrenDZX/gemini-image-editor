export async function removeBackground(imageDataUrl: string): Promise<string> {
  const apiKey = process.env.REMOVEBG_API_KEY as string;

  if (!apiKey) {
    throw new Error('removebg API key is not configured');
  }

  // Convert data URL to blob
  const base64Data = imageDataUrl.split(',')[1];
  const mimeType = imageDataUrl.match(/data:([^;]+);/)?.[1] || 'image/png';
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  // Create form data
  const formData = new FormData();
  formData.append('image_file', blob, 'image.png');
  formData.append('size', 'auto');

  // Call removebg API
  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`removebg API error: ${response.status} - ${errorText}`);
  }

  // Convert response to data URL
  const resultBlob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(resultBlob);
  });
}
