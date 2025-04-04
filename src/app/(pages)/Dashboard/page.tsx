'use client'

import { checkToken, getBlogsByUserId, GetToken, loggedInData } from '@/utils/DataServices'
import React, { useEffect, useState } from 'react'
import { Button, Dropdown, DropdownItem, FileInput, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextInput, Accordion, AccordionContent, AccordionPanel, AccordionTitle, ListGroup } from 'flowbite-react'
import { IBlogsItems } from '@/utils/Interfaces'
import BlogEntries from '@/utils/BlogEntries.json'
import { useRouter } from 'next/navigation'

const page = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  //these use states will be fore our form
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogImage, setBlogImage] = useState<any>(); //<string | array
  const [blogDescription, setBlogDescription] = useState<string>('');
  const [blogCatagory, setBlogCatagory] = useState<string>('');
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
      const userblogItems = await getBlogsByUserId(loggedIn.id, GetToken());
      console.log(userblogItems);
      
      //set the user's blog items inside the useState
      
      setBlogItems(userblogItems);
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
  const handleCatagory = (catagories: string) => setBlogCatagory(catagories);
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

  }

  //accordian functions---------------------------------------
  const handleShow = () => {
    setOpenModal(true);
    setEdit(false);
  }

  const handleEdit = (items: IBlogsItems) => {
    setOpenModal(true);
    setEdit(true);
  }

  const handlePublish = async (items: IBlogsItems) => {
    items.isPublished = !items.isPublished;
  }

  const handleDelete = async (items: IBlogsItems) => {
    items.isDeleted = true;
  }

  //save function---------------------------------------------
  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const item = {}
    setOpenModal(false);
    if(edit){
      //our edit logic will go here
    }else{
      //our add logic
    }
  }


  return (
    <main className='flex min-h-screen flex-col p-24'>
      <div className='flex flex-col items-center mb-18'>
        <h1 className='text-center text-3xl'>Dashboard Page</h1>
        
        <Button onClick={() => setOpenModal(true)}>Add Blog</Button>
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
                    <Dropdown label="Catagories" dismissOnClick={true}>
                      <DropdownItem onClick={() => handleCatagory('Jiu Jitsu')}>Jiu Jitsu</DropdownItem>
                      <DropdownItem onClick={() => handleCatagory('Boxing')}>Boxing</DropdownItem>
                      <DropdownItem onClick={() => handleCatagory('Kung Fu')}>Kung Fu</DropdownItem>
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