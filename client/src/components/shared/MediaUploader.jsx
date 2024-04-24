import { useToast } from "../ui/use-toast"
import CloudinaryUploadWidget from "./CloudinaryUploadWidget"
import { getImageSize } from "@/lib/utils"
 

const MediaUploader = ({onValueChange, setImage, image, publicId, type}) => {
  const { toast } = useToast()

  const onUploadSuccessHandle = (result) => {
    console.log('uploadhandle')
    setImage((prevState) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url
    }))

    onValueChange(result?.info?.public_id)

    toast({
      title: 'Image uploaded successfully',
      description: '1 credit was deducted from your account',
      duration: 5000,
      className: 'error-toast'
    })
  }

  const onUploadErrorHandle = () => {
    console.log('error')

    toast({
      title: 'Something went wrong while uploading',
      description: 'Please try again',
      duration: 5000,
      className: 'error-toast'
    })
  }

  return (
    // <div className="grid w-full max-w-sm items-center gap-1.5">
    //   <Label htmlFor="picture">Picture</Label>
    //   <Input id="picture" type="file" />
    // </div>

        // <p className="p-14-medium">Click here to upload image</p>
        <CloudinaryUploadWidget onUploadSuccessHandle={onUploadSuccessHandle} onUploadErrorHandle={onUploadErrorHandle} >
{/* <          {({ open }) => ( */}
            <div className="flex flex-col gap-4">
              <h3 className="h3-bold text-dark-600">Original</h3>

              {publicId ? (
                <div className="cursor-pointer overflow-hidden rounded-[10px]">
                    <img src={image.secureURL} alt="image" className="media-uploader_cldImage"
                      sizes="(max-width: 767px) 100vw, 50vw"
                      width={getImageSize(type, image, "width")}
                      height={getImageSize(type, image, "height")}
                    />
                    {/* <AdvancedImage cldImg={image.url} /> */}
                </div>
              ):(
                <div className="media-uploader_cta">
                  <div className="media-uploader_cta-image">
                    <img 
                      src="/icons/add.svg"
                      alt="Add Image"
                      width={24}
                      height={24}
                    />
                  </div>
                  <p className="p-14-medium">Click here to upload image</p>
                </div>
              )}
            </div>
          {/* )}> */}
        </CloudinaryUploadWidget>
    
  )
}

export default MediaUploader