import { debounce, getImageSize } from "@/lib/utils"

const TransformedImage = ({ image, type, title, isTransforming, setIsTransforming, transformationConfig, hasDownload=false}) => {
  const downloadHandler = () => {

  }  
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {hasDownload && (
          <button className="download-btn" onClick={downloadHandler}>
            <img src="/icons/download.svg" alt="Download" width={24} height={24} className="pb-[6px]" />
          </button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative"> 
          <img src={image.secureURL} alt={image.title} className="transformed-image"
            sizes="(max-width: 767px) 100vw, 50vw"
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            onLoad={() => {
              setIsTransforming() && setIsTransforming(false)
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming() && setIsTransforming(false)
              }, 8000)
            }}
            {...transformationConfig}
          />

          {isTransforming && (
            <div className="transforming-loader">
              <img src="/icons/spinner.svg" alt="transforming" width={50} height={50} />
            </div>
          )}

        </div>
      ):( 
        <div className="transformed-placeholder">
          Transformed image
        </div>
      )}
      
    </div>
  )
}

export default TransformedImage