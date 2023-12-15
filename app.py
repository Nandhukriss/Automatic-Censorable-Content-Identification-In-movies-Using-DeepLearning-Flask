
from joblib import load
import io
from flask import Flask, render_template, request, session, send_file,jsonify
from flask_session import Session
from tempfile import mkdtemp
import os
import subprocess
import shutil
from detect import run
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# allowed input image extensions
IMG_EXTENSIONS = ['bmp', 'jpg', 'jpeg', 'png', 'tif', 'tiff', 'dng', 'webp', 'mpo',
'JPG']

# allowed input video extensions
VID_EXTENSIONS = ['mov', 'avi', 'mp4', 'mpg', 'mpeg', 'm4v', 'wmv', 'mkv']

def extract_audio_ffmpeg(video_path, audio_path):
    subprocess.run(['ffmpeg', '-y', '-i', video_path, '-q:a', '0', '-map', 'a', audio_path])

def embed_audio_ffmpeg(video_path, audio_path, output_path):
    # Set a temporary output path
    temp_output_path = output_path.replace('.mp4', '_temp.mp4')

    # Run FFmpeg to embed audio
    subprocess.run(['ffmpeg', '-y', '-i', video_path, '-i', audio_path, '-c:v', 'copy', '-c:a', 'aac', '-strict', 'experimental', temp_output_path])

    # Replace the original file with the temporary one
    shutil.move(temp_output_path, output_path)


def detect(test_input):
    """ 
    Function to detect potholes given an image input
    Parameters:
        test_input: image/video input
    Output:
        image/video with detection
    """
    # weights
    weights_path = 'weights/final.pt'
    # to save the detection
    output_path = 'static/test_out'
    # img dimension
    img_width, img_height = 640, 640
    img_size = [img_width, img_height]
    # confidence threshold
    conf_threshold = 0.5
    # iou threshold
    iou_threshold = 0.5
    # bounding box thickness
    bbox_line_thick = 0

    # run detection
    run(weights=weights_path, 
        source=test_input, 
        imgsz=img_size,
        conf_thres=conf_threshold, 
        iou_thres = iou_threshold,
        project=output_path,
        name='',
        exist_ok=True,
        device='cpu',
        hide_labels=False,
        hide_conf=True,
        line_thickness=bbox_line_thick
    )

# home page
@app.route("/")
def index():
    return render_template(
        "index.html", 
        ori_image="/static/input.png", 
        det_image="/static/result.png",
        fName=None,
        message=None
)
@app.route("/about")
def about():
    return render_template("about.html")



# carryout detection
@app.route("/detection", methods=["GET", "POST"])
def detection():
    file = request.files["test_file"]

    # check if a file is uploaded
    if file:
        # check file extention
        ext = file.filename.split('.')[-1]

        # detection on an image
        if ext in IMG_EXTENSIONS:
            # create a path
            file_path = os.path.join("static/test", file.filename)
            # save the file
            file.save(file_path)
            # carryout detection
            detect(file_path)
            
            return render_template(
                "index.html", type="primary", 
                message="Done!, Image is ready to download", 
                ori_image=f"static/test/{file.filename}", 
                det_image=f"static/test_out/{file.filename}",
                fName=file.filename
            )
        # detection on a video
        elif ext in VID_EXTENSIONS:
            # create a path
            file_path = os.path.join("static/test", file.filename)
            # save the file
            file.save(file_path)

            # Extract audio from the video using FFmpeg
            audio_path = os.path.join("static/test", f"extracted_audio_{file.filename}.mp3")
            extract_audio_ffmpeg(file_path, audio_path)

            detect(file_path)

            # Embed the extracted audio into the detection using FFmpeg
            result_path = os.path.join("static/test_out", file.filename)
            embed_audio_ffmpeg(result_path, audio_path, result_path)

        
            return jsonify({
            'type': 'primary',
            'message': 'Done!, Image/Video is ready to download',
            'ori_image': f'static/test/{file.filename}',
            'det_image': f'static/test_out/{file.filename}',
            'fName': str(file.filename.split('.')[0])+'.mp4',})
    # if no input render an error message        
    else:
        return render_template(
                "index.html", type="danger", 
                message="Please upload a file.",
                ori_image="static/input.png", 
                det_image="static/result.png",
                fName=None
            )

# # download the detection
# @app.route("/download/<fName>", methods=["GET", "POST"])
# def download(fName):
#     det_path = f"static/test_out/{fName}"
#     return send_file(det_path, as_attachment=True)

# # download error handling
# @app.route("/download_error", methods=["GET", "POST"])
# def download_error():
#     return render_template(
#             "index.html", type="danger", 
#             message="Please upload a file and carryout detection.",
#             ori_image="static/input.png", 
#             det_image="static/result.png",
#             fName=None
#         )

if __name__ == "__main__":
    app.run(debug=True)
    # app.run(host="0.0.0.0", port=5000)
