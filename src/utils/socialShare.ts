export const shareToSocialMedia = (
  designName: string,
  imageDataUrl: string,
  platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp'
) => {
  const text = `Check out my beautiful Pookkalam design "${designName}" created for Onam! 🌸🎨 #Onam #Pookkalam #FlowerArt`;
  const url = window.location.href;

  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
      break;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
      break;
    default:
      // Copy to clipboard as fallback
      navigator.clipboard.writeText(`${text}\n${url}`);
      break;
  }
};

export const downloadCanvasAsImage = (canvas: HTMLCanvasElement, filename: string = 'my-pookkalam.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const getCanvasImageData = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/png');
};