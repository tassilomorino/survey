import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
export default function Dropzone({setFieldValue, avatar}) {
  const [setLogoUrl] = useState(null);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if(acceptedFiles?.length){
    const file = acceptedFiles[0];
      getBase64(file)
    }
    
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    acceptedFiles: "image/*",
    maxFiles:1,
  });


  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      // setFieldValue("avatar",reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }


  return (
    <div>
      <div
        style={{
          backgroundColor: "aliceblue",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the logo file here</p>
          ) : (
            <>
            {avatar && (
              <p>Drag and drop another image or click to select</p>
            )}

            {!avatar&&(
            <p>Drag and drop files here or Click to select files</p>

            )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}
