import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { useState, useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { debounce, deepMergeObjects } from "@/lib/utils"
import axios from "axios"

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

  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
      // axios.post(`${baseURL}/users/updateCredit`, {
      //   userId, creditFee
      // })
    })
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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