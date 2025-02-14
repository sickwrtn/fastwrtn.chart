const realUpload = document.querySelector('.real-upload');
const img = document.querySelector('.img-control');


function getImageFiles(event) {
    var reader = new FileReader();

    reader.onload = function(event) {
        img.setAttribute("src",event.target.result);
    }
    reader.readAsDataURL(event.target.files[0]);
    console.log("asd");
}

realUpload.addEventListener('change', getImageFiles);