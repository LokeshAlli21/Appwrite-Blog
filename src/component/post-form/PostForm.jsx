import React, { useCallback, useEffect, useState } from 'react'
import { useForm} from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import appwriteService from '../../appwrite/conf'
import { useNavigate } from 'react-router-dom' 
import { useSelector } from 'react-redux'

function PostForm({post, slug}) {
    const [loading, setLoading] = useState(false)
    const {register, handleSubmit,watch,setValue, control , getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)

    const submit = async(data) => {
        setLoading(true)
        if(post) {
            const file = data.image[0]? await appwriteService.uploadFile(data.image[0]) :null
            if(file){
                appwriteService.deleteFile(post.featuredImage)
            }
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file? file.$id :undefined,
            })
    
            if(dbPost){
                setLoading(false)
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0])

            if(file){
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.$id,
                })

                if(dbPost){
                    setLoading(false)
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback(value => {
        if(value && typeof value === 'string'){
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");
        }

        return '';
    }, []);

    useEffect(() => {
        const subscription = watch((value, name) => {
            if(name === 'title'){
                setValue('slug', slugTransform(value.title),{
                    shouldValidate: true
                })
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    },[watch, slugTransform,setValue])

//   return loading? (
//     <div>loading....</div>
//   ) : 
return loading ? (
    <p className="text-center text-gray-500 py-6">Loading...</p>
) : (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap bg-white">
        <div className="w-full md:w-2/3 px-2">
            <Input
                label="Title :"
                placeholder="Title"
                className="mb-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...register("title", { required: true })}
            />
            <Input
                readOnly={post ? true : false}
                label="Slug :"
                placeholder="Slug"
                className="mb-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...register("slug", { required: true })}
                onInput={(e) => {
                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                }}
            />
            <RTE 
                label="Content :" 
                name="content" 
                control={control} 
                defaultValue={getValues("content")} 
                className="border border-gray-300 rounded-lg p-2"
            />
        </div>
        <div className="w-full md:w-1/3 px-2 mt-4 md:mt-0">
            <Input
                label="Featured Image :"
                type="file"
                className="mb-4 border-gray-300"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", { required: !post })}
            />
            {post && (
                <div className="w-full mb-4">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="rounded-lg w-full"
                    />
                </div>
            )}
            <Select
                options={["active", "inactive"]}
                label="Status"
                className="mb-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...register("status", { required: true })}
            />
            <Button 
                type="submit" 
                bgColor={post ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} 
                className="w-full text-white font-semibold py-2 rounded-lg"
            >
                {post ? "Update" : "Submit"}
            </Button>
        </div>
    </form>
);

}

export default PostForm