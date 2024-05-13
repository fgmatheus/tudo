

document.querySelectorAll('.imagem-teste').forEach(function(img) {
img.addEventListener('click', function() {
    var imgSrc = this.src;
    var maxImg = '<img src="' + imgSrc + '" />';
    document.getElementById('imagem-maximizada').innerHTML = maxImg;
    document.getElementById('imagem-maximizada').style.display = 'block';
    });
});

document.getElementById('imagem-maximizada').addEventListener('click', function() {
    this.style.display = 'none';
});
