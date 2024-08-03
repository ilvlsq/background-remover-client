import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState() as any;
  const [uploadImageSrc, setUploadImageSrc] = useState() as any;
  const [images, setImages] = useState([]) as any;
  const [selectedImage, setSelectedImage] = useState() as any;
  const [isLoading, setIsLoading] = useState(false) as any;
  const [aspectRatio, setAspectRatio] = useState("16x9") as any;

  useEffect(() => {
    setSelectedImage(null);
  }, [images, isLoading]);

  const uploadImage = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImageSrc(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);
      setFormData(formData);
    }
  };

  const deleteImage = () => {
    setFormData(null);
    setUploadImageSrc(null);
    setImages([]);
  };

  const doRemoveBackGround = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/remove-bg", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.images) {
        setImages(
          data.images.map((img: any) => `data:image/png;base64,${img}`)
        );
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

  const doFilterImage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/filter", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.images) {
        setImages(
          data.images.map((img: any) => `data:image/png;base64,${img}`)
        );
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;

    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const aspectRatios = ["16x9", "1x1", "3x2", "2x3", "4x3"];
  const pngFrame =
    "https://t3.ftcdn.net/jpg/04/96/63/80/360_F_496638091_v0Y3hmCvb9y8JDKEGyWC455Ex4aNGPen.jpg";

  return (
    <div>
      <div className="flex items-center flex-col justify-center w-full my-10 mx-auto">
        {uploadImageSrc ? (
          <div className="indicator w-fit h-fit">
            <div className="indicator-item indicator-top">
              <button
                className="btn btn-error z-50"
                onClick={deleteImage}
                disabled={isLoading}
              >
                <img
                  className="h-7 w-7"
                  src="https://www.svgrepo.com/show/502615/delete-photo.svg"
                />
              </button>
            </div>
            <img
              className="object-contain max-h-64 max-w-96 rounded-lg"
              src={uploadImageSrc}
              alt="Uploaded"
            />
          </div>
        ) : (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-96 h-64 border-2 border-gray-300 border-dashed rounded-lg transition ease-in-out cursor-pointer bg-transparent hover:bg-base-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={uploadImage}
            />
          </label>
        )}
        <div className="flex flex-col w-96 border-opacity-50 mt-10">
          <button
            className="btn btn-primary grid h-20"
            disabled={!formData || isLoading}
            onClick={doRemoveBackGround}
          >
            Remove BG
          </button>
          <div className="divider">OR</div>
          <button
            className="btn btn-primary grid h-20"
            disabled={!formData || isLoading}
            onClick={doFilterImage}
          >
            Filter
          </button>
        </div>
      </div>
      {isLoading && (
        <progress className="flex progress w-56 mx-auto"></progress>
      )}
      {selectedImage && (
        <div className="card card-compact bg-base-100 shadow-xl flex  max-w-2xl max-h-min mx-auto my-5">
          <div className="flex flex-row justify-between">
            <span>Procesed Image</span>
            <span>Original Image</span>
          </div>
          <div className="diff rounded-lg" id={`ratio-${aspectRatio}`}>
            <div className="diff-item-1">
              {images.length == 1 ? (
                <img alt="daisy" src={pngFrame} />
              ) : (
                <img alt="daisy" src={uploadImageSrc} />
              )}
            </div>
            <div className="diff-item-2">
              <img alt="daisy" src={selectedImage} />
            </div>
            <div className="diff-resizer"></div>
          </div>
          <div className="card-body">
            <div className="card-actions justify-end">
              <div className="dropdown dropdown-left">
                <div tabIndex={0} role="button" className="btn m-1">
                  Choose aspect ratio
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {aspectRatios.map((ratio: string, index: number) => (
                    <li key={index} onClick={() => setAspectRatio(ratio)}>
                      <a>{ratio}</a>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    downloadImage(
                      selectedImage,
                      `image_${new Date().getMilliseconds()}.png`
                    )
                  }
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
        {!isLoading &&
          images.map((imageUrl: string, index: number) => (
            <div
              key={index}
              className="card card-compact bg-base-100 shadow-xl min-w-96 w-fit h-fit"
            >
              <figure className="w-full h-full relative">
                {images.length === 1 && (
                  <img
                    className="w-full h-full z-10 absolute object-cover rounded-lg"
                    src={pngFrame}
                    alt="PNG Frame"
                  />
                )}
                <img
                  className="z-20 relative object-contain w-full h-full max-w-lg rounded-lg"
                  src={imageUrl}
                  alt={`Processed ${index}`}
                />
              </figure>
              <div className="card-body">
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-base-100"
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      downloadImage(
                        imageUrl,
                        `image_${new Date().getMilliseconds()}.png`
                      )
                    }
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
