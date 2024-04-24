import { useEffect, useRef } from "react"

const CloudinaryUploadWidget = (props) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
  const uploadPreset = "imagii";
  const successHandler = props.onUploadSuccessHandle
  const errorHandler = props.onUploadErrorHandle

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: cloudName,
      uploadPreset: uploadPreset,
      multiple: false,
      clientAllowedFormats: ["images"],
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        successHandler(result)
      }
      else if(error){
        errorHandler
      }
    })
  }, [cloudName,errorHandler, successHandler])
  

  return (
    // <div>CloudinaryUploadWidget</div>
    <button onClick={() => widgetRef.current.open()}>
      {props.children}
    </button>
  )
}

export default CloudinaryUploadWidget