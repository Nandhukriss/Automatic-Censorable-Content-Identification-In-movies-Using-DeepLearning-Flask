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

    const allowedExtensionsForPic = ['bmp', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'dng', 'webp', 'mpo', 'JPG']
    const allowedExtensionsForVideo = ['mov', 'avi', 'mp4', 'mpg', 'mpeg', 'm4v', 'wmv', 'mkv']

    if (file && allowedExtensionsForPic.includes(file.name.split('.').pop().toLowerCase())) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#uploadedImage').attr('src', e.target.result);
            $('#resultPicture').attr('src', e.target.result);


            $('#uploadedImageCaption').text(file.name);
            $('#resultPictureCaption').text('To View Result Click Censor');

        };
        reader.readAsDataURL(file);
    }
    if (file && allowedExtensionsForVideo.includes(file.name.split('.').pop().toLowerCase())) {
        const reader = new FileReader();
        reader.onload = function (e) {
          $('#inputVideoPic').html(`
          
          <div class='container d-flex justify-content-center  align-items-center flex-column '>
          <h1 class="font-weight-bold text-center mt-2" id="uploadedVideoCaption">To Censor this Click Censor Button🕵🏼</h1>
          <video
            id="my-video"
            class="video-js"
            controls
            preload="auto"
            width="800"
            height="450"
            poster="https://github.com/Nandhukriss/Automatic-Censorable-Content-Identification-In-movies-Using-DeepLearning-Flask/assets/103727372/ae0b3abf-f1a0-48a4-843c-599b105b1bbb"
            data-setup="{}"
          >
            <source src="ayan.mp4" type="video/mp4" class='uploadedVideo'/>
            <source src="ayan.mp4" type="video/webm" class='uploadedVideo' />
            <p class="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a
              web browser that
              <a href="https://videojs.com/html5-video-support/" target="_blank">
                supports HTML5 video
              </a>
            </p>
            </video>
            </div>
   

        `);
        
        
        $('#my-video').attr('style', 'width: 800px; height: 450px;');
            $('.uploadedVideo').attr('src', e.target.result);


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
          $('#resultPictureCaption').text('Here is Your Result');
        }
        if(response.not_support){

          $("#unsupported-message").removeClass("d-none").fadeIn(1000);
        }
        if(response.img){
          $('#resultPicture').attr('src', response.det_image);
        }
        if(response.video){




    // Create a new video element with the censored video source
    const newVideoElement = `
    <div class='container d-flex justify-content-center  align-items-center flex-column '>
    <h1 class="font-weight-bold text-center mt-2" id="uploadedVideoCaption">🎊 Here is the Censored Video 🎊</h1>
        <video
            id="my-video"
            class="video-js"
            controls
            preload="auto"
            width="800"
            height="450"
            poster="https://github.com/Nandhukriss/Automatic-Censorable-Content-Identification-In-movies-Using-DeepLearning-Flask/assets/103727372/638f1a0f-d26f-41ad-8b25-83950faf840c"
            data-setup="{}"
        >
            <source src="${response.det_video}" type="video/mp4" class='uploadedVideo'/>
            <source src="${response.det_video}" type="video/webm" class='uploadedVideo' />
            <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider upgrading to a
                web browser that
                <a href="https://videojs.com/html5-video-support/" target="_blank">
                    supports HTML5 video
                </a>
            </p>
        </video>
        </div>`
        ;
        
        // Replace the existing video container with the new video element
        $('#inputVideoPic').html(newVideoElement);
        $('#my-video').attr('style', 'width: 800px; height: 450px;');



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


