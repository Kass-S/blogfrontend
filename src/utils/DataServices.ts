import { IBlogsItems, IUserData, IUserInfo } from "./Interfaces"


const url = "https://spacekkblog-g8fzhrd2ecc2fnf2.westus-01.azurewebsites.net/"

//this variable will be used in our getBlog by user id fetch when se set them up

let userData: IUserData;

//create account fetch
export const createAccount = async (user: IUserInfo) => {
    const res = await fetch(url + 'User/CreateUser', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(user)
    });
    //if our response is not ok we will run this block
    if(!res.ok){
        const data = await res.json();
        const message = data.message;
        console.log(message);
        return data.success;
    }

    const data = await res.json();
    return data.success;
}

//login fetch
export const login = async (user:IUserInfo) => {
    const res = await fetch(url + 'User/Login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(user)
    });

    if(!res.ok){
        const data = await res.json();
        const message = data.message;
        console.log(message);
        return null;
    }

    const data = await res.json();
    return data;
}

//get logged data fetch
export const getLoggedInUserData = async (username:string) => {
    const res = await fetch(url + `User/GetUserInfoByUsername/${username}`);

    if(!res.ok){
        const data = await res.json();
        const message = data.message;
        console.log(message);
        return null;
    }

    userData = await res.json();
    //we're not going to use this data inside of a variable we will make a separate function for implementation
    return userData;
}

//Get the users data
export const loggedInData = () => {
    return userData;
}

//we're checking if the token is in our storage (check if logged in)
export const checkToken = () => {
    let result = false;

    if(typeof window != null){
        const lsData = localStorage.getItem("Token");

        if(lsData != null){
            result = true;
        }
    }
    return result;
    
}

// BLOG ENDPOINTS

export const getAllBlogs = async (token:string) => {
    const res = await fetch(url + 'Blog/GetAllBlogs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return [];
    }
    const data = await res.json();
    return data;
}

export const getBlogsByUserId = async (userId:number, token:string) => {
    const res = await fetch(url + 'Blog/GetBlogsByUserId/' + userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return [];
    }
    const data = await res.json();
    return data;
}

export const addBlogItem = async (blog: IBlogsItems, token:string) => {
    const res = await fetch(url + 'Blog/AddBlog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(blog)
    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return false;
    }
    const data = await res.json();
    //return true we have successfully added our blog to our backend db
    return data.success;
}

export const updateBlogItem = async (blog:IBlogsItems, token:string) => {
    const res = await fetch(url + 'Blog/EditBlog', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(blog)
    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return false;
    }
    const data = await res.json();
    return data.success;
}

export const deleteBlogItem = async (blog:IBlogsItems, token:string) => {
    const res = await fetch(url + 'Blog/DeleteBlog', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(blog)
    });
    if(!res.ok){
        const errorData = await res.json();
        const message = errorData.message;
        console.log(message);
        return false;
    }
    const data = await res.json();
    return data.success;
}

export const GetToken = () => {
    return localStorage.getItem('Token') ?? '';
}