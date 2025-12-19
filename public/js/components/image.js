function previewImage(event) {
    const img = document.getElementById('coverPreview');
    img.src = URL.createObjectURL(event.target.files[0]);
}