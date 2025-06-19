const handleDownload = () => {
  const blob = new Blob(['Mock compressed/decompressed data'], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  let downloadName = 'processed_file';

  if (selectedFile) {
    const originalName = selectedFile.name;
    if (selectedMode === 'compress') {
      downloadName = originalName + '.compressed';
    } else {
      downloadName = originalName.endsWith('.compressed')
        ? originalName.replace(/\.compressed$/, '')
        : originalName + '.decompressed';
    }
  }

  a.href = url;
  a.download = downloadName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  toast({
    title: "Download Started",
    description: "Your file download has begun.",
  });
};

