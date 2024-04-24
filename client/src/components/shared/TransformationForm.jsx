import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { useEffect, useState, useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { debounce, deepMergeObjects } from "@/lib/utils"
import axios from "axios"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { InsufficientCreditsModal } from "./InsufficientCredit"

const baseURL = import.meta.env.VITE_BACKEND_API_URI;

const formSchema = z.object({
  title: z.string().optional(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})

const TransformationForm = ({ action, data=null , userId, type, creditBalance, config=null}) => {

  const tranformationType = transformationTypes[type]

  const [image, setImage] = useState(data)
  const [newTransformation, setNewTransformation] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)
  const [isPending, startTransition] = useTransition()

  // this will only populating the form in case we are updating the existing image
  const intialValues = data && action === 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  }: defaultValues

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: intialValues,
  })

  async function onSubmit(values) {
    setIsSubmitting(true)
    
    if(data || image){
      const tranformationUrl = getCldImageUrl({
        width: image?.width, 
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      })

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        tranformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        tranformationURL: tranformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color
      }

      if(action === 'Add'){
        try {
          const newImage = await axios.post(`${baseURL}/image`, {
            image: imageData,
            userId,
          })

          if(newImage){
            form.reset()
            setImage(data)
          }
        } catch (error) {
            console.log(error)
        }
      }

      if(action === 'Update'){
        try {
          await axios.put(`${baseURL}/image`, {
            image: { ...imageData, id: data._id},
            userId
          })
        } catch (error) {
          console.log(error)
        }
      }
    }

    setIsSubmitting(false)
  }

  const onSelectFieldHandler = (value, onChangeField) =>{
    const imageSize = aspectRatioOptions[value]
    setImage((prevState) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height
    }))
    setNewTransformation(tranformationType.config)

    return onChangeField(value)
  }
  
  const onInputChangeHandler = (fieldName, value, type, onChangeField) => {
    debounce(() => {
      setNewTransformation((prev) => ({
        ...prev,
        [type]: {
          ...prev?.[type],
          [fieldName==='prompt'?'prompt':'to']: value
        }
      }))

      return onChangeField(value)
    }, 1000)
  }

  // TODO: Return back
  const onTransformHandler = async() => {
    setIsTransforming(true)
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    )

    setNewTransformation(null)

    startTransition(async () => {
      axios.post(`${baseURL}/users/updateCredit`, {userId, creditFee})
    })
  }


  useEffect(() => {
    if(image && type==='restor' || type==='removeBackground')
      setNewTransformation(tranformationType.config)
  }, [image, tranformationType.config, type])
  
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <CustomField 
          control={form.control} 
          name="title" 
          formLabel="Image Title" 
          className="w-full" 
          render={({field}) => <Input {...field} className="input-field" />} 
        />

        {type==='fill' && (
          <CustomField
            control={form.control} 
            name="aspectRatio" 
            formLabel="Aspect Ratio" 
            className="w-full"             
            render={({ field }) => (
              <Select onValueChange={(value) => onSelectFieldHandler(value, field.onChange)} value={field.value}>
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item"> 
                      {aspectRatioOptions[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type==='remove' || type==='recolor') && (
          <div className="promt-field">
            <CustomField 
              control={form.control}
              name="promt"
              formLabel={type==='remove' ? 'Object to remove': 'Object to recolor'}
              className="w-full"
              render={(({field}) => (
                <Input 
                  value={field.value} 
                  className="input-field"
                  onChange={(e) => onInputChangeHandler('prompt', e.target.value, type, field.onChange)}  
                />
              ))}
            />

            {type==='recolor' && (
              <CustomField 
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({field}) => (
                  <Input 
                    value={field.value} 
                    className="input-field"
                    onChange={(e) => onInputChangeHandler('color', e.target.value, 'recolor', field.onChange)} 
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control} 
            name="publicId" 
            className="flex size-full flex-col" 
            render={({field}) => 
              <MediaUploader 
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            } 
          />

          <TransformedImage 
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button type="button" 
            className="submit-button capitalize" 
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming?'Transforming...' : 'Apply Transformation'}
          </Button>

          <Button type="submit" 
            className="submit-button capitalize" 
            disabled={isSubmitting}
          >
            {isSubmitting?'Submitting...' : 'Save Image'}
          </Button>

        </div>
      </form>
    </Form>
  )
}

export default TransformationForm