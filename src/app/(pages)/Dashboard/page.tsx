'use client'

import { addBlogItem, checkToken, deleteBlogItem, getBlogsByUserId, GetToken, loggedInData, updateBlogItem } from '@/utils/DataServices'
import React, { useEffect, useState } from 'react'
import { Button, Dropdown, DropdownItem, FileInput, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextInput, Accordion, AccordionContent, AccordionPanel, AccordionTitle, ListGroup } from 'flowbite-react'
import { IBlogsItems } from '@/utils/Interfaces'
import BlogEntries from '@/utils/BlogEntries.json'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

const page = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  //these use states will be fore our form
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogImage, setBlogImage] = useState<any>(); //<string | array
  const [blogDescription, setBlogDescription] = useState<string>('');
  const [blogCategory, setBlogCategory] = useState<string>('');
  const [blogId, setBlogId] = useState<number>(0);
  const [blogUserId, setBlogUserId] = useState<number>(0);
  const [blogPublisherName, setBlogPublisherName] = useState<string>('');

  const [edit, setEdit] = useState<boolean>(false);

  const [blogItems, setBlogItems] = useState<IBlogsItems[]>(BlogEntries);

  const router = useRouter();


  useEffect(() => {

    const getLoggedInData = async () => {
      //get the user's information
      const loggedIn = loggedInData();
      setBlogUserId(loggedIn.id);
      setBlogPublisherName(loggedIn.username);

      //get the user's blog items
      const userBlogItems = await getBlogsByUserId(loggedIn.id, GetToken());
      console.log(userBlogItems);
      
      //set the user's blog items inside the useState
      
      setBlogItems(userBlogItems);
    }


    if(!checkToken()){
      //push to login page
      router.push('/')
    }else{
      //get user data / logic login funtion
      getLoggedInData();
    }

  },[]);

  //form functions--------------------------------------------
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => setBlogTitle(e.target.value);
  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => setBlogDescription(e.target.value);
  const handleCategory = (categories: string) => setBlogCategory(categories);

  //not good for big images
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //we are creating a new file reader object
    let reader = new FileReader();

    //then we get the first file we uploaded
    let file = e.target.files?.[0];

    //if there is a file to select
    if(file){
      //when thsi file is turned into a string this onload function will run
      reader.onload = () => {
        setBlogImage(reader.result);//once the file is read we will store the result into our setter function
      }

      reader.readAsDataURL(file); //converst our file to a base64-encoaded string
    }

  }

  //accordian functions---------------------------------------
  const handleShow = () => {
    setOpenModal(true);
    setEdit(false);
    setBlogId(0);
    setBlogUserId(blogUserId);
    setBlogPublisherName(blogPublisherName);
    setBlogTitle("");
    setBlogImage("");
    setBlogDescription("");
    setBlogCategory("");
  }

  const handleEdit = (items: IBlogsItems) => {
    setOpenModal(true);
    setEdit(true);
    setBlogId(items.id);
    setBlogUserId(items.userId);
    setBlogPublisherName(items.publisherName);
    setBlogTitle(items.title);
    setBlogImage(items.image);
    setBlogDescription(items.description);
    setBlogCategory(items.category);
  }

  const handlePublish = async (items: IBlogsItems) => {
    items.isPublished = !items.isPublished;

    let result = await updateBlogItem(items, GetToken());

    if(result){
      let userBlogItems = await getBlogsByUserId(blogUserId, GetToken());
      setBlogItems(userBlogItems);
    }else{
      alert("Blog was not published");
    }
  }

  const handleDelete = async (items: IBlogsItems) => {
    items.isDeleted = true;

    let result = await deleteBlogItem(items, GetToken());

    if(result){
      let userBlogItems = await getBlogsByUserId(blogUserId, GetToken());
      setBlogItems(userBlogItems);
    }else{
      alert("Blog item(s) were not deleted");
    }
  }

  //save function---------------------------------------------
  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const item: IBlogsItems = {
      id: blogId,
      userId: blogUserId,
      publisherName: blogPublisherName,
      title: blogTitle,
      image: blogImage,
      description: blogDescription,
      date: format(new Date(), 'MM-dd-yyyy'),
      category: blogCategory,
      isPublished: e.currentTarget.textContent === 'Save' ? false : true,
      isDeleted: false

    }
    setOpenModal(false);
    
    let result = false;
    if(edit){
      //our edit logic will go here
      result = await updateBlogItem(item, GetToken());

    }else{
      //our add logic
      result = await addBlogItem(item, GetToken())
    }

    if(result){
      let userBlogItems = await getBlogsByUserId(blogUserId, GetToken());
      setBlogItems(userBlogItems);
    }else{
      alert(`Blog Items were not ${edit ? 'Updated' : 'Added'}`);
    }
  }


  return (
    <main className='flex min-h-screen flex-col p-24'>
      <div className='flex flex-col items-center mb-18'>
        <h1 className='text-center text-3xl'>Dashboard Page</h1>
        
        <Button onClick={handleShow}>Add Blog</Button>
          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <ModalHeader>{edit ? 'Edit Blog Post' : 'Add Blog Post'}</ModalHeader>

            <ModalBody>
              <form className="flex max-w-md flex-col gap-4">
                <div>
                  <div className="mb-2 block">
                    {/* Title, Image, Description Category, Tags */}
                    <Label htmlFor="Title">Title</Label>
                  </div>
                  <TextInput id="Title" type="text" placeholder="Title" required onChange={handleTitle} />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="descrption">Description</Label>
                  </div>
                  <TextInput id="Description" placeholder='Description' type="text" required onChange={handleDescription} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Dropdown label="Categories" dismissOnClick={true}>
                      <DropdownItem onClick={() => handleCategory('Jiu Jitsu')}>Jiu Jitsu</DropdownItem>
                      <DropdownItem onClick={() => handleCategory('Boxing')}>Boxing</DropdownItem>
                      <DropdownItem onClick={() => handleCategory('Kung Fu')}>Kung Fu</DropdownItem>
                    </Dropdown>
                  </div>

                  <div className="mb-2 block">
                    <Label htmlFor="Image">Image</Label>
                  </div>
                  <FileInput id="Picture" accept="image/png, image/jpg" placeholder="Chose Picture" onChange={handleImage} />
                </div>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleSave}>Save and publish</Button>
              <Button onClick={handleSave}>Save</Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
            </ModalFooter>
          </Modal>

        <Accordion alwaysOpen  className="w-3xl mt-5">

          <AccordionPanel>
            <AccordionTitle className='cursor-pointer'>Published Blog Items</AccordionTitle>
            <AccordionContent>
              <ListGroup>
                {
                  blogItems.map((item: IBlogsItems, idx: number) => {
                    return (
                      <div key={idx}>
                        {
                          item.isPublished && !item.isDeleted && (
                            <div className='flex flex-col p-10'>
                              <h2 className='text-3xl'>{item.title}</h2>
                              <div className='flex flex-row space-x-3'>
                                <Button color='blue' className='cursor-pointer' onClick={() => handleEdit(item)} >Edit</Button>
                                <Button color='red' className='cursor-pointer' onClick={() => handleDelete(item)} >Delete</Button>
                                <Button color='yellow' className='cursor-pointer' onClick={() => handlePublish(item)}>Unpublish</Button>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    )
                  })
                }
              </ListGroup>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel>
            <AccordionTitle className='cursor-pointer'>Unpublished Blog Items</AccordionTitle>
            <AccordionContent>
              <ListGroup>
                {
                  blogItems.map((item: IBlogsItems, idx: number) => {
                    return (
                      <div key={idx}>
                        {
                          !item.isPublished && !item.isDeleted && (
                            <div className='flex flex-col p-10'>
                              <h2 className='text-3xl'>{item.title}</h2>
                              <div className='flex flex-row space-x-3'>
                                <Button color='blue' className='cursor-pointer' onClick={() => handleEdit(item)} >Edit</Button>
                                <Button color='red' className='cursor-pointer' onClick={() => handleDelete(item)} >Delete</Button>
                                <Button color='yellow' className='cursor-pointer' onClick={() => handlePublish(item)}>Unpublish</Button>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    )
                  })
                }
              </ListGroup>
            </AccordionContent>
          </AccordionPanel>

        </Accordion>
      </div>
    </main>
    
  )
}

export default page