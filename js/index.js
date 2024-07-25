/**
 * @typedef {Object} Contact
 * @property {string} name - The name of the contact.
 * @property {string} phone - The phone number of the contact.
 * @property {string} email - The email address of the contact.
 * @property {string} address - The address of the contact.
 * @property {string} img - img link.
 *
 */


/**
 * @type {Contact[]}
 */
let phones  = [

 {
  name: "John Doe",
  phone: "123-456-7890",
  email: "john.doe@example.com",
  address: "123 Main St, Anytown, USA",
  img: randomImage()
 },
 {
  name: "Jane Smith",
  phone: "987-654-3210",
  email: "jane.smith@example.com",
  address: "456 Elm St, Othertown, USA",
  img: randomImage()
 },
 {
  name: "Alice Johnson",
  phone: "555-123-4567",
  email: "alice.johnson@example.com",
  address: "789 Oak St, Sometown, USA",
  img: randomImage()
 },
 {
  name: "Bob Brown",
  phone: "444-555-6666",
  email: "bob.brown@example.com",
  address: "101 Pine St, Anycity, USA",
  img: randomImage()
 },
 {
  name: "Carol White",
  phone: "333-222-1111",
  email: "carol.white@example.com",
  address: "202 Maple St, Thistown, USA",
  img: randomImage()
 }

]



/**
 *
 * @type {('edit'|'newContact')}
 */
let modalMode = 'edit'


const $ = document.querySelector.bind(document)

function random(min, max) {
 return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomImage(){
 return `./images/${random(1,4)}.jpg`
}


const emptyImage = './images/none.jpg'




function createListItem(name,phone,img){



 const templete = document.getElementById('list-item').content.cloneNode(true)

 //templete.firstElementChild.dataset.name = name


 templete.querySelector('img').src = img
 templete.querySelectorAll("li")[0].textContent = `${name} - ${phone}`


templete.firstElementChild.addEventListener('click',()=>{

 openModal(name,'edit')

}
)

 return templete
}









/**
 *
 * @param listEl
 * @param arr {Contact[]}
 */

function render(listEl,arr){

 if (!listEl) throw new Error('list element empty')

 listEl.innerHTML = ''


 for (let item of arr){

 listEl.append(createListItem(item.name,item.phone,item.img))

 }

 const empty = document.getElementById('empty')

 if (arr.length === 0){
 empty.style.display = 'block'
 } else {
  empty.style.display = 'none'
 }

 }






 function searchContact(name = ''){

 if (!name?.trim()) {
 return phones
 }

 return phones.filter(x=>x['name'].toLowerCase().includes(name))

 }




/**
 *
 * @param contact {Contact}
 */
 function save(contact){


   name = contact?.name?.trim()

   if (!name) {
    throw new Error('bad name')
   }

 const same = phones.findIndex(x => x.name.toLowerCase() === contact.name.toLowerCase())


 if (modalMode === 'newContact') {


  if (same !== -1) throw new Error('already exists')

   phones.push(contact)
   sortList()

   }else {


   if (same !== -1 &&  same !== tempIndex) throw new Error('already exists')

   phones[tempIndex] = contact
   sortList()

   }

  }





 function sortList(){
  phones.sort((a, b)=>a['name'].localeCompare(b['name']))
 }



/**
 *
 * @param name {string}
 * @param email {string}
 * @param phone {string}
 * @returns {Contact}
 */
function createContact({name,email = '',phone = 'None',img = '',address = ""}){

  return {name:name,email:email,phone:phone,img:img,address:address}

 }




 function remove(name,onFinish){

 const index = phones.findIndex(x=>x.name === name)

  if (index === -1){
  throw new Error('name not found')
  }


 const check = confirm(`delete ${phones[index].name}?`)

 if (check) {
 phones.splice(index, 1)
 sortList()

 const listEl = document.getElementById('the-list')

 render(listEl,phones)

 onFinish?.()

 }

 }




 function clear(list_elem){
 phones = []

render(list_elem,phones)
 }




 let tempIndex= -1



/**
 *
 * @param name {string}
 * @param mode {'edit'|'newContact'}
 */
  function openModal(name = undefined,mode='edit'){

  modalMode = mode

  tempIndex = null


  const modal = document.getElementById('myModal')


  if (name){

  const index = phones.findIndex(x=>x.name === name)


  const person = phones[index]

  if (!person)  return

  tempIndex = index


  modal.querySelector('#title').textContent = name

  modal.querySelector('#name').value = name

  modal.querySelector('#phone').value = person.phone || 'None'

  modal.querySelector('#email').value = person.email || ''

  modal.querySelector('#img').src = person.img || ''

  modal.querySelector('#address').value = person.address|| ''

  }

  if (mode =='newContact'){
   modal.querySelector('#img').src = emptyImage
   modal.querySelector('#remove_btn').style.display ='none'
  } else {
   modal.querySelector('#remove_btn').style.display ='block'
  }


  document.body.style.overflow = 'hidden'

  modal.style.display = 'block'


 }






 function closeModal(){
   const modal = document.getElementById('myModal')

  modal.querySelector('#title').textContent = ''

  modal.querySelector('#name').value = ''

  modal.querySelector('#phone').value = ''

  modal.querySelector('#email').value = ''

  modal.querySelector('#address').value = ''

  document.body.style.overflow = 'unset'

   modal.style.display = 'none'

 }





   function exitMsg(){
   window.addEventListener('beforeunload',(e)=>{
   e.preventDefault()

   e.returnValue = ''
   return true

  }
  )

  }







/**
 *
 * @param listEl
 */
  function setModalListeners(listEl){
   const modal = document.getElementById('myModal')


      const up =  modal.querySelector('#upload')

      up.addEventListener('change',async (e)=>{


      /**
       * @type {HTMLInputElement}
      */
       const elem = e.target

       const file = elem.files[0];

      elem.value = ''

      const b =  new Blob([await file.arrayBuffer()])

      const url =    URL.createObjectURL(b)

      modal.querySelector('#img').src = url

      }
      )


    modal.querySelector('#img').addEventListener('click',(e)=>{
    up.click()
    }
    )



    modal.querySelector('#save_btn').addEventListener('click',(e)=>{

    e.preventDefault()

    if (!e.target.form.reportValidity()){
    return
    }

    const name = modal.querySelector('#name').value
    const phone = modal.querySelector('#phone').value
    const email = modal.querySelector('#email').value
     const address = modal.querySelector('#address').value
    const img = modal.querySelector('#img').src

     try{
     save(createContact({name,phone,email,img,address}))

     closeModal()

     render(listEl,phones)

    }catch(e){
     alert(String(e))
    }


    }


    )




   modal.querySelector('#remove_btn').addEventListener('click',()=>{

    if (tempIndex == null) {
    return
    }

    try{
     remove(phones[tempIndex]?.name,()=>closeModal())

    }catch(e){

     alert(String(e))

    }


   }
   )
   }






 function init() {

  const listEl = document.getElementById('the-list')



   exitMsg()


  setModalListeners(listEl)



   $('#clearAll').addEventListener('click',()=>{

   const check = confirm('clear all?')
   if (check) {
   clear(listEl)
   }
   }
   )




  $('#addBtn')
  .addEventListener('click',()=>{
   openModal(undefined,'newContact')

  }
  )


  $('#myModal').getElementsByClassName('close')[0]
  .addEventListener('click', ()=>closeModal())




  render(listEl,phones)


  const search = document.getElementById('search')



   search.addEventListener('input',(ev)=>{

   const input = ev.target.value

   render(listEl,searchContact(input))

  }
  )

  }






document.addEventListener('DOMContentLoaded',()=>init())
