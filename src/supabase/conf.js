import {supabase} from './supabaseClient.js'

class Service {
    client = new Client()
    databases
    bucket

    constructor(){
        this.client
            .setEndpoint(env.appwriteUrl)
            .setProject(env.projectId)
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }
    // post related services
    async createPost({title, slug, content, featuredImage, userId, author}){
        try {
            return await this.databases.createDocument(
                env.databaseId,
                env.collectionId,
                slug,
                {
                    title,
                    content, 
                    featuredImage,
                    userId,
                    author: JSON.stringify(author),
                }
            )
        } catch (error) {
            console.log('appwrite service :: createPost error :: ', error)
            throw error
        } finally{
            return 'error'
        }
    }
    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                env.databaseId,
                env.collectionId,
                slug,
                {
                    title,
                    content, 
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log('appwrite service :: updatePost error :: ', error)
            throw error
        }
    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                env.databaseId, 
                env.collectionId,
                slug
            )
            return true
        } catch (error) {
            console.log('appwrite service :: deletePost error :: ', error)
            throw error
            return false
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(
                env.databaseId,
                env.collectionId,
                slug
            )
        } catch (error) {
            console.log('appwrite service :: getPost error :: ', error)
            throw error
            return false
        }
    }
    async getPosts(queries = [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                env.databaseId,
                env.collectionId,
                queries
            )
        } catch (error) {
            console.log('appwrite service :: getPosts error :: ', error)
            throw error
            return false
        }
    }
    // file related services
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                env.bucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log('appwrite service :: uploadFile error :: ', error)
            throw error
            return false
        }
    }
    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                env.bucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log('appwrite service :: deleteFile error :: ', error)
            throw error
            return false
        }
    }
    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            env.bucketId,
            fileId
        )
    }
    
}

const service = new Service()

export default service