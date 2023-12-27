# ACCIM

## Tech Stack

**Client:** HTML, CSS, Bootstrap,Javascript 

**Server:** Flask

## FAQ

#### Can the system detect both images and videos?

Yes, the system is capable of detecting both images and videos

#### How does the system detect censorable contents?

The system utilizes the YOLOv5 algorithm for content detection. YOLOv5 (You Only Look Once) is an object detection algorithm that can quickly and accurately detect objects, including censorable content, in images and videos.

#### Where were the models trained?

The models were trained on a platform called Roboflow, and I used my custom dataset for the training process. Roboflow provides tools for managing and training computer vision models with custom datasets.


## Installation

Install with pip:

```
pip install -r requirements.txt
```
## Run Flask
### Run flask for develop
```
python app.py
```
In flask, Default port is `5000`

## 1.Instructions For Users 
![front](https://github.com/Nandhukriss/Automatic-Censorable-Content-Identification-In-movies-Using-DeepLearning-Flask/assets/103727372/d25824d8-4d99-4f23-b3db-1563fe80ee84)

## 2.Image Censoring
![picoout](https://github.com/Nandhukriss/Automatic-Censorable-Content-Identification-In-movies-Using-DeepLearning-Flask/assets/103727372/31120b3d-9775-4a67-a983-5774da7a55fb)


## 3.Video Censoring 
![videoprocessing](https://github.com/Nandhukriss/Automatic-Censorable-Content-Identification-In-movies-Using-DeepLearning-Flask/assets/103727372/e075df09-d515-4528-a5e0-3aaaa1b25875)
## 4.Result
![result1](https://github.com/Nandhukriss/Automatic-Censorable-Content-Identification-In-movies-Using-DeepLearning-Flask/assets/103727372/daf77342-ead3-4a82-a8ac-66ed8879f78e)

