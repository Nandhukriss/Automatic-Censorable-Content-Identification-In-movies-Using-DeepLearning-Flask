$(document).ready(function () {

    
    $('#predictButton, #downloadButton').prop('disabled', true);

  $('#fileInput').on('change', function(event) {
    // Enable the button if a file is selected
    
    $('#predictButton').prop('disabled', this.files.length === 0);

    // Display the selected image
    const file = event.target.files[0];

        // Reset the message containers
        $("#message").addClass("d-none");
        $("#unsupported-message").addClass("d-none");

    const allowedExtensions = ['bmp', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'dng', 'webp', 'mpo', 'JPG'];

    if (file && allowedExtensions.includes(file.name.split('.').pop().toLowerCase())) {
        const reader = new FileReader();
        reader.onload = function (e) {
            let placeholderResult='https://th.bing.com/th/id/R.c3e6917c371f3eec0d4af6b4ab5cd652?rik=xOBRQz8KrvenFw&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f10%2fDark-Gray-Photos-Free-Download.png&ehk=eMIx7cw1SzVnUiD1Mb5A44iSiESOrUViHOir52HCX8k%3d&risl=&pid=ImgRaw&r=0'
            $('#uploadedImage').attr('src', e.target.result);
            $('#resultPicture').attr('src', e.target.result);


            $('#uploadedImageCaption').text(file.name);
            $('#resultPictureCaption').text('To View Result Click Censor');

        };
        reader.readAsDataURL(file);
    }
  });
  


    let predictButton = $('#predictButton');
    let downloadForm = $('#downloadForm');
    let loaderContainer = $('.progress-container ');
    // let images = $('#images ');
    predictButton.click(function (e) {
      e.preventDefault();
      // Show the loader
      loaderContainer.removeClass('d-none');
      // images.addClass('d-none');
      
      
      let formData = new FormData($('form')[0]);

      $.ajax({
        type: 'POST',
        url: '/detection',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {

        if(response.done){

          //To show the download button 
          $('#downloadButton').prop('disabled', false);
          $("#message").removeClass("d-none").fadeIn(1000);
        }
        if(response.not_support){

          $("#unsupported-message").removeClass("d-none").fadeIn(1000);
        }
        if(response.img){
          $('#resultPicture').attr('src', response.det_image);
        }


          // Handle the success response here.
          console.log(response);
            // Hide the loader
            loaderContainer.addClass('d-none');
          // images.removeClass("d-none").fadeIn(1000);
          

          if(response.fName){

            // Set the form action link dynamically with fname from JSON response
            downloadForm.attr('action', '/download/' + response.fName);
          } 
        },
        error: function (error) {
          // Handle the error response here.
          console.error(error);
        }
      });
    });
  });
