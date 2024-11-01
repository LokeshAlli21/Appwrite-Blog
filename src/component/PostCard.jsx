import React from 'react';
import appwriteService from '../appwrite/conf';
import { Link } from 'react-router-dom';

function PostCard({ $id, title, featuredImage, author}) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-white rounded-xl shadow-md p-2 transition-transform duration-200 hover:scale-105">
        <div className="w-full flex justify-center mb-0">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-xl"
          />
        </div>
        {author && (
          <h3 className=' text-right italic'>~ Author: <span className="font-semibold text-gray-600">{JSON.parse(author).name}</span></h3>
        )}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;