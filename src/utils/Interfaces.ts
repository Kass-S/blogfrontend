export interface IBlogsItems {
    id: number
    userId: number
    publisherName: string
    date: string
    title: string
    image: string 
    description: string 
    category: string 
    isPublished: boolean
    isDeleted: boolean
}

//this will be used for our login and create account fetch
export interface IUserInfo {
    username: string 
    password: string
}

//this will be used to fetch our user data id and name
export interface IUserData {
    id: number
    username: string
}

//interface fo getting our token
export interface IToken {
    token: string
}