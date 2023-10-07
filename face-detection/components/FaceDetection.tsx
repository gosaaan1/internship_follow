import { useState } from 'react';
import Dropzone from 'react-dropzone';

const FaceDetection = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append('file', uploadedFile);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    }).then((response) => {
        response.json();
    }).then((json) => {
        console.log(json);
    }).catch((error) => {
        console.error('Error on submit:', error);
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg">
      <div>顔をマスクする</div>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="border-dashed border-4 border-gray-300 p-4 mb-4 cursor-pointer"
          >
            <input {...getInputProps()} />
            {uploadedFile ? (
              <img src={URL.createObjectURL(uploadedFile)} />
            ) : (
              <p>ここに画像をドラッグ・アンド・ドロップしてください</p>
            )}
          </div>
        )}
      </Dropzone>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={!uploadedFile}
      >
        画像をマスク
      </button>
    </div>
  );
};

export default FaceDetection;
